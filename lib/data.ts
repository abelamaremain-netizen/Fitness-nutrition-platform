// ─── IMAGE PATHS ────────────────────────────────────────────────────────────
export const IMAGES = {
  hero1: "/images/female images (2).jpg",
  hero2: "/images/female images1 (2).jpg",
  hero3: "/images/gettyimages-1860710155-612x612.jpg",
  hero4: "/images/images2 (2).jpg",
  hero5: "/images/Strength-Training-for-Women-Square.webp",
  hero6: "/images/Red Notice (2021).avi_snapshot_00.37.43.586.jpg",
};

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Plans", href: "/plans" },
  { label: "Fitness Plan", href: "/fitness-plan" },
  { label: "Meal Plan", href: "/meal-plan" },
  { label: "BMI Calculator", href: "/bmi" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ─── STATS ───────────────────────────────────────────────────────────────────
export const STATS = [
  { value: 1200, suffix: "+", label: "Plans Sold" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 50, suffix: "+", label: "Expert Plans" },
  { value: 3, suffix: "K+", label: "Happy Clients" },
];

// ─── PLANS ───────────────────────────────────────────────────────────────────
export type PlanLevel = "Normal" | "Pro" | "VIP";
export type PlanGoal = "weight-loss" | "muscle-gain" | "nutrition" | "lifestyle";

export interface Plan {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: PlanGoal;
  goalLabel: string;
  calories: number; // daily calorie target
  levels: { level: PlanLevel; price: number }[];
  featured: boolean;
  bestseller: boolean;
  videoThumb: string;
  videoUrl: string;
  pdfUrl: string;
  tags: string[];
  // for recommendation scoring
  suitableFor: string[]; // e.g. ["female", "male"]
  minBmi: number;
  maxBmi: number;
  activityLevel: string[]; // "sedentary" | "light" | "moderate" | "active"
}

export const PLANS: Plan[] = [
  {
    id: "fat-burn-express",
    title: "Fat Burn Express",
    description:
      "A high-intensity fat-burning program combining cardio intervals and strength circuits. Designed for quick, lasting results.",
    image: IMAGES.hero1,
    goal: "weight-loss",
    goalLabel: "Weight Loss",
    calories: 1500,
    levels: [
      { level: "Normal", price: 299 },
      { level: "Pro", price: 499 },
      { level: "VIP", price: 799 },
    ],
    featured: true,
    bestseller: true,
    videoThumb: "https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
    pdfUrl: "/pdfs/fat-burn-express.pdf",
    tags: ["Cardio", "HIIT", "Fat Loss"],
    suitableFor: ["female", "male"],
    minBmi: 25,
    maxBmi: 40,
    activityLevel: ["sedentary", "light"],
  },
  {
    id: "lean-muscle-builder",
    title: "Lean Muscle Builder",
    description:
      "Progressive strength training program with optimized protein intake strategies. Build lean muscle without excess bulk.",
    image: IMAGES.hero2,
    goal: "muscle-gain",
    goalLabel: "Muscle Gain",
    calories: 2400,
    levels: [
      { level: "Normal", price: 349 },
      { level: "Pro", price: 549 },
      { level: "VIP", price: 849 },
    ],
    featured: true,
    bestseller: false,
    videoThumb: "https://img.youtube.com/vi/R6gZoAzAhCg/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=R6gZoAzAhCg",
    pdfUrl: "/pdfs/lean-muscle-builder.pdf",
    tags: ["Strength", "Progressive", "Muscle"],
    suitableFor: ["female", "male"],
    minBmi: 18,
    maxBmi: 27,
    activityLevel: ["moderate", "active"],
  },
  {
    id: "clean-nutrition-reset",
    title: "Clean Nutrition Reset",
    description:
      "A 30-day whole-foods nutrition overhaul. Meal plans, grocery lists, and prep guides for a complete dietary transformation.",
    image: IMAGES.hero3,
    goal: "nutrition",
    goalLabel: "Nutrition",
    calories: 1800,
    levels: [
      { level: "Normal", price: 249 },
      { level: "Pro", price: 449 },
      { level: "VIP", price: 699 },
    ],
    featured: false,
    bestseller: true,
    videoThumb: "https://img.youtube.com/vi/sTANio_2E0Q/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=sTANio_2E0Q",
    pdfUrl: "/pdfs/clean-nutrition-reset.pdf",
    tags: ["Nutrition", "Meal Prep", "Clean Eating"],
    suitableFor: ["female", "male"],
    minBmi: 18,
    maxBmi: 35,
    activityLevel: ["sedentary", "light", "moderate"],
  },
  {
    id: "power-shred",
    title: "Power Shred",
    description:
      "Advanced cutting program for those who want to retain muscle while aggressively reducing body fat percentage.",
    image: IMAGES.hero4,
    goal: "weight-loss",
    goalLabel: "Weight Loss",
    calories: 1700,
    levels: [
      { level: "Normal", price: 399 },
      { level: "Pro", price: 599 },
      { level: "VIP", price: 899 },
    ],
    featured: false,
    bestseller: false,
    videoThumb: "https://img.youtube.com/vi/UBMk30rjy0o/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=UBMk30rjy0o",
    pdfUrl: "/pdfs/power-shred.pdf",
    tags: ["Cutting", "Advanced", "Shred"],
    suitableFor: ["female", "male"],
    minBmi: 22,
    maxBmi: 35,
    activityLevel: ["moderate", "active"],
  },
  {
    id: "body-recomposition",
    title: "Body Recomposition",
    description:
      "Simultaneously build muscle and lose fat with precision macros and periodized training. The holy grail of fitness.",
    image: IMAGES.hero5,
    goal: "lifestyle",
    goalLabel: "Lifestyle",
    calories: 2000,
    levels: [
      { level: "Normal", price: 379 },
      { level: "Pro", price: 579 },
      { level: "VIP", price: 879 },
    ],
    featured: true,
    bestseller: false,
    videoThumb: "https://img.youtube.com/vi/vcBig73ojpE/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=vcBig73ojpE",
    pdfUrl: "/pdfs/body-recomposition.pdf",
    tags: ["Recomp", "Balanced", "Lifestyle"],
    suitableFor: ["female", "male"],
    minBmi: 20,
    maxBmi: 30,
    activityLevel: ["light", "moderate", "active"],
  },
  {
    id: "womens-toning",
    title: "Women's Toning Program",
    description:
      "Specially designed for women — sculpt and tone with resistance training, flexibility work, and a balanced nutrition guide.",
    image: IMAGES.hero6,
    goal: "lifestyle",
    goalLabel: "Lifestyle",
    calories: 1650,
    levels: [
      { level: "Normal", price: 299 },
      { level: "Pro", price: 499 },
      { level: "VIP", price: 749 },
    ],
    featured: true,
    bestseller: true,
    videoThumb: "https://img.youtube.com/vi/Mvo2snJGhtM/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Mvo2snJGhtM",
    pdfUrl: "/pdfs/womens-toning.pdf",
    tags: ["Women", "Toning", "Sculpt"],
    suitableFor: ["female"],
    minBmi: 18,
    maxBmi: 32,
    activityLevel: ["sedentary", "light", "moderate"],
  },
];

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Selam Tadesse",
    role: "Lost 12kg in 3 months",
    image: IMAGES.hero1,
    rating: 5,
    text: "FBA's Fat Burn Express plan completely changed my life. The structured program with video guides made it so easy to follow. I never felt lost.",
    plan: "Fat Burn Express",
  },
  {
    id: 2,
    name: "Meron Alemu",
    role: "Gained lean muscle",
    image: IMAGES.hero2,
    rating: 5,
    text: "I was skeptical at first, but the Lean Muscle Builder plan delivered real results. The PDF guides are incredibly detailed and the video links are gold.",
    plan: "Lean Muscle Builder",
  },
  {
    id: 3,
    name: "Hana Bekele",
    role: "Complete nutrition overhaul",
    image: IMAGES.hero3,
    rating: 5,
    text: "The Clean Nutrition Reset taught me how to actually eat. The meal prep guides saved me so much time and the results showed within two weeks.",
    plan: "Clean Nutrition Reset",
  },
  {
    id: 4,
    name: "Tigist Girma",
    role: "Body recomposition success",
    image: IMAGES.hero5,
    rating: 5,
    text: "I've tried so many programs. FBA is different — the plans are science-backed, well-structured, and actually work for Ethiopian body types and food culture.",
    plan: "Body Recomposition",
  },
  {
    id: 5,
    name: "Liya Haile",
    role: "Toning & confidence boost",
    image: IMAGES.hero6,
    rating: 5,
    text: "The Women's Toning Program gave me more than a better body — it gave me confidence. The VIP plan with personalized notes was worth every birr.",
    plan: "Women's Toning Program",
  },
  {
    id: 6,
    name: "Azeb Worku",
    role: "Power Shred results",
    image: IMAGES.hero4,
    rating: 4,
    text: "Incredibly detailed program. I appreciated that the plan respected my dietary restrictions and still helped me shred 8kg in 6 weeks.",
    plan: "Power Shred",
  },
];

// ─── BLOG POSTS ──────────────────────────────────────────────────────────────
export const BLOG_POSTS = [
  {
    id: "understanding-macros",
    title: "Understanding Macronutrients: The Foundation of Any Diet",
    excerpt:
      "Proteins, carbs, and fats — understanding how each affects your body is the first step to crafting a diet that actually works for your goals.",
    image: IMAGES.hero3,
    category: "Nutrition",
    date: "August 20, 2026",
    readTime: "5 min read",
    author: "FBA Team",
  },
  {
    id: "hiit-vs-steady-state",
    title: "HIIT vs Steady-State Cardio: What's Right for You?",
    excerpt:
      "Both have their place in a well-rounded fitness program. Here's how to know which one aligns with your current goals and fitness level.",
    image: IMAGES.hero1,
    category: "Training",
    date: "August 14, 2026",
    readTime: "4 min read",
    author: "FBA Team",
  },
  {
    id: "bmi-guide",
    title: "BMI Explained: What It Means and What It Doesn't",
    excerpt:
      "BMI is a useful screening tool, but it's not the full picture. Here's how to interpret your BMI in context and what to do with the number.",
    image: IMAGES.hero4,
    category: "Health",
    date: "August 8, 2026",
    readTime: "6 min read",
    author: "FBA Team",
  },
  {
    id: "ethiopian-diet-fitness",
    title: "Ethiopian Foods That Fuel Your Fitness Goals",
    excerpt:
      "Injera, lentils, tibs — traditional Ethiopian cuisine is packed with nutrients. Here's how to leverage local foods in your fitness journey.",
    image: IMAGES.hero2,
    category: "Nutrition",
    date: "July 30, 2026",
    readTime: "7 min read",
    author: "FBA Team",
  },
  {
    id: "sleep-and-recovery",
    title: "Why Sleep Is Your Most Powerful Recovery Tool",
    excerpt:
      "You can't out-train poor sleep. Here's the science behind sleep and muscle recovery, and practical tips to optimize yours.",
    image: IMAGES.hero5,
    category: "Recovery",
    date: "July 22, 2026",
    readTime: "5 min read",
    author: "FBA Team",
  },
  {
    id: "women-weight-training",
    title: "Why Women Should Lift Heavy: Busting the Myths",
    excerpt:
      "Heavy lifting won't make you bulky — it will make you strong, lean, and confident. Here's the evidence-backed truth.",
    image: IMAGES.hero6,
    category: "Training",
    date: "July 15, 2026",
    readTime: "6 min read",
    author: "FBA Team",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: "How do I access my plan after purchase?",
    a: "After completing your purchase, the plan is immediately available in your dashboard. You can download the PDF and access all video links from there.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Telebirr, CBE Birr, major Ethiopian banks via Chapa, and international cards via Stripe.",
  },
  {
    q: "Are the plans suitable for beginners?",
    a: "Yes. Our Normal level plans are designed for beginners with clear, step-by-step instructions. Pro and VIP levels are for intermediate to advanced users.",
  },
  {
    q: "Can I get a refund?",
    a: "Due to the digital nature of our plans, we do not offer refunds after the PDF has been downloaded. Please review the plan details and free preview before purchasing.",
  },
  {
    q: "Are the plans available in Amharic?",
    a: "Yes, most plans have Amharic versions. You can toggle between English and Amharic from the language selector in the navigation.",
  },
  {
    q: "What is the difference between Normal, Pro, and VIP?",
    a: "Normal includes the core plan PDF and basic video links. Pro adds detailed breakdowns, more videos, and meal prep guides. VIP includes everything in Pro plus personalized notes and bonus content.",
  },
  {
    q: "Do I need gym equipment?",
    a: "It depends on the plan. Each plan detail page clearly states the equipment needed. Some plans have home-workout alternatives.",
  },
  {
    q: "How is the BMI calculator used?",
    a: "Our BMI calculator not only gives you your BMI but uses your goals, age, gender, and activity level to recommend the most suitable plans from our catalog.",
  },
];

// ─── HOW IT WORKS STEPS ──────────────────────────────────────────────────────
export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Calculate Your BMI",
    description:
      "Enter your details — age, weight, height, gender, and goals. Our calculator gives you your BMI and daily calorie target.",
  },
  {
    step: "02",
    title: "Get Recommendations",
    description:
      "Based on your profile, we surface the plans that best match your body, goals, and fitness level.",
  },
  {
    step: "03",
    title: "Choose Your Level",
    description:
      "Each plan has Normal, Pro, and VIP tiers. Pick the level of detail and support that fits your commitment.",
  },
  {
    step: "04",
    title: "Purchase & Access",
    description:
      "Complete payment securely. Your plan is instantly available — download the PDF and access video content from your dashboard.",
  },
];

// ─── TEAM MEMBERS ────────────────────────────────────────────────────────────
export const TEAM = [
  {
    name: "Dr. Ayana Bekele",
    role: "Head Nutritionist",
    bio: "PhD in Sports Nutrition. 10+ years helping athletes and everyday people transform through targeted dietary strategies.",
    image: IMAGES.hero3,
  },
  {
    name: "Coach Mihret Tadesse",
    role: "Lead Fitness Trainer",
    bio: "Certified personal trainer and strength coach. Specialist in body recomposition and women's fitness programming.",
    image: IMAGES.hero2,
  },
  {
    name: "Frehiwot Girma",
    role: "Wellness Coach",
    bio: "Holistic wellness specialist focused on sustainable lifestyle change, stress management, and long-term health.",
    image: IMAGES.hero5,
  },
];

// ─── RECOMMENDATION ENGINE ───────────────────────────────────────────────────
export interface UserProfile {
  gender: "male" | "female";
  age: number;
  weight: number; // kg
  height: number; // cm
  goal: "weight-loss" | "muscle-gain" | "nutrition" | "lifestyle";
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  healthConditions?: string[];
  allergies?: string[];
}

export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { label: "Normal weight", color: "text-green-400" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
  return { label: "Obese", color: "text-red-400" };
}

export function calculateTDEE(profile: UserProfile): number {
  // Mifflin-St Jeor BMR
  let bmr: number;
  if (profile.gender === "male") {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  return Math.round(bmr * multipliers[profile.activityLevel]);
}

export function getCalorieTarget(tdee: number, goal: UserProfile["goal"]): number {
  switch (goal) {
    case "weight-loss": return tdee - 500;
    case "muscle-gain": return tdee + 300;
    default: return tdee;
  }
}

export function recommendPlans(profile: UserProfile): Plan[] {
  const bmi = calculateBMI(profile.weight, profile.height);
  const calorieTarget = getCalorieTarget(calculateTDEE(profile), profile.goal);

  const scored = PLANS.map((plan) => {
    let score = 0;

    // Goal match (highest weight)
    if (plan.goal === profile.goal) score += 40;

    // BMI range match
    if (bmi >= plan.minBmi && bmi <= plan.maxBmi) score += 20;

    // Activity level match
    if (plan.activityLevel.includes(profile.activityLevel)) score += 15;

    // Gender match
    if (plan.suitableFor.includes(profile.gender)) score += 15;

    // Calorie proximity (closer = higher score)
    const calorieDiff = Math.abs(plan.calories - calorieTarget);
    if (calorieDiff < 200) score += 10;
    else if (calorieDiff < 400) score += 5;

    return { plan, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.plan);
}
