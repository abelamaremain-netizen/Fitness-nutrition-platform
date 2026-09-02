"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react";

// Demo credentials — in the real app this is handled server-side with JWT
const DEMO_EMAIL    = "admin@naodiansamri.com";
const DEMO_PASSWORD = "admin123";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Try admin@naodiansamri.com / admin123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0a" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-white text-xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-serif)" }}>
            Naodi <span className="text-white/40">&</span> Samri
          </span>
          <p className="text-white/25 text-[9px] font-semibold tracking-[0.3em] uppercase mt-1">
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Lock icon */}
          <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.09] flex items-center justify-center mx-auto mb-6">
            <Lock size={18} className="text-white/50" strokeWidth={1.5} />
          </div>

          <h1 className="text-xl font-bold text-white text-center mb-1"
            style={{ fontFamily: "var(--font-serif)" }}>
            Admin Login
          </h1>
          <p className="text-white/30 text-xs text-center mb-7">
            Restricted access — authorised personnel only
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                required
                placeholder="admin@naodiansamri.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pill-input"
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pill-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400/80 text-xs leading-relaxed bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2.5"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-white w-full py-3.5 mt-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><ArrowRight size={14} /> Enter Admin Panel</>
              }
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-5 border-t border-white/[0.07] text-center">
            <p className="text-[10px] text-white/20 tracking-wider uppercase mb-2">Demo credentials</p>
            <p className="text-[11px] text-white/30 font-mono">admin@naodiansamri.com</p>
            <p className="text-[11px] text-white/30 font-mono">admin123</p>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6">
          <a href="/"
            className="text-[11px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors">
            ← Back to Site
          </a>
        </p>
      </motion.div>
    </div>
  );
}
