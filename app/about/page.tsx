"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Users, Target, Heart } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import StatCounter from "@/components/ui/StatCounter";
import { TEAM, IMAGES, STATS } from "@/lib/data";

const VALUES = [
  { icon: Target, title: "Science First", description: "Every plan is grounded in exercise science and nutritional research — not trends." },
  { icon: Users, title: "Community Driven", description: "Built for the Ethiopian community, with respect for local culture, food, and lifestyle." },
  { icon: Heart, title: "Inclusive Approach", description: "Plans for all body types, fitness levels, and dietary needs — no one is left behind." },
  { icon: Award, title: "Quality Guaranteed", description: "Each plan goes through expert review before publishing. We stand behind every program." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-[440px]">
        <Image src={IMAGES.hero2} alt="About FBA" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pt-16">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-4">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-5xl md:text-6xl font-bold text-white">
            About <em>FBA</em>
          </motion.h1>
        </div>
      </div>

      {/* Mission */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-5">Our Mission</p>
            <h2 className="text-4xl font-bold text-white mb-7 leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}>
              Making expert fitness<br /><em>accessible to everyone.</em>
            </h2>
            <p className="text-white/45 text-sm leading-8 mb-5">
              FBA was born from a simple frustration: quality fitness and nutrition guidance was
              too expensive, too generic, or not designed with Ethiopian bodies, culture, and food in mind.
            </p>
            <p className="text-white/45 text-sm leading-8 mb-8">
              Our team of certified trainers, nutritionists, and wellness coaches built a platform
              where science-backed plans meet cultural relevance — at a price that&apos;s accessible to real people.
            </p>
            <Link href="/plans" className="btn btn-white py-3.5 px-8 inline-flex">
              Browse Our Plans <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            <div className="grid grid-cols-2 gap-4 h-[400px]">
              <div className="relative rounded-2xl overflow-hidden row-span-2">
                <Image src={IMAGES.hero5} alt="" fill className="object-cover" sizes="300px" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={IMAGES.hero1} alt="" fill className="object-cover" sizes="200px" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={IMAGES.hero6} alt="" fill className="object-cover" sizes="200px" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
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
                  <div className="w-10 h-10 rounded-xl card flex items-center justify-center mb-5 border-white/15">
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

      {/* Team */}
      <section className="py-24 px-8" style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">The Team</p>
            <h2 className="text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif)" }}>
              Meet the <em>Experts</em>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-7">
            {TEAM.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="card overflow-hidden hover:border-white/20 transition-colors group">
                  <div className="relative h-64 overflow-hidden">
                    <Image src={member.image} alt={member.name} fill
                      className="object-cover object-top transition-transform duration-600 group-hover:scale-105"
                      sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-0.5"
                      style={{ fontFamily: "var(--font-serif)" }}>{member.name}</h3>
                    <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-4">{member.role}</p>
                    <p className="text-white/35 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="card p-12 md:p-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif)" }}>
                Ready to join<br /><em>thousands of results?</em>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Start with a free BMI calculation and get your personalised plan recommendation in minutes.
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
