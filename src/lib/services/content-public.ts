/**
 * content-public.ts
 * Server-side public content queries — used from Server Components / page.tsx files.
 * Uses createServerClient (cookie-aware) instead of createBrowserClient.
 */
import { createServerClient } from "@/src/lib/supabase/server";
import type {
  BlogPost, Faq, HowItWorksStep,
  TeamMember, Testimonial,
} from "@/src/types/database.types";

// Server-side queries (called from RSC page.tsx files)
export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("faqs").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("testimonials").select("*")
    .eq("published", true).order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts").select("*")
    .eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts").select("*")
    .eq("id", id).eq("published", true).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("team_members").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getHowItWorksSteps(): Promise<HowItWorksStep[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("how_it_works_steps").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getSiteContent(): Promise<Record<string, string>> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

// Browser-safe (used from client components like ContactForm)
// submitContactMessage has been moved to contact-browser.ts
// to avoid client components importing server-only next/headers
