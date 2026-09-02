"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingBag, Users, Package,
  ArrowRight, ArrowUpRight,
} from "lucide-react";
import {
  ORDERS, CUSTOMERS, ADMIN_PLANS, REVENUE_DATA,
  THIS_MONTH_REVENUE, TOTAL_ORDERS, COMPLETED_ORDERS, TOTAL_CUSTOMERS,
} from "@/lib/admin-data";

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, trend,
}: {
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

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
function RevenueChart() {
  const max = Math.max(...REVENUE_DATA.map((d) => d.revenue));
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-1">
            Revenue
          </p>
          <p className="text-2xl font-black text-white"
            style={{ fontFamily: "var(--font-serif)" }}>
            {THIS_MONTH_REVENUE.toLocaleString()} ETB
          </p>
          <p className="text-[11px] text-white/25 mt-0.5">This month</p>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-white/40">
          <TrendingUp size={13} /> +18% vs last month
        </span>
      </div>

      {/* Bars */}
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

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    completed: "bg-white/10 text-white/70",
    pending:   "bg-yellow-500/15 text-yellow-400",
    failed:    "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase ${s[status]}`}>
      {status}
    </span>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const recentOrders  = ORDERS.slice(0, 5);
  const topPlans      = [...ADMIN_PLANS].sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Page title */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">
          Overview
        </p>
        <h1 className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-serif)" }}>
          Dashboard
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Revenue" value={`${THIS_MONTH_REVENUE.toLocaleString()}`}
          sub="ETB this month" icon={TrendingUp} trend="+18%" />
        <StatCard
          label="Total Orders" value={String(TOTAL_ORDERS)}
          sub={`${COMPLETED_ORDERS} completed`} icon={ShoppingBag} trend="+12%" />
        <StatCard
          label="Customers" value={String(TOTAL_CUSTOMERS)}
          sub="Registered users" icon={Users} trend="+8%" />
        <StatCard
          label="Active Plans" value={String(ADMIN_PLANS.filter(p => p.published).length)}
          sub="Published plans" icon={Package} />
      </div>

      {/* Chart + Top plans */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>

        {/* Top plans */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35">
              Top Plans
            </p>
            <Link href="/admin/plans"
              className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white flex items-center gap-1 transition-colors">
              View All <ArrowRight size={10} />
            </Link>
          </div>
          <div className="space-y-4">
            {topPlans.map((plan, i) => {
              const barPct = (plan.revenue / topPlans[0].revenue) * 100;
              return (
                <div key={plan.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-white/25 w-4 flex-shrink-0">#{i + 1}</span>
                      <p className="text-xs text-white/70 truncate">{plan.title}</p>
                    </div>
                    <p className="text-xs font-semibold text-white flex-shrink-0 ml-2">
                      {plan.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                      className="h-full bg-white/50 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35">
            Recent Orders
          </p>
          <Link href="/admin/orders"
            className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white flex items-center gap-1 transition-colors">
            View All <ArrowRight size={10} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Order", "Customer", "Plan", "Duration", "Amount", "Status", "Date"].map((h) => (
                  <th key={h}
                    className="px-6 py-3 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 text-[11px] font-mono text-white/40">{order.id}</td>
                  <td className="px-6 py-3.5">
                    <p className="text-sm text-white/80 font-medium">{order.customer}</p>
                    <p className="text-[11px] text-white/30">{order.email}</p>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-white/60 max-w-[160px] truncate">{order.plan}</td>
                  <td className="px-6 py-3.5 text-sm text-white/40">{order.duration}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-white/80">
                    {order.amount.toLocaleString()} ETB
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-3.5 text-[11px] text-white/30">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Plans",    href: "/admin/plans",     desc: "Add, edit, publish" },
          { label: "View Orders",     href: "/admin/orders",    desc: "Track all purchases" },
          { label: "Customers",       href: "/admin/customers", desc: "User profiles & health" },
          { label: "Edit Content",    href: "/admin/content",   desc: "About, FAQ, Hero" },
        ].map((l) => (
          <Link key={l.href} href={l.href}
            className="card p-5 hover:border-white/20 transition-colors group">
            <p className="text-white text-sm font-semibold mb-1 group-hover:text-white transition-colors">
              {l.label}
            </p>
            <p className="text-white/30 text-xs">{l.desc}</p>
            <ArrowRight size={13} className="text-white/20 group-hover:text-white/60 mt-3 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
