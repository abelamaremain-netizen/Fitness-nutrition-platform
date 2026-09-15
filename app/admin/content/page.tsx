"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2, GripVertical, Save, Loader2, Eye, EyeOff, Pencil, Star } from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Faq          { id: string; question: string; answer: string; sort_order: number; }
interface Testimonial  { id: string; name: string; role: string; text: string; plan_name: string; rating: number; }
interface TeamMember   { id: string; name: string; role: string; bio: string; image_url: string; sort_order: number; }
interface BlogPost     { id: string; title: string; excerpt: string; body: string; category: string; author: string; published: boolean; }
interface SiteContentMap { [key: string]: string; }

// ─── API HELPER ──────────────────────────────────────────────────────────────
async function adminApi(action: string, payload: unknown): Promise<void> {
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `API error ${res.status}`);
  }
}

// ─── SAVE BUTTON ─────────────────────────────────────────────────────────────
function SaveButton({ onSave, label = "Save Changes" }: { onSave: () => Promise<void>; label?: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleClick = async () => {
    setState("saving");
    setErrMsg("");
    try {
      await onSave();
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Save failed");
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={handleClick} disabled={state === "saving"} className="btn btn-white py-2.5 px-5">
        {state === "saving" && <Loader2 size={14} className="animate-spin" />}
        {state === "saved"  && <><Check size={14} /> Saved!</>}
        {state === "error"  && <span className="text-red-400">✗ Failed</span>}
        {state === "idle"   && <><Save size={14} /> {label}</>}
      </button>
      {state === "error" && errMsg && (
        <p className="text-red-400/80 text-[11px]">{errMsg}</p>
      )}
    </div>
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
  const [teamMembers,  setTeamMembers]  = useState<TeamMember[]>([]);
  const [blogPosts,    setBlogPosts]    = useState<BlogPost[]>([]);
  const [editingPost,  setEditingPost]  = useState<BlogPost | null>(null);

  // Load all data on mount — reads use anon key (RLS allows public reads)
  useEffect(() => {
    const supabase = createBrowserClient();
    Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase.from("faqs").select("*").order("sort_order"),
      supabase.from("testimonials").select("id, name, role, text, plan_name, rating").order("sort_order"),
      supabase.from("team_members").select("*").order("sort_order"),
      supabase.from("blog_posts").select("id, title, excerpt, body, category, author, published").order("created_at", { ascending: false }),
    ]).then(([contentRes, faqRes, testRes, teamRes, blogRes]) => {
      const map: SiteContentMap = {};
      for (const row of contentRes.data ?? []) map[row.key] = row.value;
      setContent(map);
      setFaqs((faqRes.data as Faq[]) ?? []);
      setTestimonials((testRes.data as Testimonial[]) ?? []);
      setTeamMembers((teamRes.data as TeamMember[]) ?? []);
      setBlogPosts((blogRes.data as BlogPost[]) ?? []);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setKey = (key: string, value: string) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  // ── SAVE HANDLERS — all go through /api/admin/content (service role key) ──

  const saveSiteContentKeys = (keys: string[]) => async () => {
    const rows = keys.map((k) => ({ key: k, value: content[k] ?? "" }));
    await adminApi("upsert_site_content", rows);
  };

  const saveHero    = saveSiteContentKeys(["hero_headline","hero_subheadline","hero_body","hero_cta_primary","hero_cta_secondary"]);
  const saveStats   = saveSiteContentKeys([
    "stat_plans_sold_value","stat_plans_sold_suffix","stat_plans_sold_label",
    "stat_satisfaction_value","stat_satisfaction_suffix","stat_satisfaction_label",
    "stat_expert_plans_value","stat_expert_plans_suffix","stat_expert_plans_label",
    "stat_happy_clients_value","stat_happy_clients_suffix","stat_happy_clients_label",
  ]);
  const saveMission = saveSiteContentKeys(["mission_statement"]);
  const saveContact = saveSiteContentKeys([
    "contact_email","contact_phone","contact_whatsapp","contact_location",
    "social_instagram","social_youtube","social_tiktok",
    "telebirr_phone","telebirr_name","cbe_account","cbe_name","support_email","whatsapp_number",
  ]);
  const saveTerms   = saveSiteContentKeys(["terms_content"]);
  const savePrivacy = saveSiteContentKeys(["privacy_content"]);

  const saveFaqs = async () => {
    await adminApi("save_faqs", {
      faqs: faqs.map((f, i) => ({ question: f.question, answer: f.answer, sort_order: i + 1 })),
    });
  };

  const saveTestimonials = async () => {
    await adminApi("save_testimonials", {
      testimonials: testimonials.map((t, i) => ({
        name:       t.name,
        role:       t.role,
        text:       t.text,
        plan_name:  t.plan_name,
        rating:     t.rating || 5,
        sort_order: i + 1,
      })),
    });
  };

  const saveTeamMembers = async () => {
    await adminApi("save_team_members", {
      members: teamMembers.map((m, i) => ({
        name:       m.name,
        role:       m.role,
        bio:        m.bio,
        image_url:  m.image_url || null,
        sort_order: i + 1,
      })),
    });
  };

  // ── Blog helpers ──
  const saveBlogPost = async (post: BlogPost) => {
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_blog_post", payload: { post: { ...post, id: post.id.startsWith("new-") ? undefined : post.id } } }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (post.id.startsWith("new-") && data.id) {
      setBlogPosts((prev) => prev.map((p) => p.id === post.id ? { ...post, id: data.id } : p));
    }
    setEditingPost(null);
  };

  const deleteBlogPost = async (id: string) => {
    await adminApi("delete_blog_post", { id });
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleBlogPublish = async (id: string, current: boolean) => {
    await adminApi("toggle_blog_publish", { id, published: !current });
    setBlogPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: !current } : p));
  };

  const startNewPost = () => {
    const draft: BlogPost = { id: `new-${Date.now()}`, title: "", excerpt: "", body: "", category: "General", author: "Naodi & Samri", published: false };
    setBlogPosts((prev) => [draft, ...prev]);
    setEditingPost(draft);
  };

  // ── FAQ helpers ──
  const addFaq    = () => setFaqs((prev) => [...prev, { id: `new-${Date.now()}`, question: "", answer: "", sort_order: prev.length + 1 }]);
  const removeFaq = (id: string) => setFaqs((prev) => prev.filter((f) => f.id !== id));
  const updateFaq = (id: string, field: "question" | "answer", val: string) =>
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, [field]: val } : f));

  // ── Testimonial helpers ──
  const addTestimonial    = () => setTestimonials((prev) => [...prev, { id: `new-${Date.now()}`, name: "", role: "", text: "", plan_name: "", rating: 5 }]);
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id));
  const updateTestimonial = (id: string, field: string, val: string | number) =>
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, [field]: val } : t));

  // ── Team member helpers ──
  const addTeamMember    = () => setTeamMembers((prev) => [...prev, { id: `new-${Date.now()}`, name: "", role: "", bio: "", image_url: "", sort_order: prev.length + 1 }]);
  const removeTeamMember = (id: string) => setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  const updateTeamMember = (id: string, field: string, val: string) =>
    setTeamMembers((prev) => prev.map((m) => m.id === id ? { ...m, [field]: val } : m));

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
            <textarea rows={2} value={content.hero_body ?? ""} onChange={(e) => setKey("hero_body", e.target.value)} className={ta} placeholder="Expert-crafted plans..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Primary CTA Button</label>
              <input value={content.hero_cta_primary ?? ""} onChange={(e) => setKey("hero_cta_primary", e.target.value)} className={inp} placeholder="Calculate My BMI" />
            </div>
            <div>
              <label className="field-label">Secondary CTA Button</label>
              <input value={content.hero_cta_secondary ?? ""} onChange={(e) => setKey("hero_cta_secondary", e.target.value)} className={inp} placeholder="Browse Plans" />
            </div>
          </div>
          <div className="flex justify-end"><SaveButton onSave={saveHero} /></div>
        </div>
      </Section>

      {/* ── STATS ── */}
      <Section title="Stats Bar" desc="Numbers shown on home, about, and testimonials pages">
        <div className="space-y-4">
          <p className="text-white/30 text-xs">Each stat has a value, suffix (e.g. + or %), and label.</p>
          <div className="space-y-3">
            {[
              { label: "Plans Sold",        vKey: "stat_plans_sold_value",    sKey: "stat_plans_sold_suffix",    lKey: "stat_plans_sold_label",    vPh: "1200", sPh: "+", lPh: "Plans Sold" },
              { label: "Satisfaction Rate", vKey: "stat_satisfaction_value",  sKey: "stat_satisfaction_suffix",  lKey: "stat_satisfaction_label",  vPh: "98",   sPh: "%", lPh: "Satisfaction Rate" },
              { label: "Expert Plans",      vKey: "stat_expert_plans_value",  sKey: "stat_expert_plans_suffix",  lKey: "stat_expert_plans_label",  vPh: "50",   sPh: "+", lPh: "Expert Plans" },
              { label: "Happy Clients",     vKey: "stat_happy_clients_value", sKey: "stat_happy_clients_suffix", lKey: "stat_happy_clients_label", vPh: "3000", sPh: "+", lPh: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.vKey} className="grid grid-cols-3 gap-3 items-end border border-white/[0.07] rounded-xl p-4">
                <div>
                  <label className="field-label">{stat.label} — Value</label>
                  <input type="number" value={content[stat.vKey] ?? ""} onChange={(e) => setKey(stat.vKey, e.target.value)} placeholder={stat.vPh} className={inp} />
                </div>
                <div>
                  <label className="field-label">Suffix</label>
                  <input value={content[stat.sKey] ?? ""} onChange={(e) => setKey(stat.sKey, e.target.value)} placeholder={stat.sPh} className={inp} />
                </div>
                <div>
                  <label className="field-label">Label</label>
                  <input value={content[stat.lKey] ?? ""} onChange={(e) => setKey(stat.lKey, e.target.value)} placeholder={stat.lPh} className={inp} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end"><SaveButton onSave={saveStats} /></div>
        </div>
      </Section>

      {/* ── TEAM MEMBERS ── */}
      <Section title="Team / Experts" desc={`${teamMembers.length} members — shown on About and Home pages`}>
        <div className="space-y-4">
          <p className="text-white/30 text-xs leading-relaxed">
            Add any number of team members. Each has a name, role, bio, and image URL.
            Paste a Supabase Storage URL or any public image link.
          </p>
          {teamMembers.map((m, idx) => (
            <motion.div key={m.id} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-white/15" />
                  <span className="text-[11px] font-semibold text-white/35 tracking-widest uppercase">
                    Member {idx + 1}
                  </span>
                </div>
                <button onClick={() => removeTeamMember(m.id)}
                  className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Name</label>
                  <input value={m.name} onChange={(e) => updateTeamMember(m.id, "name", e.target.value)}
                    placeholder="e.g. Naodi" className={inp} />
                </div>
                <div>
                  <label className="field-label">Role / Title</label>
                  <input value={m.role} onChange={(e) => updateTeamMember(m.id, "role", e.target.value)}
                    placeholder="e.g. Co-Founder & Fitness Coach" className={inp} />
                </div>
              </div>
              <div>
                <label className="field-label">Bio</label>
                <textarea rows={3} value={m.bio} onChange={(e) => updateTeamMember(m.id, "bio", e.target.value)}
                  placeholder="Short bio shown on the about page..." className={ta} />
              </div>
              <div>
                <label className="field-label">Photo URL</label>
                <input value={m.image_url} onChange={(e) => updateTeamMember(m.id, "image_url", e.target.value)}
                  placeholder="https://... (Supabase Storage URL or any public image link)" className={inp} />
                {m.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image_url} alt={m.name}
                    className="mt-2 h-16 w-16 rounded-xl object-cover object-top border border-white/10"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
              </div>
            </motion.div>
          ))}
          <button onClick={addTeamMember}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 hover:border-white/30 text-white/30 hover:text-white/60 text-sm transition-all">
            <Plus size={14} /> Add Team Member
          </button>
          <div className="flex justify-end pt-2"><SaveButton onSave={saveTeamMembers} /></div>
        </div>
      </Section>

      {/* ── MISSION STATEMENT ── */}
      <Section title="Mission Statement" desc="Shown on About page">
        <div className="space-y-4">
          <div>
            <label className="field-label">Mission Statement</label>
            <input value={content.mission_statement ?? ""} onChange={(e) => setKey("mission_statement", e.target.value)}
              placeholder="Making expert fitness accessible to everyone." className={inp} />
          </div>
          <div className="flex justify-end"><SaveButton onSave={saveMission} /></div>
        </div>
      </Section>

      {/* ── CONTACT INFO ── */}
      <Section title="Contact Info" desc="Shown on the contact page and checkout">
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
              <label className="field-label">WhatsApp Number (with country code)</label>
              <input value={content.contact_whatsapp ?? ""} onChange={(e) => setKey("contact_whatsapp", e.target.value)} placeholder="251912345678" className={inp} />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input value={content.contact_location ?? ""} onChange={(e) => setKey("contact_location", e.target.value)} className={inp} />
            </div>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mt-2">Payment Details (shown at checkout)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Telebirr Phone Number</label>
              <input value={content.telebirr_phone ?? ""} onChange={(e) => setKey("telebirr_phone", e.target.value)} placeholder="09XXXXXXXX" className={inp} />
            </div>
            <div>
              <label className="field-label">Telebirr Account Name</label>
              <input value={content.telebirr_name ?? ""} onChange={(e) => setKey("telebirr_name", e.target.value)} placeholder="Naodi & Samri Fitness" className={inp} />
            </div>
            <div>
              <label className="field-label">CBE Account Number</label>
              <input value={content.cbe_account ?? ""} onChange={(e) => setKey("cbe_account", e.target.value)} placeholder="1000XXXXXXXXX" className={inp} />
            </div>
            <div>
              <label className="field-label">CBE Account Name</label>
              <input value={content.cbe_name ?? ""} onChange={(e) => setKey("cbe_name", e.target.value)} placeholder="Naodi & Samri Fitness" className={inp} />
            </div>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mt-2">Social Links</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Instagram URL</label>
              <input value={content.social_instagram ?? ""} onChange={(e) => setKey("social_instagram", e.target.value)} placeholder="https://instagram.com/..." className={inp} />
            </div>
            <div>
              <label className="field-label">TikTok URL</label>
              <input value={content.social_tiktok ?? ""} onChange={(e) => setKey("social_tiktok", e.target.value)} placeholder="https://tiktok.com/..." className={inp} />
            </div>
          </div>
          <div className="flex justify-end"><SaveButton onSave={saveContact} /></div>
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
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="field-label">Plan Referenced</label>
                  <input value={t.plan_name} onChange={(e) => updateTestimonial(t.id, "plan_name", e.target.value)}
                    placeholder="Plan name" className={inp} />
                </div>
                <div>
                  <label className="field-label">Rating (1–5)</label>
                  <div className="flex items-center gap-2 mt-1">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} type="button" onClick={() => updateTestimonial(t.id, "rating", n)}
                        className="transition-colors">
                        <Star size={18} className={n <= (t.rating || 5) ? "text-white fill-white" : "text-white/20"} />
                      </button>
                    ))}
                    <button onClick={() => removeTestimonial(t.id)}
                      className="ml-auto p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <button onClick={addTestimonial}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 hover:border-white/30 text-white/30 hover:text-white/60 text-sm transition-all">
            <Plus size={14} /> Add Testimonial
          </button>
          <div className="flex justify-end pt-2"><SaveButton onSave={saveTestimonials} /></div>
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
          <div className="flex justify-end pt-2"><SaveButton onSave={saveFaqs} /></div>
        </div>
      </Section>

      {/* ── TERMS ── */}
      <Section title="Terms & Conditions" desc="Shown at /terms">
        <div className="space-y-4">
          <textarea rows={16} value={content.terms_content ?? ""}
            onChange={(e) => setKey("terms_content", e.target.value)}
            placeholder="Enter your Terms & Conditions..." className={ta} />
          <div className="flex justify-end"><SaveButton onSave={saveTerms} /></div>
        </div>
      </Section>

      {/* ── PRIVACY ── */}
      <Section title="Privacy Policy" desc="Shown at /privacy">
        <div className="space-y-4">
          <textarea rows={16} value={content.privacy_content ?? ""}
            onChange={(e) => setKey("privacy_content", e.target.value)}
            placeholder="Enter your Privacy Policy..." className={ta} />
          <div className="flex justify-end"><SaveButton onSave={savePrivacy} /></div>
        </div>
      </Section>

      {/* ── BLOG POSTS ── */}
      <Section title="Blog Posts" desc={`${blogPosts.length} posts`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-white/35 text-xs">Manage articles shown at /blog</p>
            <button onClick={startNewPost} className="btn btn-white py-2 px-4 text-[10px]">
              <Plus size={13} /> New Post
            </button>
          </div>
          <div className="space-y-3">
            {blogPosts.map((post) => (
              <motion.div key={post.id} layout
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="border border-white/[0.07] rounded-xl overflow-hidden">
                {editingPost?.id === post.id ? (
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="field-label">Title</label>
                        <input value={editingPost.title}
                          onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                          placeholder="Post title" className={inp} />
                      </div>
                      <div>
                        <label className="field-label">Category</label>
                        <select value={editingPost.category}
                          onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                          className={inp}>
                          <option>Nutrition</option><option>Training</option>
                          <option>Health</option><option>Recovery</option><option>General</option>
                        </select>
                      </div>
                      <div>
                        <label className="field-label">Author</label>
                        <input value={editingPost.author}
                          onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                          className={inp} />
                      </div>
                      <div className="col-span-2">
                        <label className="field-label">Excerpt</label>
                        <textarea rows={2} value={editingPost.excerpt}
                          onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                          placeholder="Short summary..." className={ta} />
                      </div>
                      <div className="col-span-2">
                        <label className="field-label">Body</label>
                        <textarea rows={12} value={editingPost.body}
                          onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                          placeholder="Full article content..." className={ta} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-white/[0.07]">
                      <div>
                        <p className="text-sm text-white font-medium">Published</p>
                        <p className="text-[11px] text-white/30">Visible on the blog page</p>
                      </div>
                      <button type="button"
                        onClick={() => setEditingPost({ ...editingPost, published: !editingPost.published })}
                        className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${editingPost.published ? "bg-white" : "bg-white/15"}`}>
                        <motion.div animate={{ x: editingPost.published ? 20 : 0 }}
                          className={`w-5 h-5 rounded-full transition-colors ${editingPost.published ? "bg-black" : "bg-white/40"}`} />
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => {
                        setEditingPost(null);
                        if (post.id.startsWith("new-")) setBlogPosts((prev) => prev.filter((p) => p.id !== post.id));
                      }} className="btn btn-outline flex-1 py-2.5 text-[10px]">Cancel</button>
                      <button onClick={() => saveBlogPost(editingPost).catch(console.error)}
                        className="btn btn-white flex-1 py-2.5 text-[10px]">
                        <Save size={13} /> Save Post
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{post.title || "Untitled"}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-white/30">{post.category}</span>
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                          post.published ? "bg-white/10 text-white/55" : "bg-yellow-500/15 text-yellow-400"
                        }`}>{post.published ? "Published" : "Draft"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleBlogPublish(post.id, post.published).catch(console.error)}
                        className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition-all">
                        {post.published ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button onClick={() => setEditingPost(post)}
                        className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition-all">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteBlogPost(post.id).catch(console.error)}
                        className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {blogPosts.length === 0 && (
              <p className="text-white/25 text-sm text-center py-8">No blog posts yet.</p>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
