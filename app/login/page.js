"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Auth logic will go here
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
      <div style={{ width: "100%", maxWidth: "420px" }}>

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
            Member Portal
          </p>
          <h1 style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "28px",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "8px",
          }}>
            Sign In
          </h1>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#b5b5b5",
          }}>
            Access your Bink City account
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
          {/* Bottom glow line */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(to right, transparent, #c41230, transparent)",
          }} />

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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
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
            SIGN IN
          </button>

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "#b5b5b5",
            textAlign: "center",
            marginTop: "20px",
          }}>
            Don&apos;t have an account?{" "}
            <Link href="#" style={{ color: "#c41230", textDecoration: "none" }}>
              Contact us
            </Link>
          </p>
        </form>

        {/* Services */}
        <div style={{ marginTop: "40px" }}>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "#b5b5b5",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "16px",
          }}>
            Account Services
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {["View Balance", "Transaction History", "Manage Profile", "Support"].map((s) => (
              <div key={s} style={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: "8px",
                padding: "14px",
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#b5b5b5",
                cursor: "pointer",
              }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
