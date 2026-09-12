import { notFound } from "next/navigation";
import { getPlanBySlug, getPlanDurations } from "@/src/lib/services/plans";
import { getPublishedTestimonials } from "@/src/lib/services/content-public";
import { mapPlan } from "@/lib/mappers";
import PlanDetailClient from "./PlanDetailClient";

export const revalidate = 0;

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the plan first — we need its UUID before fetching durations
  const dbPlan = await getPlanBySlug(id).catch(() => null);
  if (!dbPlan) notFound();

  // Fix #3: use dbPlan.id (UUID), not the URL param (slug/id string)
  // Fix #11: fetch ALL durations in one query using plan_id IN (…) to avoid N+1
  const { getPublishedPlans } = await import("@/src/lib/services/plans");

  const [dbDurations, dbTestimonials, allDbPlans] = await Promise.all([
    getPlanDurations(dbPlan.id).catch(() => []),   // ← correct: UUID not slug
    getPublishedTestimonials().catch(() => []),
    getPublishedPlans().catch(() => []),
  ]);

  const plan = mapPlan(dbPlan, dbDurations);

  // Fix #11: fetch all durations for related plans in ONE query, not N queries
  const relatedDbPlans = allDbPlans
    .filter((p) => p.goal === dbPlan.goal && p.id !== dbPlan.id)
    .slice(0, 3);

  const relatedPlanIds = relatedDbPlans.map((p) => p.id);

  // Single query for all related plan durations
  let allRelatedDurations: import("@/src/types/database.types").PlanDuration[] = [];
  if (relatedPlanIds.length > 0) {
    const { createServerClient } = await import("@/src/lib/supabase/server");
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("plan_durations")
      .select("*")
      .in("plan_id", relatedPlanIds)
      .order("sort_order", { ascending: true });
    allRelatedDurations = data ?? [];
  }

  const relatedPlans = relatedDbPlans.map((p) =>
    mapPlan(p, allRelatedDurations.filter((d) => d.plan_id === p.id))
  );

  // Fix #10: case-insensitive testimonial match
  const titleLower = plan.title.toLowerCase().trim();
  const planTestimonials = dbTestimonials
    .filter((t) => t.plan_name?.toLowerCase().trim() === titleLower)
    .slice(0, 2);

  return (
    <PlanDetailClient
      plan={plan}
      relatedPlans={relatedPlans}
      testimonials={planTestimonials}
    />
  );
}
