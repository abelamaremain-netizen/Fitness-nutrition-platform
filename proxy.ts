import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (formerly Middleware) — runs on the server before any page is rendered.
 *
 * Protects ALL /admin/* routes except /admin/login:
 * - Valid Supabase session  → allow through
 * - No session             → redirect to /admin/login
 *
 * Also refreshes the auth cookie on every request so sessions stay alive.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Skip if env vars are missing (shouldn't happen in production)
  if (!url || !anon) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: must call getUser() to refresh session tokens
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage  = pathname === "/admin/login";

  // ── No session → redirect to login ──────────────────────────────────────
  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Already logged in + visiting login page → go to dashboard ───────────
  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin";
    dashboardUrl.searchParams.delete("redirect");
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
