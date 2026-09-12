import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";
import type { Database } from "@/src/types/database.types";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24ifQ.placeholder";

/**
 * Browser-side Supabase client.
 * Uses @supabase/ssr so the session is stored in cookies (not localStorage).
 * This means middleware.ts can read the session server-side to protect routes.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Supabase queries will return empty results."
    );
  }

  return createSSRBrowserClient<Database>(url ?? PLACEHOLDER_URL, key ?? PLACEHOLDER_KEY);
}
