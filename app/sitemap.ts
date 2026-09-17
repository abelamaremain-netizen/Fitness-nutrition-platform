import type { MetadataRoute } from "next";
import { createServerClient } from "@/src/lib/supabase/server";

const SITE_URL = "https://fitness-nutrition-platform.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const static_routes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                         lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/plans`,              lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/fitness-plan`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/meal-plan`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/bmi`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`,              lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/about`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/testimonials`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/terms`,            lastModified: new Date(), changeFrequency: "yearly",   priority: 0.3 },
    { url: `${SITE_URL}/privacy`,          lastModified: new Date(), changeFrequency: "yearly",   priority: 0.3 },
  ];

  // Dynamic plan pages
  let plan_routes: MetadataRoute.Sitemap = [];
  let blog_routes: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createServerClient();

    const [plansRes, postsRes] = await Promise.all([
      supabase
        .from("plans")
        .select("id, updated_at")
        .eq("published", true),
      supabase
        .from("blog_posts")
        .select("id, updated_at")
        .eq("published", true),
    ]);

    plan_routes = (plansRes.data ?? []).map((plan) => ({
      url:             `${SITE_URL}/plans/${plan.id}`,
      lastModified:    new Date(plan.updated_at),
      changeFrequency: "weekly" as const,
      priority:        0.8,
    }));

    blog_routes = (postsRes.data ?? []).map((post) => ({
      url:             `${SITE_URL}/blog/${post.id}`,
      lastModified:    new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority:        0.6,
    }));
  } catch {
    // DB unavailable at build time — static routes only
  }

  return [...static_routes, ...plan_routes, ...blog_routes];
}
