import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

export function createBrowserClient() {
  // Read env vars inside the function so they are only accessed at runtime,
  // not at build time when they would be empty strings.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(url, key);
}
