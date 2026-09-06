import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SIGNED_URL_EXPIRY = 3600; // 1 hour in seconds

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

    // Accept both query params (GET) and JSON body (POST)
    let order_id: string | undefined;
    let email: string | undefined;
    let content_type: "pdf" | "video" | undefined;

    if (req.method === "GET") {
      const url = new URL(req.url);
      order_id = url.searchParams.get("order_id") || undefined;
      email = url.searchParams.get("email") || undefined;
      content_type = (url.searchParams.get("type") as "pdf" | "video") ||
        undefined;
    } else {
      const body = await req.json();
      order_id = body.order_id;
      email = body.email;
      content_type = body.type;
    }

    if (!order_id || !email || !content_type) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: order_id, email, type",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (content_type !== "pdf" && content_type !== "video") {
      return new Response(
        JSON.stringify({
          error: 'Invalid content type. Must be "pdf" or "video".',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 1. Check order_access — verify the customer has unlocked access
    const { data: access, error: accessError } = await supabase
      .from("order_access")
      .select("unlocked, email, plan_id")
      .eq("order_id", order_id)
      .eq("email", email)
      .eq("unlocked", true)
      .maybeSingle();

    if (accessError) {
      return new Response(
        JSON.stringify({ error: "Failed to verify access" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!access) {
      return new Response(
        JSON.stringify({
          error: "Access denied. Payment not verified or email does not match.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2. Get the plan to find the file path
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("pdf_url, video_url")
      .eq("id", access.plan_id)
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

    const filePath = content_type === "pdf" ? plan.pdf_url : plan.video_url;

    if (!filePath) {
      return new Response(
        JSON.stringify({
          error:
            `${content_type.toUpperCase()} content not available for this plan`,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. Generate a temporary signed URL for the private paid-content bucket
    //    The filePath stored in the plan is the path within the 'paid-content' bucket
    const { data: signedUrlData, error: urlError } = await supabase
      .storage
      .from("paid-content")
      .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

    if (urlError || !signedUrlData) {
      return new Response(
        JSON.stringify({ error: "Failed to generate access URL" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 4. Return the signed URL with expiry info
    return new Response(
      JSON.stringify({
        url: signedUrlData.signedUrl,
        expires_in: SIGNED_URL_EXPIRY,
        content_type,
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
