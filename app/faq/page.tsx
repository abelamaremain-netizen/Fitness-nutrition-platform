"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { FAQS } from "@/lib/data";

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="pt-36 pb-16 text-center px-8">
        <AnimatedSection>
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Help</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-serif)" }}>
            Frequently Asked <em>Questions</em>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
            Everything you need to know about plans, payments, and access.
          </p>
        </AnimatedSection>
      </div>

      <div className="max-w-3xl mx-auto px-8 pb-24">
        {/* Accordion */}
        <div className="space-y-3 mb-16">
          {FAQS.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.04}>
              <div className={`card overflow-hidden transition-colors ${open === i ? "border-white/20" : ""}`}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className={`font-semibold text-sm leading-relaxed pr-2 transition-colors ${
                    open === i ? "text-white" : "text-white/70"
                  }`}>
                    {faq.q}
                  </span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      open === i ? "bg-white text-black" : "bg-white/8 text-white/40"
                    }`}>
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}>
                      <div className="px-6 pb-6 pt-1 text-white/45 text-sm leading-7 border-t border-white/[0.07]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Still have questions */}
        <AnimatedSection>
          <div className="card p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto mb-5">
              <MessageCircle size={20} className="text-white/50" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-serif)" }}>
              Still have questions?
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-7 max-w-xs mx-auto">
              Our team responds via email, phone, and WhatsApp within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="btn btn-white py-3 px-8">
                Contact Us <ArrowRight size={13} />
              </Link>
              <a href="https://wa.me/251912345678" target="_blank" rel="noopener noreferrer"
                className="btn btn-outline py-3 px-8">
                WhatsApp Us
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
