import Image from "next/image";
import { IMAGES } from "@/lib/data";
import FitnessPlanClient from "./FitnessPlanClient";
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
    console.error("[fitness-plan] DB fetch failed:", e);
    return [];
  }
}

export default async function FitnessPlanPage() {
  const plans = await fetchPlans();
  return <FitnessPlanClient plans={plans} />;
}
