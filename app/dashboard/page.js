import { auth } from "../../lib/auth.js";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma.js";
import Link from "next/link";

const STATUS_COLORS = {
  PENDING: { bg: "rgba(234, 179, 8, 0.15)", text: "#facc15", label: "Pending" },
  AUTHORIZED: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", label: "Authorized" },
  PROCESSING: { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", label: "Processing" },
  COMPLETED: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", label: "Completed" },
  FAILED: { bg: "rgba(239, 68, 68, 0.15)", text: "#f87171", label: "Failed" },
  REFUNDED: { bg: "rgba(156, 163, 175, 0.15)", text: "#9ca3af", label: "Refunded" },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const cardStyle = {
    backgroundColor: "#111111",
    border: "1px solid #1f1f1f",
    borderRadius: "12px",
    padding: "24px",
  };

  return (
    <div
      style={{
        paddingTop: "64px",
        minHeight: "100vh",
        backgroundColor: "#000000",
        padding: "100px 24px 60px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
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
            Dashboard
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
            Welcome, {user?.name}
          </h1>
        </div>

        {/* Verification Banner */}
        {!user?.idVerified && (
          <div
            style={{
              ...cardStyle,
              borderColor: "#c41230",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: "4px",
                }}
              >
                Identity Verification Required
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#b5b5b5",
                  margin: 0,
                }}
              >
                You must verify your identity before purchasing tokens.
              </p>
            </div>
            <Link
              href="/verify"
              style={{
                backgroundColor: "#c41230",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "10px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Verify Now
            </Link>
          </div>
        )}

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {[
            {
              label: "Total Orders",
              value: orders.length,
            },
            {
              label: "Completed",
              value: orders.filter((o) => o.status === "COMPLETED").length,
            },
            {
              label: "Tokens Delivered",
              value: orders
                .filter((o) => o.status === "COMPLETED")
                .reduce((sum, o) => sum + o.tokenAmount, 0)
                .toLocaleString(),
            },
          ].map(({ label, value }) => (
            <div key={label} style={cardStyle}>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#b5b5b5",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {user?.idVerified && (
          <div style={{ marginBottom: "32px" }}>
            <Link
              href="/order"
              style={{
                display: "inline-block",
                backgroundColor: "#c41230",
                color: "#ffffff",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                padding: "14px 32px",
                borderRadius: "8px",
                textDecoration: "none",
                letterSpacing: "0.08em",
              }}
            >
              BUY TOKENS
            </Link>
          </div>
        )}

        {/* Orders Table */}
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #1f1f1f",
            }}
          >
            <h2
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              Order History
            </h2>
          </div>

          {orders.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#b5b5b5",
              }}
            >
              No orders yet. Purchase tokens to get started.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #1f1f1f",
                      textAlign: "left",
                    }}
                  >
                    {["Date", "Club ID", "Player ID", "Tokens", "Price", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            color: "#b5b5b5",
                            fontWeight: 600,
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
                    return (
                      <tr
                        key={order.id}
                        style={{ borderBottom: "1px solid #1f1f1f" }}
                      >
                        <td style={{ padding: "14px 16px", color: "#b5b5b5" }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#ffffff" }}>
                          {order.clubGgClubId}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#ffffff" }}>
                          {order.clubGgPlayerId}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#ffffff" }}>
                          {order.tokenAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#ffffff" }}>
                          ${(order.priceUsd / 100).toFixed(2)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              backgroundColor: status.bg,
                              color: status.text,
                              padding: "4px 12px",
                              borderRadius: "9999px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {status.label}
                          </span>
                          {order.failureReason && (
                            <p
                              style={{
                                color: "#f87171",
                                fontSize: "11px",
                                marginTop: "4px",
                                marginBottom: 0,
                              }}
                            >
                              {order.failureReason}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
