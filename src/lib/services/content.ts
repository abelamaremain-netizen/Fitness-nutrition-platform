import { createServerClient } from "@/src/lib/supabase/server";
import { createBrowserClient } from "@/src/lib/supabase/client";
import type {
  BlogPost,
  ContactMessage,
  Faq,
  HowItWorksStep,
  SiteContent,
  TeamMember,
  Testimonial,
} from "@/src/types/database.types";

// ---------------------------------------------------------------------------
// Public (browser) content queries
// ---------------------------------------------------------------------------

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getHowItWorksSteps(): Promise<HowItWorksStep[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("how_it_works_steps")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSiteContent(): Promise<Record<string, string>> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value");

  if (error) throw error;

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value;
  }
  return map;
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("contact_messages").insert(input);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Admin (server) content queries
// ---------------------------------------------------------------------------

export async function adminGetAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertTestimonial(
  testimonial: Partial<Testimonial> & { name: string; text: string },
): Promise<Testimonial> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .upsert(testimonial)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function adminGetAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertBlogPost(
  post: Partial<BlogPost> & { title: string },
): Promise<BlogPost> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .upsert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteBlogPost(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function adminGetAllTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertTeamMember(
  member: Partial<TeamMember> & { name: string },
): Promise<TeamMember> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .upsert(member)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteTeamMember(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw error;
}

export async function adminGetAllFaqs(): Promise<Faq[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertFaq(
  faq: Partial<Faq> & { question: string; answer: string },
): Promise<Faq> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .upsert(faq)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteFaq(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

export async function adminGetHowItWorksSteps(): Promise<HowItWorksStep[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("how_it_works_steps")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertHowItWorksStep(
  step: Partial<HowItWorksStep> & { title: string },
): Promise<HowItWorksStep> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("how_it_works_steps")
    .upsert(step)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteHowItWorksStep(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("how_it_works_steps").delete().eq(
    "id",
    id,
  );
  if (error) throw error;
}

export async function adminGetContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function adminMarkContactMessageRead(
  id: string,
  isRead: boolean,
): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) throw error;
}

export async function adminDeleteContactMessage(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("contact_messages").delete().eq(
    "id",
    id,
  );
  if (error) throw error;
}

export async function adminGetSiteContent(): Promise<SiteContent[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("key", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateSiteContent(
  key: string,
  value: string,
): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value }, { onConflict: "key" });

  if (error) throw error;
}
