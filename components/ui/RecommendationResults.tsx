"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Download, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import type { Plan, UserProfile } from "@/lib/data";
import { calculateBMI, getBMICategory, calculateTDEE, getCalorieTarget } from "@/lib/data";

interface Props { plans: Plan[]; profile: UserProfile; onReset: () => void; }

export default function RecommendationResults({ plans, profile, onReset }: Props) {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);
  const tdee = calculateTDEE(profile);
  const target = getCalorieTarget(tdee, profile.goal);

  return (
    <div className="space-y-10">

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}>
        {[
          { v: String(bmi),                label: "Your BMI",    sub: bmiCat.label },
          { v: tdee.toLocaleString(),       label: "Maintenance", sub: "kcal / day" },
          { v: target.toLocaleString(),     label: "Daily Target",sub: "kcal / day" },
          { v: String(plans.length),        label: "Plans Found", sub: "Ranked for you" },
        ].map((s, i) => (
          <div key={i} className="text-center px-5 py-5" style={{ background: "#161616" }}>
            <p className="text-2xl font-black text-white"
              style={{ fontFamily: "var(--font-serif)" }}>{s.v}</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/35 mt-1">{s.label}</p>
            <p className="text-[11px] text-white/22 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-serif)" }}>
          Recommended <em>for You</em>
        </h2>
        <button onClick={onReset}
          className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
          <ArrowLeft size={13} /> Update Profile
        </button>
      </div>

      {/* Plan cards */}
      <div className="flex flex-col gap-5">
        {plans.map((plan, i) => (
          <motion.div key={plan.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card group hover:border-white/20 transition-all overflow-hidden">
            <div className="flex flex-col sm:flex-row">

              {/* Thumbnail */}
              <div className="relative sm:w-52 h-44 sm:h-auto flex-shrink-0 overflow-hidden rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl sm:rounded-tr-none rounded-br-none sm:rounded-bl-2xl">
                <Image src={plan.videoThumb} alt={plan.title} fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="208px" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

                {/* Play */}
                <a href={plan.videoUrl} target="_blank" rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center hover:bg-white hover:border-white transition-all group/play">
                    <Play size={14} className="text-white ml-0.5 group-hover/play:text-black" fill="currentColor" />
                  </div>
                </a>

                {/* Rank */}
                <div className={`absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                  i === 0 ? "bg-white text-black" : "bg-black/60 backdrop-blur text-white/60 border border-white/15"
                }`}>
                  {i === 0 ? "Best Match" : `#${i + 1}`}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between gap-4 min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-white/35 mb-1">{plan.goalLabel}</p>
                      <h3 className="text-white font-bold text-lg leading-tight"
                        style={{ fontFamily: "var(--font-serif)" }}>
                        {plan.title}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-black text-lg">{plan.calories}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">cal/day</p>
                    </div>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed line-clamp-2">{plan.description}</p>
                </div>

                {/* Tiers + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                  {/* Pricing */}
                  <div className="flex gap-2 flex-1">
                    {plan.levels.map(({ level, price }) => (
                      <div key={level}
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem" }}
                        className="flex-1 text-center py-2 px-1">
                        <p className="text-[9px] font-bold tracking-widest uppercase text-white/28">{level}</p>
                        <p className="text-white font-bold text-sm">{price}</p>
                        <p className="text-[9px] text-white/20">ETB</p>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <a href={plan.videoUrl} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline text-[10px] py-2.5 px-4">
                      <ExternalLink size={11} /> Watch
                    </a>
                    <a href={plan.pdfUrl} download
                      className="btn btn-outline text-[10px] py-2.5 px-4">
                      <Download size={11} /> PDF
                    </a>
                    <Link href={`/plans/${plan.id}`}
                      className="btn btn-white text-[10px] py-2.5 px-5">
                      Get Plan <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
