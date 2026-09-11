import { IMAGES } from "@/lib/data";
import MealPlanClient from "./MealPlanClient";
import type { Plan } from "@/lib/data";

export const revalidate = 0;

async function fetchPlans(): Promise<Plan[]> {
  try {
    const { getPublishedPlans, getPlanDurations } = await import("@/src/lib/services/plans");
    const { mapPlan } = await import("@/lib/mappers");
    const dbPlans = await getPublishedPlans();
    if (!dbPlans.length) return [];
    const durations = await Promise.all(
      dbPlans.map((p) => getPlanDurations(p.id).catch(() => []))
    );
    return dbPlans.map((p, i) => mapPlan(p, durations[i]));
  } catch (e) {
    console.error("[meal-plan] DB fetch failed:", e);
    return [];
  }
}

export default async function MealPlanPage() {
  const plans = await fetchPlans();
  return <MealPlanClient plans={plans} />;
}
