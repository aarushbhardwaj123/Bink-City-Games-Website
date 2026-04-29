"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const publicLinks = [
    { href: "/", label: "Home" },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/order", label: "Buy Tokens" },
  ];

  const links = session ? [...publicLinks, ...authLinks] : publicLinks;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.92)",
        borderBottom: "1px solid #1f1f1f",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            BINK <span style={{ color: "#c41230" }}>CITY</span>
          </span>
        </Link>

        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                color: pathname === href ? "#c41230" : "#b5b5b5",
                borderBottom:
                  pathname === href
                    ? "2px solid #c41230"
                    : "2px solid transparent",
                paddingBottom: "4px",
                transition: "color 0.2s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#b5b5b5",
              }}
            >
              {session.user.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                backgroundColor: "transparent",
                color: "#b5b5b5",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "8px 20px",
                borderRadius: "6px",
                border: "1px solid #1f1f1f",
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href="/login"
              style={{
                backgroundColor: "#c41230",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "8px 20px",
                borderRadius: "6px",
                textDecoration: "none",
                letterSpacing: "0.03em",
              }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "8px 20px",
                borderRadius: "6px",
                textDecoration: "none",
                border: "1px solid #1f1f1f",
                letterSpacing: "0.03em",
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
