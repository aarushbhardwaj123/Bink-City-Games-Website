"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const TOKEN_PRICE_PER_UNIT = 0.01; // $0.01 per token

const TOKEN_PRESETS = [1000, 5000, 10000, 50000, 100000, 500000];

function CheckoutForm({ clientSecret, orderId, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message);
      setProcessing(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: "100%",
          backgroundColor: processing ? "#7a0a1e" : "#c41230",
          color: "#ffffff",
          fontFamily: "Orbitron, sans-serif",
          fontSize: "13px",
          fontWeight: 700,
          padding: "14px",
          borderRadius: "8px",
          border: "none",
          cursor: processing ? "not-allowed" : "pointer",
          letterSpacing: "0.08em",
          marginTop: "24px",
          opacity: processing ? 0.7 : 1,
        }}
      >
        {processing ? "PROCESSING..." : "CONFIRM PAYMENT"}
      </button>
    </form>
  );
}

export default function OrderPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [form, setForm] = useState({
    clubId: "",
    playerId: "",
    tokenAmount: "",
  });
  const [step, setStep] = useState("form"); // form | payment | success
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [priceDisplay, setPriceDisplay] = useState("0.00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) router.push("/login");
  }, [session, sessionStatus, router]);

  function handleChange(e) {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    if (e.target.name === "tokenAmount") {
      const amt = parseInt(e.target.value, 10);
      setPriceDisplay(
        isNaN(amt) ? "0.00" : (amt * TOKEN_PRICE_PER_UNIT).toFixed(2)
      );
    }
  }

  function selectPreset(amount) {
    setForm({ ...form, tokenAmount: String(amount) });
    setPriceDisplay((amount * TOKEN_PRICE_PER_UNIT).toFixed(2));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubId: form.clubId,
          playerId: form.playerId,
          tokenAmount: form.tokenAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create order");
        setLoading(false);
        return;
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setPriceDisplay((data.priceUsd / 100).toFixed(2));
      setStep("payment");
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#000000",
    border: "1px solid #1f1f1f",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#ffffff",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "#b5b5b5",
    marginBottom: "8px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const cardStyle = {
    backgroundColor: "#111111",
    border: "1px solid #1f1f1f",
    borderRadius: "16px",
    padding: "36px",
    position: "relative",
    overflow: "hidden",
  };

  if (step === "success") {
    return (
      <div
        style={{
          paddingTop: "64px",
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>&#x2705;</div>
        <h2
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "12px",
          }}
        >
          Payment Authorized
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            color: "#b5b5b5",
            marginBottom: "8px",
            maxWidth: "500px",
          }}
        >
          Your payment of <strong style={{ color: "#c41230" }}>${priceDisplay}</strong> has
          been authorized. Our system is now delivering your tokens.
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "#b5b5b5",
            marginBottom: "32px",
            maxWidth: "500px",
          }}
        >
          You will only be charged once the tokens are successfully delivered.
          If the club or player ID is invalid, the hold will be released.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            backgroundColor: "#c41230",
            color: "#ffffff",
            fontFamily: "Orbitron, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            padding: "12px 28px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}
        >
          VIEW DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: "64px",
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "#c41230",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Token Purchase
          </p>
          <h1
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            {step === "payment" ? "Complete Payment" : "Buy Tokens"}
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
            }}
          >
            {step === "payment"
              ? `$${priceDisplay} for ${parseInt(form.tokenAmount).toLocaleString()} tokens`
              : "Select your club, enter your player ID, and choose an amount"}
          </p>
        </div>

        {step === "form" && (
          <form onSubmit={handleSubmit} style={cardStyle}>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(to right, transparent, #c41230, transparent)",
              }}
            />

            {error && (
              <div
                style={{
                  backgroundColor: "rgba(196, 18, 48, 0.15)",
                  border: "1px solid #c41230",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#ff6b7a",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>ClubGG Club ID</label>
              <input
                type="text"
                name="clubId"
                value={form.clubId}
                onChange={handleChange}
                placeholder="Enter your Club ID"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>ClubGG Player ID</label>
              <input
                type="text"
                name="playerId"
                value={form.playerId}
                onChange={handleChange}
                placeholder="Your Player ID or username"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Token Amount</label>
              <input
                type="number"
                name="tokenAmount"
                value={form.tokenAmount}
                onChange={handleChange}
                placeholder="e.g. 10000"
                required
                min="100"
                max="10000000"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {TOKEN_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => selectPreset(p)}
                  style={{
                    backgroundColor:
                      form.tokenAmount === String(p)
                        ? "#c41230"
                        : "#000000",
                    color: "#ffffff",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border:
                      form.tokenAmount === String(p)
                        ? "1px solid #c41230"
                        : "1px solid #1f1f1f",
                    cursor: "pointer",
                  }}
                >
                  {p.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Price Summary */}
            <div
              style={{
                backgroundColor: "#000000",
                border: "1px solid #1f1f1f",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#b5b5b5",
                }}
              >
                Total Price
              </span>
              <span
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                ${priceDisplay}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#7a0a1e" : "#c41230",
                color: "#ffffff",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.08em",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "CREATING ORDER..." : "PROCEED TO PAYMENT"}
            </button>
          </form>
        )}

        {step === "payment" && clientSecret && (
          <div style={cardStyle}>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(to right, transparent, #c41230, transparent)",
              }}
            />
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#c41230",
                    colorBackground: "#000000",
                    colorText: "#ffffff",
                    colorDanger: "#f87171",
                    borderRadius: "8px",
                    fontFamily: "Inter, sans-serif",
                  },
                },
              }}
            >
              <CheckoutForm
                clientSecret={clientSecret}
                orderId={orderId}
                onSuccess={() => setStep("success")}
                onError={(msg) => setError(msg)}
              />
            </Elements>

            <button
              onClick={() => {
                setStep("form");
                setClientSecret(null);
                setError("");
              }}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: "#b5b5b5",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #1f1f1f",
                cursor: "pointer",
                marginTop: "12px",
              }}
            >
              Back to Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
