"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/payment", label: "Payments" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: "rgba(0,0,0,0.95)",
      borderBottom: "1px solid #1f1f1f",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "Orbitron, sans-serif",
            fontWeight: 900,
            fontSize: "22px",
            color: "#ffffff",
            letterSpacing: "0.06em",
          }}>
            BINK <span style={{ color: "#c41230" }}>CITY</span>
          </span>
        </Link>

        {/* Center nav links */}
        <div style={{ display: "flex", gap: "28px", flex: 1, justifyContent: "center" }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              color: pathname === href ? "#ffffff" : "#888888",
              borderBottom: pathname === href ? "2px solid #c41230" : "2px solid transparent",
              paddingBottom: "2px",
              transition: "color 0.2s",
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right: auth buttons */}
        <div style={{ display: "flex", gap: "10px", flexShrink: 0, alignItems: "center" }}>
          {session ? (
            <>
              <Link href="/dashboard" style={{
                backgroundColor: "transparent", color: "#ffffff",
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                padding: "8px 18px", borderRadius: "6px", textDecoration: "none",
                border: "1px solid #333333", letterSpacing: "0.02em",
              }}>
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} style={{
                backgroundColor: "#c41230", color: "#ffffff",
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                padding: "8px 18px", borderRadius: "6px", border: "none",
                cursor: "pointer", letterSpacing: "0.02em",
              }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                backgroundColor: "transparent", color: "#ffffff",
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                padding: "8px 18px", borderRadius: "6px", textDecoration: "none",
                border: "1px solid #333333", letterSpacing: "0.02em",
              }}>
                Login
              </Link>
              <Link href="/signup" style={{
                backgroundColor: "#c41230", color: "#ffffff",
                fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
                padding: "8px 18px", borderRadius: "6px", textDecoration: "none",
                letterSpacing: "0.02em",
              }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
