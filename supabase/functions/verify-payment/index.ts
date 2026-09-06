import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Manual Payment Verification (Telebirr)
 *
 * This edge function allows the frontend to check the status of an order
 * after the customer returns from the Telebirr payment page.
 *
 * In the Telebirr H5 flow, payment notifications arrive asynchronously via
 * the telebirr-notify webhook. However, the customer may return to the
 * returnUrl before the webhook fires. This function lets the frontend
 * poll the order status to see if it has been completed yet.
 *
 * If the order is still pending and Telebirr credentials are configured,
 * this function can optionally query the Telebirr API to check the
 * payment status directly (if Telebirr provides a query endpoint).
 */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const tx_ref = body.tx_ref;

    if (!tx_ref) {
      return new Response(
        JSON.stringify({ error: "Missing tx_ref" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 1. Find the order by transaction reference
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("tx_ref", tx_ref)
      .maybeSingle();

    if (orderError) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve order" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2. Return the current order status
    // The telebirr-notify webhook updates the order status asynchronously.
    // The frontend polls this endpoint until status is no longer 'pending'.
    return new Response(
      JSON.stringify({
        order_id: order.id,
        tx_ref: order.tx_ref,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        plan_id: order.plan_id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: (err as Error).message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
