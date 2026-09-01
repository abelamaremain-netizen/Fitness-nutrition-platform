"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import PlanCard from "@/components/ui/PlanCard";
import { PLANS, IMAGES, type PlanGoal } from "@/lib/data";

const GOALS: { value: PlanGoal | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "nutrition", label: "Nutrition" },
  { value: "lifestyle", label: "Lifestyle" },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

export default function PlansPage() {
  const [goal, setGoal] = useState<PlanGoal | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = PLANS
    .filter((p) => {
      const matchGoal = goal === "all" || p.goal === goal;
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
      return matchGoal && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.levels[0].price - b.levels[0].price;
      if (sort === "price-desc") return b.levels[0].price - a.levels[0].price;
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    });

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={IMAGES.hero2} alt="All Plans" fill priority
          className="object-cover object-top grayscale opacity-50" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 max-w-6xl mx-auto px-8 left-0 right-0">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/40 mb-3">
            Shop
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white">
            All <em>Plans</em>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Filter bar */}
        <div className="border border-white/10 flex flex-col md:flex-row items-stretch md:items-center gap-0 mb-10">
          {/* Search */}
          <div className="relative flex-1 border-b md:border-b-0 md:border-r border-white/10">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search plans..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-white placeholder-white/25 text-sm pl-10 pr-4 py-3.5 focus:outline-none" />
          </div>

          {/* Goal pills */}
          <div className="flex items-center gap-0 px-4 py-3 flex-wrap gap-y-2 border-b md:border-b-0 md:border-r border-white/10">
            {GOALS.map((g) => (
              <button key={g.value} onClick={() => setGoal(g.value)}
                className={`toggle-chip mx-1 ${goal === g.value ? "active" : ""}`}>
                {g.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-0">
            {SORTS.map((s) => (
              <button key={s.value} onClick={() => setSort(s.value)}
                className={`px-4 py-3.5 text-[10px] font-semibold tracking-[0.14em] uppercase border-r border-white/10 last:border-r-0 transition-colors ${
                  sort === s.value ? "bg-white text-black" : "text-white/35 hover:text-white"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-[11px] tracking-[0.14em] uppercase text-white/25 mb-8">
          {filtered.length} plan{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((plan, i) => (
                <motion.div key={plan.id} layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}>
                  <PlanCard plan={plan} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-24">
              <p style={{ fontFamily: "var(--font-serif)" }}
                className="text-white/30 text-xl italic mb-3">
                No plans found.
              </p>
              <button onClick={() => { setSearch(""); setGoal("all"); }}
                className="text-[11px] tracking-[0.16em] uppercase text-white/35 hover:text-white transition-colors underline">
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
