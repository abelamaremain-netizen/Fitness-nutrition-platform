"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { HOW_IT_WORKS, IMAGES } from "@/lib/data";

const STEP_IMAGES = [IMAGES.hero4, IMAGES.hero1, IMAGES.hero2, IMAGES.hero5];

const FEATURES = [
  "Instant PDF download after purchase",
  "Video content via YouTube / Vimeo",
  "Amharic & English plan documents",
  "Normal, Pro, and VIP levels",
  "BMI-based plan recommendations",
  "Secure payment via Chapa & Stripe",
  "Mobile-friendly dashboard access",
  "Expert-reviewed plans",
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="pt-36 pb-16 text-center px-8">
        <AnimatedSection>
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Process</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-serif)" }}>
            How <em>It Works</em>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
            From your first visit to your first result — four steps to a better you.
          </p>
        </AnimatedSection>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-24">
        {/* Steps — alternating layout */}
        <div className="space-y-24">
          {HOW_IT_WORKS.map((step, i) => (
            <AnimatedSection key={step.step} direction={i % 2 === 0 ? "left" : "right"}>
              <div className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                {/* Text */}
                <div>
                  <p className="text-8xl font-black leading-none mb-5"
                    style={{ color: "rgba(255,255,255,0.04)", fontFamily: "var(--font-serif)" }}>
                    {step.step}
                  </p>
                  <div className="w-11 h-11 card rounded-xl flex items-center justify-center mb-5">
                    <span className="text-white/60 font-bold text-sm">{step.step}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {step.title}
                  </h2>
                  <p className="text-white/45 text-base leading-relaxed">{step.description}</p>
                  {i === HOW_IT_WORKS.length - 1 && (
                    <Link href="/plans" className="btn btn-white mt-8 inline-flex">
                      Browse Plans <ArrowRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Image */}
                <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
                  <Image src={STEP_IMAGES[i]} alt={step.title} fill
                    className="object-cover" sizes="600px" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-black font-black text-base">{step.step}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Features checklist */}
        <AnimatedSection className="mt-24">
          <div className="card p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Included</p>
                <h2 className="text-3xl font-bold text-white mb-8"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  Everything you need<br /><em>to succeed</em>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FEATURES.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-white/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-white/55 text-sm leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                <Image src={IMAGES.hero3} alt="Features" fill className="object-cover" sizes="500px" />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center mt-20">
          <h2 className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-serif)" }}>
            Ready to get <em>started?</em>
          </h2>
          <p className="text-white/40 text-sm mb-8">Calculate your BMI and find your perfect plan.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bmi" className="btn btn-white py-3.5 px-10">
              Calculate BMI <ArrowRight size={14} />
            </Link>
            <Link href="/plans" className="btn btn-outline py-3.5 px-10">
              Browse Plans
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
