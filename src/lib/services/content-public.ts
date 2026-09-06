/**
 * content-public.ts
 * Browser-safe public content queries ONLY.
 * No server-side imports — safe to use in client components.
 */
import { createBrowserClient } from "@/src/lib/supabase/client";
import type {
  BlogPost, Faq, HowItWorksStep,
  TeamMember, Testimonial,
} from "@/src/types/database.types";

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("faqs").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("testimonials").select("*")
    .eq("published", true).order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("blog_posts").select("*")
    .eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("blog_posts").select("*")
    .eq("id", id).eq("published", true).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("team_members").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getHowItWorksSteps(): Promise<HowItWorksStep[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("how_it_works_steps").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getSiteContent(): Promise<Record<string, string>> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

export async function submitContactMessage(input: {
  name: string; email: string; subject: string; message: string;
}): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("contact_messages").insert(input);
  if (error) throw error;
}
