import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentForm.css";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { UserContext } from "./UserContext";

const PaymentForm = ({ bookingData, amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);

  // helper to create occupied dates after successful payment
  const createBooking = async (bookingData) => {
    const { bikeId, userId, selectedDateRange } = bookingData;
    const baseURL = "http://127.0.0.1:8000";
    const bikeUrl = `${baseURL}/api/bikes/${bikeId}/`;
    const userUrl = `${baseURL}/api/users/${userId}/`;

    if (selectedDateRange.startDate && !selectedDateRange.endDate) {
      selectedDateRange.endDate = selectedDateRange.startDate;
    }

    const endDate = new Date(selectedDateRange.endDate);
    for (
      let currentDate = new Date(selectedDateRange.startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      try {
        // Format date in local timezone, not UTC
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const localDateString = `${year}-${month}-${day}`;

        const response = await fetch(`${baseURL}/api/occupied-dates/`, {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({
            bike: bikeUrl,
            user: userUrl,
            date: localDateString,
          }),
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred.");
      navigate("/failure");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // only after stripe confirms success do we create the booking
      if (bookingData) {
        await createBooking(bookingData);
      }
      navigate("/success");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      <button className="pay-button" disabled={!stripe || loading}>
        {loading ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </button>
      {message && <p className="error-message">{message}</p>}
    </form>
  );
};

export default PaymentForm;