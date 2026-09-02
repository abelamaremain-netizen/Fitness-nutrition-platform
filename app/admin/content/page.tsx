"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2, GripVertical, Upload, Save } from "lucide-react";
import { FAQS, TESTIMONIALS } from "@/lib/data";

// ─── SAVE BUTTON ─────────────────────────────────────────────────────────────
function SaveButton({ onSave }: { onSave: () => void }) {
  const [saved, setSaved] = useState(false);
  const handleClick = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <button onClick={handleClick} className="btn btn-white py-2.5 px-5">
      {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
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
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="text-white/30">
          ↑
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-white/[0.07]">
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inp = "w-full bg-[#0f0f0f] border border-white/[0.09] text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/25 transition-colors";
const ta = `${inp} resize-none`;

// ─── CONTENT PAGE ─────────────────────────────────────────────────────────────
export default function AdminContentPage() {

  // ── HERO ──
  const [hero, setHero] = useState({
    headline:    "Transform Your Body.",
    subheadline: "Own Your Results.",
    body:        "Expert-crafted fitness and nutrition plans by Naodi & Samri, tailored to your goals.",
    ctaPrimary:  "Calculate My BMI",
    ctaSecondary:"Browse Plans",
  });

  // ── ABOUT ──
  const [about, setAbout] = useState({
    naodiBio: "Naodi is a certified fitness coach specialising in body recomposition, strength training, and women's wellness. She built her own transformation first — and built this platform to share exactly what worked.",
    samriBio: "Samri is a nutrition specialist and certified personal trainer focused on sustainable diet plans, hormonal health, and helping women achieve lasting results through science-backed guidance.",
    mission:  "Making expert fitness accessible to everyone in Ethiopia.",
  });

  // ── FAQ ──
  const [faqs, setFaqs] = useState(FAQS.map((f, i) => ({ id: i, q: f.q, a: f.a })));

  const addFaq = () => setFaqs((prev) => [...prev, { id: Date.now(), q: "", a: "" }]);
  const removeFaq = (id: number) => setFaqs((prev) => prev.filter((f) => f.id !== id));
  const updateFaq = (id: number, field: "q" | "a", val: string) =>
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, [field]: val } : f));

  // ── TESTIMONIALS ──
  const [testimonials, setTestimonials] = useState(
    TESTIMONIALS.map((t) => ({ id: t.id, name: t.name, role: t.role, text: t.text, plan: t.plan }))
  );

  const addTestimonial = () => setTestimonials((prev) => [
    ...prev,
    { id: Date.now(), name: "", role: "", text: "", plan: "" },
  ]);
  const removeTestimonial = (id: number) => setTestimonials((prev) => prev.filter((t) => t.id !== id));
  const updateTestimonial = (id: number, field: string, val: string) =>
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, [field]: val } : t));

  // ── CONTACT ──
  const [contact, setContact] = useState({
    email:    "hello@naodiansamri.com",
    phone:    "+251 91 234 5678",
    whatsapp: "+251912345678",
    location: "Addis Ababa, Ethiopia",
  });

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-1">Management</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Content</h1>
        <p className="text-white/35 text-sm mt-1">Edit all static content — changes go live immediately.</p>
      </div>

      {/* ── HOMEPAGE HERO ─── */}
      <Section title="Homepage Hero" desc="The main banner on the home page">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Main Headline</label>
              <input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                className={inp} />
            </div>
            <div>
              <label className="field-label">Italic Sub-Headline</label>
              <input value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                className={inp} />
            </div>
          </div>
          <div>
            <label className="field-label">Body Text</label>
            <textarea rows={2} value={hero.body} onChange={(e) => setHero({ ...hero, body: e.target.value })}
              className={ta} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Primary CTA Button</label>
              <input value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })}
                className={inp} />
            </div>
            <div>
              <label className="field-label">Secondary CTA Button</label>
              <input value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })}
                className={inp} />
            </div>
          </div>
          <div>
            <label className="field-label">Hero Background Image</label>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-white/35 hover:text-white/60 transition-all text-sm">
              <Upload size={14} strokeWidth={1.5} /> Replace background image
            </button>
          </div>
          <div className="flex justify-end">
            <SaveButton onSave={() => {}} />
          </div>
        </div>
      </Section>

      {/* ── ABOUT US ─── */}
      <Section title="About Us" desc="Naodi & Samri bios and mission statement">
        <div className="space-y-5">
          <div>
            <label className="field-label">Mission Statement</label>
            <input value={about.mission} onChange={(e) => setAbout({ ...about, mission: e.target.value })}
              className={inp} />
          </div>
          <div>
            <label className="field-label">Naodi — Bio</label>
            <textarea rows={4} value={about.naodiBio}
              onChange={(e) => setAbout({ ...about, naodiBio: e.target.value })} className={ta} />
          </div>
          <div>
            <label className="field-label">Samri — Bio</label>
            <textarea rows={4} value={about.samriBio}
              onChange={(e) => setAbout({ ...about, samriBio: e.target.value })} className={ta} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Naodi — Profile Photo</label>
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-white/35 hover:text-white/60 transition-all text-sm">
                <Upload size={14} strokeWidth={1.5} /> Replace photo
              </button>
            </div>
            <div>
              <label className="field-label">Samri — Profile Photo</label>
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-white/35 hover:text-white/60 transition-all text-sm">
                <Upload size={14} strokeWidth={1.5} /> Replace photo
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <SaveButton onSave={() => {}} />
          </div>
        </div>
      </Section>

      {/* ── FAQ ─── */}
      <Section title="FAQ" desc={`${faqs.length} questions`}>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={faq.id} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <GripVertical size={14} className="text-white/15 mt-3 flex-shrink-0 cursor-grab" />
                <div className="flex-1 space-y-2">
                  <input value={faq.q} onChange={(e) => updateFaq(faq.id, "q", e.target.value)}
                    placeholder="Question" className={inp} />
                  <textarea rows={2} value={faq.a} onChange={(e) => updateFaq(faq.id, "a", e.target.value)}
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
            <SaveButton onSave={() => {}} />
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ─── */}
      <Section title="Testimonials" desc={`${testimonials.length} testimonials`}>
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
                <textarea rows={2} value={t.text}
                  onChange={(e) => updateTestimonial(t.id, "text", e.target.value)}
                  placeholder="What the customer said..." className={ta} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <label className="field-label">Plan Referenced</label>
                  <input value={t.plan} onChange={(e) => updateTestimonial(t.id, "plan", e.target.value)}
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
            <SaveButton onSave={() => {}} />
          </div>
        </div>
      </Section>

      {/* ── CONTACT INFO ─── */}
      <Section title="Contact Info" desc="Shown on the contact page">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Email</label>
              <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className={inp} />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className={inp} />
            </div>
            <div>
              <label className="field-label">WhatsApp Number</label>
              <input value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                placeholder="+251..." className={inp} />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input value={contact.location}
                onChange={(e) => setContact({ ...contact, location: e.target.value })}
                className={inp} />
            </div>
          </div>
          <div className="flex justify-end">
            <SaveButton onSave={() => {}} />
          </div>
        </div>
      </Section>

    </div>
  );
}
