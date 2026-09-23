// ─── ADMIN TYPE DEFINITIONS ───────────────────────────────────────────────────
// All data comes from Supabase — no mock arrays.

export type OrderStatus  = "completed" | "pending" | "failed";
export type PaymentMethod = "Telebirr" | "CBE Birr" | "Chapa" | "Card";

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
