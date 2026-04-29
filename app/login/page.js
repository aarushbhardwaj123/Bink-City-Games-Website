"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
            Member Portal
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
            Sign In
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
            }}
          >
            Access your Bink City account
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

          {registered && (
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.15)",
                border: "1px solid #22c55e",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#4ade80",
              }}
            >
              Account created! Sign in to continue.
            </div>
          )}

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
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
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
            {loading ? "SIGNING IN..." : "SIGN IN"}
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
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              style={{ color: "#c41230", textDecoration: "none" }}
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function LoginFallback() {
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
        fontFamily: "Inter, sans-serif",
        color: "#b5b5b5",
      }}
    >
      Loading...
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
