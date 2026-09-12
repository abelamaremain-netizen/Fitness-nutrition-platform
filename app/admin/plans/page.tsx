"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Upload } from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";
import type { DurationKey } from "@/lib/data";

interface DBPlan {
  id: string;
  title: string;
  description: string;
  goal: string;
  level: string;
  published: boolean;
  created_at: string;
}

const DURATION_OPTIONS: { key: DurationKey; label: string }[] = [
  { key: "1-week",   label: "1 Week" },
  { key: "1-month",  label: "1 Month" },
  { key: "3-months", label: "3 Months" },
  { key: "6-months", label: "6 Months" },
];

const levelStyle: Record<string, string> = {
  Normal: "bg-white/8 text-white/55",
  Pro:    "bg-white/12 text-white/75",
  VIP:    "bg-white/18 text-white",
};

// ─── PLAN FORM MODAL ──────────────────────────────────────────────────────────
function PlanFormModal({
  plan, onClose, onSaved,
}: {
  plan: DBPlan | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!plan;

  const [form, setForm] = useState({
    title:            plan?.title       ?? "",
    description:      plan?.description ?? "",
    long_description: "",
    goal:             plan?.goal        ?? "lifestyle",
    level:            (plan?.level      ?? "Normal") as "Normal" | "Pro" | "VIP",
    published:        plan?.published   ?? true,
    featured:         false,
    bestseller:       false,
    video_url:        "",
    video_thumb:      "",
    tags:             "",
    includes:         "",
    // Recommendation engine fields
    suitable_for:     ["female", "male"] as string[],
    min_bmi:          "0",
    max_bmi:          "60",
    activity_levels:  ["sedentary", "light", "moderate", "active"] as string[],
  });

  const [durations, setDurations] = useState<Record<DurationKey, { enabled: boolean; price: string }>>(
    DURATION_OPTIONS.reduce((acc, d) => {
      acc[d.key] = { enabled: false, price: "" };
      return acc;
    }, {} as Record<DurationKey, { enabled: boolean; price: string }>)
  );

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  // Load existing durations when editing
  useEffect(() => {
    if (!plan) return;
    const supabase = createBrowserClient();
    supabase.from("plan_durations").select("*").eq("plan_id", plan.id).then(({ data }) => {
      if (!data) return;
      setDurations((prev) => {
        const next = { ...prev };
        for (const d of data) {
          if (next[d.key as DurationKey]) {
            next[d.key as DurationKey] = { enabled: true, price: String(d.price) };
          }
        }
        return next;
      });
    });
    // Also load full plan details
    supabase.from("plans").select("*").eq("id", plan.id).maybeSingle().then(({ data }) => {
      if (!data) return;
      setForm((prev) => ({
        ...prev,
        long_description: data.long_description ?? "",
        video_url:        data.video_url        ?? "",
        video_thumb:      data.video_thumb      ?? "",
        tags:             (data.tags   ?? []).join(", "),
        includes:         (data.includes ?? []).join("\n"),
        featured:         data.featured   ?? false,
        bestseller:       data.bestseller ?? false,
        suitable_for:     data.suitable_for     ?? ["female", "male"],
        min_bmi:          String(data.min_bmi   ?? 0),
        max_bmi:          String(data.max_bmi   ?? 60),
        activity_levels:  data.activity_levels  ?? ["sedentary", "light", "moderate", "active"],
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    const supabase = createBrowserClient();
    try {
      const goalMap: Record<string, string> = {
        "Weight Loss":  "weight-loss",
        "Muscle Gain":  "muscle-gain",
        "Nutrition":    "nutrition",
        "Lifestyle":    "lifestyle",
      };
      const goalKey = goalMap[form.goal] ?? form.goal;

      const payload = {
        title:            form.title.trim(),
        description:      form.description.trim(),
        long_description: form.long_description.trim(),
        goal:             goalKey as "weight-loss" | "muscle-gain" | "nutrition" | "lifestyle",
        level:            form.level.toLowerCase() as "normal" | "pro" | "vip",
        published:        form.published,
        featured:         form.featured,
        bestseller:       form.bestseller,
        video_url:        form.video_url.trim() || null,
        video_thumb:      form.video_thumb.trim() || null,
        tags:             form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        includes:         form.includes.split("\n").map((t) => t.trim()).filter(Boolean),
        suitable_for:     form.suitable_for,
        min_bmi:          parseFloat(form.min_bmi) || 0,
        max_bmi:          parseFloat(form.max_bmi) || 60,
        activity_levels:  form.activity_levels,
        updated_at:       new Date().toISOString(),
      };

      let planId = plan?.id;

      if (isEdit) {
        const { error: e } = await supabase.from("plans").update(payload).eq("id", plan!.id);
        if (e) throw e;
      } else {
        const { data, error: e } = await supabase.from("plans").insert(payload).select("id").single();
        if (e) throw e;
        planId = data.id;
      }

      // Upsert durations
      if (planId) {
        await supabase.from("plan_durations").delete().eq("plan_id", planId);
        const durationRows = DURATION_OPTIONS
          .filter((d) => durations[d.key].enabled && durations[d.key].price)
          .map((d, i) => ({
            plan_id:    planId as string,
            key:        d.key,
            label:      d.label,
            price:      parseInt(durations[d.key].price, 10),
            sort_order: i + 1,
          }));
        if (durationRows.length > 0) {
          const { error: de } = await supabase.from("plan_durations").insert(durationRows);
          if (de) throw de;
        }
      }

      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full bg-[#0f0f0f] border border-white/[0.09] text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/30 transition-colors";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 16 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.1]"
        style={{ background: "#111" }}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
            {isEdit ? "Edit Plan" : "New Plan"}
          </h2>
          <button onClick={onClose} className="text-white/35 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="field-label">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Fat Burn Express" className={inp} />
          </div>

          {/* Description */}
          <div>
            <label className="field-label">Short Description (shown on cards)</label>
            <textarea rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description..." className={`${inp} resize-none`} />
          </div>

          {/* Long description */}
          <div>
            <label className="field-label">Full Description (shown on detail page)</label>
            <textarea rows={4} value={form.long_description}
              onChange={(e) => setForm({ ...form, long_description: e.target.value })}
              placeholder="Detailed description..." className={`${inp} resize-none`} />
          </div>

          {/* Goal + Level — REQUIRED, shown prominently at top */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/[0.12] bg-white/[0.02]">
            <div>
              <label className="field-label">Goal <span className="text-red-400">*</span></label>
              <p className="text-white/25 text-[10px] mb-2">Used for filtering on the shop page</p>
              <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className={inp}>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="nutrition">Nutrition</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="field-label">Level <span className="text-red-400">*</span></label>
              <p className="text-white/25 text-[10px] mb-2">Normal = basic, Pro = detailed, VIP = premium</p>
              <select value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as "Normal"|"Pro"|"VIP" })}
                className={inp}>
                <option>Normal</option>
                <option>Pro</option>
                <option>VIP</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="field-label">Tags (comma separated)</label>
            <input type="text" value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="Cardio, HIIT, Fat Loss" className={inp} />
          </div>

          {/* Includes */}
          <div>
            <label className="field-label">What&apos;s Included (one per line)</label>
            <textarea rows={4} value={form.includes}
              onChange={(e) => setForm({ ...form, includes: e.target.value })}
              placeholder={"Detailed PDF workout guide\nVideo demonstrations\n..."}
              className={`${inp} resize-none`} />
          </div>

          {/* ── RECOMMENDATION ENGINE FIELDS ── */}
          <div className="p-4 rounded-xl border border-white/[0.12] bg-white/[0.02] space-y-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-1">
                Recommendation Engine
              </p>
              <p className="text-white/25 text-[11px]">
                These fields power the personalised plan matching on the Fitness Plan and Meal Plan pages.
                Fill them in accurately so customers get matched to the right plan.
              </p>
            </div>

            {/* Suitable for */}
            <div>
              <label className="field-label">Suitable For</label>
              <div className="flex gap-3 mt-1">
                {(["female", "male"] as const).map((g) => (
                  <button key={g} type="button"
                    onClick={() => setForm((prev) => {
                      const already = prev.suitable_for.includes(g);
                      return {
                        ...prev,
                        suitable_for: already
                          ? prev.suitable_for.filter((v) => v !== g)
                          : [...prev.suitable_for, g],
                      };
                    })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                      form.suitable_for.includes(g)
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/40 border-white/15 hover:border-white/35"
                    }`}>
                    {g === "female" ? "👩 Female" : "👨 Male"}
                  </button>
                ))}
              </div>
              <p className="text-white/22 text-[11px] mt-1.5">Select all genders this plan is suitable for.</p>
            </div>

            {/* BMI Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Min BMI</label>
                <input type="number" value={form.min_bmi}
                  onChange={(e) => setForm({ ...form, min_bmi: e.target.value })}
                  placeholder="e.g. 18" className={inp} />
                <p className="text-white/22 text-[11px] mt-1">Lowest BMI this plan suits</p>
              </div>
              <div>
                <label className="field-label">Max BMI</label>
                <input type="number" value={form.max_bmi}
                  onChange={(e) => setForm({ ...form, max_bmi: e.target.value })}
                  placeholder="e.g. 35" className={inp} />
                <p className="text-white/22 text-[11px] mt-1">Highest BMI this plan suits</p>
              </div>
            </div>
            <p className="text-white/25 text-[11px] -mt-2">
              BMI guide: Underweight &lt;18.5 | Normal 18.5–24.9 | Overweight 25–29.9 | Obese ≥30
            </p>

            {/* Activity Levels */}
            <div>
              <label className="field-label">Suitable Activity Levels</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  { v: "sedentary", l: "Sedentary", s: "Little/no exercise" },
                  { v: "light",     l: "Light",     s: "1–3 days/week" },
                  { v: "moderate",  l: "Moderate",  s: "3–5 days/week" },
                  { v: "active",    l: "Very Active",s: "6–7 days/week" },
                ].map((a) => (
                  <button key={a.v} type="button"
                    onClick={() => setForm((prev) => {
                      const has = prev.activity_levels.includes(a.v);
                      return {
                        ...prev,
                        activity_levels: has
                          ? prev.activity_levels.filter((v) => v !== a.v)
                          : [...prev.activity_levels, a.v],
                      };
                    })}
                    className={`px-3 py-2 rounded-xl text-left border transition-all ${
                      form.activity_levels.includes(a.v)
                        ? "bg-white/10 border-white/40 text-white"
                        : "bg-transparent border-white/10 text-white/40 hover:border-white/25"
                    }`}>
                    <p className="text-[11px] font-semibold">{a.l}</p>
                    <p className="text-[10px] text-white/30">{a.s}</p>
                  </button>
                ))}
              </div>
              <p className="text-white/22 text-[11px] mt-1.5">Who is this plan designed for?</p>
            </div>

            {/* Featured + Bestseller */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.09]">
                <div>
                  <p className="text-sm text-white font-medium">Featured</p>
                  <p className="text-[10px] text-white/30">Shown on home page</p>
                </div>
                <button type="button"
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`w-9 h-5 rounded-full transition-all flex items-center px-0.5 ${form.featured ? "bg-white" : "bg-white/15"}`}>
                  <motion.div animate={{ x: form.featured ? 16 : 0 }}
                    className={`w-4 h-4 rounded-full ${form.featured ? "bg-black" : "bg-white/40"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.09]">
                <div>
                  <p className="text-sm text-white font-medium">Bestseller</p>
                  <p className="text-[10px] text-white/30">Shows bestseller badge</p>
                </div>
                <button type="button"
                  onClick={() => setForm({ ...form, bestseller: !form.bestseller })}
                  className={`w-9 h-5 rounded-full transition-all flex items-center px-0.5 ${form.bestseller ? "bg-white" : "bg-white/15"}`}>
                  <motion.div animate={{ x: form.bestseller ? 16 : 0 }}
                    className={`w-4 h-4 rounded-full ${form.bestseller ? "bg-black" : "bg-white/40"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Durations */}
          <div>
            <label className="field-label mb-3">Durations &amp; Prices (ETB)</label>
            <div className="space-y-2">
              {DURATION_OPTIONS.map((d) => (
                <div key={d.key} className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => setDurations((prev) => ({
                      ...prev, [d.key]: { ...prev[d.key], enabled: !prev[d.key].enabled },
                    }))}
                    className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 transition-all ${
                      durations[d.key].enabled ? "bg-white border-white" : "bg-transparent border-white/20 hover:border-white/50"
                    }`}>
                    {durations[d.key].enabled && <Check size={11} className="text-black" />}
                  </button>
                  <span className={`text-sm w-24 flex-shrink-0 ${durations[d.key].enabled ? "text-white/70" : "text-white/25"}`}>
                    {d.label}
                  </span>
                  <input type="number" disabled={!durations[d.key].enabled} placeholder="Price in ETB"
                    value={durations[d.key].price}
                    onChange={(e) => setDurations((prev) => ({
                      ...prev, [d.key]: { ...prev[d.key], price: e.target.value },
                    }))}
                    className={`${inp} flex-1 disabled:opacity-30 disabled:cursor-not-allowed`} />
                </div>
              ))}
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="field-label">Video URL (hidden until payment)</label>
            <input type="url" value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..." className={inp} />
          </div>

          {/* Video Thumbnail */}
          <div>
            <label className="field-label">Video Thumbnail URL</label>
            <input type="url" value={form.video_thumb}
              onChange={(e) => setForm({ ...form, video_thumb: e.target.value })}
              placeholder="https://img.youtube.com/vi/.../hqdefault.jpg" className={inp} />
          </div>

          {/* PDF */}
          <div>
            <label className="field-label">PDF Guide</label>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-white/40 hover:text-white/70 transition-all">
              <Upload size={15} strokeWidth={1.5} />
              <span className="text-sm">Click to upload PDF (Supabase Storage)</span>
            </button>
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between py-3 border-t border-white/[0.07]">
            <div>
              <p className="text-sm text-white font-medium">Published</p>
              <p className="text-[11px] text-white/30">Visible to customers on the shop page</p>
            </div>
            <button onClick={() => setForm({ ...form, published: !form.published })}
              className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${form.published ? "bg-white" : "bg-white/15"}`}>
              <motion.div animate={{ x: form.published ? 20 : 0 }}
                className={`w-5 h-5 rounded-full transition-colors ${form.published ? "bg-black" : "bg-white/40"}`} />
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-red-400/80 text-xs">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn btn-outline flex-1 py-3">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn btn-white flex-1 py-3">
              {saving
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : isEdit ? "Save Changes" : "Create Plan"
              }
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── PLANS PAGE ───────────────────────────────────────────────────────────────
export default function AdminPlansPage() {
  const [plans,    setPlans]    = useState<DBPlan[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState<"new" | DBPlan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search,   setSearch]   = useState("");

  const loadPlans = async () => {
    const supabase = createBrowserClient();
    setLoading(true);
    const { data } = await supabase
      .from("plans").select("id, title, description, goal, level, published, created_at")
      .order("created_at", { ascending: false });
    setPlans((data as DBPlan[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadPlans(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = plans.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const togglePublish = async (id: string, current: boolean) => {
    const supabase = createBrowserClient();
    await supabase.from("plans").update({ published: !current }).eq("id", id);
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, published: !current } : p));
  };

  const confirmDelete = async (id: string) => {
    const supabase = createBrowserClient();
    await supabase.from("plans").delete().eq("id", id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Plans</h1>
          </div>
          <button onClick={() => setModal("new")} className="btn btn-white py-2.5 px-5">
            <Plus size={14} /> New Plan
          </button>
        </div>

        <input type="text" placeholder="Search plans…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-[#141414] border border-white/[0.09] text-white placeholder-white/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors" />

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-16">
                {plans.length === 0 ? "No plans yet. Create your first plan." : "No plans match your search."}
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {["Plan", "Level", "Goal", "Status", "Created", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((plan) => (
                    <tr key={plan.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm text-white font-medium">{plan.title}</p>
                        <p className="text-[11px] text-white/25 mt-0.5 max-w-[220px] truncate">{plan.description}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${levelStyle[plan.level] ?? "bg-white/8 text-white/55"}`}>
                          {plan.level}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/50 capitalize">{plan.goal.replace("-", " ")}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => togglePublish(plan.id, plan.published)}
                          className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase transition-colors ${
                            plan.published ? "text-white/60 hover:text-white" : "text-white/25 hover:text-white/50"
                          }`}>
                          {plan.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Hidden</>}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-[11px] text-white/30">
                        {new Date(plan.created_at).toLocaleDateString("en-GB")}
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
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <PlanFormModal
            plan={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={loadPlans}
          />
        )}
      </AnimatePresence>

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
              <p className="text-white/40 text-sm mb-6">This will permanently remove the plan. This cannot be undone.</p>
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
