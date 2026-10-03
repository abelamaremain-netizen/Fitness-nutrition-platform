"use client";
import Link from "next/link";
import { useEffect } from "react";

/**
 * global-error.tsx — catches errors thrown in app/layout.tsx itself.
 * Must include <html> and <body> since it replaces the root layout.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to server monitoring — never expose to user
    if (process.env.NODE_ENV !== "production") {
      console.error("[GlobalError]", error.message);
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#0d0d0d", color: "#f0f0f0", fontFamily: "Arial, sans-serif", margin: 0 }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}>
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#666", marginBottom: "12px" }}>
            Error
          </p>
          <h1 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#888", fontSize: "14px", maxWidth: "400px", lineHeight: "1.6", marginBottom: "32px" }}>
            We couldn&apos;t load this page. This is usually a temporary issue.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={reset}
              style={{
                background: "#fff", color: "#000", border: "none",
                padding: "12px 28px", borderRadius: "8px",
                fontWeight: "700", fontSize: "12px", letterSpacing: "1px",
                textTransform: "uppercase", cursor: "pointer",
              }}>
              Try Again
            </button>
            <Link
              href="/"
              style={{
                background: "transparent", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "12px 28px", borderRadius: "8px",
                fontWeight: "700", fontSize: "12px", letterSpacing: "1px",
                textTransform: "uppercase", textDecoration: "none",
              }}>
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
