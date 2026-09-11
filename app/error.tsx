"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8"
      style={{ background: "#0d0d0d" }}>
      <p style={{ fontFamily: "var(--font-serif)" }}
        className="text-white text-3xl font-bold mb-3">
        Something went wrong
      </p>
      <p className="text-white/40 text-sm mb-8 max-w-sm leading-relaxed">
        We couldn&apos;t load this page. This is usually a temporary connection issue.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="btn btn-white py-3 px-8">
          Try Again
        </button>
        <Link href="/" className="btn btn-outline py-3 px-8">
          Go Home
        </Link>
      </div>
    </div>
  );
}
