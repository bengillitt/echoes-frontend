"use client";

import Link from "next/link";

export default function LoginMenu() {
  return (
    <div className="landing-page">
      <div className="landing-logo" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
        <img src="/icon.png" alt="Echoes Logo" style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
        Echoes
      </div>
      <p className="landing-tagline">Ask anything. Pick up where you left off.</p>
      <div className="landing-actions">
        <Link href="/login" className="landing-actions landing-btn-primary" style={{ flex: 1, display: "block", textAlign: "center", padding: "0.65rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", background: "var(--accent)", color: "var(--accent-fg)" }}>
          Log in
        </Link>
        <Link href="/register" className="landing-actions landing-btn-ghost" style={{ flex: 1, display: "block", textAlign: "center", padding: "0.65rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}>
          Register
        </Link>
      </div>
    </div>
  );
}