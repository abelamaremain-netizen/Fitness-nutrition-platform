"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2, GripVertical, Upload, Save, Loader2 } from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Faq { id: string; question: string; answer: string; sort_order: number; }
interface Testimonial { id: string; name: string; role: string; text: string; plan_name: string; }
interface SiteContentMap { [key: string]: string; }

// ─── SAVE BUTTON ─────────────────────────────────────────────────────────────
function SaveButton({ onSave, label = "Save Changes" }: { onSave: () => Promise<void>; label?: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const handleClick = async () => {
    setState("saving");
    await onSave();
    setState("saved");
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button onClick={handleClick} disabled={state === "saving"} className="btn btn-white py-2.5 px-5">
      {state === "saving" && <Loader2 size={14} className="animate-spin" />}
      {state === "saved"  && <><Check size={14} /> Saved!</>}
      {state === "idle"   && <><Save size={14} /> {label}</>}
    </button>
  );
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors">
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          {desc && <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>}
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="text-white/30 text-xs">↑</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden border-t border-white/[0.07]">
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inp = "w-full bg-[#0f0f0f] border border-white/[0.09] text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors";
const ta  = `${inp} resize-none`;

// ─── CONTENT PAGE ────────────────────────────────────────────────────────────
export default function AdminContentPage() {
  const [loading,      setLoading]      = useState(true);
  const [content,      setContent]      = useState<SiteContentMap>({});
  const [faqs,         setFaqs]         = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Load all data on mount
  useEffect(() => {
    const supabase = createBrowserClient();
    Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase.from("faqs").select("*").order("sort_order"),
      supabase.from("testimonials").select("id, name, role, text, plan_name").order("sort_order"),
    ]).then(([contentRes, faqRes, testRes]) => {
      const map: SiteContentMap = {};
      for (const row of contentRes.data ?? []) map[row.key] = row.value;
      setContent(map);
      setFaqs((faqRes.data as Faq[]) ?? []);
      setTestimonials((testRes.data as Testimonial[]) ?? []);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setKey = (key: string, value: string) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  // ── SAVE HANDLERS ─────────────────────────────────────────────────────────
  const saveHero = async () => {
    const supabase = createBrowserClient();
    const keys = ["hero_headline","hero_subheadline","hero_body","hero_cta_primary","hero_cta_secondary"];
    await Promise.all(keys.map((k) =>
      supabase.from("site_content").upsert({ key: k, value: content[k] ?? "" }, { onConflict: "key" })
    ));
  };

  const saveAbout = async () => {
    const supabase = createBrowserClient();
    const keys = ["mission_statement","naodi_bio","samri_bio"];
    await Promise.all(keys.map((k) =>
      supabase.from("site_content").upsert({ key: k, value: content[k] ?? "" }, { onConflict: "key" })
    ));
  };

  const saveContact = async () => {
    const supabase = createBrowserClient();
    const keys = ["contact_email","contact_phone","contact_whatsapp","contact_location",
                  "social_instagram","social_youtube","social_tiktok"];
    await Promise.all(keys.map((k) =>
      supabase.from("site_content").upsert({ key: k, value: content[k] ?? "" }, { onConflict: "key" })
    ));
  };

  const saveFaqs = async () => {
    const supabase = createBrowserClient();
    await supabase.from("faqs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const rows = faqs.map((f, i) => ({
      id:         f.id.startsWith("new-") ? undefined : f.id,
      question:   f.question,
      answer:     f.answer,
      sort_order: i + 1,
    }));
    if (rows.length > 0) await supabase.from("faqs").upsert(rows);
  };

  const saveTestimonials = async () => {
    const supabase = createBrowserClient();
    const rows = testimonials.map((t, i) => ({
      id:         t.id.startsWith("new-") ? undefined : t.id,
      name:       t.name,
      role:       t.role,
      text:       t.text,
      plan_name:  t.plan_name,
      sort_order: i + 1,
    }));
    await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (rows.length > 0) await supabase.from("testimonials").upsert(rows);
  };

  // ── FAQ helpers ──
  const addFaq = () => setFaqs((prev) => [...prev, { id: `new-${Date.now()}`, question: "", answer: "", sort_order: prev.length + 1 }]);
  const removeFaq = (id: string) => setFaqs((prev) => prev.filter((f) => f.id !== id));
  const updateFaq = (id: string, field: "question"|"answer", val: string) =>
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, [field]: val } : f));

  // ── Testimonial helpers ──
  const addTestimonial = () => setTestimonials((prev) => [...prev, { id: `new-${Date.now()}`, name: "", role: "", text: "", plan_name: "" }]);
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id));
  const updateTestimonial = (id: string, field: string, val: string) =>
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, [field]: val } : t));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Content</h1>
        <p className="text-white/35 text-sm mt-1">Changes go live immediately after saving.</p>
      </div>

      {/* ── HOMEPAGE HERO ── */}
      <Section title="Homepage Hero" desc="Main banner on the home page">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Main Headline</label>
              <input value={content.hero_headline ?? ""} onChange={(e) => setKey("hero_headline", e.target.value)} className={inp} placeholder="Transform Your Body." />
            </div>
            <div>
              <label className="field-label">Italic Sub-Headline</label>
              <input value={content.hero_subheadline ?? ""} onChange={(e) => setKey("hero_subheadline", e.target.value)} className={inp} placeholder="Own Your Results." />
            </div>
          </div>
          <div>
            <label className="field-label">Body Text</label>
            <textarea rows={2} value={content.hero_body ?? ""} onChange={(e) => setKey("hero_body", e.target.value)} className={ta} placeholder="Expert-crafted plans by Naodi & Samri..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Primary CTA</label>
              <input value={content.hero_cta_primary ?? ""} onChange={(e) => setKey("hero_cta_primary", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="field-label">Secondary CTA</label>
              <input value={content.hero_cta_secondary ?? ""} onChange={(e) => setKey("hero_cta_secondary", e.target.value)} className={inp} />
            </div>
          </div>
          <div className="flex justify-end">
            <SaveButton onSave={saveHero} />
          </div>
        </div>
      </Section>

      {/* ── ABOUT US ── */}
      <Section title="About Us" desc="Mission and bios">
        <div className="space-y-4">
          <div>
            <label className="field-label">Mission Statement</label>
            <input value={content.mission_statement ?? ""} onChange={(e) => setKey("mission_statement", e.target.value)} className={inp} />
          </div>
          <div>
            <label className="field-label">Naodi — Bio</label>
            <textarea rows={4} value={content.naodi_bio ?? ""} onChange={(e) => setKey("naodi_bio", e.target.value)} className={ta} />
          </div>
          <div>
            <label className="field-label">Samri — Bio</label>
            <textarea rows={4} value={content.samri_bio ?? ""} onChange={(e) => setKey("samri_bio", e.target.value)} className={ta} />
          </div>
          <div className="flex justify-end">
            <SaveButton onSave={saveAbout} />
          </div>
        </div>
      </Section>

      {/* ── CONTACT INFO ── */}
      <Section title="Contact Info" desc="Shown on the contact page">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Email</label>
              <input value={content.contact_email ?? ""} onChange={(e) => setKey("contact_email", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input value={content.contact_phone ?? ""} onChange={(e) => setKey("contact_phone", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="field-label">WhatsApp Number</label>
              <input value={content.contact_whatsapp ?? ""} onChange={(e) => setKey("contact_whatsapp", e.target.value)} placeholder="+251..." className={inp} />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input value={content.contact_location ?? ""} onChange={(e) => setKey("contact_location", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="field-label">Instagram URL</label>
              <input value={content.social_instagram ?? ""} onChange={(e) => setKey("social_instagram", e.target.value)} placeholder="https://instagram.com/..." className={inp} />
            </div>
            <div>
              <label className="field-label">TikTok URL</label>
              <input value={content.social_tiktok ?? ""} onChange={(e) => setKey("social_tiktok", e.target.value)} placeholder="https://tiktok.com/..." className={inp} />
            </div>
          </div>
          <div className="flex justify-end">
            <SaveButton onSave={saveContact} />
          </div>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section title="FAQ" desc={`${faqs.length} questions`}>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <motion.div key={faq.id} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <GripVertical size={14} className="text-white/15 mt-3 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <input value={faq.question} onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                    placeholder="Question" className={inp} />
                  <textarea rows={2} value={faq.answer} onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                    placeholder="Answer" className={ta} />
                </div>
                <button onClick={() => removeFaq(faq.id)}
                  className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1 flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
          <button onClick={addFaq}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 hover:border-white/30 text-white/30 hover:text-white/60 text-sm transition-all">
            <Plus size={14} /> Add Question
          </button>
          <div className="flex justify-end pt-2">
            <SaveButton onSave={saveFaqs} />
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section title="Testimonials" desc={`${testimonials.length} entries`}>
        <div className="space-y-4">
          {testimonials.map((t) => (
            <motion.div key={t.id} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Name</label>
                  <input value={t.name} onChange={(e) => updateTestimonial(t.id, "name", e.target.value)}
                    placeholder="Customer name" className={inp} />
                </div>
                <div>
                  <label className="field-label">Role / Result</label>
                  <input value={t.role} onChange={(e) => updateTestimonial(t.id, "role", e.target.value)}
                    placeholder="e.g. Lost 12kg in 3 months" className={inp} />
                </div>
              </div>
              <div>
                <label className="field-label">Testimonial Text</label>
                <textarea rows={2} value={t.text} onChange={(e) => updateTestimonial(t.id, "text", e.target.value)}
                  placeholder="What the customer said..." className={ta} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="field-label">Plan Referenced</label>
                  <input value={t.plan_name} onChange={(e) => updateTestimonial(t.id, "plan_name", e.target.value)}
                    placeholder="Plan name" className={inp} />
                </div>
                <button onClick={() => removeTestimonial(t.id)}
                  className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all self-end mb-0.5">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
          <button onClick={addTestimonial}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 hover:border-white/30 text-white/30 hover:text-white/60 text-sm transition-all">
            <Plus size={14} /> Add Testimonial
          </button>
          <div className="flex justify-end pt-2">
            <SaveButton onSave={saveTestimonials} />
          </div>
        </div>
      </Section>
    </div>
  );
}
