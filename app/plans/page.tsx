import Image from "next/image";
import { motion } from "framer-motion";
import PlansGrid from "@/components/ui/PlansGrid";
import { getPublishedPlans } from "@/src/lib/services/plans";
import { mapPlan } from "@/lib/mappers";
import { IMAGES } from "@/lib/data";

export const revalidate = 60; // revalidate every 60 seconds

export default async function PlansPage() {
  // Fetch all published plans with their durations in one query
  const dbPlans = await getPublishedPlans().catch(() => []);

  // Fetch durations for all plans in parallel
  const { getPlanDurations } = await import("@/src/lib/services/plans");
  const durationsResults = await Promise.all(
    dbPlans.map((p) => getPlanDurations(p.id).catch(() => []))
  );

  // Map to component types
  const plans = dbPlans.map((p, i) => mapPlan(p, durationsResults[i]));

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

      {/* Client grid with filters — receives server-fetched plans as props */}
      <PlansGrid plans={plans} />
    </div>
  );
}
