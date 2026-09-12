/**
 * lib/mappers.ts
 *
 * Converts Supabase DB row types to the component-friendly types
 * used throughout the app (defined in lib/data.ts).
 *
 * This means zero changes are needed in any component — PlanCard,
 * RecommendationResults, PlanDetail etc. all stay exactly the same.
 */

import type { Plan as DBPlan, PlanDuration as DBDuration } from "@/src/types/database.types";
import type { Plan, DurationOption } from "@/lib/data";

// ─── GOAL LABEL MAP ───────────────────────────────────────────────────────────
const GOAL_LABELS: Record<string, string> = {
  "weight-loss":  "Weight Loss",
  "muscle-gain":  "Muscle Gain",
  "nutrition":    "Nutrition",
  "lifestyle":    "Lifestyle",
};

// ─── DURATION MAPPER ──────────────────────────────────────────────────────────
export function mapDuration(d: DBDuration): DurationOption {
  return {
    key:   d.key as DurationOption["key"],
    label: d.label,
    price: d.price,
  };
}

// ─── PLAN MAPPER ──────────────────────────────────────────────────────────────
export function mapPlan(dbPlan: DBPlan, dbDurations: DBDuration[] = []): Plan {
  // Normalise level — DB may return lowercase, components expect title case
  const rawLevel = dbPlan.level as string;
  const level = (rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1).toLowerCase()) as Plan["level"];

  return {
    id:              dbPlan.id,
    title:           dbPlan.title,
    description:     dbPlan.description,
    longDescription: dbPlan.long_description,
    image:           dbPlan.image_url   ?? "/images/female images (2).jpg",
    goal:            dbPlan.goal        as Plan["goal"],
    goalLabel:       GOAL_LABELS[dbPlan.goal] ?? dbPlan.goal,
    level,
    planType:        ((dbPlan as { plan_type?: string }).plan_type ?? "fitness") as Plan["planType"],
    durations:       dbDurations.map(mapDuration),
    featured:        dbPlan.featured,
    bestseller:      dbPlan.bestseller,
    videoThumb:      dbPlan.video_thumb ?? "",
    videoUrl:        dbPlan.video_url   ?? "",
    pdfUrl:          dbPlan.pdf_url     ?? "",
    tags:            dbPlan.tags        ?? [],
    includes:        dbPlan.includes    ?? [],
    suitableFor:     dbPlan.suitable_for     ?? ["female", "male"],
    minBmi:          dbPlan.min_bmi     ?? 0,
    maxBmi:          dbPlan.max_bmi     ?? 60,
    activityLevel:   dbPlan.activity_levels  ?? [],
  };
}

export function mapPlans(dbPlans: DBPlan[], durationsMap: Record<string, DBDuration[]> = {}): Plan[] {
  return dbPlans.map((p) => mapPlan(p, durationsMap[p.id] ?? []));
}
