"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { IMAGES } from "@/lib/data";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* ── HERO SECTION — FenleyFit style: full bg image, form overlay ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background image */}
        <Image src={IMAGES.hero4} alt="Contact" fill priority
          className="object-cover object-center grayscale opacity-25"
          sizes="100vw" />
        {/* Gradient over image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl text-center pt-24">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/40 mb-5">
            Get In Touch
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
            GET IN <em>TOUCH</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="text-white/45 text-sm leading-relaxed mb-12 max-w-md mx-auto">
            Send us a message using the form below and we&apos;ll get back to you as soon as we can.
          </motion.p>

          {/* Form — FenleyFit exact style */}
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center">
                <div className="w-14 h-14 border border-white/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={22} className="text-white" />
                </div>
                <p style={{ fontFamily: "var(--font-serif)" }}
                  className="text-white text-2xl italic font-bold mb-2">
                  Message Sent!
                </p>
                <p className="text-white/40 text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="text-[11px] tracking-[0.18em] uppercase text-white/40 hover:text-white transition-colors">
                  Send another →
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full space-y-4">
                {/* Two-col row: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Full Name" value={form.name}
                    onChange={(e) => set("name", e.target.value)} className="pill-input" />
                  <input type="email" required placeholder="Email" value={form.email}
                    onChange={(e) => set("email", e.target.value)} className="pill-input" />
                </div>
                {/* Message */}
                <textarea required rows={4} placeholder="How can I Help?" value={form.message}
                  onChange={(e) => set("message", e.target.value)} className="pill-textarea" />
                {/* Submit */}
                <div className="pt-2">
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="btn btn-white w-full py-4 text-[11px] tracking-[0.2em] disabled:opacity-50">
                    {loading
                      ? <span className="flex items-center gap-2 justify-center">
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          SENDING...
                        </span>
                      : "SUBMIT"
                    }
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CONTACT INFO STRIP ── */}
      <section className="border-t border-white/10 max-w-5xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Mail, label: "Email", value: "hello@naodiansamri.com", href: "mailto:hello@naodiansamri.com" },
            { icon: Phone, label: "Phone", value: "+251 91 234 5678", href: "tel:+251912345678" },
            { icon: MapPin, label: "Location", value: "Addis Ababa, Ethiopia", href: "#" },
          ].map((info, i) => (
            <a key={i} href={info.href}
              className="card flex flex-col items-center text-center py-8 px-6 hover:border-white/20 transition-colors group">
              <info.icon size={18} className="text-white/30 group-hover:text-white/60 transition-colors mb-3" strokeWidth={1.5} />
              <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/30 mb-1.5">{info.label}</p>
              <p className="text-white/60 text-sm group-hover:text-white transition-colors">{info.value}</p>
            </a>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-10 text-center">
          <a href="https://wa.me/251912345678" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 btn btn-outline py-3.5 px-10 text-[11px]">
            <MessageCircle size={15} strokeWidth={1.5} />
            CHAT ON WHATSAPP
          </a>
        </div>
      </section>
    </div>
  );
}
