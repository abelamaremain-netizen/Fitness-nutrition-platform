/**
 * /api/admin/logout
 * Clears the Supabase SSR session cookie server-side and redirects to login.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const response = NextResponse.redirect(new URL("/admin/login", request.url));

  if (url && anon) {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });
    await supabase.auth.signOut();
  }

  // Clear all auth-related cookies explicitly
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes("auth") || cookie.name.includes("supabase")) {
      response.cookies.set(cookie.name, "", { maxAge: 0 });
    }
  });

  return response;
}
