"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/data";

const PERKS = [
  "Instant access to purchased plans",
  "Personalised plan recommendations",
  "BMI & daily calorie tracking",
  "Plans in Amharic & English",
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-400"][pwStrength];
  const strengthLabel = ["", "Weak", "Fair", "Strong"][pwStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    window.location.href = "/fitness-plan";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Benefits panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center relative overflow-hidden"
        style={{ background: "#111" }}>
        <Image src={IMAGES.hero2} alt="" fill className="object-cover opacity-20" sizes="50vw" />
        <div className="relative z-10 px-14 py-20">
          <Link href="/" className="inline-block mb-14">
            <span className="text-white text-2xl font-black tracking-widest uppercase"
              style={{ fontFamily: "var(--font-serif)" }}>FBA</span>
            <span className="block text-white/30 text-[8px] font-semibold tracking-[0.3em] uppercase">FITNESS</span>
          </Link>

          <h2 className="text-4xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}>
            Start your fitness<br /><em>journey today.</em>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xs">
            Create a free account to unlock personalised plan recommendations and purchase access.
          </p>

          <div className="space-y-4 mb-12">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-white/50 flex-shrink-0" />
                <span className="text-white/55 text-sm">{p}</span>
              </div>
            ))}
          </div>

          {/* Avatar stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {[IMAGES.hero1, IMAGES.hero3, IMAGES.hero4, IMAGES.hero6].map((img, i) => (
                <div key={i} className="relative w-9 h-9 rounded-full border-2 overflow-hidden"
                  style={{ borderColor: "#111" }}>
                  <Image src={img} alt="" fill className="object-cover" sizes="36px" />
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm">
              <span className="text-white font-semibold">3,000+</span> clients
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm">

          <Link href="/" className="inline-block mb-10 lg:hidden">
            <span className="text-white text-xl font-black tracking-widest uppercase"
              style={{ fontFamily: "var(--font-serif)" }}>FBA</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-1.5"
            style={{ fontFamily: "var(--font-serif)" }}>
            Create account
          </h1>
          <p className="text-white/40 text-sm mb-9">Free to join. No subscription required.</p>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black font-semibold py-3 rounded-lg text-sm transition-all mb-7">
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
              <label className="field-label">Full Name</label>
              <input type="text" required placeholder="Selam Tadesse" value={form.name}
                onChange={(e) => set("name", e.target.value)} className="pill-input" />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input type="email" required placeholder="you@email.com" value={form.email}
                onChange={(e) => set("email", e.target.value)} className="pill-input" />
            </div>
            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required placeholder="Min. 8 characters"
                  value={form.password} onChange={(e) => set("password", e.target.value)}
                  className="pill-input pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 px-1">
                  <div className="flex gap-1">
                    {[1,2,3].map((s) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= pwStrength ? strengthColor : "bg-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-white/30 mt-1">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Agree */}
            <label className="flex items-start gap-3 cursor-pointer mt-1">
              <button type="button" onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0 border transition-all ${
                  agreed ? "bg-white border-white" : "bg-transparent border-white/20 hover:border-white/50"
                }`}>
                {agreed && <CheckCircle2 size={11} className="text-black" />}
              </button>
              <span className="text-xs text-white/35 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-white/65 hover:text-white underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-white/65 hover:text-white underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading || !agreed}
              className="btn btn-white w-full py-3.5 mt-1 disabled:opacity-40">
              {loading
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><ArrowRight size={14} /> Create Account</>
              }
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-7">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-white/70 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
