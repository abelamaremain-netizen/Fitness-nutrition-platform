/**
 * /api/admin/content
 *
 * Single endpoint for all admin content writes.
 * Uses service role key (bypasses RLS).
 * Protected: verifies the caller has a valid admin session first.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

// ── helpers ──────────────────────────────────────────────────────────────────

function getAdminClient() {
  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient<Database>(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anon) return false;

  // Build a server-side Supabase client that reads the session cookie
  const supabase = createServerClient<Database>(url, anon, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll() { /* read-only check, no need to set */ },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Confirm they are in the admins table
  const admin = getAdminClient();
  const { data } = await admin.from("admins").select("id").eq("id", user.id).maybeSingle();
  return !!data;
}

// ── POST /api/admin/content ────────────────────────────────────────────────
// Body: { action: string, payload: object }
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, payload } = await request.json();
    const db = getAdminClient();

    switch (action) {

      // ── site_content upserts ────────────────────────────────────────────
      case "upsert_site_content": {
        // payload: { key: string, value: string }[]
        const rows: { key: string; value: string }[] = payload;
        const { error } = await db.from("site_content")
          .upsert(rows, { onConflict: "key" });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      // ── FAQs ────────────────────────────────────────────────────────────
      case "save_faqs": {
        // payload: { faqs: { id?, question, answer, sort_order }[] }
        await db.from("faqs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (payload.faqs.length > 0) {
          const { error } = await db.from("faqs").insert(
            payload.faqs.map((f: { id?: string; question: string; answer: string; sort_order: number }) => ({
              question:   f.question,
              answer:     f.answer,
              sort_order: f.sort_order,
            }))
          );
          if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
      }

      // ── Testimonials ────────────────────────────────────────────────────
      case "save_testimonials": {
        // payload: { testimonials: { id?, name, role, text, plan_name, rating, sort_order }[] }
        await db.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (payload.testimonials.length > 0) {
          const { error } = await db.from("testimonials").insert(
            payload.testimonials.map((t: {
              name: string; role: string; text: string;
              plan_name: string; rating: number; sort_order: number;
            }) => ({
              name:       t.name,
              role:       t.role,
              text:       t.text,
              plan_name:  t.plan_name,
              rating:     t.rating,
              published:  true,
              sort_order: t.sort_order,
            }))
          );
          if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
      }

      // ── Team Members ────────────────────────────────────────────────────
      case "save_team_members": {
        // payload: { members: { id?, name, role, bio, image_url, sort_order }[] }
        await db.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (payload.members.length > 0) {
          const { error } = await db.from("team_members").insert(
            payload.members.map((m: {
              name: string; role: string; bio: string;
              image_url: string | null; sort_order: number;
            }) => ({
              name:       m.name,
              role:       m.role,
              bio:        m.bio,
              image_url:  m.image_url || null,
              sort_order: m.sort_order,
            }))
          );
          if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
      }

      // ── Blog posts ──────────────────────────────────────────────────────
      case "save_blog_post": {
        // payload: { post: { id?, ...fields } }
        const p = payload.post;
        const fields = {
          title:      p.title,
          excerpt:    p.excerpt,
          body:       p.body,
          category:   p.category,
          author:     p.author,
          published:  p.published,
          updated_at: new Date().toISOString(),
        };
        if (p.id) {
          const { error } = await db.from("blog_posts").update(fields).eq("id", p.id);
          if (error) return NextResponse.json({ error: error.message }, { status: 500 });
          return NextResponse.json({ ok: true, id: p.id });
        } else {
          const { data, error } = await db.from("blog_posts").insert(fields).select("id").single();
          if (error) return NextResponse.json({ error: error.message }, { status: 500 });
          return NextResponse.json({ ok: true, id: data.id });
        }
      }

      case "delete_blog_post": {
        const { error } = await db.from("blog_posts").delete().eq("id", payload.id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      case "toggle_blog_publish": {
        const { error } = await db.from("blog_posts")
          .update({ published: payload.published })
          .eq("id", payload.id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("[api/admin/content]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
