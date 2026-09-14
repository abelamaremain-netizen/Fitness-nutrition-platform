import HomeClient from "./HomeClient";
import type { Plan } from "@/lib/data";
import type { Testimonial } from "@/src/types/database.types";

export const revalidate = 0;

async function fetchHomeData(): Promise<{
  featured: Plan[];
  testimonials: Testimonial[];
  content: Record<string, string>;
}> {
  try {
    const { getFeaturedPlans, getPlanDurations } = await import("@/src/lib/services/plans");
    const { getPublishedTestimonials, getSiteContent } = await import("@/src/lib/services/content-public");
    const { mapPlan } = await import("@/lib/mappers");

    const [dbFeatured, dbTestimonials, content] = await Promise.all([
      getFeaturedPlans().catch(() => []),
      getPublishedTestimonials().catch(() => []),
      getSiteContent().catch(() => ({})),
    ]);

    const featuredDurations = await Promise.all(
      dbFeatured.map((p) => getPlanDurations(p.id).catch(() => []))
    );

    return {
      featured:     dbFeatured.map((p, i) => mapPlan(p, featuredDurations[i])),
      testimonials: dbTestimonials,
      content,
    };
  } catch (e) {
    console.error("[home] DB fetch failed:", e);
    return { featured: [], testimonials: [], content: {} };
  }
}

export default async function HomePage() {
  const { featured, testimonials, content } = await fetchHomeData();
  return <HomeClient featured={featured} testimonials={testimonials} content={content} />;
}
