// ─── DEMO DATA FOR ADMIN PANEL ────────────────────────────────────────────────

import { PLANS } from "./data";

export type OrderStatus = "completed" | "pending" | "failed";
export type PaymentMethod = "Telebirr" | "CBE Birr" | "Chapa" | "Card";

export interface Order {
  id: string;
  customer: string;
  email: string;
  plan: string;
  planId: string;
  duration: string;
  amount: number;
  method: PaymentMethod;
  status: OrderStatus;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  totalSpent: number;
  plansOwned: number;
  lastActive: string;
  health: {
    gender: string;
    age: number;
    weight: number;
    height: number;
    bmi: number;
    goal: string;
    activityLevel: string;
    conditions: string[];
    allergies: string[];
  };
}

export interface AdminPlan {
  id: string;
  title: string;
  level: "Normal" | "Pro" | "VIP";
  goal: string;
  published: boolean;
  sales: number;
  revenue: number;
  createdAt: string;
}

// ─── MOCK ORDERS ──────────────────────────────────────────────────────────────
export const ORDERS: Order[] = [
  { id: "ORD-001", customer: "Selam Tadesse",  email: "selam@email.com",  plan: "Fat Burn Express",       planId: "fat-burn-express",     duration: "1 Month",  amount: 449,  method: "Telebirr",  status: "completed", date: "2026-08-28" },
  { id: "ORD-002", customer: "Meron Alemu",    email: "meron@email.com",  plan: "Lean Muscle Builder",    planId: "lean-muscle-builder",  duration: "3 Months", amount: 1299, method: "CBE Birr",  status: "completed", date: "2026-08-27" },
  { id: "ORD-003", customer: "Hana Bekele",    email: "hana@email.com",   plan: "Clean Nutrition Reset",  planId: "clean-nutrition-reset",duration: "1 Week",   amount: 99,   method: "Chapa",     status: "completed", date: "2026-08-26" },
  { id: "ORD-004", customer: "Tigist Girma",   email: "tigist@email.com", plan: "Body Recomposition",     planId: "body-recomposition",   duration: "6 Months", amount: 1899, method: "Card",      status: "completed", date: "2026-08-25" },
  { id: "ORD-005", customer: "Liya Haile",     email: "liya@email.com",   plan: "Women's Toning Program", planId: "womens-toning",        duration: "1 Month",  amount: 349,  method: "Telebirr",  status: "pending",   date: "2026-08-25" },
  { id: "ORD-006", customer: "Azeb Worku",     email: "azeb@email.com",   plan: "Power Shred",            planId: "power-shred",          duration: "3 Months", amount: 1499, method: "CBE Birr",  status: "failed",    date: "2026-08-24" },
  { id: "ORD-007", customer: "Feven Desta",    email: "feven@email.com",  plan: "Fat Burn Express",       planId: "fat-burn-express",     duration: "3 Months", amount: 999,  method: "Chapa",     status: "completed", date: "2026-08-23" },
  { id: "ORD-008", customer: "Bethel Teklu",   email: "bethel@email.com", plan: "Lean Muscle Builder",    planId: "lean-muscle-builder",  duration: "1 Month",  amount: 549,  method: "Telebirr",  status: "completed", date: "2026-08-22" },
  { id: "ORD-009", customer: "Rahel Mesfin",   email: "rahel@email.com",  plan: "Women's Toning Program", planId: "womens-toning",        duration: "6 Months", amount: 1399, method: "Card",      status: "completed", date: "2026-08-21" },
  { id: "ORD-010", customer: "Yordanos Hailu", email: "yorda@email.com",  plan: "Clean Nutrition Reset",  planId: "clean-nutrition-reset",duration: "1 Month",  amount: 299,  method: "Telebirr",  status: "pending",   date: "2026-08-20" },
  { id: "ORD-011", customer: "Sara Kebede",    email: "sara@email.com",   plan: "Body Recomposition",     planId: "body-recomposition",   duration: "1 Month",  amount: 479,  method: "CBE Birr",  status: "completed", date: "2026-08-19" },
  { id: "ORD-012", customer: "Mekdes Alemu",   email: "mekdes@email.com", plan: "Fat Burn Express",       planId: "fat-burn-express",     duration: "6 Months", amount: 1699, method: "Chapa",     status: "completed", date: "2026-08-18" },
];

// ─── MOCK CUSTOMERS ───────────────────────────────────────────────────────────
export const CUSTOMERS: Customer[] = [
  {
    id: "USR-001", name: "Selam Tadesse", email: "selam@email.com",
    joinedDate: "2026-07-10", totalSpent: 449, plansOwned: 1, lastActive: "2026-08-28",
    health: { gender: "Female", age: 28, weight: 72, height: 165, bmi: 26.4, goal: "Weight Loss", activityLevel: "Light", conditions: ["None"], allergies: ["None"] },
  },
  {
    id: "USR-002", name: "Meron Alemu", email: "meron@email.com",
    joinedDate: "2026-07-15", totalSpent: 1299, plansOwned: 1, lastActive: "2026-08-27",
    health: { gender: "Female", age: 24, weight: 58, height: 162, bmi: 22.1, goal: "Muscle Gain", activityLevel: "Moderate", conditions: ["None"], allergies: ["Dairy"] },
  },
  {
    id: "USR-003", name: "Hana Bekele", email: "hana@email.com",
    joinedDate: "2026-08-01", totalSpent: 99, plansOwned: 1, lastActive: "2026-08-26",
    health: { gender: "Female", age: 32, weight: 68, height: 170, bmi: 23.5, goal: "Nutrition", activityLevel: "Sedentary", conditions: ["Diabetes"], allergies: ["Gluten"] },
  },
  {
    id: "USR-004", name: "Tigist Girma", email: "tigist@email.com",
    joinedDate: "2026-06-20", totalSpent: 1899, plansOwned: 1, lastActive: "2026-08-25",
    health: { gender: "Female", age: 27, weight: 63, height: 168, bmi: 22.3, goal: "Lifestyle", activityLevel: "Active", conditions: ["None"], allergies: ["None"] },
  },
  {
    id: "USR-005", name: "Liya Haile", email: "liya@email.com",
    joinedDate: "2026-08-20", totalSpent: 349, plansOwned: 1, lastActive: "2026-08-25",
    health: { gender: "Female", age: 22, weight: 55, height: 158, bmi: 22.0, goal: "Lifestyle", activityLevel: "Light", conditions: ["None"], allergies: ["Nuts"] },
  },
  {
    id: "USR-006", name: "Azeb Worku", email: "azeb@email.com",
    joinedDate: "2026-08-05", totalSpent: 0, plansOwned: 0, lastActive: "2026-08-24",
    health: { gender: "Female", age: 35, weight: 78, height: 163, bmi: 29.3, goal: "Weight Loss", activityLevel: "Moderate", conditions: ["Hypertension"], allergies: ["None"] },
  },
  {
    id: "USR-007", name: "Feven Desta", email: "feven@email.com",
    joinedDate: "2026-07-28", totalSpent: 999, plansOwned: 1, lastActive: "2026-08-23",
    health: { gender: "Female", age: 29, weight: 70, height: 166, bmi: 25.4, goal: "Weight Loss", activityLevel: "Light", conditions: ["None"], allergies: ["None"] },
  },
  {
    id: "USR-008", name: "Bethel Teklu", email: "bethel@email.com",
    joinedDate: "2026-08-10", totalSpent: 549, plansOwned: 1, lastActive: "2026-08-22",
    health: { gender: "Female", age: 26, weight: 60, height: 164, bmi: 22.3, goal: "Muscle Gain", activityLevel: "Moderate", conditions: ["None"], allergies: ["Soy"] },
  },
];

// ─── MOCK ADMIN PLANS ─────────────────────────────────────────────────────────
export const ADMIN_PLANS: AdminPlan[] = PLANS.map((p, i) => ({
  id: p.id,
  title: p.title,
  level: p.level,
  goal: p.goalLabel,
  published: true,
  sales: [48, 31, 62, 19, 27, 55][i] ?? 20,
  revenue: [48 * 449, 31 * 849, 62 * 299, 19 * 999, 27 * 479, 55 * 349][i] ?? 5000,
  createdAt: "2026-07-01",
}));

// ─── REVENUE CHART DATA (last 7 days) ────────────────────────────────────────
export const REVENUE_DATA = [
  { day: "Mon", revenue: 2847 },
  { day: "Tue", revenue: 3210 },
  { day: "Wed", revenue: 1890 },
  { day: "Thu", revenue: 4320 },
  { day: "Fri", revenue: 3750 },
  { day: "Sat", revenue: 5100 },
  { day: "Sun", revenue: 2640 },
];

export const TOTAL_REVENUE = ORDERS
  .filter((o) => o.status === "completed")
  .reduce((sum, o) => sum + o.amount, 0);

export const THIS_MONTH_REVENUE = 18540;
export const TOTAL_ORDERS = ORDERS.length;
export const COMPLETED_ORDERS = ORDERS.filter((o) => o.status === "completed").length;
export const TOTAL_CUSTOMERS = CUSTOMERS.length;
