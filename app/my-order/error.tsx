"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function MyOrderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[MyOrderError]", error.message);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-8 text-center"
      style={{ background: "#0d0d0d" }}>
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-3">
          Couldn&apos;t load your orders
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          There was a problem loading your order. Your order is safe — try again or contact us if this keeps happening.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-white py-3 px-6">Try Again</button>
          <Link href="/contact" className="btn btn-outline py-3 px-6">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
