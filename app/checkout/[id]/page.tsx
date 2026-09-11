"use client";
import { useState, use, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, ArrowRight,
  Download, Copy, Check,
  Phone, Building2, MessageCircle, Mail,
  Clock, Shield, ExternalLink,
} from "lucide-react";
import { PLANS, type DurationOption } from "@/lib/data";
import { createBrowserClient } from "@/src/lib/supabase/client";

// ─── PAYMENT DETAILS ──────────────────────────────────────────────────────────
// Admin updates these in site_content — hardcoded here as fallback
const TELEBIRR_PHONE = "0912345678";
const TELEBIRR_NAME  = "Naodi & Samri Fitness";
const CBE_ACCOUNT    = "1000123456789";
const CBE_NAME       = "Naodi & Samri Fitness";
const WHATSAPP_NUM   = "251912345678";
const SUPPORT_EMAIL  = "hello@naodiansamri.com";

type Step = "review" | "payment" | "submitted";

// ─── COPY BUTTON ─────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all flex-shrink-0"
      title="Copy">
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

// ─── MAIN CHECKOUT ────────────────────────────────────────────────────────────
function CheckoutContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const durationKey  = searchParams.get("duration") ?? "";

  const plan = PLANS.find((p) => p.id === id);
  if (!plan) notFound();

  const duration: DurationOption =
    plan.durations.find((d) => d.key === durationKey) ?? plan.durations[0];

  const [step,       setStep]      = useState<Step>("review");
  const [method,     setMethod]    = useState<"telebirr" | "cbe">("telebirr");
  const [name,       setName]      = useState("");
  const [txLink,     setTxLink]    = useState("");
  const [txError,    setTxError]   = useState("");  // real-time URL check
  const [agreed,     setAgreed]    = useState(false);
  const [loading,    setLoading]   = useState(false);
  const [error,      setError]     = useState("");

  const canContinue = agreed;
  const canSubmit   = txLink.trim().startsWith("http") && name.trim() && !txError;

  // ── Live uniqueness check ─────────────────────────────────────
  const checkTxLink = async (url: string) => {
    setTxError("");
    if (!url.trim().startsWith("http")) return;
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("tx_ref", url.trim())
      .maybeSingle();
    if (data) {
      setTxError("This transaction link has already been used for a previous order.");
    }
  };

  const handleTxLinkChange = (url: string) => {
    setTxLink(url);
    setTxError("");
    // Debounce — only check after user stops typing
    clearTimeout((window as Window & { _txTimer?: ReturnType<typeof setTimeout> })._txTimer);
    (window as Window & { _txTimer?: ReturnType<typeof setTimeout> })._txTimer = setTimeout(() => {
      if (url.trim().startsWith("http")) checkTxLink(url);
    }, 800);
  };

  const handleSubmitOrder = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserClient();

      // ── Check uniqueness BEFORE inserting ──────────────────────
      // Prevents the same transaction link being used more than once
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("tx_ref", txLink.trim())
        .maybeSingle();

      if (existing) {
        setError(
          "This transaction link has already been used for another order. " +
          "Each payment must have a unique transaction link. " +
          "If you believe this is a mistake, please contact us."
        );
        setLoading(false);
        return;
      }

      // ── Insert order ────────────────────────────────────────────
      const { error: dbError } = await supabase.from("orders").insert({
        customer_name:   name.trim(),
        customer_email:  "",
        customer_phone:  "",
        plan_id:         plan.id,
        duration_key:    duration.key,
        duration_label:  duration.label,
        amount:          duration.price,
        currency:        "ETB",
        payment_method:  method,
        status:          "pending_verification",
        tx_ref:          txLink.trim(),
      });

      // Handle race condition — duplicate caught at DB level
      if (dbError?.code === "23505") {
        setError(
          "This transaction link has already been used. " +
          "Please contact us if you need help."
        );
        setLoading(false);
        return;
      }

      if (dbError) throw dbError;
      setStep("submitted");
    } catch {
      setError("Something went wrong saving your order. Please contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-8">

        {/* Back link */}
        {step !== "submitted" && (
          <Link href={`/plans/${plan.id}`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-[11px] tracking-widest uppercase transition-colors mb-10">
            <ArrowLeft size={13} /> Back to Plan
          </Link>
        )}

        <AnimatePresence mode="wait">

          {/* ── STEP 1: REVIEW ───────────────────────────────── */}
          {step === "review" && (
            <motion.div key="review"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}>

              <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
                Checkout
              </p>
              <h1 style={{ fontFamily: "var(--font-serif)" }}
                className="text-3xl font-bold text-white mb-10">
                Review Your <em>Order</em>
              </h1>

              {/* Plan summary */}
              <div className="card p-5 flex gap-4 mb-5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={plan.image} alt={plan.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-semibold tracking-widest uppercase text-white/35 mb-1">
                    {plan.goalLabel} · {plan.level}
                  </p>
                  <h3 className="text-white font-bold text-base leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {plan.title}
                  </h3>
                  <p className="text-white/35 text-xs mt-1">
                    Duration: <span className="text-white/60">{duration.label}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-white">{duration.price.toLocaleString()}</p>
                  <p className="text-white/35 text-xs">ETB</p>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer mb-8">
                <button type="button" onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0 border transition-all ${
                    agreed ? "bg-white border-white" : "bg-transparent border-white/20 hover:border-white/50"
                  }`}>
                  {agreed && <Check size={11} className="text-black" />}
                </button>
                <span className="text-xs text-white/35 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-white/65 hover:text-white underline">Terms &amp; Conditions</Link>
                  {" "}and understand that access is granted after payment verification by our team.
                </span>
              </label>

              <button onClick={() => canContinue && setStep("payment")}
                disabled={!canContinue}
                className="btn btn-white w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed">
                Continue to Payment <ArrowRight size={14} />
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: PAYMENT INSTRUCTIONS ─────────────────── */}
          {step === "payment" && (
            <motion.div key="payment"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}>

              <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
                Payment
              </p>
              <h1 style={{ fontFamily: "var(--font-serif)" }}
                className="text-3xl font-bold text-white mb-2">
                Make Your <em>Payment</em>
              </h1>
              <p className="text-white/40 text-sm mb-8">
                Pay using Telebirr or CBE below. After payment, paste the transaction link to complete your order.
              </p>

              {/* Method selector */}
              <div className="flex gap-3 mb-6">
                {(["telebirr", "cbe"] as const).map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                      method === m
                        ? "bg-white/8 border-white/35 text-white"
                        : "bg-transparent border-white/10 text-white/45 hover:border-white/25"
                    }`}>
                    {m === "telebirr" ? <Phone size={16} strokeWidth={1.5} /> : <Building2 size={16} strokeWidth={1.5} />}
                    <div className="text-left">
                      <p className="text-sm font-semibold">{m === "telebirr" ? "Telebirr" : "CBE Birr"}</p>
                      <p className="text-[11px] text-white/30">{m === "telebirr" ? "Mobile money" : "Bank transfer"}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment details */}
              <div className="card p-6 mb-6">
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-5">
                  {method === "telebirr" ? "Telebirr" : "CBE"} Account Details
                </p>

                <div className="space-y-3">
                  {method === "telebirr" ? (
                    <>
                      <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.07]">
                        <div>
                          <p className="text-[10px] text-white/30 font-semibold tracking-widest uppercase mb-0.5">Phone Number</p>
                          <p className="text-white font-bold text-lg tracking-wider">{TELEBIRR_PHONE}</p>
                        </div>
                        <CopyButton value={TELEBIRR_PHONE} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.07]">
                        <div>
                          <p className="text-[10px] text-white/30 font-semibold tracking-widest uppercase mb-0.5">Account Name</p>
                          <p className="text-white/80 text-sm">{TELEBIRR_NAME}</p>
                        </div>
                        <CopyButton value={TELEBIRR_NAME} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.07]">
                        <div>
                          <p className="text-[10px] text-white/30 font-semibold tracking-widest uppercase mb-0.5">Account Number</p>
                          <p className="text-white font-bold text-lg tracking-wider">{CBE_ACCOUNT}</p>
                        </div>
                        <CopyButton value={CBE_ACCOUNT} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.07]">
                        <div>
                          <p className="text-[10px] text-white/30 font-semibold tracking-widest uppercase mb-0.5">Account Name</p>
                          <p className="text-white/80 text-sm">{CBE_NAME}</p>
                        </div>
                        <CopyButton value={CBE_NAME} />
                      </div>
                    </>
                  )}

                  {/* Amount */}
                  <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.07]">
                    <div>
                      <p className="text-[10px] text-white/30 font-semibold tracking-widest uppercase mb-0.5">Amount to Pay</p>
                      <p className="text-white font-black text-xl">
                        {duration.price.toLocaleString()} <span className="text-white/40 text-sm font-normal">ETB</span>
                      </p>
                    </div>
                    <CopyButton value={String(duration.price)} />
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-5 pt-5 border-t border-white/[0.07]">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-3">
                    How to get your transaction link
                  </p>
                  <ol className="space-y-2">
                    {method === "telebirr" ? (
                      <>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">1.</span> Open your Telebirr app and send the payment to the number above.</li>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">2.</span> After payment, go to <strong className="text-white/65">Transaction History</strong> in the app.</li>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">3.</span> Open the transaction and tap <strong className="text-white/65">Share</strong> or <strong className="text-white/65">View Receipt</strong>.</li>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">4.</span> Copy the transaction link and paste it in the field below.</li>
                      </>
                    ) : (
                      <>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">1.</span> Transfer the amount to the CBE account number above via CBE Birr app or online banking.</li>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">2.</span> After transfer, open your <strong className="text-white/65">Transaction Details</strong>.</li>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">3.</span> Tap <strong className="text-white/65">Share Receipt</strong> or copy the transaction reference link.</li>
                        <li className="flex gap-2.5 text-sm text-white/45"><span className="text-white/25 flex-shrink-0">4.</span> Paste that link in the field below.</li>
                      </>
                    )}
                  </ol>
                </div>
              </div>

              {/* Transaction link + name input */}
              <div className="card p-5 mb-6 space-y-4">
                <div>
                  <label className="field-label">Your Full Name</label>
                  <input type="text" placeholder="As it appears on your payment" value={name}
                    onChange={(e) => setName(e.target.value)} className="pill-input mt-1" />
                </div>
                <div>
                  <label className="field-label">Transaction Link</label>
                  <input type="url" placeholder="https://..." value={txLink}
                    onChange={(e) => handleTxLinkChange(e.target.value)}
                    className={`pill-input mt-1 ${txError ? "border-red-500/50" : ""}`} />
                  {txError ? (
                    <p className="text-red-400/80 text-[11px] mt-2 pl-1 leading-relaxed">
                      ⚠ {txError}
                    </p>
                  ) : (
                    <p className="text-white/22 text-[11px] mt-2 pl-1">
                      Paste the link you received after payment. Our team will verify it and activate your plan within 24 hours.
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-red-400/80 text-sm text-center mb-4">{error}</p>
              )}

              <div className="flex gap-3 mb-8">
                <button onClick={() => setStep("review")}
                  className="btn btn-outline py-3.5 px-6 text-[10px]">
                  ← Back
                </button>
                <button onClick={handleSubmitOrder} disabled={!canSubmit || loading}
                  className="btn btn-white flex-1 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    : <><Check size={14} /> Submit Order</>
                  }
                </button>
              </div>

              {/* Support contact */}
              <div className="card p-5">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-4">
                  Need Help?
                </p>
                <div className="space-y-3">
                  <a href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                    <MessageCircle size={15} strokeWidth={1.5} className="flex-shrink-0" />
                    Chat with us on WhatsApp
                  </a>
                  <a href={`mailto:${SUPPORT_EMAIL}`}
                    className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                    <Mail size={15} strokeWidth={1.5} className="flex-shrink-0" />
                    {SUPPORT_EMAIL}
                  </a>
                </div>
                <p className="text-white/22 text-[11px] mt-4 leading-relaxed">
                  If you&apos;re having trouble with the payment or the transaction link, contact us directly and we&apos;ll sort it out for you.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: SUBMITTED ─────────────────────────────── */}
          {step === "submitted" && (
            <motion.div key="submitted"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-10">

              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
                className="w-20 h-20 rounded-full border border-white/25 bg-white/[0.06] flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={36} className="text-white" strokeWidth={1.5} />
              </motion.div>

              <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
                Order Received
              </p>
              <h1 style={{ fontFamily: "var(--font-serif)" }}
                className="text-4xl font-bold text-white mb-4">
                Order <em>Submitted!</em>
              </h1>

              <p className="text-white/50 text-sm leading-relaxed mb-3 max-w-sm mx-auto">
                We&apos;ve received your order for <span className="text-white font-semibold">{plan.title}</span> ({duration.label}).
              </p>
              <p className="text-white/35 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
                Our team will verify your transaction link and activate your plan. This usually takes a few hours during business hours.
              </p>

              {/* What happens next */}
              <div className="card p-6 text-left mb-8">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-5">
                  What happens next
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Clock,    text: "Our team reviews your transaction link (usually within a few hours)" },
                    { icon: Shield,   text: "Once verified, your plan is activated" },
                    { icon: Download, text: "PDF guide and video content become accessible" },
                    { icon: MessageCircle, text: "Contact us on WhatsApp if you have any questions" },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Icon size={15} className="text-white/35 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-white/50 text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="card p-5 text-left mb-8">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-4">
                  Questions?
                </p>
                <div className="space-y-3">
                  <a href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                    <MessageCircle size={15} strokeWidth={1.5} /> Chat on WhatsApp
                  </a>
                  <a href={`mailto:${SUPPORT_EMAIL}`}
                    className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                    <Mail size={15} strokeWidth={1.5} /> {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/plans" className="btn btn-white py-3.5 px-8">
                  Browse More Plans
                </Link>
                <Link href="/" className="btn btn-outline py-3.5 px-8">
                  Back to Home
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense>
      <CheckoutContent id={id} />
    </Suspense>
  );
}
