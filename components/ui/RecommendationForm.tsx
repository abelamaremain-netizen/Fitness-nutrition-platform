"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useLang } from "@/context/LangContext";
import type { UserProfile } from "@/lib/data";

interface Props {
  mode: "fitness" | "meal";
  onSubmit: (profile: UserProfile) => void;
}

// Health conditions & allergies — kept in English as they are medical terms
// that map to DB storage values. Admin can add Amharic versions in content.
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

export default function RecommendationForm({ mode, onSubmit }: Props) {
  const { t } = useLang();

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
    if (!form.age || +form.age < 13 || +form.age > 100) e.age = "13–100";
    if (!form.weight || +form.weight < 30) e.weight = "Required";
    if (!form.height || +form.height < 100) e.height = "Required";
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

  const reset = () => {
    setForm({ gender: "", age: "", weight: "", height: "", goal: "", activityLevel: "", healthConditions: [], allergies: [] });
    setErrors({});
  };

  // Goal options — value is always the DB key, label is translated
  const fitnessGoals = [
    { v: "weight-loss",  l: t("form.loseWeight") },
    { v: "muscle-gain",  l: t("form.buildMuscle") },
    { v: "lifestyle",    l: t("form.toneLifestyle") },
  ];
  const mealGoals = [
    { v: "weight-loss",  l: t("form.loseWeight") },
    { v: "muscle-gain",  l: t("form.gainMass") },
    { v: "nutrition",    l: t("form.cleanNutrition") },
    { v: "lifestyle",    l: t("form.balancedDiet") },
  ];
  const goals = mode === "fitness" ? fitnessGoals : mealGoals;

  // Activity options — value is always the DB key
  const activities = [
    { v: "sedentary", l: t("form.sedentary"), s: t("form.sedentarySub") },
    { v: "light",     l: t("form.light"),     s: t("form.lightSub") },
    { v: "moderate",  l: t("form.moderate"),  s: t("form.moderateSub") },
    { v: "active",    l: t("form.active"),    s: t("form.activeSub") },
  ];

  const errMsg = (k: string) => errors[k]
    ? <p className="text-red-400/80 text-[11px] mt-1.5 pl-1">{errors[k]}</p>
    : null;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-3">
      {children}
    </p>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Gender */}
      <div>
        <SectionLabel>
          {t("form.gender")}
          {errors.gender && <span className="text-red-400/80 ml-2 normal-case font-normal">— {errors.gender}</span>}
        </SectionLabel>
        <div className="flex gap-3">
          <Chip label={t("bmi.female")} active={form.gender === "female"} onClick={() => set("gender", "female")} />
          <Chip label={t("bmi.male")}   active={form.gender === "male"}   onClick={() => set("gender", "male")} />
        </div>
      </div>

      {/* Measurements */}
      <div>
        <SectionLabel>{t("form.measurements")}</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <input type="number" placeholder={t("form.age")} value={form.age}
              onChange={(e) => set("age", e.target.value)} className="pill-input" />
            {errMsg("age")}
          </div>
          <div>
            <input type="number" placeholder={t("form.weight")} value={form.weight}
              onChange={(e) => set("weight", e.target.value)} className="pill-input" />
            {errMsg("weight")}
          </div>
          <div>
            <input type="number" placeholder={t("form.height")} value={form.height}
              onChange={(e) => set("height", e.target.value)} className="pill-input" />
            {errMsg("height")}
          </div>
        </div>
      </div>

      {/* Goal — values are DB keys, labels translated */}
      <div>
        <SectionLabel>
          {t("form.yourGoal")}
          {errors.goal && <span className="text-red-400/80 ml-2 normal-case font-normal">— {errors.goal}</span>}
        </SectionLabel>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <Chip key={g.v} label={g.l} active={form.goal === g.v} onClick={() => set("goal", g.v)} />
          ))}
        </div>
      </div>

      {/* Activity — values are DB keys, labels translated */}
      <div>
        <SectionLabel>
          {t("form.activityLevel")}
          {errors.activityLevel && <span className="text-red-400/80 ml-2 normal-case font-normal">— {errors.activityLevel}</span>}
        </SectionLabel>
        <div className="flex flex-wrap gap-2">
          {activities.map((a) => (
            <button key={a.v} type="button" onClick={() => set("activityLevel", a.v)}
              className={`toggle-chip ${form.activityLevel === a.v ? "active" : ""}`}>
              {a.l}
            </button>
          ))}
        </div>
      </div>

      {/* Health conditions */}
      <div>
        <SectionLabel>
          {t("form.healthConditions")}{" "}
          <span className="normal-case font-normal">{t("form.selectAll")}</span>
        </SectionLabel>
        <div className="flex flex-wrap gap-2">
          {HEALTH_CONDITIONS.map((c) => (
            <Chip key={c} label={c} active={form.healthConditions.includes(c)} onClick={() => toggleArr("healthConditions", c)} />
          ))}
        </div>
      </div>

      {/* Allergies — meal only */}
      {mode === "meal" && (
        <div>
          <SectionLabel>
            {t("form.allergies")}{" "}
            <span className="normal-case font-normal">{t("form.selectAll")}</span>
          </SectionLabel>
          <div className="flex flex-wrap gap-2">
            {ALLERGIES.map((a) => (
              <Chip key={a} label={a} active={form.allergies.includes(a)} onClick={() => toggleArr("allergies", a)} />
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <motion.button type="submit"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="btn btn-white flex-1 py-3.5 text-[11px]">
          {t("form.findPlans")} <ArrowRight size={14} />
        </motion.button>
        <button type="button" onClick={reset} className="btn btn-outline px-4 py-3.5">
          <RotateCcw size={14} />
        </button>
      </div>
    </form>
  );
}
