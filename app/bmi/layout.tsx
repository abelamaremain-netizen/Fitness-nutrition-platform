import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description:
    "Calculate your Body Mass Index (BMI) and daily calorie target. Get personalised fitness and meal plan recommendations based on your results — free tool by Naodi & Samri.",
  alternates: { canonical: "/bmi" },
  openGraph: {
    title:       "Free BMI Calculator | Naodi & Samri Fitness",
    description: "Find your BMI, daily calorie target, and the best plan for your goals.",
    url:         "/bmi",
  },
};

export default function BmiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
