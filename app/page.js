import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", backgroundColor: "#000000" }}>

      {/* Hero */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "100px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(196,18,48,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: "#c41230",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          Automated Transaction Platform
        </p>

        <h1 style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "clamp(32px, 6vw, 64px)",
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1.1,
          marginBottom: "24px",
          maxWidth: "800px",
        }}>
          Welcome to{" "}
          <span style={{ color: "#c41230" }}>Bink City</span>
        </h1>

        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          color: "#b5b5b5",
          maxWidth: "500px",
          lineHeight: 1.7,
          marginBottom: "40px",
        }}>
          Fast, secure, and fully automated transactions — built for the Bink City community.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" style={{
            backgroundColor: "#c41230",
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            padding: "14px 32px",
            borderRadius: "8px",
            textDecoration: "none",
            letterSpacing: "0.03em",
          }}>
            Get Started
          </Link>
          <Link href="/payment" style={{
            backgroundColor: "transparent",
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            padding: "14px 32px",
            borderRadius: "8px",
            textDecoration: "none",
            border: "1px solid #1f1f1f",
            letterSpacing: "0.03em",
          }}>
            Make a Payment
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "60px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
      }}>
        {[
          {
            title: "Instant Transfers",
            desc: "Send and receive funds in seconds with our automated engine.",
            icon: "⚡",
          },
          {
            title: "Secure Accounts",
            desc: "Your data and funds are protected with industry-grade security.",
            icon: "🔒",
          },
          {
            title: "Easy Payments",
            desc: "Manage, schedule, and track all payments from one dashboard.",
            icon: "💳",
          },
        ].map(({ title, desc, icon }) => (
          <div key={title} style={{
            backgroundColor: "#111111",
            border: "1px solid #1f1f1f",
            borderRadius: "12px",
            padding: "32px",
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
            <div style={{ fontSize: "28px", marginBottom: "16px" }}>{icon}</div>
            <h3 style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "12px",
              letterSpacing: "0.05em",
            }}>
              {title}
            </h3>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
              lineHeight: 1.6,
              margin: 0,
            }}>
              {desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1f1f1f",
        textAlign: "center",
        padding: "32px 24px",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        color: "#b5b5b5",
      }}>
        &copy; 2026 Bink City. All rights reserved.
      </footer>
    </div>
  );
}
