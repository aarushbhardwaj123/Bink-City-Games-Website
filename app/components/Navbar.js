"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/login", label: "Account" },
    { href: "/payment", label: "Payments" },
  ];

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: "rgba(0,0,0,0.92)",
      borderBottom: "1px solid #1f1f1f",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "Orbitron, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#ffffff",
            letterSpacing: "0.05em",
          }}>
            BINK <span style={{ color: "#c41230" }}>CITY</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "32px" }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              color: pathname === href ? "#c41230" : "#b5b5b5",
              borderBottom: pathname === href ? "2px solid #c41230" : "2px solid transparent",
              paddingBottom: "4px",
              transition: "color 0.2s",
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link href="/login" style={{
          backgroundColor: "#c41230",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          padding: "8px 20px",
          borderRadius: "6px",
          textDecoration: "none",
          letterSpacing: "0.03em",
          transition: "background-color 0.2s",
        }}>
          Sign In
        </Link>
      </div>
    </nav>
  );
}
