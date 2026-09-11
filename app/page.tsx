import { getFeaturedPlans, getPublishedPlans, getPlanDurations } from "@/src/lib/services/plans";
import { getPublishedTestimonials } from "@/src/lib/services/content-public";
import { mapPlan } from "@/lib/mappers";
import HomeClient from "./HomeClient";

export const revalidate = 0; // always fetch fresh from DB

export default async function HomePage() {
  // Fetch featured plans + their durations
  const [dbFeatured, dbTestimonials] = await Promise.all([
    getFeaturedPlans().catch(() => []),
    getPublishedTestimonials().catch(() => []),
  ]);

  const featuredDurations = await Promise.all(
    dbFeatured.map((p) => getPlanDurations(p.id).catch(() => []))
  );

  const featured = dbFeatured.map((p, i) => mapPlan(p, featuredDurations[i]));

  return (
    <HomeClient
      featured={featured}
      testimonials={dbTestimonials}
    />
  );
}
