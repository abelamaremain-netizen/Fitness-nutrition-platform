import Image from "next/image";
import PlansGrid from "@/components/ui/PlansGrid";
import { IMAGES } from "@/lib/data";
import type { Plan } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Plans",
  description: "Explore all fitness and meal plans by Naodi & Samri. Filter by goal, level, and duration to find the perfect plan for your body and budget.",
  alternates: { canonical: "/plans" },
  openGraph: {
    title:       "Browse Fitness & Meal Plans | Naodi & Samri",
    description: "Science-backed plans for weight loss, muscle gain, nutrition, and lifestyle — built for Ethiopia.",
    url: "/plans",
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
    console.error("[plans] DB fetch failed:", e);
    return [];
  }
}

export default async function PlansPage() {
  const [plans, siteContent] = await Promise.all([
    fetchPlans(),
    import("@/src/lib/services/content-public").then(m => m.getSiteContent().catch(() => ({} as Record<string,string>))),
  ]);
  const heroImg = siteContent.plans_hero_image || IMAGES.hero2;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={heroImg} alt="All Plans" fill priority
          className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 max-w-6xl mx-auto px-8 left-0 right-0">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-3">
            Shop
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white">
            All <em>Plans</em>
          </h1>
        </div>
      </div>

      {/* Client grid — receives server-fetched plans */}
      <PlansGrid plans={plans} />
    </div>
  );
}
