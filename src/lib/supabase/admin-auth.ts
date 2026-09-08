/**
 * Admin authentication helpers using Supabase Auth.
 * Used only in server components and API routes.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Browser-side: sign in with email + password */
export async function signInAdmin(email: string, password: string) {
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Browser-side: sign out */
export async function signOutAdmin() {
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  await client.auth.signOut();
}

/** Check if the current Supabase session user is in the admins table */
export async function getAdminSession() {
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true },
  });
  const { data: { session } } = await client.auth.getSession();
  if (!session) return null;

  // Verify they are in the admins table
  const admin = createClient<Database>(supabaseUrl, serviceRoleKey);
  const { data } = await admin
    .from("admins")
    .select("id, name, email")
    .eq("id", session.user.id)
    .maybeSingle();

  return data ? { session, admin: data } : null;
}
