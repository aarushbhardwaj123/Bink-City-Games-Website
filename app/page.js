import Link from "next/link";

const features = [
  { icon: "⚡", title: "Instant Payouts", desc: "Get your winnings fast — most payouts processed within 24 hours." },
  { icon: "🔒", title: "Fully Legal & Secure", desc: "Operating under a sweepstakes model. No purchase necessary. Void where prohibited." },
  { icon: "🎧", title: "24/7 Assistance", desc: "Our support team is always on standby via Telegram and email." },
  { icon: "🏆", title: "Real Players", desc: "Compete against real players across private Club GG rooms." },
  { icon: "🎁", title: "Welcome Bundle", desc: "New members receive a bonus chip package on their first load." },
  { icon: "📱", title: "Play Anywhere", desc: "Desktop or mobile — access your account from any device, any time." },
  { icon: "💎", title: "Exclusive Tournaments", desc: "Members-only tournaments with massive prize pools every week." },
  { icon: "🔄", title: "Flexible Reloads", desc: "Top up your chip balance anytime with multiple payment options." },
];

const whyBinkCity = [
  {
    title: "Trustable Services",
    desc: "Every transaction is logged, verified, and backed by our secure platform. Your funds are safe with us.",
    icon: "🛡️",
  },
  {
    title: "Reliable Support",
    desc: "Real humans, real help. Our support team responds fast — day or night via our Telegram channel.",
    icon: "💬",
  },
  {
    title: "Real Players = Real Action",
    desc: "No bots, no filler. Every table is filled with active, verified Bink City community members.",
    icon: "🃏",
  },
  {
    title: "Welcome Bundle",
    desc: "Join today and receive a welcome chip bundle to kick off your Bink City experience.",
    icon: "🎁",
  },
];

const clubggFeatures = [
  { title: "Classic Poker", desc: "Texas Hold'em, Omaha, and more — available 24/7 across all skill levels.", icon: "♠️" },
  { title: "Tournaments", desc: "Scheduled multi-table tournaments with leaderboards and top finisher rewards.", icon: "🏆" },
  { title: "Private Clubs", desc: "Bink City members play inside exclusive private Club GG rooms.", icon: "🔐" },
  { title: "Bonuses & Promos", desc: "Regular reload bonuses, freerolls, and member-exclusive promotions.", icon: "🎰" },
];

const faqs = [
  {
    q: "How do I get started?",
    a: "Create a Bink City account, verify your identity, and link your Club GG player ID. Then select a bundle and load chips to start playing.",
  },
  {
    q: "Is this legal?",
    a: "Yes. Bink City operates under a sweepstakes promotional model. No purchase is necessary to participate. Void where prohibited by law.",
  },
  {
    q: "How do I load chips?",
    a: "After registering, select a chip bundle from the payment page and complete your transaction. Chips are credited to your Club GG account.",
  },
  {
    q: "How do I cash out?",
    a: "Submit a redemption request from your dashboard. Payouts are processed via ACH, bank wire, or crypto within 24 hours.",
  },
  {
    q: "What states are prohibited?",
    a: "Players in Washington, Montana, South Dakota, Idaho, Nevada, Louisiana, and Michigan are not eligible to participate.",
  },
  {
    q: "Do I need a Club GG account?",
    a: "Yes. Club GG is the platform we operate on. You will need a Club GG player ID to link to your Bink City account.",
  },
];

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh", paddingTop: "68px" }}>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        overflow: "hidden",
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px",
          background: "radial-gradient(ellipse, rgba(196,18,48,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Suit watermarks */}
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.04,
          fontFamily: "serif", fontSize: "160px", display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center", gap: "60px", color: "#ffffff",
        }}>
          {["♠","♥","♦","♣","♠","♥","♦","♣","♠","♥","♦","♣"].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>

        {/* Logo badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(196,18,48,0.12)",
          border: "1px solid rgba(196,18,48,0.3)",
          borderRadius: "50px",
          padding: "8px 20px",
          marginBottom: "28px",
        }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.2em", color: "#c41230", textTransform: "uppercase",
          }}>
            🃏 Official Bink City Player Portal
          </span>
        </div>

        <h1 style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "clamp(36px, 7vw, 76px)",
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1.08,
          marginBottom: "24px",
          maxWidth: "900px",
          letterSpacing: "0.02em",
        }}>
          WHERE THE<br />
          <span style={{ color: "#c41230" }}>REAL GAME</span><br />
          BEGINS
        </h1>

        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "17px",
          color: "#b5b5b5",
          maxWidth: "520px",
          lineHeight: 1.75,
          marginBottom: "44px",
        }}>
          Bink City is your exclusive portal to private Club GG poker rooms.
          Load chips, play tournaments, and cash out — all from one platform.
        </p>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/signup" style={{
            backgroundColor: "#c41230", color: "#ffffff",
            fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "13px",
            padding: "16px 36px", borderRadius: "8px", textDecoration: "none",
            letterSpacing: "0.1em",
          }}>
            PLAY NOW
          </Link>
          <Link href="/payment" style={{
            backgroundColor: "transparent", color: "#ffffff",
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px",
            padding: "16px 36px", borderRadius: "8px", textDecoration: "none",
            border: "1px solid #2a2a2a",
          }}>
            Load Chips
          </Link>
        </div>

        {/* Trust badges */}
        <div style={{
          display: "flex", gap: "32px", marginTop: "56px", flexWrap: "wrap", justifyContent: "center",
        }}>
          {["18+ Only", "No Purchase Necessary", "Sweepstakes Model", "24/7 Support"].map((b) => (
            <span key={b} style={{
              fontFamily: "Inter, sans-serif", fontSize: "12px",
              color: "#555555", fontWeight: 500, letterSpacing: "0.05em",
            }}>
              ✓ {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── SAMPLE PLAYER SHOWCASE ── */}
      <section style={{
        maxWidth: "900px", margin: "0 auto", padding: "80px 24px",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.2em", color: "#c41230", textTransform: "uppercase", marginBottom: "16px",
        }}>
          Join the Community
        </p>
        <h2 style={{
          fontFamily: "Orbitron, sans-serif", fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: 800, color: "#ffffff", marginBottom: "48px",
        }}>
          Your Seat is Waiting
        </h2>

        {/* Player card */}
        <div style={{
          backgroundColor: "#111111", border: "1px solid #1f1f1f", borderRadius: "20px",
          padding: "48px 40px", maxWidth: "420px", width: "100%", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(to right, transparent, #c41230, transparent)",
          }} />
          {/* Avatar */}
          <div style={{
            width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #c41230 0%, #7a0a1a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px", border: "3px solid rgba(196,18,48,0.4)",
          }}>
            🃏
          </div>
          <div style={{
            fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "16px",
            color: "#ffffff", marginBottom: "6px",
          }}>
            BinkCity Player
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#b5b5b5", marginBottom: "8px",
          }}>
            Club GG ID: ••••••
          </div>
          <div style={{
            display: "inline-block",
            backgroundColor: "rgba(196,18,48,0.15)", border: "1px solid rgba(196,18,48,0.3)",
            borderRadius: "20px", padding: "4px 14px",
            fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
            color: "#c41230", letterSpacing: "0.08em", marginBottom: "28px",
          }}>
            ● ACTIVE MEMBER
          </div>
          <Link href="/signup" style={{
            display: "block", backgroundColor: "#c41230", color: "#ffffff",
            fontFamily: "Orbitron, sans-serif", fontSize: "12px", fontWeight: 700,
            padding: "14px", borderRadius: "8px", textDecoration: "none",
            letterSpacing: "0.1em",
          }}>
            PLAY NOW →
          </Link>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section style={{ padding: "60px 24px 80px", backgroundColor: "#050505" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.2em", color: "#c41230", textTransform: "uppercase", marginBottom: "12px",
            }}>
              Why Players Choose Us
            </p>
            <h2 style={{
              fontFamily: "Orbitron, sans-serif", fontSize: "clamp(20px, 3.5vw, 32px)",
              fontWeight: 800, color: "#ffffff",
            }}>
              Everything You Need to Win
            </h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} style={{
                backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a",
                borderRadius: "12px", padding: "28px 24px", position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "2px",
                  background: "linear-gradient(to right, transparent, #c41230, transparent)",
                }} />
                <div style={{ fontSize: "26px", marginBottom: "14px" }}>{icon}</div>
                <div style={{
                  fontFamily: "Orbitron, sans-serif", fontSize: "12px", fontWeight: 700,
                  color: "#ffffff", marginBottom: "10px", letterSpacing: "0.04em",
                }}>
                  {title}
                </div>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "13px",
                  color: "#888888", lineHeight: 1.65, margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLUBGG OVERVIEW ── */}
      <section style={{ padding: "80px 24px", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.2em", color: "#c41230", textTransform: "uppercase", marginBottom: "12px",
            }}>
              The Platform
            </p>
            <h2 style={{
              fontFamily: "Orbitron, sans-serif", fontSize: "clamp(20px, 3.5vw, 32px)",
              fontWeight: 800, color: "#ffffff", marginBottom: "16px",
            }}>
              Powered by Club GG
            </h2>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#888888",
              maxWidth: "560px", margin: "0 auto", lineHeight: 1.7,
            }}>
              Bink City operates within private Club GG rooms — one of the most popular
              social poker platforms in the world.
            </p>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px",
          }}>
            {clubggFeatures.map(({ icon, title, desc }) => (
              <div key={title} style={{
                backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a",
                borderRadius: "14px", padding: "32px 24px", textAlign: "center",
              }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{icon}</div>
                <div style={{
                  fontFamily: "Orbitron, sans-serif", fontSize: "13px", fontWeight: 700,
                  color: "#ffffff", marginBottom: "10px",
                }}>
                  {title}
                </div>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "13px",
                  color: "#888888", lineHeight: 1.65, margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#444444",
            textAlign: "center", marginTop: "32px", lineHeight: 1.6,
          }}>
            Club GG is a free poker client that only offers poker gameplay with play money that has no monetary value
            and is not affiliated with, sponsoring, or endorsing this promotional activity.
          </p>
        </div>
      </section>

      {/* ── WHY BINKCITY ── */}
      <section style={{ padding: "80px 24px", backgroundColor: "#050505" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.2em", color: "#c41230", textTransform: "uppercase", marginBottom: "12px",
            }}>
              Our Promise
            </p>
            <h2 style={{
              fontFamily: "Orbitron, sans-serif", fontSize: "clamp(20px, 3.5vw, 32px)",
              fontWeight: 800, color: "#ffffff",
            }}>
              Why Bink City?
            </h2>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px",
          }}>
            {whyBinkCity.map(({ icon, title, desc }) => (
              <div key={title} style={{
                backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a",
                borderRadius: "14px", padding: "36px 28px", position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: "linear-gradient(to right, transparent, #c41230, transparent)",
                }} />
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{icon}</div>
                <div style={{
                  fontFamily: "Orbitron, sans-serif", fontSize: "13px", fontWeight: 700,
                  color: "#ffffff", marginBottom: "12px",
                }}>
                  {title}
                </div>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "14px",
                  color: "#888888", lineHeight: 1.7, margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 24px", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.2em", color: "#c41230", textTransform: "uppercase", marginBottom: "12px",
            }}>
              Got Questions?
            </p>
            <h2 style={{
              fontFamily: "Orbitron, sans-serif", fontSize: "clamp(20px, 3.5vw, 32px)",
              fontWeight: 800, color: "#ffffff",
            }}>
              FAQ
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map(({ q, a }) => (
              <div key={q} style={{
                backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a",
                borderRadius: "12px", padding: "24px 28px",
              }}>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700,
                  color: "#ffffff", marginBottom: "10px",
                }}>
                  {q}
                </div>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "14px",
                  color: "#888888", lineHeight: 1.7, margin: 0,
                }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TELEGRAM CTA ── */}
      <section style={{
        padding: "80px 24px", backgroundColor: "#050505", textAlign: "center",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>✈️</div>
          <h2 style={{
            fontFamily: "Orbitron, sans-serif", fontSize: "clamp(20px, 3.5vw, 28px)",
            fontWeight: 800, color: "#ffffff", marginBottom: "16px",
          }}>
            Join Our Telegram
          </h2>
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: "15px",
            color: "#888888", lineHeight: 1.7, marginBottom: "32px",
          }}>
            Get exclusive bonuses, tournament announcements, and real-time support
            directly in our Telegram channel.
          </p>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#0088cc",
              color: "#ffffff",
              fontFamily: "Orbitron, sans-serif",
              fontSize: "13px", fontWeight: 700,
              padding: "16px 40px", borderRadius: "8px", textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            JOIN TELEGRAM →
          </a>
        </div>
      </section>

      {/* ── FOOTER / INDEX ── */}
      <footer style={{
        borderTop: "1px solid #1a1a1a", backgroundColor: "#000000",
        padding: "48px 24px 32px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Site index */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "32px", marginBottom: "48px",
          }}>
            <div>
              <div style={{
                fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "18px",
                color: "#ffffff", marginBottom: "8px",
              }}>
                BINK <span style={{ color: "#c41230" }}>CITY</span>
              </div>
              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: "13px",
                color: "#555555", lineHeight: 1.6,
              }}>
                The premier private poker portal for Club GG players.
              </p>
            </div>
            {[
              { heading: "Play", links: [["Home", "/"], ["Sign Up", "/signup"], ["Login", "/login"]] },
              { heading: "Account", links: [["Load Chips", "/payment"], ["Dashboard", "/dashboard"], ["Cashout", "/payment"]] },
              { heading: "Support", links: [["FAQ", "/faq"], ["Telegram", "https://t.me/"], ["Contact", "mailto:support@binkcity.com"]] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700,
                  color: "#c41230", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px",
                }}>
                  {heading}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map(([label, href]) => (
                    <Link key={label} href={href} style={{
                      fontFamily: "Inter, sans-serif", fontSize: "13px",
                      color: "#666666", textDecoration: "none",
                    }}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "28px" }}>
            {/* Disclaimers */}
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#444444",
              lineHeight: 1.8, marginBottom: "12px", textAlign: "center",
            }}>
              18+. NO PURCHASE NECESSARY. VOID WHERE PROHIBITED BY LAW.
              Additional conditions and restrictions apply, as described in{" "}
              <Link href="/terms" style={{ color: "#666666" }}>Terms &amp; Conditions</Link>.
            </p>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#444444",
              lineHeight: 1.8, marginBottom: "16px", textAlign: "center",
            }}>
              Club GG is a free poker client that only offers poker gameplay with play money that has no monetary value
              and is not affiliated with, sponsoring, or endorsing this promotional activity.
            </p>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#333333",
              textAlign: "center",
            }}>
              Copyright &copy; 2025–2026 Division 1 Academy LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
