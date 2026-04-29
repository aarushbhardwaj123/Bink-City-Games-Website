"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          dateOfBirth: form.dateOfBirth,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
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
      <div style={{ width: "100%", maxWidth: "420px" }}>
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
            Create Account
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
            Sign Up
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
            }}
          >
            Join Bink City to get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#111111",
            border: "1px solid #1f1f1f",
            borderRadius: "16px",
            padding: "36px",
            position: "relative",
            overflow: "hidden",
          }}
        >
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
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              style={inputStyle}
            />
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
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#b5b5b5",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "#c41230", textDecoration: "none" }}
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
