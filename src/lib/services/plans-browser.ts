/**
 * plans-browser.ts
 * Browser-safe plan queries — only uses createBrowserClient (no next/headers).
 * Use this in client components. Use plans.ts only in server components.
 */
import { createBrowserClient } from "@/src/lib/supabase/client";
import type { Plan, PlanDuration } from "@/src/types/database.types";

export async function getPlanByIdBrowser(id: string): Promise<Plan | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPlanDurationsBrowser(planId: string): Promise<PlanDuration[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("plan_durations")
    .select("*")
    .eq("plan_id", planId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
