"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import PlanCard from "@/components/ui/PlanCard";
import { useLang } from "@/context/LangContext";
import {
  type Plan, type PlanGoal, type PlanLevel, type DurationKey,
} from "@/lib/data";

// ─── FILTER DEFINITIONS ───────────────────────────────────────────────────────
type PlanTypeFilter = "all" | "fitness" | "meal";
const GOAL_VALUES:     (PlanGoal | "all")[]  = ["all", "weight-loss", "muscle-gain", "nutrition", "lifestyle"];
const LEVEL_VALUES:    (PlanLevel | "all")[] = ["all", "Normal", "Pro", "VIP"];
const DURATION_VALUES: (DurationKey | "all")[] = ["all", "1-week", "1-month", "3-months", "6-months"];
const SORT_VALUES      = ["featured", "price-asc", "price-desc"];

export default function PlansGrid({ plans }: { plans: Plan[] }) {
  const { t, lang } = useLang();

  const [planType,  setPlanType]  = useState<PlanTypeFilter>("all");
  const [goal,     setGoal]     = useState<PlanGoal | "all">("all");
  const [level,    setLevel]    = useState<PlanLevel | "all">("all");
  const [duration, setDuration] = useState<DurationKey | "all">("all");
  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState("featured");

  // ── Filter + sort ──
  const filtered = plans
    .filter((p) => {
      const matchType     = planType === "all"
        || p.planType === planType
        || p.planType === "both";
      const matchGoal     = goal     === "all" || p.goal  === goal;
      const matchLevel    = level    === "all" || p.level.toLowerCase() === level.toLowerCase();
      const matchDuration = duration === "all" || p.durations.some((d) => d.key === duration);
      const q = search.toLowerCase();
      const matchSearch   = !q
        || p.title.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q)
        || p.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchType && matchGoal && matchLevel && matchDuration && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "price-asc")  return (a.durations[0]?.price ?? 0) - (b.durations[0]?.price ?? 0);
      if (sort === "price-desc") return (b.durations[0]?.price ?? 0) - (a.durations[0]?.price ?? 0);
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    });

  const clearAll = () => {
    setPlanType("all"); setGoal("all"); setLevel("all"); setDuration("all"); setSearch(""); setSort("featured");
  };

  const hasFilters = planType !== "all" || goal !== "all" || level !== "all" || duration !== "all" || search !== "";

  // ── Label helpers — map key → translated display label ──
  const goalLabel = (v: PlanGoal | "all") => ({
    "all":          t("filter.allGoals"),
    "weight-loss":  t("filter.weightLoss"),
    "muscle-gain":  t("filter.muscleGain"),
    "nutrition":    t("filter.nutrition"),
    "lifestyle":    t("filter.lifestyle"),
  }[v]);

  const levelLabel = (v: PlanLevel | "all") => ({
    "all":    t("filter.allLevels"),
    "Normal": t("filter.normal"),
    "Pro":    t("filter.pro"),
    "VIP":    t("filter.vip"),
  }[v]);

  const durLabel = (v: DurationKey | "all") => ({
    "all":       t("filter.allDurations"),
    "1-week":    t("filter.1week"),
    "1-month":   t("filter.1month"),
    "3-months":  t("filter.3months"),
    "6-months":  t("filter.6months"),
  }[v]);

  const sortLabel = (v: string) => ({
    "featured":   t("filter.featured"),
    "price-asc":  t("filter.priceAsc"),
    "price-desc": t("filter.priceDesc"),
  }[v]);

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      {/* Filters */}
      <div className="space-y-4 mb-10">

        {/* Plan Type Tabs — shown at top, most important filter */}
        <div className="flex gap-2 p-1 bg-white/[0.04] rounded-2xl border border-white/[0.07] w-fit">
          {([
            { v: "all",     label: lang === "am" ? "ሁሉም" : "All Plans" },
            { v: "fitness", label: lang === "am" ? "የአካል ብቃት" : "🏋️ Fitness Plans" },
            { v: "meal",    label: lang === "am" ? "የምግብ ዕቅድ" : "🥗 Meal Plans" },
          ] as { v: PlanTypeFilter; label: string }[]).map((opt) => (
            <button key={opt.v} onClick={() => setPlanType(opt.v)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                planType === opt.v
                  ? "bg-white text-black shadow-sm"
                  : "text-white/45 hover:text-white"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder={t("filter.searchPlans")} value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 text-white placeholder-white/25 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {SORT_VALUES.map((s) => (
              <button key={s} onClick={() => setSort(s)}
                className={`px-4 py-3 rounded-xl text-[11px] font-semibold tracking-wider uppercase border transition-all ${
                  sort === s
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/40 border-white/12 hover:border-white/30 hover:text-white"
                }`}>
                {sortLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-2">{t("filter.goal")}</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_VALUES.map((v) => (
              <button key={v} onClick={() => setGoal(v)}
                className={`toggle-chip ${goal === v ? "active" : ""}`}>
                {goalLabel(v)}
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div>
          <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-2">{t("filter.level")}</p>
          <div className="flex flex-wrap gap-2">
            {LEVEL_VALUES.map((v) => (
              <button key={v} onClick={() => setLevel(v)}
                className={`toggle-chip ${level === v ? "active" : ""}`}>
                {levelLabel(v)}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-2">{t("filter.duration")}</p>
          <div className="flex flex-wrap gap-2">
            {DURATION_VALUES.map((v) => (
              <button key={v} onClick={() => setDuration(v)}
                className={`toggle-chip ${duration === v ? "active" : ""}`}>
                {durLabel(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count + clear */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-[11px] tracking-widest uppercase text-white/30">
          {filtered.length} {filtered.length !== 1 ? t("nav.plans").toLowerCase() : t("nav.plans").toLowerCase().replace(/s$/, "")}
        </p>
        {hasFilters && (
          <button onClick={clearAll}
            className="text-[11px] tracking-widest uppercase text-white/30 hover:text-white transition-colors underline">
            ✕
          </button>
        )}
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((plan, i) => (
              <motion.div key={plan.id} layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}>
                <PlanCard plan={plan} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-28">
            <p style={{ fontFamily: "var(--font-serif)" }} className="text-white/30 text-xl italic mb-3">
              {lang === "am" ? "ምንም ዕቅዶች አልተገኙም።" : "No plans match your filters."}
            </p>
            <button onClick={clearAll}
              className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors underline">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
