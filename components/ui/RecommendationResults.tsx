"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Download, ExternalLink, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useLang } from "@/context/LangContext";
import type { Plan, UserProfile, DurationOption } from "@/lib/data";
import { calculateBMI, getBMICategory, calculateTDEE, getCalorieTarget } from "@/lib/data";

interface Props { plans: Plan[]; profile: UserProfile; onReset: () => void; }

const levelStyle: Record<string, string> = {
  Normal: "bg-white/10 text-white/60",
  Pro:    "bg-white/15 text-white/80",
  VIP:    "bg-white/20 text-white",
};

function PlanRow({ plan, rank }: { plan: Plan; rank: number }) {
  const router   = useRouter();
  const { t }    = useLang();
  const [selected, setSelected] = useState<DurationOption | null>(
    plan.durations.length > 0 ? plan.durations[0] : null
  );

  const handleGetPlan = () => {
    if (!selected) return;
    router.push(`/checkout/${plan.id}?duration=${selected.key}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.07 }}
      className="card group hover:border-white/20 transition-all overflow-hidden">
      <div className="flex flex-col sm:flex-row">

        {/* Thumbnail */}
        <div className="relative sm:w-52 h-44 sm:h-auto flex-shrink-0 overflow-hidden rounded-tl-2xl rounded-tr-2xl sm:rounded-tr-none sm:rounded-bl-2xl">
          {plan.videoThumb ? (
            <Image src={plan.videoThumb} alt={plan.title} fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="208px" />
          ) : (
            <Image src={plan.image} alt={plan.title} fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="208px" />
          )}
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors" />

          {/* Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center">
              <Play size={14} className="text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Rank badge */}
          <div className={`absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
            rank === 0
              ? "bg-white text-black"
              : "bg-black/60 backdrop-blur text-white/60 border border-white/15"
          }`}>
            {rank === 0 ? t("results.bestMatch") : `#${rank + 1}`}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between gap-4 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {/* Level badge — translated */}
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${levelStyle[plan.level] ?? levelStyle.Normal}`}>
                    {t(`filter.${plan.level.toLowerCase()}` as "filter.normal" | "filter.pro" | "filter.vip")}
                  </span>
                  {/* Goal label — from DB, shown as-is */}
                  <span className="text-[9px] text-white/30 tracking-widest uppercase">
                    {plan.goalLabel}
                  </span>
                </div>
                {/* Title — from DB */}
                <h3 className="text-white font-bold text-base leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  {plan.title}
                </h3>
              </div>
            </div>
            {/* Description — from DB */}
            <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-3">
              {plan.description}
            </p>

            {/* Duration selector */}
            <div>
              <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/25 mb-2 flex items-center gap-1.5">
                <Clock size={10} /> {t("results.selectDur")}
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.durations.map((d) => (
                  <button key={d.key} onClick={() => setSelected(d)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      selected?.key === d.key
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/45 border-white/15 hover:border-white/35 hover:text-white"
                    }`}>
                    {/* Duration labels come from DB */}
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex items-baseline gap-1.5 flex-1">
              <span className="text-2xl font-black text-white">{selected ? selected.price.toLocaleString() : "—"}</span>
              <span className="text-white/35 text-sm">ETB</span>
              <span className="text-white/22 text-xs">/ {selected?.label ?? ""}</span>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Link href={`/plans/${plan.id}`}
                className="btn btn-outline text-[10px] py-2.5 px-4">
                <ExternalLink size={11} /> {t("plan.details")}
              </Link>
              <button onClick={handleGetPlan}
                disabled={!selected}
                className="btn btn-white text-[10px] py-2.5 px-5 disabled:opacity-40">
                <ArrowRight size={11} /> {t("results.getPlan")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecommendationResults({ plans, profile, onReset }: Props) {
  const { t } = useLang();
  const bmi    = calculateBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);
  const tdee   = calculateTDEE(profile);
  const target = getCalorieTarget(tdee, profile.goal);

  return (
    <div className="space-y-10">

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}>
        {[
          { v: String(bmi),            label: t("results.yourBMI"),    sub: bmiCat.label },
          { v: tdee.toLocaleString(),   label: t("results.maintenance"),sub: t("results.kcalDay") },
          { v: target.toLocaleString(), label: t("results.target"),     sub: t("results.kcalDay") },
          { v: String(plans.length),    label: t("results.plansFound"), sub: t("results.rankedForYou") },
        ].map((s, i) => (
          <div key={i} className="text-center px-5 py-5" style={{ background: "#161616" }}>
            <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-serif)" }}>{s.v}</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/35 mt-1">{s.label}</p>
            <p className="text-[11px] text-white/22 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
          {t("results.recommended")}
        </h2>
        <button onClick={onReset}
          className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
          <ArrowLeft size={13} /> {t("form.updateProfile")}
        </button>
      </div>

      {/* Plan rows */}
      <div className="flex flex-col gap-5">
        {plans.length > 0 ? (
          plans.map((plan, i) => (
            <PlanRow key={plan.id} plan={plan} rank={i} />
          ))
        ) : (
          <div className="text-center py-16">
            <p style={{ fontFamily: "var(--font-serif)" }}
              className="text-white/40 text-xl italic mb-3">
              No plans matched your profile.
            </p>
            <p className="text-white/25 text-sm mb-6">
              Try adjusting your goals or activity level, or browse all plans.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={onReset}
                className="btn btn-outline py-3 px-6 text-[11px]">
                ← Update Profile
              </button>
              <a href="/plans" className="btn btn-white py-3 px-6 text-[11px]">
                Browse All Plans
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
