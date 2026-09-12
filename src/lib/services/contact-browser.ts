/**
 * contact-browser.ts
 * Browser-safe contact form submission.
 * Keep separate from content-public.ts so client components
 * don't pull in server-only imports (next/headers).
 */
import { createBrowserClient } from "@/src/lib/supabase/client";

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
