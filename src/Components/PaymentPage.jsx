import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import "./PaymentPage.css";

let stripePromise;

const getStripe = async () => {
  if (!stripePromise) {
    try {
      stripePromise = loadStripe(
        "pk_test_51T4HxXGpiSk0R6a5aamv390IGn9pJkYgZzC21qKj1zNoUahm316tcyS7ddxKilK5etiHU2jrCSilTqWm6DQxrBnS00qoJeW4D1"
      );
      console.log("Stripe loading...");
    } catch (error) {
      console.error("Failed to load Stripe:", error);
      throw error;
    }
  }
  return stripePromise;
};

const PaymentPage = () => {
  const location = useLocation();
  const { clientSecret, amount, currency } = location.state || {};
  const [stripe, setStripe] = useState(null);
  const [options, setOptions] = useState(null);
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAndSetStripe = async () => {
      try {
        const stripeInstance = await getStripe();
        setStripe(stripeInstance);
        console.log("Stripe loaded successfully");

        if (clientSecret) {
          console.log("Setting Stripe options with clientSecret");
          setOptions({
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Stripe:", error);
        setStripeError("Failed to load payment provider. Please refresh and try again.");
        setIsLoading(false);
      }
    };

    loadAndSetStripe();
  }, [clientSecret]);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h1>🔐 Secure Payment</h1>
          <p>Complete your bike booking</p>
        </div>
        
        {amount && (
          <div className="amount-display">
            <strong>{(amount / 100).toFixed(2)}</strong>
            <span>{currency}</span>
          </div>
        )}
        
        {stripeError ? (
          <div className="error-container">
            <p className="error-text">{stripeError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-btn"
            >
              Refresh Page
            </button>
          </div>
        ) : stripe && options ? (
          <Elements stripe={stripe} options={options}>
            <PaymentForm />
          </Elements>
        ) : (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading payment details...</p>
          </div>
        )}
        
        <div className="security-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Encrypted and secured by Stripe
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;