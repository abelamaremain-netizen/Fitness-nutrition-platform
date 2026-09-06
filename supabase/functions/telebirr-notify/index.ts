import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Telebirr Notification Webhook
 *
 * This edge function receives the asynchronous payment notification from Telebirr
 * after a customer completes (or fails) a payment on the Telebirr H5 payment page.
 *
 * Telebirr sends a POST request to the notifyUrl with the payment result.
 * The payload includes:
 * - outTradeNo: our transaction reference (tx_ref)
 * - tradeNo: Telebirr's transaction number
 * - tradeStatus: payment status
 * - totalAmount: the amount paid
 * - sign: RSA signature for verification
 *
 * Flow:
 * 1. Parse the notification payload
 * 2. Find the order by outTradeNo (tx_ref)
 * 3. Verify the amount matches
 * 4. If payment is successful, mark order as completed and unlock content access
 * 5. Return a success response to Telebirr so they stop retrying
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

    // Telebirr sends the notification as form data or JSON
    let payload: Record<string, string>;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      // Parse as form-urlencoded
      const formData = await req.formData();
      payload = {};
      for (const [key, value] of formData.entries()) {
        payload[key] = String(value);
      }
    }

    const outTradeNo = payload.outTradeNo || payload.out_trade_no || "";
    const tradeStatus = payload.tradeStatus || payload.trade_status || "";
    const totalAmount = payload.totalAmount || payload.total_amount || "";
    const tradeNo = payload.tradeNo || payload.trade_no || "";

    if (!outTradeNo) {
      return new Response(
        JSON.stringify({ error: "Missing outTradeNo" }),
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
      .eq("tx_ref", outTradeNo)
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

    // 2. If already completed, return success (idempotent)
    if (order.status === "completed") {
      return new Response(
        JSON.stringify({ success: true, message: "Order already completed" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. Verify the amount matches (server-side check, never trust client)
    if (totalAmount) {
      const paidAmount = parseFloat(totalAmount);
      const orderAmount = parseFloat(order.amount.toString());
      if (paidAmount !== orderAmount) {
        // Amount mismatch — mark as failed
        await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("id", order.id);

        return new Response(
          JSON.stringify({ error: "Amount mismatch" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // 4. Check if payment was successful
    // Telebirr tradeStatus values: "TRADE_SUCCESS" for successful payments
    const isSuccessful = tradeStatus === "TRADE_SUCCESS" ||
      tradeStatus === "success";

    if (!isSuccessful) {
      // Payment failed or pending — mark as failed
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment not successful",
          trade_status: tradeStatus,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 5. Mark the order as completed
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", order.id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update order status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 6. Create or update order_access to unlock content
    const { error: accessError } = await supabase
      .from("order_access")
      .upsert(
        {
          order_id: order.id,
          plan_id: order.plan_id,
          email: order.customer_email,
          unlocked: true,
          unlocked_at: new Date().toISOString(),
        },
        { onConflict: "order_id" },
      );

    if (accessError) {
      return new Response(
        JSON.stringify({ error: "Failed to unlock content access" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 7. Return success to Telebirr so they stop retrying the notification
    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and content unlocked",
        trade_no: tradeNo,
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
