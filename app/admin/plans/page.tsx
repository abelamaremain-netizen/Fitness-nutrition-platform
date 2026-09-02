"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X,
  Check, ChevronDown, Upload, ArrowUpDown,
} from "lucide-react";
import { ADMIN_PLANS, type AdminPlan } from "@/lib/admin-data";
import { PLANS, type DurationKey } from "@/lib/data";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function LevelBadge({ level }: { level: string }) {
  const s: Record<string, string> = {
    Normal: "bg-white/8 text-white/55",
    Pro:    "bg-white/12 text-white/75",
    VIP:    "bg-white/18 text-white",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${s[level]}`}>
      {level}
    </span>
  );
}

// ─── DURATION ROW in form ─────────────────────────────────────────────────────
const DURATION_OPTIONS: { key: DurationKey; label: string }[] = [
  { key: "1-week",   label: "1 Week" },
  { key: "1-month",  label: "1 Month" },
  { key: "3-months", label: "3 Months" },
  { key: "6-months", label: "6 Months" },
];

// ─── PLAN FORM MODAL ──────────────────────────────────────────────────────────
function PlanFormModal({
  plan, onClose,
}: {
  plan: AdminPlan | null;
  onClose: () => void;
}) {
  const isEdit = !!plan;
  const existing = plan ? PLANS.find((p) => p.id === plan.id) : null;

  const [form, setForm] = useState({
    title:       existing?.title       ?? "",
    description: existing?.description ?? "",
    goal:        existing?.goalLabel   ?? "Weight Loss",
    level:       (existing?.level      ?? "Normal") as "Normal" | "Pro" | "VIP",
    published:   plan?.published       ?? true,
    videoUrl:    existing?.videoUrl    ?? "",
    pdfNote:     "Upload PDF",
  });

  const [durations, setDurations] = useState<Record<DurationKey, { enabled: boolean; price: string }>>(
    DURATION_OPTIONS.reduce((acc, d) => {
      const existingDur = existing?.durations.find((ed) => ed.key === d.key);
      acc[d.key] = { enabled: !!existingDur, price: existingDur ? String(existingDur.price) : "" };
      return acc;
    }, {} as Record<DurationKey, { enabled: boolean; price: string }>)
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const inp = "w-full bg-[#0f0f0f] border border-white/[0.09] text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/30 transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.1]"
        style={{ background: "#111" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
            {isEdit ? "Edit Plan" : "New Plan"}
          </h2>
          <button onClick={onClose} className="text-white/35 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="field-label">Plan Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Fat Burn Express" className={inp} />
          </div>

          {/* Description */}
          <div>
            <label className="field-label">Short Description</label>
            <textarea rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description shown on plan cards..."
              className={`${inp} resize-none`} />
          </div>

          {/* Goal + Level row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Goal Category</label>
              <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className={inp}>
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Nutrition</option>
                <option>Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="field-label">Plan Level</label>
              <select value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as "Normal"|"Pro"|"VIP" })}
                className={inp}>
                <option>Normal</option>
                <option>Pro</option>
                <option>VIP</option>
              </select>
            </div>
          </div>

          {/* Duration pricing */}
          <div>
            <label className="field-label mb-3">Duration Options &amp; Pricing (ETB)</label>
            <div className="space-y-2">
              {DURATION_OPTIONS.map((d) => (
                <div key={d.key} className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => setDurations((prev) => ({
                      ...prev,
                      [d.key]: { ...prev[d.key], enabled: !prev[d.key].enabled },
                    }))}
                    className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 transition-all ${
                      durations[d.key].enabled
                        ? "bg-white border-white"
                        : "bg-transparent border-white/20 hover:border-white/50"
                    }`}>
                    {durations[d.key].enabled && <Check size={11} className="text-black" />}
                  </button>
                  <span className={`text-sm w-24 flex-shrink-0 ${durations[d.key].enabled ? "text-white/70" : "text-white/25"}`}>
                    {d.label}
                  </span>
                  <input
                    type="number"
                    disabled={!durations[d.key].enabled}
                    placeholder="Price in ETB"
                    value={durations[d.key].price}
                    onChange={(e) => setDurations((prev) => ({
                      ...prev,
                      [d.key]: { ...prev[d.key], price: e.target.value },
                    }))}
                    className={`${inp} flex-1 disabled:opacity-30 disabled:cursor-not-allowed`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="field-label">Video URL (YouTube / Vimeo)</label>
            <input type="url" value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..." className={inp} />
            <p className="text-white/20 text-[11px] mt-1.5 pl-1">
              This link is only revealed to customers after purchase.
            </p>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="field-label">PDF Guide</label>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-white/40 hover:text-white/70 transition-all">
              <Upload size={15} strokeWidth={1.5} />
              <span className="text-sm">Click to upload PDF — locked until payment</span>
            </button>
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between py-3 border-t border-white/[0.07]">
            <div>
              <p className="text-sm text-white font-medium">Published</p>
              <p className="text-[11px] text-white/30">Visible to customers on the shop page</p>
            </div>
            <button onClick={() => setForm({ ...form, published: !form.published })}
              className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${
                form.published ? "bg-white" : "bg-white/15"
              }`}>
              <motion.div animate={{ x: form.published ? 20 : 0 }}
                className={`w-5 h-5 rounded-full transition-colors ${form.published ? "bg-black" : "bg-white/40"}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="btn btn-outline flex-1 py-3">
              Cancel
            </button>
            <button onClick={handleSave}
              className="btn btn-white flex-1 py-3">
              {saved ? <><Check size={14} /> Saved!</> : isEdit ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── PLANS PAGE ───────────────────────────────────────────────────────────────
export default function AdminPlansPage() {
  const [plans,     setPlans]     = useState<AdminPlan[]>(ADMIN_PLANS);
  const [modal,     setModal]     = useState<"new" | AdminPlan | null>(null);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [search,    setSearch]    = useState("");

  const filtered = plans.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const togglePublish = (id: string) =>
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, published: !p.published } : p));

  const confirmDelete = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <>
      <div className="space-y-6 max-w-6xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              Plans
            </h1>
          </div>
          <button onClick={() => setModal("new")} className="btn btn-white py-2.5 px-5">
            <Plus size={14} /> New Plan
          </button>
        </div>

        {/* Search */}
        <input type="text" placeholder="Search plans…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-[#141414] border border-white/[0.09] text-white placeholder-white/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors" />

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {["Plan", "Level", "Goal", "Sales", "Revenue (ETB)", "Status", "Actions"].map((h) => (
                    <th key={h}
                      className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">
                      <span className="flex items-center gap-1">
                        {h}
                        {["Sales", "Revenue (ETB)"].includes(h) && <ArrowUpDown size={10} className="opacity-40" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((plan) => (
                  <tr key={plan.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm text-white font-medium">{plan.title}</p>
                      <p className="text-[11px] text-white/25 mt-0.5">{plan.createdAt}</p>
                    </td>
                    <td className="px-5 py-4">
                      <LevelBadge level={plan.level} />
                    </td>
                    <td className="px-5 py-4 text-sm text-white/50">{plan.goal}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white/70">{plan.sales}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white/70">
                      {plan.revenue.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => togglePublish(plan.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase transition-colors ${
                          plan.published ? "text-white/60 hover:text-white" : "text-white/25 hover:text-white/50"
                        }`}>
                        {plan.published
                          ? <><Eye size={12} /> Published</>
                          : <><EyeOff size={12} /> Hidden</>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(plan)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteId(plan.id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Plan form modal */}
      <AnimatePresence>
        {modal && (
          <PlanFormModal
            plan={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="card p-7 max-w-sm w-full text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Delete Plan?</h3>
              <p className="text-white/40 text-sm mb-6">
                This will permanently remove the plan and all its content. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn btn-outline flex-1 py-3">Cancel</button>
                <button onClick={() => confirmDelete(deleteId)}
                  className="flex-1 py-3 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-[11px] font-semibold tracking-widest uppercase transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
