import { getPublishedPlans, getPlanDurations } from "@/src/lib/services/plans";
import { mapPlan } from "@/lib/mappers";
import { PLANS } from "@/lib/data";
import MealPlanClient from "./MealPlanClient";

export const revalidate = 60;

export default async function MealPlanPage() {
  const dbPlans = await getPublishedPlans().catch(() => []);
  const durations = await Promise.all(
    dbPlans.map((p) => getPlanDurations(p.id).catch(() => []))
  );
  const plans = dbPlans.length > 0
    ? dbPlans.map((p, i) => mapPlan(p, durations[i]))
    : PLANS;

  return <MealPlanClient plans={plans} />;
}
