import {
  createServerClient,
  createAdminClient,
} from "@/src/lib/supabase/server";
import type {
  Order,
  OrderAccess,
  PlanDurationKey,
  PaymentMethod,
  OrderStatus,
} from "@/src/types/database.types";

// ---------------------------------------------------------------------------
// Admin (server) queries — manage orders
// ---------------------------------------------------------------------------

export async function adminGetAllOrders(): Promise<Order[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, plans(title)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function adminGetOrder(id: string): Promise<Order | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function adminUpdateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminGetOrderAccess(
  orderId: string,
): Promise<OrderAccess | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("order_access")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Secure order creation — uses admin client (service role) to bypass RLS
// and retrieve the actual price from the database (never trusts client price)
// ---------------------------------------------------------------------------

export async function createOrderSecure(input: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  plan_id: string;
  duration_key: PlanDurationKey;
  payment_method: PaymentMethod;
}): Promise<{ order: Order; tx_ref: string }> {
  const admin = createAdminClient();

  // 1. Fetch the plan duration to get the real price
  const { data: duration, error: durError } = await admin
    .from("plan_durations")
    .select("price, label, plan_id")
    .eq("plan_id", input.plan_id)
    .eq("key", input.duration_key)
    .maybeSingle();

  if (durError) throw durError;
  if (!duration) throw new Error("Invalid plan or duration selection");

  // 2. Verify the plan exists and is published
  const { data: plan, error: planError } = await admin
    .from("plans")
    .select("id, published")
    .eq("id", input.plan_id)
    .maybeSingle();

  if (planError) throw planError;
  if (!plan) throw new Error("Plan not found");
  if (!plan.published) throw new Error("Plan is not available for purchase");

  // 3. Generate a unique transaction reference
  const tx_ref = `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  // 4. Create the order with the server-verified price
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      plan_id: input.plan_id,
      duration_key: input.duration_key,
      duration_label: duration.label,
      amount: duration.price,
      currency: "ETB",
      payment_method: input.payment_method,
      status: "pending",
      chapa_tx_ref: tx_ref,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  return { order, tx_ref };
}

// ---------------------------------------------------------------------------
// Payment verification — called after payment gateway confirms payment
// ---------------------------------------------------------------------------

export async function verifyAndUnlockOrder(
  txRef: string,
): Promise<{ success: boolean; order: Order | null }> {
  const admin = createAdminClient();

  // 1. Find the order by transaction reference
  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("*")
    .eq("chapa_tx_ref", txRef)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) return { success: false, order: null };

  // 2. If already completed, return success (idempotent)
  if (order.status === "completed") return { success: true, order };

  // 3. Mark the order as completed
  const { data: updatedOrder, error: updateError } = await admin
    .from("orders")
    .update({ status: "completed" })
    .eq("id", order.id)
    .select()
    .single();

  if (updateError) throw updateError;

  // 4. Create or update order_access to unlock content
  const { error: accessError } = await admin.from("order_access").upsert(
    {
      order_id: order.id,
      plan_id: order.plan_id,
      email: order.customer_email,
      unlocked: true,
      unlocked_at: new Date().toISOString(),
    },
    { onConflict: "order_id" },
  );

  if (accessError) throw accessError;

  return { success: true, order: updatedOrder };
}

// ---------------------------------------------------------------------------
// Check access — used by the edge function to verify a customer has unlocked
// ---------------------------------------------------------------------------

export async function checkOrderAccess(
  orderId: string,
  email: string,
): Promise<boolean> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("order_access")
    .select("unlocked, email")
    .eq("order_id", orderId)
    .eq("email", email)
    .eq("unlocked", true)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}
