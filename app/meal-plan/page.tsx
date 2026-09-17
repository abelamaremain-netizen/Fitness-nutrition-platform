import { IMAGES } from "@/lib/data";
import MealPlanClient from "./MealPlanClient";
import type { Plan } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Plans",
  description: "Get a personalised nutrition plan based on your body measurements, allergies, and health goals. Ethiopian and international meal plans by Naodi & Samri.",
  alternates: { canonical: "/meal-plan" },
  openGraph: {
    title:       "Personalised Meal & Nutrition Plans | Naodi & Samri",
    description: "Tell us about your dietary needs and get matched to the right nutrition plan. Built for Ethiopian lifestyles.",
    url: "/meal-plan",
  },
};

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
