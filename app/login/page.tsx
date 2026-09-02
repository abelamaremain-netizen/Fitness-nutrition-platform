"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Star, Lock } from "lucide-react";
import { IMAGES } from "@/lib/data";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "/plans";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // Demo: after "login" redirect to the original destination
    router.push(redirect);
  };

  const comingFromCheckout = redirect.includes("/checkout");

  return (
    <div className="min-h-screen flex">
      {/* Left image panel */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <Image src={IMAGES.hero5} alt="" fill className="object-cover" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="card p-6 max-w-xs">
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={12} className="text-white/60 fill-white/60" />
              ))}
            </div>
            <p className="text-white/70 text-sm italic leading-relaxed mb-3">
              &ldquo;FBA completely changed how I approach fitness. The plans are clear and actually work.&rdquo;
            </p>
            <p className="text-white/40 text-xs font-semibold tracking-widest uppercase">
              — Selam T., Lost 12kg
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-8 py-20 lg:max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm">

          <Link href="/" className="inline-block mb-10">
            <span className="text-white text-xl font-black tracking-widest uppercase"
              style={{ fontFamily: "var(--font-serif)" }}>FBA</span>
            <span className="block text-white/30 text-[8px] font-semibold tracking-[0.3em] uppercase">
              FITNESS
            </span>
          </Link>

          {/* Context message if coming from checkout */}
          {comingFromCheckout && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 card p-4 mb-7">
              <Lock size={15} className="text-white/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-white text-sm font-semibold mb-0.5">Login required to purchase</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Create a free account or log in to complete your purchase and access your plan.
                </p>
              </div>
            </motion.div>
          )}

          <h1 className="text-3xl font-bold text-white mb-1.5"
            style={{ fontFamily: "var(--font-serif)" }}>
            Welcome back
          </h1>
          <p className="text-white/40 text-sm mb-9">
            Log in to access your purchased plans.
          </p>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 bg-white
            hover:bg-white/90 text-black font-semibold py-3 rounded-lg text-sm transition-all mb-7">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-white/25 text-xs">or with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input type="email" required placeholder="you@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className="pill-input" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
                <Link href="/forgot-password"
                  className="text-[11px] text-white/35 hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pill-input pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-white w-full py-3.5 mt-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><ArrowRight size={14} /> Log In</>
              }
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-7">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${comingFromCheckout ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="text-white hover:text-white/70 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
