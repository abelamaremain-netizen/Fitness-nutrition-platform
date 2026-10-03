/**
 * contact-browser.ts
 * Browser-safe contact form submission.
 * Logs server-side errors safely — never exposes internal details to users.
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
  if (error) {
    console.error("[contact] submitContactMessage:", error.message);
    throw new Error("Failed to submit message");
  }
}
