import { notFound } from "next/navigation";
import { getPlanBySlug, getPlanDurations } from "@/src/lib/services/plans";
import { getPublishedTestimonials } from "@/src/lib/services/content-public";
import { mapPlan } from "@/lib/mappers";
import PlanDetailClient from "./PlanDetailClient";

export const revalidate = 60;

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [dbPlan, dbDurations, dbTestimonials] = await Promise.all([
    getPlanBySlug(id).catch(() => null),
    getPlanDurations(id).catch(() => []),
    getPublishedTestimonials().catch(() => []),
  ]);

  if (!dbPlan) notFound();

  const plan = mapPlan(dbPlan, dbDurations);

  // Related plans — same goal, different id (fetch from DB)
  const { getPublishedPlans } = await import("@/src/lib/services/plans");
  const allDbPlans = await getPublishedPlans().catch(() => []);
  const allDurations = await Promise.all(
    allDbPlans.map((p) => getPlanDurations(p.id).catch(() => []))
  );
  const relatedPlans = allDbPlans
    .filter((p) => p.goal === dbPlan.goal && p.id !== dbPlan.id)
    .slice(0, 3)
    .map((p) => {
      const idx = allDbPlans.findIndex((ap) => ap.id === p.id);
      return mapPlan(p, allDurations[idx] ?? []);
    });

  // Testimonials matching this plan title
  const planTestimonials = dbTestimonials
    .filter((t) => t.plan_name === plan.title)
    .slice(0, 2);

  return (
    <PlanDetailClient
      plan={plan}
      relatedPlans={relatedPlans}
      testimonials={planTestimonials}
    />
  );
}
