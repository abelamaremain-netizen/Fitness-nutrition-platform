"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Lock, Play,
  ArrowRight, Clock, Shield, Star,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Plan, DurationOption } from "@/lib/data";
import type { Testimonial } from "@/src/types/database.types";

const levelStyle: Record<string, { bg: string; text: string }> = {
  Normal: { bg: "bg-white/10",  text: "text-white/70" },
  Pro:    { bg: "bg-white/15",  text: "text-white/85" },
  VIP:    { bg: "bg-white/20",  text: "text-white" },
};

interface Props {
  plan:           Plan;
  relatedPlans:   Plan[];
  testimonials:   Testimonial[];
}

export default function PlanDetailClient({ plan, relatedPlans, testimonials }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<DurationOption | null>(
    plan.durations.length > 0 ? plan.durations[0] : null
  );

  const handleGetPlan = () => {
    if (!selected) return;
    router.push(`/checkout/${plan.id}?duration=${selected.key}`);
  };

  const lvl = levelStyle[plan.level] ?? levelStyle["Normal"];

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="relative h-72 md:h-[420px]">
        <Image src={plan.image} alt={plan.title} fill priority
          className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute top-24 left-0 right-0 max-w-6xl mx-auto px-8">
          <Link href="/plans"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[11px] tracking-widest uppercase transition-colors">
            <ArrowLeft size={13} /> All Plans
          </Link>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-10 max-w-6xl mx-auto px-8 left-0 right-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full ${lvl.bg} ${lvl.text}`}>
              {plan.level}
            </span>
            <span className="text-[9px] font-semibold tracking-widest uppercase text-white/50 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
              {plan.goalLabel}
            </span>
            {plan.bestseller && (
              <span className="text-[9px] font-bold tracking-widest uppercase text-black bg-white px-3 py-1 rounded-full">
                Bestseller
              </span>
            )}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {plan.title}
          </motion.h1>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left — plan info */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description */}
            <AnimatedSection>
              <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-4">
                About This Plan
              </p>
              <p className="text-white/65 text-base leading-8">
                {plan.longDescription}
              </p>
            </AnimatedSection>

            {/* What's included */}
            <AnimatedSection delay={0.05}>
              <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-5">
                What&apos;s Included
              </p>
              <div className="space-y-3">
                {plan.includes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-white/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-white/65 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Video preview — locked */}
            <AnimatedSection delay={0.1}>
              <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-5">
                Video Preview
              </p>
              <div className="relative rounded-xl overflow-hidden aspect-video bg-[#111] border border-white/10">
                {plan.videoThumb && (
                  <Image src={plan.videoThumb} alt="Preview" fill
                    className="object-cover blur-sm scale-105 opacity-40" sizes="700px" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                    <Lock size={20} className="text-white/60" />
                  </div>
                  <p className="text-white font-semibold mb-1">Video Locked</p>
                  <p className="text-white/40 text-sm mb-5">
                    Purchase this plan to unlock the full video content.
                  </p>
                  <button onClick={handleGetPlan} disabled={!selected}
                    className="btn btn-white py-2.5 px-7 text-[10px] disabled:opacity-40">
                    Unlock Now
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* Tags */}
            <AnimatedSection delay={0.12}>
              <div className="flex flex-wrap gap-2">
                {plan.tags.map((tag) => (
                  <span key={tag}
                    className="text-[10px] tracking-widest uppercase text-white/35 border border-white/12 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <AnimatedSection delay={0.14}>
                <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-5">
                  What Clients Say
                </p>
                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="card p-6">
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={12} className="text-white/60 fill-white/60" />
                        ))}
                      </div>
                      <p className="text-white/55 text-sm leading-7 italic mb-4">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <div>
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <p className="text-white/30 text-xs mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Right — sticky purchase panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-0">
              <div className="card p-6 space-y-6">
                {/* Duration selector */}
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-3">
                    Select Duration
                  </p>
                  <div className="space-y-2">
                    {plan.durations.map((d) => (
                      <button key={d.key} onClick={() => setSelected(d)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                          selected?.key === d.key
                            ? "bg-white text-black border-white font-semibold"
                            : "bg-transparent text-white/55 border-white/15 hover:border-white/35 hover:text-white"
                        }`}>
                        <div className="flex items-center gap-2">
                          <Clock size={13} className={selected?.key === d.key ? "text-black" : "text-white/30"} />
                          <span>{d.label}</span>
                        </div>
                        <span className="font-bold">{d.price.toLocaleString()} ETB</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-white/40 text-sm">Total</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {selected ? selected.price.toLocaleString() : "—"}
                      </span>
                      <span className="text-white/40 text-sm">ETB</span>
                    </div>
                  </div>
                  <p className="text-white/25 text-xs text-right">
                    {selected ? `for ${selected.label}` : "Select a duration"}
                  </p>
                </div>

                {/* CTA */}
                <button onClick={handleGetPlan} disabled={!selected}
                  className="btn btn-white w-full py-4 text-[11px] disabled:opacity-40">
                  <ArrowRight size={14} /> Get This Plan
                </button>

                <div className="flex items-center justify-center gap-2 text-white/25 text-[11px]">
                  <Shield size={12} strokeWidth={1.5} />
                  <span>Secure payment · Instant access</span>
                </div>
              </div>

              {/* PDF locked notice */}
              <div className="card mt-4 p-4 flex items-start gap-3">
                <Lock size={14} className="text-white/30 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-white/55 text-xs font-semibold mb-0.5">PDF Guide Locked</p>
                  <p className="text-white/28 text-xs leading-relaxed">
                    The full PDF guide is available immediately after purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related plans */}
        {relatedPlans.length > 0 && (
          <AnimatedSection className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-3">
                  More Plans
                </p>
                <h2 style={{ fontFamily: "var(--font-serif)" }}
                  className="text-3xl font-bold text-white">
                  You Might Also Like
                </h2>
              </div>
              <Link href="/plans"
                className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors flex items-center gap-2">
                All Plans <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPlans.map((r) => (
                <Link key={r.id} href={`/plans/${r.id}`}>
                  <motion.div whileHover={{ y: -4 }}
                    className="card overflow-hidden group hover:border-white/20 transition-colors">
                    <div className="relative h-44 overflow-hidden rounded-t-2xl">
                      <Image src={r.image} alt={r.title} fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                        sizes="400px" />
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold text-sm mb-1"
                        style={{ fontFamily: "var(--font-serif)" }}>
                        {r.title}
                      </h3>
                      <p className="text-white/35 text-xs leading-relaxed line-clamp-2 mb-3">
                        {r.description}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-white font-bold">
                          from {r.durations[0]?.price.toLocaleString()}
                        </span>
                        <span className="text-white/35 text-xs">ETB</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
