/**
 * /api/create-order
 *
 * Server-side order creation — re-fetches the price from DB so the
 * client cannot manipulate the amount.
 * Public endpoint (no admin auth needed) but validates all inputs.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

function getServiceClient() {
  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient<Database>(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, durationKey, customerName, txRef, paymentMethod, deviceToken } = body;

    // ── Input validation ────────────────────────────────────────────────
    if (!planId || typeof planId !== "string") {
      return NextResponse.json({ error: "Invalid planId" }, { status: 400 });
    }
    if (!durationKey || typeof durationKey !== "string") {
      return NextResponse.json({ error: "Invalid durationKey" }, { status: 400 });
    }
    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
      return NextResponse.json({ error: "Customer name required (min 2 characters)" }, { status: 400 });
    }
    if (customerName.trim().length > 100) {
      return NextResponse.json({ error: "Customer name too long" }, { status: 400 });
    }
    if (!txRef || typeof txRef !== "string" || !txRef.startsWith("http")) {
      return NextResponse.json({ error: "Valid transaction link required" }, { status: 400 });
    }
    if (txRef.length > 2000) {
      return NextResponse.json({ error: "Transaction link too long" }, { status: 400 });
    }
    if (!["telebirr", "cbe"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const db = getServiceClient();

    // ── Verify plan exists and is published ─────────────────────────────
    const { data: plan, error: planErr } = await db
      .from("plans")
      .select("id, published")
      .eq("id", planId)
      .eq("published", true)
      .maybeSingle();

    if (planErr || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // ── Look up the real price from DB — client cannot manipulate this ──
    const { data: duration, error: durErr } = await db
      .from("plan_durations")
      .select("key, label, price")
      .eq("plan_id", planId)
      .eq("key", durationKey as "1-week" | "1-month" | "3-months" | "6-months")
      .maybeSingle();

    if (durErr || !duration) {
      return NextResponse.json({ error: "Duration not found for this plan" }, { status: 404 });
    }

    // ── Check tx_ref uniqueness ──────────────────────────────────────────
    const { data: existing } = await db
      .from("orders")
      .select("id")
      .eq("tx_ref", txRef.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "This transaction link has already been used for another order." },
        { status: 409 }
      );
    }

    // ── Insert order with server-verified price ──────────────────────────
    const { data: inserted, error: insertErr } = await db
      .from("orders")
      .insert({
        customer_name:  customerName.trim(),
        customer_email: "",
        customer_phone: "",
        plan_id:        planId,
        duration_key:   duration.key,
        duration_label: duration.label,
        amount:         duration.price,
        currency:       "ETB",
        payment_method: paymentMethod as "telebirr" | "cbe",
        status:         "pending_verification" as const,
        tx_ref:         txRef.trim(),
        ...(deviceToken && typeof deviceToken === "string" ? { device_token: deviceToken } : {}),
      })
      .select("id")
      .single();

    if (insertErr?.code === "23505") {
      return NextResponse.json(
        { error: "This transaction link has already been used." },
        { status: 409 }
      );
    }

    if (insertErr || !inserted) {
      console.error("[create-order]", insertErr);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, orderId: inserted.id });
  } catch (err) {
    console.error("[create-order]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
