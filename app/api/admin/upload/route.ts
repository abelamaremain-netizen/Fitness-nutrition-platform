/**
 * /api/admin/upload
 *
 * Handles file uploads to Supabase Storage using the service role key.
 * Protected: verifies admin session before accepting any file.
 *
 * POST multipart/form-data:
 *   - file: the file to upload
 *   - bucket: "public-assets" | "paid-content"
 *   - path: destination path inside the bucket (e.g. "plans/my-plan.pdf")
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

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file     = formData.get("file") as File | null;
    const bucket   = formData.get("bucket") as string | null;
    const path     = formData.get("path") as string | null;

    if (!file || !bucket || !path) {
      return NextResponse.json({ error: "file, bucket, and path are required" }, { status: 400 });
    }

    // Only allow specific buckets
    if (!["public-assets", "paid-content"].includes(bucket)) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    // Only allow safe file types
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `File type ${file.type} not allowed` }, { status: 400 });
    }

    // Max 20MB
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
    }

    const db = getAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer  = Buffer.from(arrayBuffer);

    const { error: uploadError } = await db.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get the public URL (for public-assets bucket) or a signed URL concept
    let publicUrl: string | null = null;
    if (bucket === "public-assets") {
      const { data } = db.storage.from(bucket).getPublicUrl(path);
      publicUrl = data.publicUrl;
    } else {
      // For paid-content — return the storage path; the app will generate signed URLs when needed
      // For now we store the path and the admin can see it was uploaded
      publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/${bucket}/${path}`;
    }

    return NextResponse.json({ ok: true, url: publicUrl, path });
  } catch (err) {
    console.error("[api/admin/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
