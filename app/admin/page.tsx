"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package, ArrowRight, ArrowUpRight } from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";
import type { AdminPlan } from "@/lib/admin-data";

interface DBOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  plan_id: string;
  duration_label: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, trend }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; trend?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
          <Icon size={16} className="text-white/60" strokeWidth={1.8} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[11px] text-white/40 font-medium">
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-white mb-0.5"
        style={{ fontFamily: "var(--font-serif)" }}>{value}</p>
      <p className="text-[11px] font-semibold tracking-widest uppercase text-white/35">{label}</p>
      <p className="text-[11px] text-white/22 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── REVENUE CHART — built from real DB orders (last 7 days) ─────────────────
function RevenueChart({ revenue, orders }: { revenue: number; orders: DBOrder[] }) {
  // Build last-7-days buckets from completed orders
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      date:  d.toISOString().slice(0, 10),
      revenue: 0,
    };
  });

  for (const order of orders) {
    if (order.status !== "completed") continue;
    const orderDate = order.created_at.slice(0, 10);
    const bucket = days.find((d) => d.date === orderDate);
    if (bucket) bucket.revenue += order.amount;
  }

  const max = Math.max(...days.map((d) => d.revenue), 1); // avoid div by zero

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-1">Revenue</p>
          <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-serif)" }}>
            {revenue.toLocaleString()} ETB
          </p>
          <p className="text-[11px] text-white/25 mt-0.5">Total completed</p>
        </div>
      </div>
      <div className="flex items-end gap-2 h-32">
        {days.map((d) => {
          const pct = (d.revenue / max) * 100;
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(pct, 2)}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full rounded-t-sm transition-colors ${
                  d.revenue > 0 ? "bg-white/80 hover:bg-white" : "bg-white/10"
                }`}
                title={d.revenue > 0 ? `${d.revenue.toLocaleString()} ETB` : "No orders"}
              />
              <p className="text-[10px] text-white/30">{d.label}</p>
            </div>
          );
        })}
      </div>
      {days.every((d) => d.revenue === 0) && (
        <p className="text-white/20 text-[11px] text-center mt-3">No completed orders in the last 7 days</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    completed:            "bg-white/10 text-white/70",
    pending:              "bg-yellow-500/15 text-yellow-400",
    failed:               "bg-red-500/15 text-red-400",
    pending_verification: "bg-blue-500/15 text-blue-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase ${s[status] ?? s.pending}`}>
      {status.replace("_", " ")}
    </span>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [orders,  setOrders]  = useState<DBOrder[]>([]);
  const [plans,   setPlans]   = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();
    Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("plans").select("id, title, level, goal, published, created_at").order("created_at", { ascending: false }),
    ]).then(([ordersRes, plansRes]) => {
      if (ordersRes.data) setOrders(ordersRes.data as DBOrder[]);
      if (plansRes.data) {
        setPlans(plansRes.data.map((p) => ({
          id: p.id, title: p.title,
          level: p.level as AdminPlan["level"],
          goal: p.goal,
          published: p.published,
          sales: 0, revenue: 0,
          createdAt: p.created_at,
        })));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue    = completedOrders.reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const uniqueCustomers = new Set(orders.map((o) => o.customer_name).filter(Boolean)).size;
  const recentOrders    = orders.slice(0, 5);
  const topPlans        = plans.slice(0, 4);
  const pendingCount    = orders.filter((o) => o.status === "pending_verification" || o.status === "pending").length;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Overview</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue"  value={`${totalRevenue.toLocaleString()}`} sub="ETB completed"                         icon={TrendingUp}  />
        <StatCard label="Total Orders"   value={String(orders.length)}              sub={`${completedOrders.length} completed`}  icon={ShoppingBag} />
        <StatCard label="Buyers"         value={String(uniqueCustomers)}            sub="Unique buyers"                          icon={Users}       />
        <StatCard label="Active Plans"   value={String(plans.filter(p => p.published).length)} sub={`${pendingCount} pending verification`} icon={Package} />
      </div>

      {/* Chart + Top plans */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart revenue={totalRevenue} orders={orders} />
        </div>
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35">Plans</p>
            <Link href="/admin/plans"
              className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white flex items-center gap-1 transition-colors">
              View All <ArrowRight size={10} />
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : topPlans.length === 0 ? (
            <p className="text-white/25 text-xs text-center py-4">No plans yet.</p>
          ) : (
            <div className="space-y-4">
              {topPlans.map((plan, i) => (
                <div key={plan.id} className="flex items-center gap-3">
                  <span className="text-[10px] text-white/25 w-4 flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">{plan.title}</p>
                    <p className="text-[10px] text-white/30 capitalize">{plan.level}</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    plan.published ? "bg-white/10 text-white/50" : "bg-yellow-500/15 text-yellow-400"
                  }`}>
                    {plan.published ? "Live" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35">Recent Orders</p>
          <Link href="/admin/orders"
            className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white flex items-center gap-1 transition-colors">
            View All <ArrowRight size={10} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-white/25 text-sm text-center py-12">No orders yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Customer", "Plan", "Duration", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="text-sm text-white/80 font-medium">{order.customer_name || "—"}</p>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/50 max-w-[140px] truncate">{order.plan_id}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40">{order.duration_label}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-white/80">
                      {(Number(order.amount) || 0).toLocaleString()} ETB
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-3.5 text-[11px] text-white/30">
                      {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Plans",  href: "/admin/plans",     desc: "Add, edit, publish" },
          { label: "View Orders",   href: "/admin/orders",    desc: "Track all purchases" },
          { label: "Buyers",        href: "/admin/customers", desc: "Order history" },
          { label: "Edit Content",  href: "/admin/content",   desc: "About, FAQ, Hero" },
        ].map((l) => (
          <Link key={l.href} href={l.href}
            className="card p-5 hover:border-white/20 transition-colors group">
            <p className="text-white text-sm font-semibold mb-1">{l.label}</p>
            <p className="text-white/30 text-xs">{l.desc}</p>
            <ArrowRight size={13} className="text-white/20 group-hover:text-white/60 mt-3 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
