"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    dob: "", phone: "", address: "", city: "", state: "", zip: "",
    governmentId: "", clubggId: "", agreed: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleNext(e) {
    e.preventDefault();
    setStep(2);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStep(3);
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
    fontSize: "11px", fontWeight: 600,
    color: "#888888", marginBottom: "7px",
    letterSpacing: "0.06em", textTransform: "uppercase",
  };

  const fieldStyle = { marginBottom: "18px" };

  if (step === 3) {
    return (
      <div style={{
        paddingTop: "68px", minHeight: "100vh", backgroundColor: "#000000",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center", padding: "100px 24px",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "24px" }}>🎉</div>
        <h2 style={{
          fontFamily: "Orbitron, sans-serif", fontSize: "26px",
          fontWeight: 800, color: "#ffffff", marginBottom: "14px",
        }}>
          Welcome to Bink City!
        </h2>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "15px",
          color: "#888888", maxWidth: "420px", lineHeight: 1.7, marginBottom: "32px",
        }}>
          Your account is under review. You will receive a confirmation email within 24 hours.
          Once approved, you can load chips and start playing.
        </p>
        <Link href="/" style={{
          backgroundColor: "#c41230", color: "#ffffff",
          fontFamily: "Orbitron, sans-serif", fontSize: "12px", fontWeight: 700,
          padding: "14px 32px", borderRadius: "8px", textDecoration: "none", letterSpacing: "0.08em",
        }}>
          BACK TO HOME
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      paddingTop: "68px", minHeight: "100vh", backgroundColor: "#000000",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "80px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
            letterSpacing: "0.2em", color: "#c41230", textTransform: "uppercase", marginBottom: "12px",
          }}>
            18+ Identity Verification Required
          </p>
          <h1 style={{
            fontFamily: "Orbitron, sans-serif", fontSize: "26px",
            fontWeight: 800, color: "#ffffff", marginBottom: "8px",
          }}>
            {step === 1 ? "Create Account" : "Verify Identity"}
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#888888" }}>
            {step === 1
              ? "Step 1 of 2 — Account details"
              : "Step 2 of 2 — Government verification"}
          </p>
          {/* Progress bar */}
          <div style={{
            height: "3px", backgroundColor: "#1a1a1a", borderRadius: "2px", marginTop: "20px",
          }}>
            <div style={{
              height: "100%", borderRadius: "2px", backgroundColor: "#c41230",
              width: step === 1 ? "50%" : "100%", transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        <div style={{
          backgroundColor: "#111111", border: "1px solid #1f1f1f",
          borderRadius: "16px", padding: "36px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(to right, transparent, #c41230, transparent)",
          }} />

          {step === 1 && (
            <form onSubmit={handleNext}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange}
                    placeholder="John" required style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange}
                    placeholder="Doe" required style={inputStyle} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" required minLength={8} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+1 (555) 000-0000" required style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Club GG Player ID</label>
                <input name="clubggId" value={form.clubggId} onChange={handleChange}
                  placeholder="Your Club GG ID" required style={inputStyle} />
              </div>
              <button type="submit" style={{
                width: "100%", backgroundColor: "#c41230", color: "#ffffff",
                fontFamily: "Orbitron, sans-serif", fontSize: "12px", fontWeight: 700,
                padding: "14px", borderRadius: "8px", border: "none", cursor: "pointer",
                letterSpacing: "0.08em", marginTop: "8px",
              }}>
                CONTINUE →
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={{
                backgroundColor: "rgba(196,18,48,0.08)", border: "1px solid rgba(196,18,48,0.2)",
                borderRadius: "8px", padding: "14px 16px", marginBottom: "24px",
              }}>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "12px",
                  color: "#c41230", margin: 0, lineHeight: 1.6,
                }}>
                  🔒 You must be 18 or older to participate. Your information is encrypted and used solely for age and identity verification.
                </p>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange}
                  required style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Home Address</label>
                <input name="address" value={form.address} onChange={handleChange}
                  placeholder="123 Main St" required style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0 12px" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>City</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    placeholder="City" required style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>State</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    placeholder="TX" required maxLength={2} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>ZIP</label>
                  <input name="zip" value={form.zip} onChange={handleChange}
                    placeholder="00000" required style={inputStyle} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Government ID Number</label>
                <input name="governmentId" value={form.governmentId} onChange={handleChange}
                  placeholder="Driver's license or passport number" required style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange}
                  required style={{ marginTop: "3px", accentColor: "#c41230", flexShrink: 0 }} />
                <label style={{
                  fontFamily: "Inter, sans-serif", fontSize: "12px",
                  color: "#888888", lineHeight: 1.6,
                }}>
                  I confirm I am 18 or older, not in a prohibited state, and agree to the{" "}
                  <Link href="/terms" style={{ color: "#c41230" }}>Terms &amp; Conditions</Link>.
                  No purchase is necessary to participate.
                </label>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setStep(1)} style={{
                  flex: 1, backgroundColor: "transparent", color: "#888888",
                  fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                  padding: "14px", borderRadius: "8px", border: "1px solid #1f1f1f",
                  cursor: "pointer",
                }}>
                  ← Back
                </button>
                <button type="submit" style={{
                  flex: 2, backgroundColor: "#c41230", color: "#ffffff",
                  fontFamily: "Orbitron, sans-serif", fontSize: "12px", fontWeight: 700,
                  padding: "14px", borderRadius: "8px", border: "none", cursor: "pointer",
                  letterSpacing: "0.08em",
                }}>
                  CREATE ACCOUNT
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "13px",
          color: "#555555", textAlign: "center", marginTop: "20px",
        }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#c41230", textDecoration: "none" }}>Sign in</Link>
        </p>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "11px",
          color: "#333333", textAlign: "center", marginTop: "12px", lineHeight: 1.6,
        }}>
          18+. NO PURCHASE NECESSARY. VOID WHERE PROHIBITED BY LAW.
        </p>
      </div>
    </div>
  );
}
