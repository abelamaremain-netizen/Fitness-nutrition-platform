"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Search, Filter, X, Eye, ChevronDown } from "lucide-react";
import { ORDERS, TOTAL_ORDERS, COMPLETED_ORDERS, type Order, type OrderStatus } from "@/lib/admin-data";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const s: Record<OrderStatus, string> = {
    completed: "bg-white/10 text-white/70",
    pending:   "bg-yellow-500/15 text-yellow-400",
    failed:    "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase ${s[status]}`}>
      {status}
    </span>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card px-5 py-4 text-center">
      <p className="text-xl font-black text-white" style={{ fontFamily: "var(--font-serif)" }}>{value}</p>
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mt-0.5">{label}</p>
    </div>
  );
}

// ─── ORDER DETAIL MODAL ───────────────────────────────────────────────────────
function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
        className="w-full max-w-md rounded-2xl border border-white/[0.1]" style={{ background: "#111" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <div>
            <p className="text-[10px] font-mono text-white/35">{order.id}</p>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              Order Detail
            </h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Customer",  value: order.customer },
            { label: "Email",     value: order.email },
            { label: "Plan",      value: order.plan },
            { label: "Duration",  value: order.duration },
            { label: "Amount",    value: `${order.amount.toLocaleString()} ETB` },
            { label: "Method",    value: order.method },
            { label: "Date",      value: order.date },
          ].map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/30 flex-shrink-0">
                {row.label}
              </p>
              <p className="text-sm text-white/70 text-right">{row.value}</p>
            </div>
          ))}
          {/* Status with change option */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/30">Status</p>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="btn btn-white w-full py-3">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [search,     setSearch]     = useState("");
  const [status,     setStatus]     = useState<OrderStatus | "all">("all");
  const [method,     setMethod]     = useState("all");
  const [sortBy,     setSortBy]     = useState<"date" | "amount">("date");
  const [sortDir,    setSortDir]    = useState<"asc" | "desc">("desc");
  const [selected,   setSelected]   = useState<Order | null>(null);

  const totalRevenue = ORDERS
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.amount, 0);

  const filtered = useMemo(() => {
    return ORDERS
      .filter((o) => {
        const matchSearch = !search ||
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.plan.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === "all" || o.status === status;
        const matchMethod = method === "all" || o.method === method;
        return matchSearch && matchStatus && matchMethod;
      })
      .sort((a, b) => {
        if (sortBy === "amount") {
          return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
        }
        return sortDir === "desc"
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date);
      });
  }, [search, status, method, sortBy, sortDir]);

  // CSV export
  const exportCSV = () => {
    const header = "Order ID,Customer,Email,Plan,Duration,Amount (ETB),Method,Status,Date";
    const rows = filtered.map((o) =>
      `${o.id},${o.customer},${o.email},"${o.plan}",${o.duration},${o.amount},${o.method},${o.status},${o.date}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "orders.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (col: "date" | "amount") => {
    if (sortBy === col) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const inp = "bg-[#141414] border border-white/[0.09] text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors";

  return (
    <>
      <div className="space-y-6 max-w-6xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Orders</h1>
          </div>
          <button onClick={exportCSV} className="btn btn-outline py-2.5 px-5">
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatPill label="Total Orders"    value={TOTAL_ORDERS} />
          <StatPill label="Completed"       value={COMPLETED_ORDERS} />
          <StatPill label="Pending"         value={ORDERS.filter((o) => o.status === "pending").length} />
          <StatPill label="Revenue (ETB)"   value={totalRevenue.toLocaleString()} />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search orders, customers…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inp} pl-9 w-full`} />
          </div>

          {/* Status filter */}
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}
            className={inp}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Method filter */}
          <select value={method} onChange={(e) => setMethod(e.target.value)}
            className={inp}>
            <option value="all">All Methods</option>
            <option>Telebirr</option>
            <option>CBE Birr</option>
            <option>Chapa</option>
            <option>Card</option>
          </select>

          {(search || status !== "all" || method !== "all") && (
            <button onClick={() => { setSearch(""); setStatus("all"); setMethod("all"); }}
              className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white transition-colors">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-[11px] tracking-widest uppercase text-white/25">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">Order</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">Customer</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">Plan</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">Method</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25 cursor-pointer select-none"
                    onClick={() => toggleSort("amount")}>
                    <span className="flex items-center gap-1">
                      Amount <ChevronDown size={11} className={`transition-transform ${sortBy === "amount" && sortDir === "asc" ? "rotate-180" : ""}`} />
                    </span>
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">Status</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25 cursor-pointer select-none"
                    onClick={() => toggleSort("date")}>
                    <span className="flex items-center gap-1">
                      Date <ChevronDown size={11} className={`transition-transform ${sortBy === "date" && sortDir === "asc" ? "rotate-180" : ""}`} />
                    </span>
                  </th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-[11px] font-mono text-white/35">{order.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white/80 font-medium">{order.customer}</p>
                      <p className="text-[11px] text-white/25">{order.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white/60 max-w-[150px] truncate">{order.plan}</p>
                      <p className="text-[11px] text-white/25">{order.duration}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/45">{order.method}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-white/80">
                      {order.amount.toLocaleString()} ETB
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5 text-[11px] text-white/30">{order.date}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(order)}
                        className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition-all">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-white/25">
                <p className="text-sm">No orders match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
