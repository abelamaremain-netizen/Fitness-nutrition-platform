"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface FaqItem { id: string; q: string; a: string; }

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3 mb-16">
      {faqs.map((faq, i) => (
        <AnimatedSection key={faq.id} delay={i * 0.04}>
          <div className={`card overflow-hidden transition-colors ${open === faq.id ? "border-white/20" : ""}`}>
            <button onClick={() => setOpen(open === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
              <span className={`font-semibold text-sm leading-relaxed pr-2 transition-colors ${open === faq.id ? "text-white" : "text-white/70"}`}>
                {faq.q}
              </span>
              <motion.div animate={{ rotate: open === faq.id ? 180 : 0 }} transition={{ duration: 0.2 }}
                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${open === faq.id ? "bg-white text-black" : "bg-white/8 text-white/40"}`}>
                <ChevronDown size={14} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === faq.id && (
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
  );
}
