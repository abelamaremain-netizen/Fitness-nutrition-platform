import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Guard — if env vars are missing, return a null client that won't crash
  if (!url || !key) {
    console.warn(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Supabase queries will return empty results."
    );
    // Return a dummy client that fails gracefully
    return createClient<Database>(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24ifQ.placeholder"
    );
  }

  return createClient<Database>(url, key);
}
