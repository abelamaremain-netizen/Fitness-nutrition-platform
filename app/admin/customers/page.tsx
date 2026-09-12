"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Eye, Shield, ShieldOff } from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";

interface CustomerSummary {
  email: string;
  name: string;
  phone: string;
  totalSpent: number;
  orderCount: number;
  lastOrder: string;
  orders: DBOrder[];
}

interface DBOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  plan_id: string;
  duration_label: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}
function CustomerModal({ customer, onClose }: { customer: CustomerSummary; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.1]"
        style={{ background: "#111" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              {customer.name || customer.email}
            </h2>
            <p className="text-[11px] text-white/30 mt-0.5">{customer.email}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Orders",        v: customer.orderCount },
              { l: "Total Spent",   v: `${customer.totalSpent.toLocaleString()} ETB` },
              { l: "Last Order",    v: new Date(customer.lastOrder).toLocaleDateString("en-GB") },
            ].map((s) => (
              <div key={s.l} className="card p-3 text-center">
                <p className="text-sm font-bold text-white">{s.v}</p>
                <p className="text-[10px] text-white/25 tracking-widest uppercase mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Order history */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/30 mb-4">Order History</p>
            <div className="space-y-2">
              {customer.orders.map((o) => (
                <div key={o.id} className="card p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-white/60 font-medium truncate">{o.plan_id}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{o.duration_label} · {o.payment_method}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-white/80">{o.amount.toLocaleString()} ETB</p>
                    <p className="text-[10px] text-white/25">{new Date(o.created_at).toLocaleDateString("en-GB")}</p>
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                    o.status === "completed" ? "bg-white/10 text-white/60" :
                    o.status === "pending"   ? "bg-yellow-500/15 text-yellow-400" :
                                               "bg-red-500/15 text-red-400"
                  }`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="btn btn-white w-full py-3">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCustomersPage() {
  const [orders,   setOrders]   = useState<DBOrder[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<CustomerSummary | null>(null);
  // banned is loaded from DB — persists across refreshes
  const [banned,   setBanned]   = useState<Set<string>>(new Set());
  const [banning,  setBanning]  = useState<string | null>(null); // email being toggled

  useEffect(() => {
    const supabase = createBrowserClient();
    // Load orders and banned list in parallel
    Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("banned_customers").select("email"),
    ]).then(([ordersRes, bannedRes]) => {
      setOrders((ordersRes.data as DBOrder[]) ?? []);
      const bannedEmails = new Set<string>(
        ((bannedRes.data ?? []) as { email: string }[]).map((r) => r.email)
      );
      setBanned(bannedEmails);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleBan = async (email: string) => {
    setBanning(email);
    const supabase = createBrowserClient();
    const isBanned = banned.has(email);

    if (isBanned) {
      await supabase.from("banned_customers").delete().eq("email", email);
      setBanned((prev) => { const n = new Set(prev); n.delete(email); return n; });
    } else {
      await supabase.from("banned_customers").upsert({ email }, { onConflict: "email" });
      setBanned((prev) => new Set(prev).add(email));
    }
    setBanning(null);
  };

  // Group orders by email → customer summaries
  const customers: CustomerSummary[] = useMemo(() => {
    const map = new Map<string, CustomerSummary>();
    for (const o of orders) {
      const existing = map.get(o.customer_email);
      if (existing) {
        existing.orderCount++;
        existing.totalSpent += o.status === "completed" ? o.amount : 0;
        if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at;
        existing.orders.push(o);
      } else {
        map.set(o.customer_email, {
          email:      o.customer_email,
          name:       o.customer_name || "",
          phone:      o.customer_phone || "",
          totalSpent: o.status === "completed" ? o.amount : 0,
          orderCount: 1,
          lastOrder:  o.created_at,
          orders:     [o],
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.lastOrder.localeCompare(a.lastOrder));
  }, [orders]);

  const filtered = useMemo(() =>
    customers.filter((c) => {
      const q = search.toLowerCase();
      return !q || c.email.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
    }),
  [customers, search]);

  return (
    <>
      <div className="space-y-6 max-w-6xl">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Customers</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md">
          {[
            { l: "Total",    v: customers.length },
            { l: "Paying",   v: customers.filter((c) => c.totalSpent > 0).length },
            { l: "No Orders",v: customers.filter((c) => c.orderCount === 0).length },
          ].map((s) => (
            <div key={s.l} className="card p-4 text-center">
              <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-serif)" }}>{s.v}</p>
              <p className="text-[10px] tracking-widest uppercase text-white/30 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search by name or email…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#141414] border border-white/[0.09] text-white placeholder-white/20 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors w-full" />
          </div>
          {search && (
            <button onClick={() => setSearch("")}
              className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white transition-colors">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <p className="text-[11px] tracking-widest uppercase text-white/25">
          {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-16">
                {customers.length === 0 ? "No customers yet." : "No customers match your search."}
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {["Customer", "Orders", "Total Spent", "Last Order", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const isBanned = banned.has(c.email);
                    return (
                      <tr key={c.email}
                        className={`border-b border-white/[0.04] transition-colors ${isBanned ? "opacity-40" : "hover:bg-white/[0.02]"}`}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-white/80 font-medium">{c.name || "—"}</p>
                          <p className="text-[11px] text-white/25">{c.email}</p>
                          {c.phone && <p className="text-[11px] text-white/20">{c.phone}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-white/50">{c.orderCount}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-white/70">
                          {c.totalSpent.toLocaleString()} ETB
                        </td>
                        <td className="px-5 py-3.5 text-[11px] text-white/30">
                          {new Date(c.lastOrder).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSelected(c)}
                              className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition-all">
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => toggleBan(c.email)}
                              disabled={banning === c.email}
                              title={isBanned ? "Unban customer" : "Ban customer"}
                              className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${
                                isBanned ? "text-yellow-400 hover:bg-yellow-500/10" : "text-white/25 hover:text-red-400 hover:bg-red-500/10"
                              }`}>
                              {banning === c.email
                                ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                                : isBanned ? <Shield size={13} /> : <ShieldOff size={13} />
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && <CustomerModal customer={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
