"use client";
import { useState, use, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Shield, Lock, CheckCircle2,
  CreditCard, Smartphone, Building2, ArrowRight,
  Download, Play,
} from "lucide-react";
import { PLANS, type DurationOption } from "@/lib/data";

// ─── PAYMENT METHODS ─────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "telebirr",
    label: "Telebirr",
    icon: Smartphone,
    description: "Pay via Telebirr mobile money",
  },
  {
    id: "cbe",
    label: "CBE Birr",
    icon: Building2,
    description: "Commercial Bank of Ethiopia",
  },
  {
    id: "chapa",
    label: "Other Banks",
    icon: Building2,
    description: "All Ethiopian banks via Chapa",
  },
  {
    id: "card",
    label: "Card",
    icon: CreditCard,
    description: "Visa / Mastercard",
  },
];

type Step = "review" | "payment" | "success";

function CheckoutContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const durationKey  = searchParams.get("duration") ?? "";

  const plan = PLANS.find((p) => p.id === id);
  if (!plan) notFound();

  const duration: DurationOption =
    plan.durations.find((d) => d.key === durationKey) ?? plan.durations[0];

  const [step,          setStep]          = useState<Step>("review");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [phoneNumber,   setPhoneNumber]   = useState("");
  const [loading,       setLoading]       = useState(false);
  const [agreed,        setAgreed]        = useState(false);

  // Demo: simulate payment
  const handlePay = async () => {
    if (!agreed) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setStep("success");
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-8">

        {/* Back link */}
        {step !== "success" && (
          <Link href={`/plans/${plan.id}`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-[11px] tracking-widest uppercase transition-colors mb-10">
            <ArrowLeft size={13} /> Back to Plan
          </Link>
        )}

        <AnimatePresence mode="wait">

          {/* ── STEP 1: ORDER REVIEW ──────────────────────────── */}
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

              <div className="grid md:grid-cols-5 gap-8">
                {/* Order summary — left */}
                <div className="md:col-span-3 space-y-5">
                  {/* Plan card */}
                  <div className="card p-5 flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={plan.image} alt={plan.title} fill
                        className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-1">
                        {plan.goalLabel} · {plan.level}
                      </p>
                      <h3 className="text-white font-bold text-base leading-snug mb-1"
                        style={{ fontFamily: "var(--font-serif)" }}>
                        {plan.title}
                      </h3>
                      <p className="text-white/35 text-xs">
                        Duration: <span className="text-white/60">{duration.label}</span>
                      </p>
                    </div>
                  </div>

                  {/* What you get */}
                  <div className="card p-5">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-4">
                      What You Get
                    </p>
                    <div className="space-y-2.5">
                      {plan.includes.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <CheckCircle2 size={14} className="text-white/50 flex-shrink-0" strokeWidth={1.5} />
                          <span className="text-white/55 text-sm">{item}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-3 pt-1 border-t border-white/[0.07] mt-1">
                        <Download size={14} className="text-white/50 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-white/55 text-sm">Instant PDF download after payment</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Play size={14} className="text-white/50 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-white/55 text-sm">Full video content unlocked</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <button type="button" onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0 border transition-all ${
                        agreed ? "bg-white border-white" : "bg-transparent border-white/25 hover:border-white/50"
                      }`}>
                      {agreed && <CheckCircle2 size={11} className="text-black" />}
                    </button>
                    <span className="text-xs text-white/35 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-white/65 hover:text-white underline">
                        Terms &amp; Conditions
                      </Link>
                      {" "}and understand that digital products are non-refundable once downloaded.
                    </span>
                  </label>
                </div>

                {/* Price panel — right */}
                <div className="md:col-span-2">
                  <div className="card p-6 space-y-5 sticky top-24">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">
                      Order Summary
                    </p>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-white/50">
                        <span>{plan.title}</span>
                        <span>{duration.price.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between text-white/35 text-xs">
                        <span>Duration</span>
                        <span>{duration.label}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-white font-semibold">Total</span>
                        <span className="text-white font-black text-lg">
                          {duration.price.toLocaleString()} ETB
                        </span>
                      </div>
                    </div>

                    <button onClick={() => agreed && setStep("payment")}
                      disabled={!agreed}
                      className="btn btn-white w-full py-4 text-[11px] disabled:opacity-40 disabled:cursor-not-allowed">
                      Continue to Payment <ArrowRight size={14} />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-white/22 text-[10px]">
                      <Shield size={11} strokeWidth={1.5} />
                      <span>256-bit SSL encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: PAYMENT ───────────────────────────────── */}
          {step === "payment" && (
            <motion.div key="payment"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}>

              <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
                Payment
              </p>
              <h1 style={{ fontFamily: "var(--font-serif)" }}
                className="text-3xl font-bold text-white mb-10">
                Choose Payment <em>Method</em>
              </h1>

              <div className="grid md:grid-cols-5 gap-8">
                {/* Payment form — left */}
                <div className="md:col-span-3 space-y-5">

                  {/* Method selector */}
                  <div className="card p-5 space-y-2">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-3">
                      Payment Method
                    </p>
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
                          paymentMethod === m.id
                            ? "bg-white/8 border-white/35 text-white"
                            : "bg-transparent border-white/10 text-white/45 hover:border-white/25 hover:text-white/70"
                        }`}>
                        <m.icon size={16} strokeWidth={1.5}
                          className={paymentMethod === m.id ? "text-white" : "text-white/35"} />
                        <div className="text-left flex-1">
                          <p className="text-sm font-semibold">{m.label}</p>
                          <p className="text-[11px] text-white/30">{m.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 ${
                          paymentMethod === m.id ? "border-white bg-white" : "border-white/25"
                        }`}>
                          {paymentMethod === m.id && (
                            <div className="w-full h-full rounded-full bg-black scale-50" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Phone input for mobile money */}
                  {(paymentMethod === "telebirr" || paymentMethod === "cbe") && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="card p-5">
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-3">
                        {paymentMethod === "telebirr" ? "Telebirr" : "CBE Birr"} Phone Number
                      </p>
                      <input
                        type="tel"
                        placeholder="+251 9X XXX XXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pill-input"
                      />
                      <p className="text-white/25 text-xs mt-2 pl-1">
                        You will receive a payment prompt on this number.
                      </p>
                    </motion.div>
                  )}

                  {/* Card inputs */}
                  {paymentMethod === "card" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="card p-5 space-y-4">
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-1">
                        Card Details
                      </p>
                      <input type="text" placeholder="Card number"
                        className="pill-input" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM / YY"
                          className="pill-input" />
                        <input type="text" placeholder="CVV"
                          className="pill-input" />
                      </div>
                      <input type="text" placeholder="Name on card"
                        className="pill-input" />
                    </motion.div>
                  )}
                </div>

                {/* Order summary — right */}
                <div className="md:col-span-2">
                  <div className="card p-6 space-y-5 sticky top-24">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">
                      Order Summary
                    </p>

                    {/* Mini plan info */}
                    <div className="flex gap-3 pb-4 border-b border-white/[0.07]">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={plan.image} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{plan.title}</p>
                        <p className="text-white/35 text-xs">{duration.label}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-white/45 text-sm">Total</span>
                      <div>
                        <span className="text-white font-black text-xl">
                          {duration.price.toLocaleString()}
                        </span>
                        <span className="text-white/40 text-sm ml-1">ETB</span>
                      </div>
                    </div>

                    <button onClick={handlePay} disabled={loading}
                      className="btn btn-white w-full py-4 text-[11px] disabled:opacity-60">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <><Lock size={13} /> Pay {duration.price.toLocaleString()} ETB</>
                      )}
                    </button>

                    <button onClick={() => setStep("review")}
                      className="w-full text-center text-[11px] tracking-widest uppercase text-white/30 hover:text-white transition-colors">
                      ← Back to Review
                    </button>

                    <div className="flex items-center justify-center gap-2 text-white/22 text-[10px]">
                      <Shield size={11} strokeWidth={1.5} />
                      <span>256-bit SSL encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: SUCCESS ───────────────────────────────── */}
          {step === "success" && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-16">

              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-white/10 border border-white/25 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={36} className="text-white" strokeWidth={1.5} />
              </motion.div>

              <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
                Payment Successful
              </p>
              <h1 style={{ fontFamily: "var(--font-serif)" }}
                className="text-4xl font-bold text-white mb-4">
                You&apos;re all set!
              </h1>
              <p className="text-white/45 text-sm leading-relaxed mb-3">
                <span className="text-white font-semibold">{plan.title}</span> ({duration.label}) has been
                unlocked and added to your dashboard.
              </p>
              <p className="text-white/28 text-xs mb-10">
                A confirmation email has been sent to your registered address.
              </p>

              {/* Unlocked content links */}
              <div className="card p-6 mb-8 space-y-3 text-left">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-4">
                  Your Content Is Ready
                </p>
                <a href={plan.pdfUrl} download
                  className="flex items-center gap-3 py-3 px-4 rounded-xl border border-white/15 hover:border-white/35 text-white/65 hover:text-white transition-all group">
                  <Download size={15} strokeWidth={1.5} className="group-hover:text-white" />
                  <div>
                    <p className="text-sm font-semibold">Download PDF Guide</p>
                    <p className="text-[11px] text-white/30">{plan.title} — {duration.label}</p>
                  </div>
                  <ArrowRight size={13} className="ml-auto text-white/25 group-hover:text-white" />
                </a>
                <a href={plan.videoUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 rounded-xl border border-white/15 hover:border-white/35 text-white/65 hover:text-white transition-all group">
                  <Play size={15} strokeWidth={1.5} className="group-hover:text-white" />
                  <div>
                    <p className="text-sm font-semibold">Watch Video Content</p>
                    <p className="text-[11px] text-white/30">Opens in YouTube</p>
                  </div>
                  <ArrowRight size={13} className="ml-auto text-white/25 group-hover:text-white" />
                </a>
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
