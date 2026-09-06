import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/src/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server-side Supabase client that runs with the anon key and
 * forwards the user's auth cookies. RLS policies apply normally.
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  const authCookies = cookieStore.getAll();

  const cookieHeader = authCookies
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Cookie: cookieHeader,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Admin client using the service role key — bypasses RLS.
 * ONLY use this in server-side code (route handlers, server components).
 * NEVER expose the service role key to the browser.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
