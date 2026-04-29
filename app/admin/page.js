"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const STATUS_COLORS = {
  PENDING: { bg: "rgba(234, 179, 8, 0.15)", text: "#facc15", label: "Pending" },
  AUTHORIZED: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", label: "Authorized" },
  PROCESSING: { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", label: "Processing" },
  COMPLETED: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", label: "Completed" },
  FAILED: { bg: "rgba(239, 68, 68, 0.15)", text: "#f87171", label: "Failed" },
  REFUNDED: { bg: "rgba(156, 163, 175, 0.15)", text: "#9ca3af", label: "Refunded" },
};

const FILTER_TABS = ["ALL", "PENDING", "AUTHORIZED", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED"];

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "25" });
      if (filter !== "ALL") params.set("status", filter);

      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch {
      console.error("Failed to fetch admin orders");
    }
    setLoading(false);
  }, [filter, page, router]);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [session, sessionStatus, fetchOrders, router]);

  // Auto-refresh every 10s
  useEffect(() => {
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function handleRetry(orderId) {
    setRetrying(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}/retry`, { method: "POST" });
      await fetchOrders();
    } catch {
      console.error("Retry failed");
    }
    setRetrying(null);
  }

  const cardStyle = {
    backgroundColor: "#111111",
    border: "1px solid #1f1f1f",
    borderRadius: "12px",
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
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
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
            Administration
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
            Order Management
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#b5b5b5",
            }}
          >
            {total} total orders
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setPage(1); }}
              style={{
                backgroundColor: filter === tab ? "#c41230" : "#111111",
                color: filter === tab ? "#ffffff" : "#b5b5b5",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "6px",
                border: filter === tab ? "1px solid #c41230" : "1px solid #1f1f1f",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          {loading ? (
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                color: "#b5b5b5",
              }}
            >
              Loading...
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                color: "#b5b5b5",
              }}
            >
              No orders found.
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
                  <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                    {["Date", "User", "Club ID", "Player ID", "Tokens", "Price", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "14px 16px",
                            color: "#b5b5b5",
                            fontWeight: 600,
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            textAlign: "left",
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
                        <td style={{ padding: "14px 16px", color: "#b5b5b5", whiteSpace: "nowrap" }}>
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#ffffff" }}>
                          {order.user?.name || order.userId}
                          <br />
                          <span style={{ fontSize: "11px", color: "#b5b5b5" }}>
                            {order.user?.email}
                          </span>
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
                              fontSize: "11px",
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
                                maxWidth: "200px",
                              }}
                            >
                              {order.failureReason}
                            </p>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {order.status === "FAILED" && (
                            <button
                              onClick={() => handleRetry(order.id)}
                              disabled={retrying === order.id}
                              style={{
                                backgroundColor: "transparent",
                                color: "#60a5fa",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                fontWeight: 600,
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #60a5fa",
                                cursor:
                                  retrying === order.id
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: retrying === order.id ? 0.5 : 1,
                              }}
                            >
                              {retrying === order.id ? "Retrying..." : "Retry"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > 25 && (
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #1f1f1f",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  backgroundColor: "transparent",
                  color: page === 1 ? "#555" : "#b5b5b5",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #1f1f1f",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#b5b5b5",
                }}
              >
                Page {page} of {Math.ceil(total / 25)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * 25 >= total}
                style={{
                  backgroundColor: "transparent",
                  color: page * 25 >= total ? "#555" : "#b5b5b5",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #1f1f1f",
                  cursor: page * 25 >= total ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
