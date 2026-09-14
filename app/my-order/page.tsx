"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, Clock, XCircle,
  Download, Play, ArrowLeft, AlertTriangle, Lock,
} from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";

interface OrderResult {
  order: {
    id: string;
    customer_name: string;
    plan_id: string;
    duration_label: string;
    amount: number;
    status: string;
    created_at: string;
  };
  access: {
    unlocked: boolean;
    retrieved_at: string | null;
    plan_title: string;
    video_url: string | null;
    pdf_url: string | null;
  } | null;
}

export default function MyOrderPage() {
  const [txLink,   setTxLink]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [result,   setResult]   = useState<OrderResult | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleLookup = async () => {
    const link = txLink.trim();
    if (!link.startsWith("http")) {
      setError("Please enter a valid transaction link starting with https://");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setRevealed(false);

    const supabase = createBrowserClient();

    // Find order by tx_ref
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, customer_name, plan_id, duration_label, amount, status, created_at")
      .eq("tx_ref", link)
      .maybeSingle();

    if (orderErr || !order) {
      setError("No order found for this transaction link. Make sure you copied it correctly.");
      setLoading(false);
      return;
    }

    // Check if access has been granted
    const { data: access } = await supabase
      .from("order_access")
      .select("unlocked, retrieved_at")
      .eq("order_id", order.id)
      .maybeSingle();

    // If access exists and already retrieved → blocked
    if (access?.retrieved_at) {
      setError(
        "This transaction link has already been used to retrieve a plan. " +
        "For security reasons each link can only be used once. " +
        "If you believe this is a mistake, please contact us."
      );
      setLoading(false);
      return;
    }

    // Get plan details
    const { data: plan } = await supabase
      .from("plans")
      .select("title, video_url, pdf_url")
      .eq("id", order.plan_id)
      .maybeSingle();

    setResult({
      order,
      access: access ? {
        unlocked:     access.unlocked,
        retrieved_at: access.retrieved_at,
        plan_title:   plan?.title   ?? "Your Plan",
        video_url:    plan?.video_url ?? null,
        pdf_url:      plan?.pdf_url   ?? null,
      } : null,
    });

    setLoading(false);
  };

  const handleRevealContent = async () => {
    if (!result?.access || !result.order) return;
    setLoading(true);

    const supabase = createBrowserClient();

    // Mark as retrieved — this is the one-time use stamp
    const { error: updateErr } = await supabase
      .from("order_access")
      .update({ retrieved_at: new Date().toISOString() })
      .eq("order_id", result.order.id);

    if (updateErr) {
      setError("Failed to retrieve plan. Please try again or contact us.");
      setLoading(false);
      return;
    }

    setRevealed(true);
    setLoading(false);
  };

  const statusIcon = (status: string) => {
    if (status === "completed")            return <CheckCircle2 size={18} className="text-green-400" />;
    if (status === "pending_verification") return <Clock size={18} className="text-blue-400" />;
    if (status === "failed")               return <XCircle size={18} className="text-red-400" />;
    return <Clock size={18} className="text-yellow-400" />;
  };

  const statusText: Record<string, string> = {
    completed:            "Payment verified — plan is ready",
    pending_verification: "Your payment is being verified by our team. This usually takes a few hours.",
    failed:               "Payment verification failed. Please contact us.",
    pending:              "Awaiting payment verification.",
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-xl mx-auto px-8">

        <Link href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-[11px] tracking-widest uppercase transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Home
        </Link>

        <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
          Order Lookup
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)" }}
          className="text-3xl font-bold text-white mb-2">
          Find Your <em>Order</em>
        </h1>
        <p className="text-white/40 text-sm mb-10 leading-relaxed">
          Paste the transaction link you received after payment to check your order status and access your plan.
        </p>

        {/* Search box */}
        <div className="card p-5 mb-6">
          <label className="field-label mb-2">Your Transaction Link</label>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="https://..."
              value={txLink}
              onChange={(e) => { setTxLink(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              className="pill-input flex-1"
            />
            <button
              onClick={handleLookup}
              disabled={loading || !txLink.trim()}
              className="btn btn-white px-5 py-2.5 disabled:opacity-40 flex-shrink-0">
              {loading
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <Search size={15} />
              }
            </button>
          </div>
          <p className="text-white/22 text-[11px] mt-2">
            This is the link you copied from Telebirr or CBE after making payment.
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 mb-6">
              <AlertTriangle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400/90 text-sm leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4">

              {/* Order summary */}
              <div className="card p-5">
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/30 mb-4">
                  Order Found
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: "Customer",  value: result.order.customer_name || "—" },
                    { label: "Plan",      value: result.access?.plan_title ?? result.order.plan_id },
                    { label: "Duration",  value: result.order.duration_label },
                    { label: "Amount",    value: `${result.order.amount.toLocaleString()} ETB` },
                    { label: "Date",      value: new Date(result.order.created_at).toLocaleDateString("en-GB") },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between gap-4">
                      <span className="text-[11px] font-semibold tracking-widest uppercase text-white/30">
                        {row.label}
                      </span>
                      <span className="text-sm text-white/65 text-right">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-white/[0.07]">
                  {statusIcon(result.order.status)}
                  <p className="text-sm text-white/60 leading-relaxed">
                    {statusText[result.order.status] ?? "Unknown status"}
                  </p>
                </div>
              </div>

              {/* Access — only if approved */}
              {result.access?.unlocked && !revealed && (
                <div className="card p-5">
                  <div className="flex items-start gap-3 mb-5">
                    <CheckCircle2 size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold text-sm">Your plan is ready</p>
                      <p className="text-white/35 text-xs mt-1 leading-relaxed">
                        Click below to access your plan content.{" "}
                        <span className="text-yellow-400/80">
                          You can only do this once — save your files after accessing.
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRevealContent}
                    disabled={loading}
                    className="btn btn-white w-full py-3.5">
                    {loading
                      ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      : <><Lock size={14} /> Access My Plan</>
                    }
                  </button>
                </div>
              )}

              {/* Revealed content */}
              {revealed && result.access && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="card p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <p className="text-white font-semibold">
                      {result.access.plan_title}
                    </p>
                  </div>

                  <p className="text-yellow-400/80 text-xs leading-relaxed bg-yellow-500/8 border border-yellow-500/15 rounded-lg px-3 py-2.5">
                    ⚠ Save these links now. For security, this page cannot be used to retrieve this plan again.
                  </p>

                  {/* PDF */}
                  {result.access.pdf_url ? (
                    <a href={result.access.pdf_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-white w-full py-3.5 flex items-center justify-center gap-2">
                      <Download size={15} /> Download PDF Guide
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-white/30 text-sm py-2">
                      <Download size={14} />
                      <span>PDF guide not yet available — contact us</span>
                    </div>
                  )}

                  {/* Video */}
                  {result.access.video_url ? (
                    <a href={result.access.video_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline w-full py-3.5 flex items-center justify-center gap-2">
                      <Play size={15} /> Watch Video Plan
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-white/30 text-sm py-2">
                      <Play size={14} />
                      <span>Video not yet available — contact us</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Pending — no access yet */}
              {!result.access && result.order.status !== "failed" && (
                <div className="card p-5 flex items-start gap-3">
                  <Clock size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white/70 text-sm font-medium">Verification in progress</p>
                    <p className="text-white/35 text-xs mt-1 leading-relaxed">
                      Our team is reviewing your payment. Come back here with the same transaction link once notified. Usually takes a few hours during business hours.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Help */}
        <div className="mt-10 text-center">
          <p className="text-white/25 text-xs">
            Having trouble?{" "}
            <Link href="/contact" className="text-white/45 hover:text-white underline transition-colors">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
