"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Shield, ShieldOff, Eye } from "lucide-react";
import { CUSTOMERS, type Customer } from "@/lib/admin-data";

// ─── BMI LABEL ────────────────────────────────────────────────────────────────
function BmiLabel({ bmi }: { bmi: number }) {
  const cat =
    bmi < 18.5 ? { l: "Underweight", c: "text-blue-400" } :
    bmi < 25   ? { l: "Normal",      c: "text-white/60" } :
    bmi < 30   ? { l: "Overweight",  c: "text-yellow-400" } :
                 { l: "Obese",       c: "text-red-400" };
  return <span className={`text-[11px] font-semibold ${cat.c}`}>{bmi} — {cat.l}</span>;
}

// ─── CUSTOMER DETAIL MODAL ────────────────────────────────────────────────────
function CustomerModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { health: h } = customer;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.1]"
        style={{ background: "#111" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              {customer.name}
            </h2>
            <p className="text-[11px] text-white/30 mt-0.5">{customer.email} · {customer.id}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-7">
          {/* Account info */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/30 mb-4">
              Account
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Joined",       v: customer.joinedDate },
                { l: "Last Active",  v: customer.lastActive },
                { l: "Plans Owned",  v: String(customer.plansOwned) },
                { l: "Total Spent",  v: `${customer.totalSpent.toLocaleString()} ETB` },
              ].map((row) => (
                <div key={row.l} className="card p-3">
                  <p className="text-[10px] text-white/25 font-semibold tracking-widest uppercase mb-1">{row.l}</p>
                  <p className="text-sm text-white/70 font-medium">{row.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Health profile */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/30 mb-4">
              Health Profile
            </p>
            <div className="space-y-3">
              {[
                { l: "Gender",         v: h.gender },
                { l: "Age",            v: `${h.age} years` },
                { l: "Weight / Height",v: `${h.weight} kg / ${h.height} cm` },
                { l: "BMI",            v: <BmiLabel bmi={h.bmi} /> },
                { l: "Goal",           v: h.goal },
                { l: "Activity Level", v: h.activityLevel },
                { l: "Health Conditions", v: h.conditions.join(", ") || "None" },
                { l: "Allergies",      v: h.allergies.join(", ") || "None" },
              ].map((row) => (
                <div key={row.l} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-white/25 flex-shrink-0 w-36">{row.l}</p>
                  <p className="text-sm text-white/65 text-right">{row.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning if conditions */}
          {h.conditions.some((c) => c !== "None") && (
            <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4 flex items-start gap-3">
              <Shield size={15} className="text-yellow-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-yellow-400/80 text-xs leading-relaxed">
                This customer has reported health conditions: <strong>{h.conditions.join(", ")}</strong>.
                Ensure recommended plans are appropriate.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <button onClick={onClose} className="btn btn-white w-full py-3">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [search,    setSearch]    = useState("");
  const [goal,      setGoal]      = useState("all");
  const [selected,  setSelected]  = useState<Customer | null>(null);
  const [banned,    setBanned]    = useState<Set<string>>(new Set());

  const filtered = useMemo(() => customers.filter((c) => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchGoal = goal === "all" || c.health.goal === goal;
    return matchSearch && matchGoal;
  }), [customers, search, goal]);

  const toggleBan = (id: string) =>
    setBanned((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const inp = "bg-[#141414] border border-white/[0.09] text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors";

  return (
    <>
      <div className="space-y-6 max-w-6xl">

        {/* Header */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Customers</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md">
          {[
            { l: "Total",    v: customers.length },
            { l: "Active",   v: customers.filter((c) => c.plansOwned > 0).length },
            { l: "No Plans", v: customers.filter((c) => c.plansOwned === 0).length },
          ].map((s) => (
            <div key={s.l} className="card p-4 text-center">
              <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-serif)" }}>{s.v}</p>
              <p className="text-[10px] tracking-widest uppercase text-white/30 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search by name or email…" value={search}
              onChange={(e) => setSearch(e.target.value)} className={`${inp} pl-9 w-full`} />
          </div>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={inp}>
            <option value="all">All Goals</option>
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
            <option>Nutrition</option>
            <option>Lifestyle</option>
          </select>
          {(search || goal !== "all") && (
            <button onClick={() => { setSearch(""); setGoal("all"); }}
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {["Customer", "Goal", "BMI", "Plans", "Spent (ETB)", "Joined", "Actions"].map((h) => (
                    <th key={h}
                      className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const isBanned = banned.has(c.id);
                  return (
                    <tr key={c.id}
                      className={`border-b border-white/[0.04] transition-colors ${isBanned ? "opacity-40" : "hover:bg-white/[0.02]"}`}>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-white/80 font-medium">{c.name}</p>
                        <p className="text-[11px] text-white/25">{c.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/45">{c.health.goal}</td>
                      <td className="px-5 py-3.5"><BmiLabel bmi={c.health.bmi} /></td>
                      <td className="px-5 py-3.5 text-sm text-white/60">{c.plansOwned}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-white/70">
                        {c.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-white/30">{c.joinedDate}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(c)}
                            className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition-all">
                            <Eye size={13} />
                          </button>
                          <button onClick={() => toggleBan(c.id)}
                            title={isBanned ? "Unban" : "Ban"}
                            className={`p-1.5 rounded-lg transition-all ${
                              isBanned
                                ? "text-yellow-400 hover:bg-yellow-500/10"
                                : "text-white/25 hover:text-red-400 hover:bg-red-500/10"
                            }`}>
                            {isBanned ? <Shield size={13} /> : <ShieldOff size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-white/25 text-sm">No customers match your filters.</div>
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
