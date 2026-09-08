"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package, ArrowRight, ArrowUpRight } from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";
import {
  REVENUE_DATA,
  THIS_MONTH_REVENUE,
  type AdminPlan,
} from "@/lib/admin-data";

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

// ─── REVENUE CHART ────────────────────────────────────────────────────────────
function RevenueChart({ revenue }: { revenue: number }) {
  const max = Math.max(...REVENUE_DATA.map((d) => d.revenue));
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
        {REVENUE_DATA.map((d) => {
          const pct = (d.revenue / max) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-sm bg-white/80 hover:bg-white transition-colors cursor-default"
                title={`${d.revenue.toLocaleString()} ETB`}
              />
              <p className="text-[10px] text-white/30">{d.day}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    completed: "bg-white/10 text-white/70",
    pending:   "bg-yellow-500/15 text-yellow-400",
    failed:    "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase ${s[status] ?? s.pending}`}>
      {status}
    </span>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [orders,    setOrders]    = useState<DBOrder[]>([]);
  const [plans,     setPlans]     = useState<AdminPlan[]>([]);
  const [loading,   setLoading]   = useState(true);

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
  const totalRevenue    = completedOrders.reduce((s, o) => s + o.amount, 0);
  const uniqueEmails    = new Set(orders.map((o) => o.customer_email)).size;
  const recentOrders    = orders.slice(0, 5);
  const topPlans        = [...plans].slice(0, 4);

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
        <StatCard label="Total Revenue"  value={`${totalRevenue.toLocaleString()}`}  sub="ETB completed"      icon={TrendingUp}  />
        <StatCard label="Total Orders"   value={String(orders.length)}               sub={`${completedOrders.length} completed`} icon={ShoppingBag} />
        <StatCard label="Customers"      value={String(uniqueEmails)}                sub="Unique emails"      icon={Users}       />
        <StatCard label="Active Plans"   value={String(plans.filter(p => p.published).length)} sub="Published" icon={Package}  />
      </div>

      {/* Chart + Top plans */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart revenue={totalRevenue} />
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
          ) : (
            <div className="space-y-4">
              {topPlans.map((plan, i) => (
                <div key={plan.id} className="flex items-center gap-3">
                  <span className="text-[10px] text-white/25 w-4 flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">{plan.title}</p>
                    <p className="text-[10px] text-white/30">{plan.level}</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${plan.published ? "bg-white/10 text-white/50" : "bg-red-500/15 text-red-400"}`}>
                    {plan.published ? "Live" : "Draft"}
                  </span>
                </div>
              ))}
              {topPlans.length === 0 && (
                <p className="text-white/25 text-xs text-center py-4">No plans yet.</p>
              )}
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
                      <p className="text-sm text-white/80 font-medium">{order.customer_name || order.customer_email}</p>
                      <p className="text-[11px] text-white/25">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/50 max-w-[140px] truncate">{order.plan_id}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40">{order.duration_label}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-white/80">{order.amount.toLocaleString()} ETB</td>
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
          { label: "Customers",     href: "/admin/customers", desc: "Order history" },
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
