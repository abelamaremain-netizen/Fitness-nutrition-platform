"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import RecommendationForm from "@/components/ui/RecommendationForm";
import RecommendationResults from "@/components/ui/RecommendationResults";
import { IMAGES, recommendPlans, type UserProfile, type Plan } from "@/lib/data";

interface Props { plans: Plan[] }

export default function MealPlanClient({ plans }: Props) {
  const [results, setResults] = useState<Plan[] | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleSubmit = (p: UserProfile) => {
    setProfile(p);
    setResults(recommendPlans(p, plans));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-64 md:h-80 flex items-end">
        <Image src={IMAGES.samri2} alt="Meal Plan" fill priority
          className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0d0d0d]" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-8 pb-12">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/40 mb-3">
            Personalised Meal &amp; Calorie Plans
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white">
            Find Your <em>Meal Plan</em>
          </motion.h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div key="form"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}>
              <div className="border-b border-white/10 pb-8 mb-10">
                <p style={{ fontFamily: "var(--font-serif)" }}
                  className="text-2xl font-bold text-white italic mb-2">
                  Your Health Profile
                </p>
                <p className="text-white/35 text-sm leading-relaxed max-w-xl">
                  Tell us about yourself — including any allergies or dietary restrictions — and we&apos;ll
                  recommend nutrition plans calibrated to your calorie needs and goals.
                </p>
              </div>
              <RecommendationForm mode="meal" onSubmit={handleSubmit} />
            </motion.div>
          ) : (
            <motion.div key="results" id="results"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}>
              <RecommendationResults
                plans={results}
                profile={profile!}
                onReset={() => { setResults(null); setProfile(null); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
