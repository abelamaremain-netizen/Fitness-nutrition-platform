"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Clock, XCircle,
  Download, Play, ArrowLeft, Package,
} from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";

interface OrderEntry {
  orderId: string;
  deviceToken: string;
}

interface OrderData {
  id: string;
  customer_name: string;
  plan_id: string;
  duration_label: string;
  amount: number;
  status: string;
  created_at: string;
  // joined from order_access + plans
  access_unlocked: boolean;
  access_granted_at: string | null;
  plan_title: string;
  plan_video_url: string | null;
  plan_pdf_url: string | null;
}

const ACCESS_WINDOW_DAYS = 30; // how long device can access content after approval

function isAccessExpired(grantedAt: string | null): boolean {
  if (!grantedAt) return false;
  const granted = new Date(grantedAt).getTime();
  const now = Date.now();
  return now - granted > ACCESS_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export default function MyOrderPage() {
  const [orders,  setOrders]  = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      // Read all order tokens from localStorage
      const entries: OrderEntry[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("ns_order_")) {
          const orderId = key.replace("ns_order_", "");
          const deviceToken = localStorage.getItem(key) ?? "";
          entries.push({ orderId, deviceToken });
        }
      }

      if (entries.length === 0) {
        setLoading(false);
        return;
      }

      const supabase = createBrowserClient();
      const orderIds = entries.map((e) => e.orderId);

      // Fetch orders + access + plan info in parallel
      const [ordersRes, accessRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, customer_name, plan_id, duration_label, amount, status, created_at")
          .in("id", orderIds),
        supabase
          .from("order_access")
          .select("order_id, unlocked, unlocked_at, plan_id")
          .in("order_id", orderIds),
      ]);

      const dbOrders = ordersRes.data ?? [];

      // Try to fetch device_token separately — column may not exist in DB yet
      const tokenMap: Record<string, string> = {};
      const tokenRes = await supabase
        .from("orders")
        .select("id, device_token")
        .in("id", orderIds);
      if (!tokenRes.error && tokenRes.data) {
        for (const row of tokenRes.data) {
          const r = row as { id: string; device_token?: string | null };
          if (r.device_token) tokenMap[r.id] = r.device_token;
        }
      }
      const dbAccess = accessRes.data ?? [];

      // Get plan details for all plan IDs
      const planIds = [...new Set(dbOrders.map((o) => o.plan_id))];
      const plansRes = planIds.length > 0
        ? await supabase.from("plans").select("id, title, video_url, pdf_url").in("id", planIds)
        : { data: [] };
      const plans = plansRes.data ?? [];

      const result: OrderData[] = [];

      for (const entry of entries) {
        const order = dbOrders.find((o) => o.id === entry.orderId);
        if (!order) continue;

        // Verify token matches if DB has one stored
        const dbToken = tokenMap[entry.orderId];
        if (dbToken && dbToken !== entry.deviceToken) continue;

        const access = dbAccess.find((a) => a.order_id === order.id);
        const plan   = plans.find((p) => p.id === order.plan_id);

        result.push({
          id:                order.id,
          customer_name:     order.customer_name,
          plan_id:           order.plan_id,
          duration_label:    order.duration_label,
          amount:            order.amount,
          status:            order.status,
          created_at:        order.created_at,
          access_unlocked:    access?.unlocked ?? false,
          access_granted_at:  access?.unlocked_at ?? null,
          plan_title:         plan?.title    ?? "Your Plan",
          plan_video_url:     plan?.video_url ?? null,
          plan_pdf_url:       plan?.pdf_url   ?? null,
        });
      }

      // Sort newest first
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(result);
      setLoading(false);
    };

    load();
  }, []);

  const statusIcon = (status: string) => {
    if (status === "completed")            return <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />;
    if (status === "pending_verification") return <Clock size={16} className="text-blue-400 flex-shrink-0" />;
    if (status === "failed")               return <XCircle size={16} className="text-red-400 flex-shrink-0" />;
    return <Clock size={16} className="text-yellow-400 flex-shrink-0" />;
  };

  const statusText: Record<string, string> = {
    completed:            "Payment verified — plan is ready",
    pending_verification: "Being verified by our team (usually a few hours)",
    failed:               "Verification failed. Please contact us.",
    pending:              "Awaiting payment verification.",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-xl mx-auto px-8">

        <Link href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-[11px] tracking-widest uppercase transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Home
        </Link>

        <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-3">
          My Orders
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)" }}
          className="text-3xl font-bold text-white mb-2">
          Your <em>Plans</em>
        </h1>
        <p className="text-white/40 text-sm mb-10 leading-relaxed">
          Orders placed on this device. Once approved, you can access your plan content here for {ACCESS_WINDOW_DAYS} days.
        </p>

        {/* No orders found */}
        {orders.length === 0 && (
          <div className="card p-10 text-center">
            <Package size={32} className="text-white/20 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-white/50 font-semibold mb-2">No orders on this device</p>
            <p className="text-white/30 text-sm leading-relaxed mb-6">
              Orders are linked to the device and browser you used at checkout.
              If you ordered on a different device, switch to that device.
            </p>
            <Link href="/plans" className="btn btn-white py-3 px-8">Browse Plans</Link>
          </div>
        )}

        {/* Order list */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen    = expanded === order.id;
            const approved  = order.access_unlocked && order.status === "completed";
            const expired   = approved && isAccessExpired(order.access_granted_at);
            const canAccess = approved && !expired;

            return (
              <motion.div key={order.id} layout
                className="card overflow-hidden">

                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
                  {statusIcon(order.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{order.plan_title}</p>
                    <p className="text-white/35 text-[11px] mt-0.5">
                      {order.duration_label} · {order.amount.toLocaleString()} ETB · {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  {canAccess && (
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 flex-shrink-0">
                      Ready
                    </span>
                  )}
                  {expired && (
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/40 flex-shrink-0">
                      Expired
                    </span>
                  )}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                    className="text-white/25 text-xs flex-shrink-0">↑</motion.span>
                </button>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-white/[0.07]">
                      <div className="px-5 py-5 space-y-4">

                        {/* Status message */}
                        <p className="text-sm text-white/55 leading-relaxed">
                          {statusText[order.status] ?? "Unknown status"}
                        </p>

                        {/* Pending — waiting for admin */}
                        {(order.status === "pending_verification" || order.status === "pending") && (
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/8 border border-blue-500/15">
                            <Clock size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-400/80 text-xs leading-relaxed">
                              Come back to this page once our team notifies you. Your access will appear here automatically — no action needed.
                            </p>
                          </div>
                        )}

                        {/* Expired */}
                        {expired && (
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                            <XCircle size={14} className="text-white/40 mt-0.5 flex-shrink-0" />
                            <p className="text-white/40 text-xs leading-relaxed">
                              Access to this plan expired {ACCESS_WINDOW_DAYS} days after it was granted.
                              To regain access, contact us or purchase the plan again.
                            </p>
                          </div>
                        )}

                        {/* Failed */}
                        {order.status === "failed" && (
                          <Link href="/contact"
                            className="btn btn-outline w-full py-3 text-[11px] flex items-center justify-center gap-2">
                            Contact Us
                          </Link>
                        )}

                        {/* Content — accessible */}
                        {canAccess && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">
                              Your Content
                            </p>

                            {order.plan_pdf_url ? (
                              <a href={order.plan_pdf_url} target="_blank" rel="noopener noreferrer"
                                className="btn btn-white w-full py-3.5 flex items-center justify-center gap-2">
                                <Download size={15} /> Download PDF Guide
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 text-white/30 text-sm py-1">
                                <Download size={14} />
                                <span>PDF not yet available — contact us</span>
                              </div>
                            )}

                            {order.plan_video_url ? (
                              <a href={order.plan_video_url} target="_blank" rel="noopener noreferrer"
                                className="btn btn-outline w-full py-3.5 flex items-center justify-center gap-2">
                                <Play size={15} /> Watch Video Plan
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 text-white/30 text-sm py-1">
                                <Play size={14} />
                                <span>Video not yet available — contact us</span>
                              </div>
                            )}

                            {order.access_granted_at && (
                              <p className="text-white/22 text-[11px] text-center">
                                Access expires {new Date(new Date(order.access_granted_at).getTime() + ACCESS_WINDOW_DAYS * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB")}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Help */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-white/25 text-xs">
            Ordered on a different device?{" "}
            <Link href="/contact" className="text-white/45 hover:text-white underline transition-colors">
              Contact us
            </Link>
            {" "}and we&apos;ll help you access your plan.
          </p>
        </div>
      </div>
    </div>
  );
}
