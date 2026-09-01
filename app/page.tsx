"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import StatCounter from "@/components/ui/StatCounter";
import PlanCard from "@/components/ui/PlanCard";
import { STATS, PLANS, TESTIMONIALS, HOW_IT_WORKS, IMAGES } from "@/lib/data";

export default function HomePage() {
  const featured = PLANS.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <Image src={IMAGES.hero4} alt="FBA Fitness Hero" fill priority
          className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 pt-20">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/55 mb-6">
            Science-Backed Fitness &amp; Diet Plans
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-5xl md:text-7xl font-bold text-white leading-[1.06] mb-7">
            Transform Your Body.<br />
            <em className="text-white/70">Own Your Results.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/55 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Expert-crafted fitness and nutrition plans tailored to your goals.
            Calculate your BMI, get personalised recommendations, and start today.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bmi" className="btn btn-white py-4 px-10">
              Calculate My BMI <ArrowRight size={15} />
            </Link>
            <Link href="/plans" className="btn btn-outline py-4 px-10">
              Browse Plans
            </Link>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30">
          <ChevronDown size={26} />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Process</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }}
              className="text-4xl md:text-5xl font-bold text-white">
              How It <em>Works</em>
            </h2>
            <p className="text-white/40 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Four simple steps from your first visit to your first result.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.1}>
                <div className="card p-8 h-full hover:border-white/20 transition-colors">
                  <p className="text-6xl font-black leading-none mb-5"
                    style={{ color: "rgba(255,255,255,0.06)" }}>{step.step}</p>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-3">{step.step}</p>
                  <h3 className="text-white font-bold text-base mb-3">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPLIT PROMO ───────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center py-20">
          <div className="relative h-80 md:h-[460px] rounded-2xl overflow-hidden">
            <Image src={IMAGES.hero5} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-black/25" />
          </div>
          <AnimatedSection direction="left">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-5">Personalised</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }}
              className="text-4xl font-bold text-white leading-tight mb-6">
              The plan that fits<br /><em>your exact goals.</em>
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-sm">
              Our recommendation engine analyses your BMI, age, gender, activity level, and goals to find the most suitable plans for you.
            </p>
            <Link href="/fitness-plan" className="btn btn-white py-3.5 px-8 inline-flex">
              Get My Recommendation <ArrowRight size={14} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FEATURED PLANS ────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Plans</p>
              <h2 style={{ fontFamily: "var(--font-serif)" }}
                className="text-4xl md:text-5xl font-bold text-white">
                Featured <em>Plans</em>
              </h2>
            </div>
            <Link href="/plans"
              className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-white/40 hover:text-white transition-colors">
              View All <ArrowRight size={13} />
            </Link>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((plan, i) => (
              <AnimatedSection key={plan.id} delay={i * 0.08}>
                <PlanCard plan={plan} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Results</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }}
              className="text-4xl md:text-5xl font-bold text-white">
              Real People.<br /><em>Real Results.</em>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.08}>
                <div className="card p-7 h-full hover:border-white/20 transition-colors">
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={13} className="text-white/70 fill-white/70" />
                    ))}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/30 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/testimonials"
              className="text-[11px] tracking-[0.16em] uppercase text-white/35 hover:text-white transition-colors inline-flex items-center gap-2">
              Read All Stories <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 text-center">
        <Image src={IMAGES.hero6} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/75" />
        <AnimatedSection className="relative z-10 max-w-2xl mx-auto px-8">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/40 mb-5">Start Today</p>
          <h2 style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <em>Transform?</em>
          </h2>
          <p className="text-white/45 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Calculate your BMI, get a personalised plan recommendation, and take the first step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bmi" className="btn btn-white py-4 px-12">
              Calculate Your BMI <ArrowRight size={14} />
            </Link>
            <Link href="/plans" className="btn btn-outline py-4 px-12">
              Browse All Plans
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
