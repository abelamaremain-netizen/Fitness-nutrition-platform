"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Users, Target, Heart } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import StatCounter from "@/components/ui/StatCounter";
import { IMAGES, STATS } from "@/lib/data";

const VALUES = [
  { icon: Target, title: "Science First",       description: "Every plan is grounded in exercise science and nutritional research — not trends." },
  { icon: Users,  title: "Community Driven",    description: "Built for the Ethiopian community, with respect for local culture, food, and lifestyle." },
  { icon: Heart,  title: "Inclusive Approach",  description: "Plans for all body types, fitness levels, and dietary needs — no one is left behind." },
  { icon: Award,  title: "Quality Guaranteed",  description: "Each plan is personally designed and tested by Naodi & Samri before publishing." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative h-72 md:h-[480px]">
        <Image src={IMAGES.both} alt="Naodi & Samri" fill
          className="object-cover object-top" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pt-16">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-4">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-5xl md:text-6xl font-bold text-white">
            About <em>Naodi &amp; Samri</em>
          </motion.h1>
        </div>
      </div>

      {/* ── MISSION ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-5">Our Mission</p>
            <h2 className="text-4xl font-bold text-white mb-7 leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}>
              Making expert fitness<br /><em>accessible to everyone.</em>
            </h2>
            <p className="text-white/45 text-sm leading-8 mb-5">
              Naodi &amp; Samri built this platform from a simple frustration: quality fitness and nutrition
              guidance in Ethiopia was either too expensive, too generic, or not designed with Ethiopian
              bodies, culture, and food in mind.
            </p>
            <p className="text-white/45 text-sm leading-8 mb-8">
              As certified coaches and nutrition specialists, they created a platform where science-backed
              plans meet cultural relevance — and where every plan is something they&apos;ve personally
              designed, tested, and stand behind.
            </p>
            <Link href="/plans" className="btn btn-white py-3.5 px-8 inline-flex">
              Browse Our Plans <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            <div className="grid grid-cols-2 gap-4 h-[420px]">
              <div className="relative rounded-2xl overflow-hidden row-span-2">
                <Image src={IMAGES.naodi3} alt="Naodi" fill
                  className="object-cover object-top" sizes="300px" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={IMAGES.samri2} alt="Samri" fill
                  className="object-cover object-top" sizes="200px" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={IMAGES.samri1} alt="Samri training" fill
                  className="object-cover object-top" sizes="200px" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── THE FOUNDERS ─────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">The Founders</p>
            <h2 className="text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif)" }}>
              Meet <em>the Team</em>
            </h2>
          </AnimatedSection>

          {/* Naodi */}
          <AnimatedSection className="mb-16">
            <div className="grid md:grid-cols-2 gap-0 card overflow-hidden">
              <div className="relative h-[520px]">
                <Image src={IMAGES.naodi2} alt="Naodi" fill
                  className="object-cover object-top" sizes="600px" />
              </div>
              <div className="flex flex-col justify-center p-10 md:p-14">
                <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-3">
                  Co-Founder &amp; Fitness Coach
                </p>
                <h3 className="text-4xl font-bold text-white mb-5"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  Naodi
                </h3>
                <p className="text-white/50 text-sm leading-8 mb-5">
                  Naodi is a certified fitness coach specialising in body recomposition, strength training,
                  and women&apos;s wellness. She built her own transformation first — and built this platform
                  to share exactly what worked.
                </p>
                <p className="text-white/40 text-sm leading-8">
                  Her programmes combine progressive strength training with smart cardio and recovery
                  protocols, designed specifically for women who want sustainable, visible results.
                </p>
                {/* Three photos row */}
                <div className="flex gap-3 mt-8">
                  {[IMAGES.naodi1, IMAGES.naodi2, IMAGES.naodi3].map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={img} alt={`Naodi ${i+1}`} fill className="object-cover object-top" sizes="80px" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Samri */}
          <AnimatedSection delay={0.1}>
            <div className="grid md:grid-cols-2 gap-0 card overflow-hidden">
              <div className="flex flex-col justify-center p-10 md:p-14 md:order-1 order-2">
                <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-3">
                  Co-Founder &amp; Nutrition Expert
                </p>
                <h3 className="text-4xl font-bold text-white mb-5"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  Samri
                </h3>
                <p className="text-white/50 text-sm leading-8 mb-5">
                  Samri is a nutrition specialist and certified personal trainer focused on sustainable
                  diet plans, hormonal health, and helping women achieve lasting results through
                  science-backed guidance.
                </p>
                <p className="text-white/40 text-sm leading-8">
                  Her nutrition programmes are built around Ethiopian food culture — making healthy
                  eating practical, enjoyable, and effective without abandoning the foods you love.
                </p>
                {/* Three photos row */}
                <div className="flex gap-3 mt-8">
                  {[IMAGES.samri1, IMAGES.samri2, IMAGES.samri3].map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={img} alt={`Samri ${i+1}`} fill className="object-cover object-top" sizes="80px" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[520px] md:order-2 order-1">
                <Image src={IMAGES.samri2} alt="Samri" fill
                  className="object-cover object-top" sizes="600px" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Values</p>
            <h2 className="text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif)" }}>
              What We <em>Stand For</em>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="card p-7 h-full hover:border-white/20 transition-colors">
                  <div className="w-10 h-10 rounded-xl card flex items-center justify-center mb-5">
                    <v.icon size={18} className="text-white/50" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{v.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{v.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection>
            <div className="card p-12 md:p-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif)" }}>
                Ready to start your<br /><em>transformation?</em>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Start with a free BMI calculation and get your personalised plan recommendation from Naodi &amp; Samri in minutes.
              </p>
              <Link href="/bmi" className="btn btn-white py-3.5 px-10 inline-flex">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
