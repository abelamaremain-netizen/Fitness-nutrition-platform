"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[AdminError]", error.message);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-8 text-center"
      style={{ background: "#0a0a0a" }}>
      <div className="max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Page failed to load</h1>
        <p className="text-white/40 text-sm leading-relaxed mb-6">
          An unexpected error occurred. No data was lost.
        </p>
        <button onClick={reset} className="btn btn-white py-3 px-8">
          Retry
        </button>
      </div>
    </div>
  );
}
