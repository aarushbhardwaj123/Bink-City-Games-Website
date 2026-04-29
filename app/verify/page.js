"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function VerifyPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [step, setStep] = useState("loading"); // loading | init | onfido | processing | done | error
  const [error, setError] = useState("");

  const startVerification = useCallback(async () => {
    try {
      setStep("init");

      const res = await fetch("/api/onfido/create-check", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Already verified") {
          setStep("done");
          return;
        }
        throw new Error(data.error || "Failed to start verification");
      }

      const Onfido = (await import("onfido-sdk-ui")).init;

      Onfido({
        token: data.sdkToken,
        containerId: "onfido-mount",
        steps: ["document", "face"],
        onComplete: async () => {
          setStep("processing");
          try {
            await fetch("/api/onfido/complete-check", { method: "POST" });
            setStep("done");
          } catch {
            setStep("done");
          }
        },
        onError: (err) => {
          console.error("Onfido SDK error:", err);
          setError("Verification failed. Please try again.");
          setStep("error");
        },
      });

      setStep("onfido");
    } catch (err) {
      setError(err.message);
      setStep("error");
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    startVerification();
  }, [session, sessionStatus, router, startVerification]);

  const containerStyle = {
    paddingTop: "64px",
    minHeight: "100vh",
    backgroundColor: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 24px",
  };

  const cardStyle = {
    backgroundColor: "#111111",
    border: "1px solid #1f1f1f",
    borderRadius: "16px",
    padding: "48px",
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  };

  if (step === "loading" || step === "init") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "12px",
            }}
          >
            Preparing Verification
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
            }}
          >
            Setting up identity verification...
          </p>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>&#x2705;</div>
          <h2
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "12px",
            }}
          >
            Verification Submitted
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
              marginBottom: "32px",
            }}
          >
            Your identity is being reviewed. This usually takes a few minutes.
            You'll be able to purchase tokens once verified.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              backgroundColor: "#c41230",
              color: "#ffffff",
              fontFamily: "Orbitron, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            GO TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "12px",
            }}
          >
            Verification Error
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#f87171",
              marginBottom: "32px",
            }}
          >
            {error}
          </p>
          <button
            onClick={() => {
              setError("");
              startVerification();
            }}
            style={{
              backgroundColor: "#c41230",
              color: "#ffffff",
              fontFamily: "Orbitron, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Onfido SDK mounts here
  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
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
            Identity Verification
          </p>
          <h1
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "24px",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Verify Your Identity
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
            }}
          >
            Upload a government-issued ID and take a selfie
          </p>
        </div>

        <div id="onfido-mount" style={{ minHeight: "400px" }} />
      </div>
    </div>
  );
}
