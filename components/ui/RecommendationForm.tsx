"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { UserProfile } from "@/lib/data";

interface Props {
  mode: "fitness" | "meal";
  onSubmit: (profile: UserProfile) => void;
}

const HEALTH_CONDITIONS = [
  "Diabetes", "Hypertension", "Heart condition",
  "Back pain", "Knee injury", "Asthma", "None",
];
const ALLERGIES = ["Nuts", "Dairy", "Gluten", "Eggs", "Soy", "Shellfish", "None"];

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`toggle-chip ${active ? "active" : ""}`}>
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-3">
      {children}
    </p>
  );
}

export default function RecommendationForm({ mode, onSubmit }: Props) {
  const [form, setForm] = useState({
    gender: "" as "male" | "female" | "",
    age: "", weight: "", height: "",
    goal: "" as UserProfile["goal"] | "",
    activityLevel: "" as UserProfile["activityLevel"] | "",
    healthConditions: [] as string[],
    allergies: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const toggleArr = (key: "healthConditions" | "allergies", val: string) =>
    setForm((prev) => {
      const arr = prev[key];
      if (val === "None") return { ...prev, [key]: ["None"] };
      const without = arr.filter((v) => v !== "None");
      return { ...prev, [key]: arr.includes(val) ? without.filter((v) => v !== val) : [...without, val] };
    });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.gender) e.gender = "Required";
    if (!form.age || +form.age < 13 || +form.age > 100) e.age = "Valid age 13–100";
    if (!form.weight || +form.weight < 30) e.weight = "Valid weight";
    if (!form.height || +form.height < 100) e.height = "Valid height";
    if (!form.goal) e.goal = "Required";
    if (!form.activityLevel) e.activityLevel = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      gender: form.gender as "male" | "female",
      age: +form.age, weight: +form.weight, height: +form.height,
      goal: form.goal as UserProfile["goal"],
      activityLevel: form.activityLevel as UserProfile["activityLevel"],
      healthConditions: form.healthConditions, allergies: form.allergies,
    });
  };

  const reset = () => { setForm({ gender: "", age: "", weight: "", height: "", goal: "", activityLevel: "", healthConditions: [], allergies: [] }); setErrors({}); };

  const goals = mode === "fitness"
    ? [{ v: "weight-loss", l: "Lose Weight" }, { v: "muscle-gain", l: "Build Muscle" }, { v: "lifestyle", l: "Tone & Lifestyle" }]
    : [{ v: "weight-loss", l: "Lose Weight" }, { v: "muscle-gain", l: "Gain Mass" }, { v: "nutrition", l: "Clean Nutrition" }, { v: "lifestyle", l: "Balanced Diet" }];

  const activities = [
    { v: "sedentary", l: "Sedentary", s: "Little / no exercise" },
    { v: "light", l: "Light", s: "1–3 days/week" },
    { v: "moderate", l: "Moderate", s: "3–5 days/week" },
    { v: "active", l: "Very Active", s: "6–7 days/week" },
  ];

  const errMsg = (k: string) => errors[k] ? (
    <p className="text-red-400/80 text-[11px] mt-1.5 pl-1">{errors[k]}</p>
  ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── GENDER ── */}
      <div>
        <SectionLabel>Gender {errors.gender && <span className="text-red-400/80 ml-2 normal-case">— {errors.gender}</span>}</SectionLabel>
        <div className="flex gap-3">
          {(["Female", "Male"] as const).map((g) => (
            <Chip key={g} label={g} active={form.gender === g.toLowerCase()} onClick={() => set("gender", g.toLowerCase())} />
          ))}
        </div>
      </div>

      {/* ── MEASUREMENTS ── */}
      <div>
        <SectionLabel>Measurements</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <input type="number" placeholder="Age" value={form.age}
              onChange={(e) => set("age", e.target.value)} className="pill-input" />
            {errMsg("age")}
          </div>
          <div>
            <input type="number" placeholder="Weight (kg)" value={form.weight}
              onChange={(e) => set("weight", e.target.value)} className="pill-input" />
            {errMsg("weight")}
          </div>
          <div>
            <input type="number" placeholder="Height (cm)" value={form.height}
              onChange={(e) => set("height", e.target.value)} className="pill-input" />
            {errMsg("height")}
          </div>
        </div>
      </div>

      {/* ── GOAL ── */}
      <div>
        <SectionLabel>Your Goal {errors.goal && <span className="text-red-400/80 ml-2 normal-case">— {errors.goal}</span>}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <Chip key={g.v} label={g.l} active={form.goal === g.v} onClick={() => set("goal", g.v)} />
          ))}
        </div>
      </div>

      {/* ── ACTIVITY ── */}
      <div>
        <SectionLabel>Activity Level {errors.activityLevel && <span className="text-red-400/80 ml-2 normal-case">— {errors.activityLevel}</span>}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {activities.map((a) => (
            <Chip key={a.v} label={a.l} active={form.activityLevel === a.v} onClick={() => set("activityLevel", a.v)} />
          ))}
        </div>
      </div>

      {/* ── HEALTH CONDITIONS ── */}
      <div>
        <SectionLabel>Health Conditions <span className="normal-case font-normal">(select all that apply)</span></SectionLabel>
        <div className="flex flex-wrap gap-2">
          {HEALTH_CONDITIONS.map((c) => (
            <Chip key={c} label={c} active={form.healthConditions.includes(c)} onClick={() => toggleArr("healthConditions", c)} />
          ))}
        </div>
      </div>

      {/* ── ALLERGIES (meal only) ── */}
      {mode === "meal" && (
        <div>
          <SectionLabel>Food Allergies <span className="normal-case font-normal">(select all that apply)</span></SectionLabel>
          <div className="flex flex-wrap gap-2">
            {ALLERGIES.map((a) => (
              <Chip key={a} label={a} active={form.allergies.includes(a)} onClick={() => toggleArr("allergies", a)} />
            ))}
          </div>
        </div>
      )}

      {/* ── SUBMIT ── */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="btn btn-white flex-1 py-3.5 text-[11px]"
        >
          Find My Plans <ArrowRight size={14} />
        </motion.button>
        <button type="button" onClick={reset}
          className="btn btn-outline px-4 py-3.5">
          <RotateCcw size={14} />
        </button>
      </div>
    </form>
  );
}
