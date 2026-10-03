/**
 * /api/admin/content
 *
 * Single endpoint for all admin content writes.
 * Uses service role key (bypasses RLS).
 * Protected: verifies the caller has a valid admin session first.
 *
 * Error policy:
 *  - Internal DB errors are logged server-side but NEVER sent to the client
 *  - Users always receive a generic "Save failed" message on DB errors
 *  - Only safe, pre-defined messages are returned
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

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

  const supabase = createServerClient<Database>(url, anon, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const admin = getAdminClient();
  const { data } = await admin.from("admins").select("id").eq("id", user.id).maybeSingle();
  return !!data;
}

// Helper — logs real error server-side, returns safe response
function dbError(action: string, err: unknown): NextResponse {
  console.error(`[api/admin/content] action=${action}:`, err instanceof Error ? err.message : err);
  return NextResponse.json({ error: "Save failed. Please try again." }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const action: string  = body.action;
    const payload         = body.payload;
    const db = getAdminClient();

    switch (action) {

      case "upsert_site_content": {
        const rows: { key: string; value: string }[] = payload;
        const { error } = await db.from("site_content").upsert(rows, { onConflict: "key" });
        if (error) return dbError(action, error);
        return NextResponse.json({ ok: true });
      }

      case "save_faqs": {
        await db.from("faqs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (payload.faqs.length > 0) {
          const { error } = await db.from("faqs").insert(
            payload.faqs.map((f: { question: string; answer: string; sort_order: number }) => ({
              question:   f.question,
              answer:     f.answer,
              sort_order: f.sort_order,
            }))
          );
          if (error) return dbError(action, error);
        }
        return NextResponse.json({ ok: true });
      }

      case "save_testimonials": {
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
          if (error) return dbError(action, error);
        }
        return NextResponse.json({ ok: true });
      }

      case "save_team_members": {
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
          if (error) return dbError(action, error);
        }
        return NextResponse.json({ ok: true });
      }

      case "save_blog_post": {
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
          if (error) return dbError(action, error);
          return NextResponse.json({ ok: true, id: p.id });
        } else {
          const { data, error } = await db.from("blog_posts").insert(fields).select("id").single();
          if (error) return dbError(action, error);
          return NextResponse.json({ ok: true, id: data.id });
        }
      }

      case "delete_blog_post": {
        const { error } = await db.from("blog_posts").delete().eq("id", payload.id);
        if (error) return dbError(action, error);
        return NextResponse.json({ ok: true });
      }

      case "toggle_blog_publish": {
        const { error } = await db.from("blog_posts")
          .update({ published: payload.published }).eq("id", payload.id);
        if (error) return dbError(action, error);
        return NextResponse.json({ ok: true });
      }

      case "update_order_status": {
        const { error } = await db.from("orders")
          .update({ status: payload.status }).eq("id", payload.orderId);
        if (error) return dbError(action, error);
        return NextResponse.json({ ok: true });
      }

      case "grant_order_access": {
        const { error: orderErr } = await db.from("orders")
          .update({ status: "completed" }).eq("id", payload.orderId);
        if (orderErr) return dbError(action, orderErr);

        await db.from("order_access").delete().eq("order_id", payload.orderId);
        const { error: accessErr } = await db.from("order_access").insert({
          order_id:    payload.orderId,
          plan_id:     payload.planId,
          email:       payload.customerName || payload.orderId,
          unlocked:    true,
          unlocked_at: new Date().toISOString(),
        });
        if (accessErr) return dbError(action, accessErr);
        return NextResponse.json({ ok: true });
      }

      default:
        // Don't echo the action value back — just say it's invalid
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (err) {
    console.error("[api/admin/content] unexpected error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
