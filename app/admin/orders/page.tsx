"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Eye, ChevronDown, Download, ExternalLink } from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";

interface DBOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  plan_id: string;
  duration_key: string;
  duration_label: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  tx_ref: string | null;
  created_at: string;
}

type OrderStatus = "completed" | "pending" | "failed" | "pending_verification";

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    completed:            "bg-white/10 text-white/70",
    pending:              "bg-yellow-500/15 text-yellow-400",
    failed:               "bg-red-500/15 text-red-400",
    pending_verification: "bg-blue-500/15 text-blue-400",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase ${s[status] ?? s.pending}`}>
      {status}
    </span>
  );
}

function OrderModal({ order, onClose, onStatusChange }: {
  order: DBOrder;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const [updating, setUpdating] = useState(false);

  const changeStatus = async (status: OrderStatus) => {
    const supabase = createBrowserClient();
    setUpdating(true);
    await supabase.from("orders").update({ status }).eq("id", order.id);
    onStatusChange(order.id, status);
    setUpdating(false);
  };

  const grantAccess = async () => {
    const supabase = createBrowserClient();
    setUpdating(true);
    // Mark order completed
    await supabase.from("orders").update({ status: "completed" }).eq("id", order.id);
    // Create order_access row so customer can access content
    await supabase.from("order_access").upsert({
      order_id:    order.id,
      plan_id:     order.plan_id,
      email:       order.customer_email || order.customer_name,
      unlocked:    true,
      unlocked_at: new Date().toISOString(),
    }, { onConflict: "order_id" });
    onStatusChange(order.id, "completed");
    setUpdating(false);
  };

  const isPendingVerification = order.status === "pending_verification";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.1]"
        style={{ background: "#111" }}>

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

        <div className="p-6 space-y-0">
          {/* Order details rows */}
          {[
            { label: "Customer", value: order.customer_name || "—" },
            { label: "Plan ID",  value: order.plan_id },
            { label: "Duration", value: order.duration_label },
            { label: "Amount",   value: `${order.amount.toLocaleString()} ${order.currency}` },
            { label: "Method",   value: order.payment_method },
            { label: "Date",     value: new Date(order.created_at).toLocaleString("en-GB") },
          ].map((row) => (
            <div key={row.label}
              className="flex items-start justify-between gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/30 flex-shrink-0">
                {row.label}
              </p>
              <p className="text-sm text-white/65 text-right break-all">{row.value}</p>
            </div>
          ))}

          {/* Transaction link — clickable */}
          {order.tx_ref && (
            <div className="py-3 border-b border-white/[0.05]">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/30 mb-2">
                Transaction Link
              </p>
              <a href={order.tx_ref} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-blue-400 hover:text-blue-300 break-all transition-colors">
                <ExternalLink size={13} className="mt-0.5 flex-shrink-0" />
                {order.tx_ref}
              </a>
              <p className="text-[11px] text-white/25 mt-2">
                Click to verify the transaction on the bank&apos;s platform
              </p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/30">Status</p>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          {/* Grant Access — main action for pending_verification */}
          {isPendingVerification && (
            <button onClick={grantAccess} disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-50">
              {updating
                ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                : <>✓ Verify &amp; Grant Access</>
              }
            </button>
          )}

          {/* Reject */}
          {isPendingVerification && (
            <button onClick={() => changeStatus("failed")} disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium py-2.5 rounded-xl text-sm transition-all disabled:opacity-50">
              ✗ Reject (Invalid Transaction)
            </button>
          )}

          {/* Manual complete for other statuses */}
          {order.status === "pending" && (
            <button onClick={() => changeStatus("completed")} disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl text-sm transition-all">
              Mark as Completed
            </button>
          )}

          <button onClick={onClose} className="btn btn-outline w-full py-3 text-[11px]">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
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

export default function AdminOrdersPage() {
  const [orders,   setOrders]   = useState<DBOrder[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("all");
  const [method,   setMethod]   = useState("all");
  const [sortDir,  setSortDir]  = useState<"asc"|"desc">("desc");
  const [selected, setSelected] = useState<DBOrder | null>(null);

  const loadOrders = async () => {
    const supabase = createBrowserClient();
    setLoading(true);
    const { data } = await supabase
      .from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as DBOrder[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filtered = useMemo(() => {
    return orders
      .filter((o) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
          o.customer_email.toLowerCase().includes(q) ||
          (o.customer_name || "").toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q);
        const matchStatus = status === "all" || o.status === status;
        const matchMethod = method === "all" || o.payment_method === method;
        return matchSearch && matchStatus && matchMethod;
      })
      .sort((a, b) =>
        sortDir === "desc"
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }, [orders, search, status, method, sortDir]);

  const totalRevenue  = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.amount, 0);
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const pendingCount   = orders.filter((o) => o.status === "pending").length;

  const exportCSV = () => {
    const header = "ID,Customer,Email,Duration,Amount,Method,Status,Date";
    const rows = filtered.map((o) =>
      `${o.id},${o.customer_name || ""},${o.customer_email},${o.duration_label},${o.amount},${o.payment_method},${o.status},${o.created_at}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "orders.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const inp = "bg-[#141414] border border-white/[0.09] text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors";

  return (
    <>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Orders</h1>
          </div>
          <button onClick={exportCSV} className="btn btn-outline py-2.5 px-5">
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatPill label="Total"     value={orders.length} />
          <StatPill label="Completed" value={completedCount} />
          <StatPill label="Pending"   value={pendingCount} />
          <StatPill label="Revenue"   value={`${totalRevenue.toLocaleString()} ETB`} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search orders, customers…" value={search}
              onChange={(e) => setSearch(e.target.value)} className={`${inp} pl-9 w-full`} />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inp}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className={inp}>
            <option value="all">All Methods</option>
            <option>telebirr</option>
            <option>cbe</option>
            <option>chapa</option>
            <option>card</option>
          </select>
          <button onClick={() => setSortDir((d) => d === "desc" ? "asc" : "desc")}
            className={`${inp} flex items-center gap-1.5 cursor-pointer`}>
            Date <ChevronDown size={13} className={`transition-transform ${sortDir === "asc" ? "rotate-180" : ""}`} />
          </button>
          {(search || status !== "all" || method !== "all") && (
            <button onClick={() => { setSearch(""); setStatus("all"); setMethod("all"); }}
              className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white transition-colors">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <p className="text-[11px] tracking-widest uppercase text-white/25">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-16">No orders found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {["Customer", "Duration", "Method", "Amount", "Status", "Date", ""].map((h, i) => (
                      <th key={i} className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-white/80 font-medium">{order.customer_name || "—"}</p>
                        <p className="text-[11px] text-white/25">{order.customer_email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/45">{order.duration_label}</td>
                      <td className="px-5 py-3.5 text-sm text-white/40 capitalize">{order.payment_method}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-white/80">
                        {order.amount.toLocaleString()} ETB
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3.5 text-[11px] text-white/30">
                        {new Date(order.created_at).toLocaleDateString("en-GB")}
                      </td>
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
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <OrderModal
            order={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </>
  );
}
