import Image from "next/image";
import PlansGrid from "@/components/ui/PlansGrid";
import { IMAGES } from "@/lib/data";
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
    console.error("[plans] DB fetch failed:", e);
    return [];
  }
}

export default async function PlansPage() {
  const plans = await fetchPlans();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={IMAGES.hero2} alt="All Plans" fill priority
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
