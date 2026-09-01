"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import type { Plan } from "@/lib/data";

export default function PlanCard({ plan }: { plan: Plan }) {
  return (
    <motion.article whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="card flex flex-col group overflow-hidden h-full">

      {/* Image */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
        <Image src={plan.image} alt={plan.title} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {plan.bestseller && (
            <span className="bg-white text-black text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
              Bestseller
            </span>
          )}
          {plan.featured && !plan.bestseller && (
            <span className="bg-white/15 backdrop-blur border border-white/25 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full tracking-wider uppercase">
              Featured
            </span>
          )}
        </div>

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

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-2">
          {plan.levels.map(({ level, price }) => (
            <div key={level}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "0.5rem" }}
              className="text-center py-2.5 px-1">
              <p className="text-[9px] font-semibold tracking-widest uppercase text-white/30">{level}</p>
              <p className="text-white font-bold text-sm mt-0.5">{price}</p>
              <p className="text-[9px] text-white/22 tracking-wide">ETB</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-auto">
          <a href={plan.videoUrl} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline flex-1 py-2.5 text-[10px]">
            <Play size={11} /> Preview
          </a>
          <Link href={`/plans/${plan.id}`}
            className="btn btn-white flex-1 py-2.5 text-[10px]">
            View Plan <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
