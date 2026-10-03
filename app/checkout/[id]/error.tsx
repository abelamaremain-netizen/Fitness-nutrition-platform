"use client";
import Link from "next/link";
import { useEffect } from "react";
import { MessageCircle } from "lucide-react";

/**
 * Checkout-specific error boundary.
 * Shows a payment-aware message — don't tell users to retry if they may have paid.
 */
export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[CheckoutError]", error.message);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-8 text-center"
      style={{ background: "#0d0d0d" }}>
      <div className="max-w-sm">
        <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
          Checkout Error
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-white/45 text-sm leading-relaxed mb-3">
          If you already made a payment, <strong className="text-white">do not pay again</strong>.
        </p>
        <p className="text-white/35 text-sm leading-relaxed mb-8">
          Contact us with your transaction link and we&apos;ll manually process your order.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={reset} className="btn btn-white py-3">
            Try Again
          </button>
          <Link href="/contact" className="btn btn-outline py-3 flex items-center justify-center gap-2">
            <MessageCircle size={14} /> Contact Us
          </Link>
          <Link href="/plans" className="text-[11px] tracking-widest uppercase text-white/30 hover:text-white transition-colors">
            ← Back to Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
