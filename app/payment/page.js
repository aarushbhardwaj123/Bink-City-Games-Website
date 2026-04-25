"use client";

import { useState } from "react";

export default function PaymentPage() {
  const [form, setForm] = useState({
    recipient: "",
    amount: "",
    method: "bank",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{
        paddingTop: "64px",
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "100px 24px",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>✅</div>
        <h2 style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "24px",
          fontWeight: 800,
          color: "#ffffff",
          marginBottom: "12px",
        }}>
          Payment Submitted
        </h2>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          color: "#b5b5b5",
          marginBottom: "32px",
        }}>
          Your transaction of <strong style={{ color: "#c41230" }}>${form.amount}</strong> to{" "}
          <strong style={{ color: "#ffffff" }}>{form.recipient}</strong> is being processed.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ recipient: "", amount: "", method: "bank", note: "" }); }}
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
          NEW PAYMENT
        </button>
      </div>
    );
  }

  return (
    <div style={{
      paddingTop: "64px",
      minHeight: "100vh",
      backgroundColor: "#000000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "#c41230",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            Automated Transactions
          </p>
          <h1 style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "28px",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "8px",
          }}>
            Make a Payment
          </h1>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#b5b5b5",
          }}>
            Send funds securely through the Bink City platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          backgroundColor: "#111111",
          border: "1px solid #1f1f1f",
          borderRadius: "16px",
          padding: "36px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(to right, transparent, #c41230, transparent)",
          }} />

          {[
            { label: "Recipient", name: "recipient", type: "text", placeholder: "Name or account ID" },
            { label: "Amount ($)", name: "amount", type: "number", placeholder: "0.00" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "#b5b5b5",
                marginBottom: "8px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                min={type === "number" ? "0.01" : undefined}
                step={type === "number" ? "0.01" : undefined}
                style={{
                  width: "100%",
                  backgroundColor: "#000000",
                  border: "1px solid #1f1f1f",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#b5b5b5",
              marginBottom: "8px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Payment Method
            </label>
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              style={{
                width: "100%",
                backgroundColor: "#000000",
                border: "1px solid #1f1f1f",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              }}
            >
              <option value="bank">Bank Transfer</option>
              <option value="card">Debit / Credit Card</option>
              <option value="wallet">Bink City Wallet</option>
            </select>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#b5b5b5",
              marginBottom: "8px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Note (optional)
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="What's this payment for?"
              rows={3}
              style={{
                width: "100%",
                backgroundColor: "#000000",
                border: "1px solid #1f1f1f",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
          </div>

          <button type="submit" style={{
            width: "100%",
            backgroundColor: "#c41230",
            color: "#ffffff",
            fontFamily: "Orbitron, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}>
            SEND PAYMENT
          </button>
        </form>
      </div>
    </div>
  );
}
