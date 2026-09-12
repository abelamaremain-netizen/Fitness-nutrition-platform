import { createServerClient as createSSRServerClient } from "@supabase/ssr";
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
    console.warn("[Supabase] Missing env vars — queries will return empty results.");
  }

  return {
    url:     url     ?? PLACEHOLDER_URL,
    anon:    anon    ?? PLACEHOLDER_KEY,
    service: service ?? PLACEHOLDER_KEY,
  };
}

/**
 * Server-side client — reads/writes auth cookies via next/headers.
 * RLS applies. Use in Server Components, Server Actions, and Route Handlers.
 */
export async function createServerClient() {
  const { url, anon } = getEnv();
  const cookieStore = await cookies();

  return createSSRServerClient<Database>(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll called from a Server Component — safe to ignore, middleware handles refresh
        }
      },
    },
  });
}

/**
 * Admin client — service role key, bypasses RLS.
 * ONLY use server-side (Server Components / Route Handlers). NEVER expose to browser.
 */
export function createAdminClient() {
  const { url, service } = getEnv();
  return createClient<Database>(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
