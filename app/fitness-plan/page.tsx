import Image from "next/image";
import { IMAGES } from "@/lib/data";
import FitnessPlanClient from "./FitnessPlanClient";
import type { Plan } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Plans",
  description: "Get a personalised workout plan based on your BMI, age, gender, and fitness goals. Expert programs by Naodi & Samri for weight loss, muscle gain, and more.",
  alternates: { canonical: "/fitness-plan" },
  openGraph: {
    title:       "Personalised Fitness Plans | Naodi & Samri",
    description: "Fill in your profile and get matched to the fitness plan that fits your body and goals.",
    url: "/fitness-plan",
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
    console.error("[fitness-plan] DB fetch failed:", e);
    return [];
  }
}

export default async function FitnessPlanPage() {
  const [plans, siteContent] = await Promise.all([
    fetchPlans(),
    import("@/src/lib/services/content-public").then(m => m.getSiteContent().catch(() => ({} as Record<string,string>))),
  ]);
  const heroImg = siteContent.fitness_plan_hero_image || IMAGES.naodi1;
  return <FitnessPlanClient plans={plans} heroImg={heroImg} />;
}
