"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Download, Star } from "lucide-react";
import type { Plan } from "@/lib/data";

interface Props {
  plan: Plan;
  score?: number;
  showScore?: boolean;
}

const levelColors: Record<string, string> = {
  Normal: "bg-zinc-700 text-zinc-200",
  Pro: "bg-green-900 text-green-300",
  VIP: "bg-yellow-900 text-yellow-300",
};

export default function PlanCard({ plan, score, showScore }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col group"
    >
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {plan.bestseller && (
            <span className="bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              Bestseller
            </span>
          )}
          {plan.featured && !plan.bestseller && (
            <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Goal tag */}
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">
          {plan.goalLabel}
        </span>

        {/* Score badge */}
        {showScore && score !== undefined && (
          <span className="absolute bottom-3 right-3 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {score}% match
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-1">{plan.title}</h3>
        <p className="text-sm text-zinc-400 mb-4 flex-1 line-clamp-2">
          {plan.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {plan.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Levels & Prices */}
        <div className="flex gap-2 mb-4">
          {plan.levels.map(({ level, price }) => (
            <div
              key={level}
              className={`flex-1 text-center rounded-lg py-1 text-xs font-semibold ${levelColors[level]}`}
            >
              <div>{level}</div>
              <div className="font-bold text-sm">{price} ETB</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={plan.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-3 py-2 rounded-lg transition-colors flex-1 justify-center"
          >
            <Play size={14} /> Preview
          </a>
          <Link
            href={`/plans/${plan.id}`}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-3 py-2 rounded-lg transition-colors flex-1 justify-center"
          >
            View Plan
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
