"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useLang } from "@/context/LangContext";
import { calculateBMI, getBMICategory, calculateTDEE, getCalorieTarget, type UserProfile } from "@/lib/data";

interface Result {
  bmi: number; category: { label: string; color: string };
  tdee: number; loss: number; gain: number;
}

export default function BmiPage() {
  const { t } = useLang();

  const [form, setForm] = useState({
    gender: "female" as "male" | "female",
    age: "", weight: "", height: "",
    activityLevel: "moderate" as UserProfile["activityLevel"],
  });
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const calc = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.age || +form.age < 13) err.age = "13+";
    if (!form.weight || +form.weight < 30) err.weight = "30+";
    if (!form.height || +form.height < 100) err.height = "100+";
    if (Object.keys(err).length) { setErrors(err); return; }
    setErrors({});
    const p: UserProfile = {
      gender: form.gender, age: +form.age,
      weight: +form.weight, height: +form.height,
      activityLevel: form.activityLevel, goal: "lifestyle",
    };
    const bmi = calculateBMI(+form.weight, +form.height);
    const tdee = calculateTDEE(p);
    setResult({ bmi, category: getBMICategory(bmi), tdee, loss: getCalorieTarget(tdee, "weight-loss"), gain: getCalorieTarget(tdee, "muscle-gain") });
  };

  // Activity options — values are DB keys, labels translated
  const activities = [
    { v: "sedentary", l: t("bmi.sedentary") },
    { v: "light",     l: t("bmi.light") },
    { v: "moderate",  l: t("bmi.moderate") },
    { v: "active",    l: t("bmi.active") },
  ];

  // BMI scale — labels translated
  const bmiScale = [
    { dot: "bg-white/40", label: t("bmi.underweight"), range: "< 18.5" },
    { dot: "bg-white",    label: t("bmi.normal"),      range: "18.5 – 24.9" },
    { dot: "bg-white/60", label: t("bmi.overweight"),  range: "25 – 29.9" },
    { dot: "bg-white/30", label: t("bmi.obese"),       range: "≥ 30" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-white/10 pt-32 pb-20 text-center px-4">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/35 mb-4">
          Free Tool
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ fontFamily: "var(--font-serif)" }}
          className="text-5xl md:text-6xl font-bold text-white">
          {t("bmi.title").split(" ").map((w, i) => i === 0 ? w + " " : <em key={i}>{w}</em>)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="text-white/40 mt-4 max-w-md mx-auto text-sm leading-relaxed">
          {t("bmi.subtitle")}
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Left — form */}
          <AnimatedSection direction="left">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-8">
              {t("bmi.yourDetails")}
            </p>

            <form onSubmit={calc} className="space-y-5">
              {/* Gender */}
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 mb-3">{t("bmi.gender")}</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => set("gender", "female")}
                    className={`toggle-chip ${form.gender === "female" ? "active" : ""}`}>
                    {t("bmi.female")}
                  </button>
                  <button type="button" onClick={() => set("gender", "male")}
                    className={`toggle-chip ${form.gender === "male" ? "active" : ""}`}>
                    {t("bmi.male")}
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <input type="number" placeholder={t("bmi.age")} value={form.age}
                  onChange={(e) => set("age", e.target.value)} className="pill-input" />
                {errors.age && <p className="text-red-400/70 text-[11px] mt-1.5 pl-4">{errors.age}</p>}
              </div>

              {/* Weight + Height */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input type="number" placeholder={t("bmi.weight")} value={form.weight}
                    onChange={(e) => set("weight", e.target.value)} className="pill-input" />
                  {errors.weight && <p className="text-red-400/70 text-[11px] mt-1.5 pl-4">{errors.weight}</p>}
                </div>
                <div>
                  <input type="number" placeholder={t("bmi.height")} value={form.height}
                    onChange={(e) => set("height", e.target.value)} className="pill-input" />
                  {errors.height && <p className="text-red-400/70 text-[11px] mt-1.5 pl-4">{errors.height}</p>}
                </div>
              </div>

              {/* Activity — values are DB keys */}
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 mb-3">{t("bmi.activityLevel")}</p>
                <div className="flex flex-wrap gap-2">
                  {activities.map((a) => (
                    <button key={a.v} type="button" onClick={() => set("activityLevel", a.v)}
                      className={`toggle-chip ${form.activityLevel === a.v ? "active" : ""}`}>
                      {a.l}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="btn btn-white w-full py-3.5 text-[11px] mt-2">
                {t("bmi.calculate")}
              </motion.button>
            </form>

            {/* BMI Scale */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-5">
                {t("bmi.scale")}
              </p>
              <div className="space-y-3">
                {bmiScale.map((r) => (
                  <div key={r.label} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`} />
                    <span className="text-white/50 text-sm flex-1">{r.label}</span>
                    <span className="text-white/25 text-xs font-mono">{r.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right — results */}
          <AnimatedSection direction="right">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full min-h-[360px] border border-white/10 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 border border-white/15 flex items-center justify-center mb-5 text-2xl">
                    📊
                  </div>
                  <p style={{ fontFamily: "var(--font-serif)" }} className="text-white/60 text-lg italic mb-2">
                    {t("bmi.resultsHere")}
                  </p>
                  <p className="text-white/25 text-sm">{t("bmi.fillDetails")}</p>
                </motion.div>
              ) : (
                <motion.div key="res" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} className="space-y-0">

                  {/* BMI display */}
                  <div className="border border-white/15 p-8 text-center">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 mb-3">{t("bmi.yourBMI")}</p>
                    <p className="text-8xl font-black text-white tracking-tighter leading-none">{result.bmi}</p>
                    <p className="text-white/50 text-sm mt-2 font-medium">{result.category.label}</p>

                    <div className="mt-6 h-1.5 flex rounded-none overflow-hidden">
                      <div className="flex-1 bg-white/15" />
                      <div className="flex-[1.3] bg-white/40" />
                      <div className="flex-1 bg-white/25" />
                      <div className="flex-1 bg-white/12" />
                    </div>
                    <motion.div style={{ position: "relative", height: 0, marginTop: "-5px" }}>
                      <motion.div
                        initial={{ left: "0%" }}
                        animate={{ left: `${Math.min(Math.max(((result.bmi - 15) / 25) * 100, 2), 96)}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: "absolute", transform: "translateX(-50%)" }}
                        className="w-3 h-3 bg-white rounded-full border-2 border-black shadow-lg"
                      />
                    </motion.div>
                    <div className="flex justify-between text-[10px] text-white/20 mt-3 font-mono">
                      <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                    </div>
                  </div>

                  {/* Calorie targets — labels translated */}
                  {[
                    { label: t("bmi.maintenance"),    value: result.tdee, sub: t("bmi.stayAtWeight") },
                    { label: t("bmi.weightLossGoal"), value: result.loss, sub: t("bmi.deficit") },
                    { label: t("bmi.muscleGainGoal"), value: result.gain, sub: t("bmi.surplus") },
                  ].map((row) => (
                    <div key={row.label}
                      className="border border-white/10 -mt-px flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="text-white/70 text-sm font-medium">{row.label}</p>
                        <p className="text-white/25 text-[11px]">{row.sub}</p>
                      </div>
                      <p className="text-white font-black text-xl">{row.value.toLocaleString()}</p>
                    </div>
                  ))}

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-0 -mt-px">
                    <Link href="/fitness-plan" className="btn btn-white text-[10px] py-3.5 border-r border-black">
                      {t("bmi.fitnessPlans")} <ChevronRight size={11} />
                    </Link>
                    <Link href="/meal-plan" className="btn btn-outline text-[10px] py-3.5 rounded-none border-t-0">
                      {t("bmi.mealPlans")} <ChevronRight size={11} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
