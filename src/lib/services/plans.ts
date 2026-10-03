import { createServerClient } from "@/src/lib/supabase/server";
import type {
  Plan,
  PlanDuration,
  PlanGoal,
  PlanLevel,
  PlanWithDurations,
} from "@/src/types/database.types";

// ---------------------------------------------------------------------------
// Public server-side queries
// ---------------------------------------------------------------------------

export async function getPublishedPlans(): Promise<Plan[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plans").select("*").eq("published", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[plans] getPublishedPlans:", error.message);
    throw new Error("Failed to load plans");
  }
  return data ?? [];
}

export async function getFeaturedPlans(): Promise<Plan[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plans").select("*").eq("published", true).eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[plans] getFeaturedPlans:", error.message);
    throw new Error("Failed to load featured plans");
  }
  return data ?? [];
}

export async function getBestsellerPlans(): Promise<Plan[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plans").select("*").eq("published", true).eq("bestseller", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[plans] getBestsellerPlans:", error.message);
    throw new Error("Failed to load bestseller plans");
  }
  return data ?? [];
}

export async function getPlanBySlug(id: string): Promise<Plan | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plans").select("*").eq("id", id).eq("published", true).maybeSingle();
  if (error) {
    console.error("[plans] getPlanBySlug:", error.message);
    throw new Error("Failed to load plan");
  }
  return data;
}

export async function getPlanDurations(planId: string): Promise<PlanDuration[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plan_durations").select("*").eq("plan_id", planId)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[plans] getPlanDurations:", error.message);
    throw new Error("Failed to load plan durations");
  }
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Admin queries
// ---------------------------------------------------------------------------

export async function adminGetAllPlans(): Promise<Plan[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plans").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[plans] adminGetAllPlans:", error.message);
    throw new Error("Failed to load plans");
  }
  return data ?? [];
}

export async function adminGetPlan(id: string): Promise<PlanWithDurations | null> {
  const supabase = await createServerClient();
  const { data: plan, error } = await supabase
    .from("plans").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[plans] adminGetPlan:", error.message);
    throw new Error("Failed to load plan");
  }
  if (!plan) return null;

  const { data: durations, error: durError } = await supabase
    .from("plan_durations").select("*").eq("plan_id", id)
    .order("sort_order", { ascending: true });
  if (durError) {
    console.error("[plans] adminGetPlan durations:", durError.message);
    throw new Error("Failed to load plan durations");
  }
  return { ...plan, plan_durations: durations ?? [] };
}

export async function adminCreatePlan(input: {
  title: string; description?: string; long_description?: string;
  goal?: PlanGoal; level?: PlanLevel;
  image_url?: string | null; video_url?: string | null;
  pdf_url?: string | null; video_thumb?: string | null;
  tags?: string[]; includes?: string[]; suitable_for?: string[];
  min_bmi?: number | null; max_bmi?: number | null;
  activity_levels?: string[]; featured?: boolean;
  bestseller?: boolean; published?: boolean;
}): Promise<Plan> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("plans").insert(input).select().single();
  if (error) {
    console.error("[plans] adminCreatePlan:", error.message);
    throw new Error("Failed to create plan");
  }
  return data;
}

export async function adminUpdatePlan(id: string, updates: Partial<Plan>): Promise<Plan> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plans").update(updates).eq("id", id).select().single();
  if (error) {
    console.error("[plans] adminUpdatePlan:", error.message);
    throw new Error("Failed to update plan");
  }
  return data;
}

export async function adminDeletePlan(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) {
    console.error("[plans] adminDeletePlan:", error.message);
    throw new Error("Failed to delete plan");
  }
}

export async function adminSetPlanDurations(
  planId: string,
  durations: Array<{ key: PlanDuration["key"]; label: string; price: number; sort_order?: number }>,
): Promise<PlanDuration[]> {
  const supabase = await createServerClient();
  const { error: delError } = await supabase.from("plan_durations").delete().eq("plan_id", planId);
  if (delError) {
    console.error("[plans] adminSetPlanDurations delete:", delError.message);
    throw new Error("Failed to update durations");
  }
  if (durations.length === 0) return [];
  const { data, error } = await supabase.from("plan_durations").insert(
    durations.map((d, i) => ({
      plan_id: planId, key: d.key, label: d.label,
      price: d.price, sort_order: d.sort_order ?? i + 1,
    }))
  ).select();
  if (error) {
    console.error("[plans] adminSetPlanDurations insert:", error.message);
    throw new Error("Failed to save durations");
  }
  return data ?? [];
}

export async function adminPublishPlan(id: string, published: boolean): Promise<Plan> {
  return adminUpdatePlan(id, { published });
}
