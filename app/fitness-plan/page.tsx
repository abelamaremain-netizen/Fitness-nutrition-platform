import Image from "next/image";
import { getPublishedPlans, getPlanDurations } from "@/src/lib/services/plans";
import { mapPlan } from "@/lib/mappers";
import { IMAGES, PLANS } from "@/lib/data";
import FitnessPlanClient from "./FitnessPlanClient";

export const revalidate = 60;

export default async function FitnessPlanPage() {
  const dbPlans = await getPublishedPlans().catch(() => []);
  const durations = await Promise.all(
    dbPlans.map((p) => getPlanDurations(p.id).catch(() => []))
  );
  // Use DB plans if available, fallback to hardcoded
  const plans = dbPlans.length > 0
    ? dbPlans.map((p, i) => mapPlan(p, durations[i]))
    : PLANS;

  return <FitnessPlanClient plans={plans} />;
}
