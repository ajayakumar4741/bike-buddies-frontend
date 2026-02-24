import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentForm.css";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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