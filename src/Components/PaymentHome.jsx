import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./PaymentHome.css";

const PaymentHome = () => {
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  
  // Get booking details from navigation state
  const bookingData = location.state;
  // Convert bike price to cents (bikePrice is assumed to be in dollars/units)
  const amount = bookingData?.bikePrice ? Math.round(bookingData.bikePrice * 100) : 5000; // in cents

  const createBooking = async (bookingData) => {
    const { bikeId, userId, selectedDateRange } = bookingData;
    const baseURL = "http://127.0.0.1:8000";
    const bikeUrl = `${baseURL}/api/bikes/${bikeId}/`;
    const userUrl = `${baseURL}/api/users/${userId}/`;
    
    if (selectedDateRange.startDate && !selectedDateRange.endDate) {
      selectedDateRange.endDate = selectedDateRange.startDate;
    }

    for (
      let currentDate = new Date(selectedDateRange.startDate);
      currentDate <= new Date(selectedDateRange.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      try {
        const response = await fetch(`${baseURL}/api/occupied-dates/`, {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({
            bike: bikeUrl,
            user: userUrl,
            date: currentDate.toISOString().split("T")[0],
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to book ride");
        }
        const data = await response.json();
        console.log("Booking successful:", data);
      } catch (error) {
        console.error("Booking failed:", error);
      }
    }
  };

  const handlePayClick = async (email) => {
    setLoading(true);
    console.log("Starting payment...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/create-payment-intent/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: currency,
            user_email: email,
          }),
        }
      );

      const data = await response.json();
      console.log("Payment intent response:", data);
      
      if (data.clientSecret) {
        // Create booking first
        if (bookingData) {
          await createBooking(bookingData);
        }
        
        // Then navigate to payment page
        console.log("Navigating to payment page");
        navigate("/payment", { state: { clientSecret: data.clientSecret, amount: amount, currency: currency } });
      } else {
        alert("Error creating payment intent: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating payment intent: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h1>🏍️ Complete Your Payment</h1>
          <p>Secure payment for your bike booking</p>
        </div>

        {bookingData && bookingData.selectedDateRange && (
          <div className="booking-details">
            <p><strong>📅 Booking Period:</strong> {new Date(bookingData.selectedDateRange.startDate).toLocaleDateString('en-IN')} to {new Date(bookingData.selectedDateRange.endDate).toLocaleDateString('en-IN')}</p>
          </div>
        )}

        <div className="amount-display">
          <strong>{(amount / 100).toFixed(2)}</strong>
          <span>{currency}</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email || email.trim() === "") {
              alert("Please enter your email");
              return;
            }
            handlePayClick(email);
          }}
        >
          <div className="form-group">
            <label htmlFor="currency">💱 Select Currency:</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              id="currency"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">✉️ Email Address:</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              name="email"
              id="email"
              type="email"
              placeholder="your.email@example.com"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </form>

        <div className="security-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Your payment information is secure
        </div>
      </div>
    </div>
  );
};

export default PaymentHome;
