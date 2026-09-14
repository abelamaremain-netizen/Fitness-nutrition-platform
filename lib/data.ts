// ─── IMAGE PATHS ────────────────────────────────────────────────────────────
export const IMAGES = {
  // Original stock images (kept for plans/blog/misc use)
  hero1: "/images/female-default.jpg",
  hero2: "/images/female-default-2.jpg",
  hero3: "/images/gettyimages-1860710155-612x612.jpg",
  hero4: "/images/default-3.jpg",
  hero5: "/images/Strength-Training-for-Women-Square.webp",
  hero6: "/images/hero-women-toning.jpg",

  // Owner photos — Naodi & Samri
  naodi1: "/images/owners/naodi-1.JPG",
  naodi2: "/images/owners/naodi-2.JPG",
  naodi3: "/images/owners/naodi-3.JPG",
  samri1: "/images/owners/samri-1.JPG",
  samri2: "/images/owners/samri-2.JPG",
  samri3: "/images/owners/samri-3.JPG",
  both:   "/images/owners/both-1.JPG",
};

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home",          href: "/" },
  { label: "Plans",         href: "/plans" },
  { label: "Fitness Plan",  href: "/fitness-plan" },
  { label: "Meal Plan",     href: "/meal-plan" },
  { label: "BMI Calculator",href: "/bmi" },
  { label: "How It Works",  href: "/how-it-works" },
  { label: "Blog",          href: "/blog" },
  { label: "About",         href: "/about" },
  { label: "Contact",       href: "/contact" },
];

// ─── STATS ───────────────────────────────────────────────────────────────────
// Default stats — shown if admin hasn't set values in site_content yet
export const DEFAULT_STATS = [
  { value: 0,  suffix: "+",  label: "Plans Sold",       key: "stat_plans_sold" },
  { value: 0,  suffix: "%",  label: "Satisfaction Rate", key: "stat_satisfaction" },
  { value: 0,  suffix: "+",  label: "Expert Plans",      key: "stat_expert_plans" },
  { value: 0,  suffix: "+",  label: "Happy Clients",     key: "stat_happy_clients" },
];

export function parseStats(content: Record<string, string>) {
  return [
    {
      value:  parseInt(content.stat_plans_sold_value   ?? "0", 10),
      suffix: content.stat_plans_sold_suffix            ?? "+",
      label:  content.stat_plans_sold_label             ?? "Plans Sold",
    },
    {
      value:  parseInt(content.stat_satisfaction_value ?? "0", 10),
      suffix: content.stat_satisfaction_suffix          ?? "%",
      label:  content.stat_satisfaction_label           ?? "Satisfaction Rate",
    },
    {
      value:  parseInt(content.stat_expert_plans_value ?? "0", 10),
      suffix: content.stat_expert_plans_suffix          ?? "+",
      label:  content.stat_expert_plans_label           ?? "Expert Plans",
    },
    {
      value:  parseInt(content.stat_happy_clients_value ?? "0", 10),
      suffix: content.stat_happy_clients_suffix          ?? "+",
      label:  content.stat_happy_clients_label           ?? "Happy Clients",
    },
  ];
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type PlanLevel    = "Normal" | "Pro" | "VIP";
export type PlanGoal     = "weight-loss" | "muscle-gain" | "nutrition" | "lifestyle";
export type PlanType     = "fitness" | "meal" | "both";
export type DurationKey  = "1-week" | "1-month" | "3-months" | "6-months";

export interface DurationOption {
  key:   DurationKey;
  label: string;         // "1 Week", "1 Month" etc.
  price: number;         // ETB
}

export interface Plan {
  id:          string;
  title:       string;
  description: string;
  longDescription: string;  // used on detail page
  image:       string;
  goal:        PlanGoal;
  goalLabel:   string;
  level:       PlanLevel;   // single label set by admin
  planType:    PlanType;    // "fitness" | "meal" | "both"
  durations:   DurationOption[];  // admin picks which durations apply
  featured:    boolean;
  bestseller:  boolean;
  videoThumb:  string;
  videoUrl:    string;      // LOCKED until payment
  pdfUrl:      string;      // LOCKED until payment
  tags:        string[];
  includes:    string[];    // bullet points shown on detail page
  // recommendation scoring
  suitableFor:   string[];
  minBmi:        number;
  maxBmi:        number;
  activityLevel: string[];
}

// ─── DURATION FILTER OPTIONS ─────────────────────────────────────────────────
export const DURATION_FILTERS: { key: DurationKey | "all"; label: string }[] = [
  { key: "all",       label: "All Durations" },
  { key: "1-week",    label: "1 Week" },
  { key: "1-month",   label: "1 Month" },
  { key: "3-months",  label: "3 Months" },
  { key: "6-months",  label: "6 Months" },
];

export const LEVEL_FILTERS: { key: PlanLevel | "all"; label: string }[] = [
  { key: "all",    label: "All Levels" },
  { key: "Normal", label: "Normal" },
  { key: "Pro",    label: "Pro" },
  { key: "VIP",    label: "VIP" },
];

// ─── RECOMMENDATION ENGINE ────────────────────────────────────────────────────
export interface UserProfile {
  gender:        "male" | "female";
  age:           number;
  weight:        number;
  height:        number;
  goal:          "weight-loss" | "muscle-gain" | "nutrition" | "lifestyle";
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  healthConditions?: string[];
  allergies?:        string[];
}

export function calculateBMI(weight: number, height: number): number {
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
  if (bmi < 25)   return { label: "Normal weight", color: "text-white" };
  if (bmi < 30)   return { label: "Overweight", color: "text-yellow-400" };
  return           { label: "Obese", color: "text-red-400" };
}

export function calculateTDEE(profile: UserProfile): number {
  let bmr: number;
  if (profile.gender === "male") {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  const m = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  return Math.round(bmr * m[profile.activityLevel]);
}

export function getCalorieTarget(tdee: number, goal: UserProfile["goal"]): number {
  if (goal === "weight-loss")  return tdee - 500;
  if (goal === "muscle-gain")  return tdee + 300;
  return tdee;
}

export function recommendPlans(profile: UserProfile, plansToSearch: Plan[] = [], planType?: "fitness" | "meal"): Plan[] {
  const bmi = calculateBMI(profile.weight, profile.height);
  // Filter by plan type first if specified
  const candidates = planType
    ? plansToSearch.filter((p) => p.planType === planType || p.planType === "both")
    : plansToSearch;
  const scored = candidates.map((plan) => {
    let score = 0;
    if (plan.goal === profile.goal)                           score += 40;
    if (bmi >= plan.minBmi && bmi <= plan.maxBmi)            score += 20;
    if (plan.activityLevel.includes(profile.activityLevel))  score += 15;
    if (plan.suitableFor.includes(profile.gender))           score += 15;
    score += 10; // base
    return { plan, score };
  });
  return scored.sort((a, b) => b.score - a.score).map((s) => s.plan);
}
