"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, ArrowRight, Lock } from "lucide-react";
import type { Plan, DurationOption } from "@/lib/data";

const levelStyle: Record<string, string> = {
  Normal: "bg-white/10 text-white/60",
  Pro:    "bg-white/15 text-white/80",
  VIP:    "bg-white/20 text-white",
};

// Demo: treat user as NOT logged in
const IS_LOGGED_IN = false;

export default function PlanCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [selected, setSelected] = useState<DurationOption>(plan.durations[0]);

  const handleGetPlan = () => {
    if (!IS_LOGGED_IN) {
      // Redirect to login with return URL so user comes back after auth
      router.push(`/login?redirect=/checkout/${plan.id}?duration=${selected.key}`);
    } else {
      router.push(`/checkout/${plan.id}?duration=${selected.key}`);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="card flex flex-col group overflow-hidden h-full"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
        <Image src={plan.image} alt={plan.title} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Level badge */}
        <span className={`absolute top-3 left-3 text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full ${levelStyle[plan.level]}`}>
          {plan.level}
        </span>

        {plan.bestseller && (
          <span className="absolute top-3 right-3 bg-white text-black text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
            Bestseller
          </span>
        )}

        {/* Goal */}
        <span className="absolute bottom-3 left-3 text-[9px] font-semibold tracking-widest uppercase text-white/75 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full">
          {plan.goalLabel}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          <h3 className="text-white font-bold text-base leading-snug mb-1.5"
            style={{ fontFamily: "var(--font-serif)" }}>
            {plan.title}
          </h3>
          <p className="text-white/45 text-sm leading-relaxed line-clamp-2">
            {plan.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {plan.tags.map((tag) => (
            <span key={tag}
              className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Duration selector */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-2">
            Duration
          </p>
          <div className="flex flex-wrap gap-2">
            {plan.durations.map((d) => (
              <button key={d.key} onClick={() => setSelected(d)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                  selected.key === d.key
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/50 border-white/15 hover:border-white/40 hover:text-white"
                }`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-white">
            {selected.price.toLocaleString()}
          </span>
          <span className="text-white/40 text-sm">ETB</span>
          <span className="text-white/25 text-xs ml-1">/ {selected.label}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-auto">
          <Link href={`/plans/${plan.id}`}
            className="btn btn-outline flex-1 py-2.5 text-[10px]">
            <Play size={11} /> Details
          </Link>
          <button onClick={handleGetPlan}
            className="btn btn-white flex-1 py-2.5 text-[10px]">
            {IS_LOGGED_IN ? (
              <><ArrowRight size={11} /> Get Plan</>
            ) : (
              <><Lock size={11} /> Get Plan</>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
