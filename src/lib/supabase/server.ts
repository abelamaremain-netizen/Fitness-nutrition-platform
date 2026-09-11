import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/src/types/database.types";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24ifQ.placeholder";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon) {
    console.warn(
      "[Supabase] Missing env vars — queries will return empty results."
    );
  }

  return { url: url ?? PLACEHOLDER_URL, anon: anon ?? PLACEHOLDER_KEY, service: service ?? PLACEHOLDER_KEY };
}

/**
 * Server-side client — anon key + auth cookies. RLS applies.
 */
export async function createServerClient() {
  const { url, anon } = getEnv();
  const cookieStore = await cookies();
  const authCookies = cookieStore.getAll();
  const cookieHeader = authCookies
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");

  return createClient<Database>(url, anon, {
    global: { headers: { Cookie: cookieHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Admin client — service role key, bypasses RLS.
 * ONLY use server-side. NEVER expose to browser.
 */
export function createAdminClient() {
  const { url, service } = getEnv();
  return createClient<Database>(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
