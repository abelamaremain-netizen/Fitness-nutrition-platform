import HomeClient from "./HomeClient";
import type { Plan } from "@/lib/data";
import type { Metadata } from "next";
import type { Testimonial, HowItWorksStep } from "@/src/types/database.types";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Transform Your Body — Expert Fitness & Nutrition Plans",
  description:
    "Personalised fitness and meal plans by Naodi & Samri. Calculate your BMI, get matched to the right plan, and start your transformation today.",
  alternates: { canonical: "/" },
  openGraph: {
    title:       "Naodi & Samri Fitness — Transform Your Body",
    description: "Science-backed fitness and nutrition plans tailored to your goals. Built for Ethiopia.",
    url:         "/",
    images:      [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
};

async function fetchHomeData(): Promise<{
  featured:   Plan[];
  testimonials: Testimonial[];
  content:    Record<string, string>;
  howItWorks: HowItWorksStep[];
}> {
  try {
    const { getFeaturedPlans, getPlanDurations } = await import("@/src/lib/services/plans");
    const { getPublishedTestimonials, getSiteContent, getHowItWorksSteps } = await import("@/src/lib/services/content-public");
    const { mapPlan } = await import("@/lib/mappers");

    const [dbFeatured, dbTestimonials, content, howItWorks] = await Promise.all([
      getFeaturedPlans().catch(() => []),
      getPublishedTestimonials().catch(() => []),
      getSiteContent().catch(() => ({})),
      getHowItWorksSteps().catch(() => []),
    ]);

    const featuredDurations = await Promise.all(
      dbFeatured.map((p) => getPlanDurations(p.id).catch(() => []))
    );

    return {
      featured:     dbFeatured.map((p, i) => mapPlan(p, featuredDurations[i])),
      testimonials: dbTestimonials,
      content,
      howItWorks,
    };
  } catch (e) {
    console.error("[home] DB fetch failed:", e);
    return { featured: [], testimonials: [], content: {}, howItWorks: [] };
  }
}

export default async function HomePage() {
  const { featured, testimonials, content, howItWorks } = await fetchHomeData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Naodi & Samri Fitness",
    "description": "Science-backed fitness and nutrition plans tailored to your goals. Built for Ethiopia.",
    "url": "https://fitness-nutrition-platform.vercel.app",
    "logo": "https://fitness-nutrition-platform.vercel.app/og-default.jpg",
    "image": "https://fitness-nutrition-platform.vercel.app/og-default.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Addis Ababa",
      "addressCountry": "ET",
    },
    "sameAs": [],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "ETB",
      "offerCount": featured.length,
      "lowPrice": Math.min(...featured.flatMap(p => p.durations.map(d => d.price)).filter(Boolean), 99),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient featured={featured} testimonials={testimonials} content={content} howItWorks={howItWorks} />
    </>
  );
}
