import HomeClient from "./HomeClient";
import type { Plan } from "@/lib/data";
import type { Testimonial } from "@/src/types/database.types";

export const revalidate = 0;

async function fetchHomeData(): Promise<{
  featured: Plan[];
  testimonials: Testimonial[];
}> {
  try {
    const { getFeaturedPlans, getPlanDurations } = await import("@/src/lib/services/plans");
    const { getPublishedTestimonials } = await import("@/src/lib/services/content-public");
    const { mapPlan } = await import("@/lib/mappers");

    const [dbFeatured, dbTestimonials] = await Promise.all([
      getFeaturedPlans().catch(() => []),
      getPublishedTestimonials().catch(() => []),
    ]);

    const featuredDurations = await Promise.all(
      dbFeatured.map((p) => getPlanDurations(p.id).catch(() => []))
    );

    return {
      featured:     dbFeatured.map((p, i) => mapPlan(p, featuredDurations[i])),
      testimonials: dbTestimonials,
    };
  } catch (e) {
    console.error("[home] DB fetch failed:", e);
    return { featured: [], testimonials: [] };
  }
}

export default async function HomePage() {
  const { featured, testimonials } = await fetchHomeData();
  return <HomeClient featured={featured} testimonials={testimonials} />;
}
