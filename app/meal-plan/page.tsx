import { getPublishedPlans, getPlanDurations } from "@/src/lib/services/plans";
import { mapPlan } from "@/lib/mappers";

import MealPlanClient from "./MealPlanClient";

export const revalidate = 0; // always fetch fresh from DB

export default async function MealPlanPage() {
  const dbPlans = await getPublishedPlans().catch(() => []);
  const durations = await Promise.all(
    dbPlans.map((p) => getPlanDurations(p.id).catch(() => []))
  );
  const plans = dbPlans.map((p, i) => mapPlan(p, durations[i]));

  return <MealPlanClient plans={plans} />;
}
