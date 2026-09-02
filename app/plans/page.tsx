"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import PlanCard from "@/components/ui/PlanCard";
import {
  PLANS, IMAGES, DURATION_FILTERS, LEVEL_FILTERS,
  type PlanGoal, type PlanLevel, type DurationKey,
} from "@/lib/data";

const GOAL_FILTERS: { value: PlanGoal | "all"; label: string }[] = [
  { value: "all",          label: "All Goals" },
  { value: "weight-loss",  label: "Weight Loss" },
  { value: "muscle-gain",  label: "Muscle Gain" },
  { value: "nutrition",    label: "Nutrition" },
  { value: "lifestyle",    label: "Lifestyle" },
];

const SORTS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

export default function PlansPage() {
  const [goal,     setGoal]     = useState<PlanGoal | "all">("all");
  const [level,    setLevel]    = useState<PlanLevel | "all">("all");
  const [duration, setDuration] = useState<DurationKey | "all">("all");
  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState("featured");

  const filtered = PLANS
    .filter((p) => {
      const matchGoal     = goal     === "all" || p.goal  === goal;
      const matchLevel    = level    === "all" || p.level === level;
      const matchDuration = duration === "all" || p.durations.some((d) => d.key === duration);
      const q = search.toLowerCase();
      const matchSearch   = !q
        || p.title.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q)
        || p.tags.some((t) => t.toLowerCase().includes(q));
      return matchGoal && matchLevel && matchDuration && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "price-asc")  return a.durations[0].price - b.durations[0].price;
      if (sort === "price-desc") return b.durations[0].price - a.durations[0].price;
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    });

  const clearAll = () => {
    setGoal("all"); setLevel("all"); setDuration("all"); setSearch(""); setSort("featured");
  };

  const hasFilters = goal !== "all" || level !== "all" || duration !== "all" || search !== "";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={IMAGES.hero2} alt="All Plans" fill priority
          className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12
          max-w-6xl mx-auto px-8 left-0 right-0">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-3">
            Shop
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white">
            All <em>Plans</em>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* ── FILTER BAR ─────────────────────────────────────── */}
        <div className="space-y-4 mb-10">

          {/* Row 1: Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input type="text" placeholder="Search plans…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 text-white
                  placeholder-white/25 text-sm pl-10 pr-4 py-3 rounded-xl
                  focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {SORTS.map((s) => (
                <button key={s.value} onClick={() => setSort(s.value)}
                  className={`px-4 py-3 rounded-xl text-[11px] font-semibold tracking-wider uppercase border transition-all ${
                    sort === s.value
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white/40 border-white/12 hover:border-white/30 hover:text-white"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Goal filter */}
          <div>
            <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-2">Goal</p>
            <div className="flex flex-wrap gap-2">
              {GOAL_FILTERS.map((g) => (
                <button key={g.value} onClick={() => setGoal(g.value)}
                  className={`toggle-chip ${goal === g.value ? "active" : ""}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Level filter */}
          <div>
            <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-2">Level</p>
            <div className="flex flex-wrap gap-2">
              {LEVEL_FILTERS.map((l) => (
                <button key={l.key} onClick={() => setLevel(l.key)}
                  className={`toggle-chip ${level === l.key ? "active" : ""}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Duration filter */}
          <div>
            <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-2">Duration</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_FILTERS.map((d) => (
                <button key={d.key} onClick={() => setDuration(d.key)}
                  className={`toggle-chip ${duration === d.key ? "active" : ""}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count + clear */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[11px] tracking-widest uppercase text-white/30">
            {filtered.length} plan{filtered.length !== 1 ? "s" : ""}
          </p>
          {hasFilters && (
            <button onClick={clearAll}
              className="text-[11px] tracking-widest uppercase text-white/30
                hover:text-white transition-colors underline">
              Clear filters
            </button>
          )}
        </div>

        {/* ── GRID ───────────────────────────────────────────── */}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-28">
              <p style={{ fontFamily: "var(--font-serif)" }}
                className="text-white/30 text-xl italic mb-3">
                No plans match your filters.
              </p>
              <button onClick={clearAll}
                className="text-[11px] tracking-widest uppercase text-white/35
                  hover:text-white transition-colors underline">
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
