"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Only log details in development — in production use external monitoring
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error.message);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8"
      style={{ background: "#0d0d0d" }}>
      <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
        Error
      </p>
      <h1 className="text-3xl font-bold text-white mb-3">
        Something went wrong
      </h1>
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
