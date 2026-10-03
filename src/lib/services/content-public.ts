/**
 * content-public.ts
 * Server-side public content queries — used from Server Components.
 * Logs errors server-side, throws safe messages (no internal details exposed).
 */
import { createServerClient } from "@/src/lib/supabase/server";
import type {
  BlogPost, Faq, HowItWorksStep,
  TeamMember, Testimonial,
} from "@/src/types/database.types";

export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("faqs").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("[content] getFaqs:", error.message);
    throw new Error("Failed to load FAQs");
  }
  return data ?? [];
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("testimonials").select("*")
    .eq("published", true).order("sort_order", { ascending: true });
  if (error) {
    console.error("[content] getPublishedTestimonials:", error.message);
    throw new Error("Failed to load testimonials");
  }
  return data ?? [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts").select("*")
    .eq("published", true).order("created_at", { ascending: false });
  if (error) {
    console.error("[content] getPublishedBlogPosts:", error.message);
    throw new Error("Failed to load blog posts");
  }
  return data ?? [];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts").select("*")
    .eq("id", id).eq("published", true).maybeSingle();
  if (error) {
    console.error("[content] getBlogPost:", error.message);
    throw new Error("Failed to load blog post");
  }
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("team_members").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("[content] getTeamMembers:", error.message);
    throw new Error("Failed to load team members");
  }
  return data ?? [];
}

export async function getHowItWorksSteps(): Promise<HowItWorksStep[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("how_it_works_steps").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("[content] getHowItWorksSteps:", error.message);
    throw new Error("Failed to load steps");
  }
  return data ?? [];
}

export async function getSiteContent(): Promise<Record<string, string>> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) {
    console.error("[content] getSiteContent:", error.message);
    throw new Error("Failed to load site content");
  }
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}
