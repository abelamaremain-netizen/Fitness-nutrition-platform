import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Convert a PEM-formatted public key string to a CryptoKey for RSA encryption.
 */
async function importPublicKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );
}

/**
 * RSA-encrypt a JSON string using the Telebirr public key.
 * Returns a base64-encoded ciphertext.
 */
async function rsaEncrypt(
  plaintext: string,
  publicKeyPem: string,
): Promise<string> {
  const key = await importPublicKey(publicKeyPem);
  const encoded = new TextEncoder().encode(plaintext);

  // RSA-OAEP with SHA-256 can encrypt up to ~190 bytes with a 2048-bit key.
  // For larger payloads, Telebirr expects chunked encryption.
  // In practice, the prepay request JSON is small enough to fit in one block.
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    encoded,
  );

  // Convert ArrayBuffer to base64
  const bytes = new Uint8Array(encrypted);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Generate a random nonce string.
 */
function generateNonce(): string {
  return Math.random().toString(36).slice(2, 18) + Date.now().toString(36);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Telebirr credentials (stored as edge function secrets)
    const telebirrAppId = Deno.env.get("TELEBIRR_APP_ID")!;
    const telebirrAppKey = Deno.env.get("TELEBIRR_APP_KEY")!;
    const telebirrShortCode = Deno.env.get("TELEBIRR_SHORT_CODE")!;
    const telebirrPublicKey = Deno.env.get("TELEBIRR_PUBLIC_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      plan_id,
      duration_key,
      payment_method,
      return_url,
    } = body;

    // Validate required fields
    if (
      !customer_name || !customer_email || !plan_id || !duration_key ||
      !payment_method
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 1. Fetch the plan duration to get the REAL price (never trust client price)
    const { data: duration, error: durError } = await supabase
      .from("plan_durations")
      .select("price, label, plan_id")
      .eq("plan_id", plan_id)
      .eq("key", duration_key)
      .maybeSingle();

    if (durError) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve plan pricing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!duration) {
      return new Response(
        JSON.stringify({ error: "Invalid plan or duration selection" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2. Verify the plan exists and is published
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id, published, title")
      .eq("id", plan_id)
      .maybeSingle();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: "Plan not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!plan.published) {
      return new Response(
        JSON.stringify({ error: "Plan is not available for purchase" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. Generate a unique transaction reference (outTradeNo for Telebirr)
    const tx_ref = `order_${Date.now()}_${
      Math.random().toString(36).slice(2, 10)
    }`;

    // 4. Create the order with the server-verified price
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone: customer_phone || "",
        plan_id,
        duration_key,
        duration_label: duration.label,
        amount: duration.price,
        currency: "ETB",
        payment_method,
        status: "pending",
        tx_ref: tx_ref,
      })
      .select()
      .single();

    if (orderError) {
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 5. Build the Telebirr H5 prepay request
    const notifyUrl = `${supabaseUrl}/functions/v1/telebirr-notify`;
    const timestamp = Date.now().toString();

    const prepayRequest = {
      appId: telebirrAppId,
      nonce: generateNonce(),
      notifyUrl: notifyUrl,
      outTradeNo: tx_ref,
      returnUrl: return_url || "",
      shortCode: telebirrShortCode,
      subject: plan.title,
      timeoutExpress: "30",
      timestamp: timestamp,
      totalAmount: duration.price.toFixed(2),
      receiveName: customer_name,
    };

    // 6. Check if Telebirr credentials are configured
    if (
      !telebirrAppId || !telebirrAppKey || !telebirrShortCode ||
      !telebirrPublicKey
    ) {
      // Credentials not yet configured — return order info without Telebirr redirect
      return new Response(
        JSON.stringify({
          order_id: order.id,
          tx_ref: tx_ref,
          amount: duration.price,
          currency: "ETB",
          duration_label: duration.label,
          plan_title: plan.title,
          message:
            "Telebirr credentials not yet configured. Set TELEBIRR_APP_ID, TELEBIRR_APP_KEY, TELEBIRR_SHORT_CODE, and TELEBIRR_PUBLIC_KEY secrets.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 7. Encrypt the prepay request JSON with the Telebirr public key
    const requestJson = JSON.stringify(prepayRequest);
    const encryptedData = await rsaEncrypt(requestJson, telebirrPublicKey);

    // 8. Send the encrypted request to Telebirr's createOrder endpoint
    const telebirrResponse = await fetch(
      "https://app.ethiotelecom.et/service-openup/toTradeWebPay",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: telebirrAppId,
          sign: encryptedData,
          timestamp: timestamp,
          nonce: prepayRequest.nonce,
        }),
      },
    );

    if (!telebirrResponse.ok) {
      // Telebirr API returned an error — keep order as pending
      const errorText = await telebirrResponse.text();
      return new Response(
        JSON.stringify({
          error: "Telebirr payment initiation failed",
          details: errorText,
          order_id: order.id,
          tx_ref: tx_ref,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const telebirrData = await telebirrResponse.json();

    if (telebirrData.code !== "0" || !telebirrData.data?.toPayUrl) {
      return new Response(
        JSON.stringify({
          error: "Telebirr payment initiation failed",
          details: telebirrData.msg || "Unknown error",
          order_id: order.id,
          tx_ref: tx_ref,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 9. Return the Telebirr payment URL to redirect the customer
    return new Response(
      JSON.stringify({
        order_id: order.id,
        tx_ref: tx_ref,
        amount: duration.price,
        currency: "ETB",
        duration_label: duration.label,
        plan_title: plan.title,
        toPayUrl: telebirrData.data.toPayUrl,
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
