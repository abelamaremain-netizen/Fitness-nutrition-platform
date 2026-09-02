// ─── IMAGE PATHS ────────────────────────────────────────────────────────────
export const IMAGES = {
  // Original stock images (kept for plans/blog/misc use)
  hero1: "/images/female images (2).jpg",
  hero2: "/images/female images1 (2).jpg",
  hero3: "/images/gettyimages-1860710155-612x612.jpg",
  hero4: "/images/images2 (2).jpg",
  hero5: "/images/Strength-Training-for-Women-Square.webp",
  hero6: "/images/Red Notice (2021).avi_snapshot_00.37.43.586.jpg",

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
export const STATS = [
  { value: 1200, suffix: "+",  label: "Plans Sold" },
  { value: 98,   suffix: "%",  label: "Satisfaction Rate" },
  { value: 50,   suffix: "+",  label: "Expert Plans" },
  { value: 3,    suffix: "K+", label: "Happy Clients" },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type PlanLevel    = "Normal" | "Pro" | "VIP";
export type PlanGoal     = "weight-loss" | "muscle-gain" | "nutrition" | "lifestyle";
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

// ─── PLANS ───────────────────────────────────────────────────────────────────
export const PLANS: Plan[] = [
  {
    id: "fat-burn-express",
    title: "Fat Burn Express",
    description: "A high-intensity fat-burning program combining cardio intervals and strength circuits. Designed for quick, lasting results.",
    longDescription: "Fat Burn Express is a science-backed program that combines HIIT cardio with targeted strength circuits to maximise caloric burn. Designed for people who want visible results fast without spending hours in the gym. The program includes progressive overload built in from week one, and a companion nutrition guide that keeps you fuelled without sabotaging your deficit.",
    image: IMAGES.hero1,
    goal: "weight-loss",
    goalLabel: "Weight Loss",
    level: "Pro",
    durations: [
      { key: "1-week",   label: "1 Week",   price: 149 },
      { key: "1-month",  label: "1 Month",  price: 449 },
      { key: "3-months", label: "3 Months", price: 999 },
      { key: "6-months", label: "6 Months", price: 1699 },
    ],
    featured: true,
    bestseller: true,
    videoThumb: "https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
    pdfUrl: "/pdfs/fat-burn-express.pdf",
    tags: ["Cardio", "HIIT", "Fat Loss"],
    includes: [
      "Detailed PDF workout guide",
      "Progressive 4-phase structure",
      "Companion nutrition guide",
      "Video demonstrations",
      "Warm-up & cool-down routines",
    ],
    suitableFor: ["female", "male"],
    minBmi: 25, maxBmi: 40,
    activityLevel: ["sedentary", "light"],
  },
  {
    id: "lean-muscle-builder",
    title: "Lean Muscle Builder",
    description: "Progressive strength training with optimised protein intake strategies. Build lean muscle without excess bulk.",
    longDescription: "Lean Muscle Builder is a periodised strength program built around compound lifts and strategic hypertrophy phases. The plan adapts weekly so your muscles never plateau. Includes a full macronutrient breakdown and meal timing guide to maximise protein synthesis and recovery.",
    image: IMAGES.hero2,
    goal: "muscle-gain",
    goalLabel: "Muscle Gain",
    level: "VIP",
    durations: [
      { key: "1-month",  label: "1 Month",  price: 549 },
      { key: "3-months", label: "3 Months", price: 1299 },
      { key: "6-months", label: "6 Months", price: 2199 },
    ],
    featured: true,
    bestseller: false,
    videoThumb: "https://img.youtube.com/vi/R6gZoAzAhCg/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=R6gZoAzAhCg",
    pdfUrl: "/pdfs/lean-muscle-builder.pdf",
    tags: ["Strength", "Progressive", "Muscle"],
    includes: [
      "Full periodised workout plan PDF",
      "Macronutrient & meal timing guide",
      "Exercise video library",
      "Rest & recovery protocols",
      "Supplement recommendations",
    ],
    suitableFor: ["female", "male"],
    minBmi: 18, maxBmi: 27,
    activityLevel: ["moderate", "active"],
  },
  {
    id: "clean-nutrition-reset",
    title: "Clean Nutrition Reset",
    description: "A whole-foods nutrition overhaul. Meal plans, grocery lists, and prep guides for a complete dietary transformation.",
    longDescription: "Clean Nutrition Reset is a structured dietary programme that removes processed foods and rebuilds your eating habits around whole, nutrient-dense foods. Includes week-by-week meal plans tailored to Ethiopian and international cuisines, complete grocery lists, and simple meal prep guides that fit a busy schedule.",
    image: IMAGES.hero3,
    goal: "nutrition",
    goalLabel: "Nutrition",
    level: "Normal",
    durations: [
      { key: "1-week",   label: "1 Week",   price: 99 },
      { key: "1-month",  label: "1 Month",  price: 299 },
      { key: "3-months", label: "3 Months", price: 699 },
    ],
    featured: false,
    bestseller: true,
    videoThumb: "https://img.youtube.com/vi/sTANio_2E0Q/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=sTANio_2E0Q",
    pdfUrl: "/pdfs/clean-nutrition-reset.pdf",
    tags: ["Nutrition", "Meal Prep", "Clean Eating"],
    includes: [
      "Week-by-week meal plan PDF",
      "Full grocery list per week",
      "Meal prep video guides",
      "Ethiopian & international recipes",
      "Calorie & macro breakdown",
    ],
    suitableFor: ["female", "male"],
    minBmi: 18, maxBmi: 35,
    activityLevel: ["sedentary", "light", "moderate"],
  },
  {
    id: "power-shred",
    title: "Power Shred",
    description: "Advanced cutting program for those who want to retain muscle while aggressively reducing body fat percentage.",
    longDescription: "Power Shred is an advanced programme designed for people who already have a training foundation and want to cut body fat while preserving hard-earned muscle. Combines a caloric deficit diet with strength-preserving training and strategic refeed days. Not for beginners.",
    image: IMAGES.hero4,
    goal: "weight-loss",
    goalLabel: "Weight Loss",
    level: "VIP",
    durations: [
      { key: "1-month",  label: "1 Month",  price: 599 },
      { key: "3-months", label: "3 Months", price: 1499 },
      { key: "6-months", label: "6 Months", price: 2499 },
    ],
    featured: false,
    bestseller: false,
    videoThumb: "https://img.youtube.com/vi/UBMk30rjy0o/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=UBMk30rjy0o",
    pdfUrl: "/pdfs/power-shred.pdf",
    tags: ["Cutting", "Advanced", "Shred"],
    includes: [
      "Advanced cutting protocol PDF",
      "Refeed day scheduling guide",
      "Muscle retention training plan",
      "Cardio programming guide",
      "Progress tracking templates",
    ],
    suitableFor: ["female", "male"],
    minBmi: 22, maxBmi: 35,
    activityLevel: ["moderate", "active"],
  },
  {
    id: "body-recomposition",
    title: "Body Recomposition",
    description: "Simultaneously build muscle and lose fat with precision macros and periodised training.",
    longDescription: "Body Recomposition is the most technically demanding goal in fitness — losing fat and gaining muscle at the same time. This programme uses precision macro cycling, strategic training phases, and frequent assessment checkpoints. Best suited for intermediate trainees.",
    image: IMAGES.hero5,
    goal: "lifestyle",
    goalLabel: "Lifestyle",
    level: "Pro",
    durations: [
      { key: "1-month",  label: "1 Month",  price: 479 },
      { key: "3-months", label: "3 Months", price: 1099 },
      { key: "6-months", label: "6 Months", price: 1899 },
    ],
    featured: true,
    bestseller: false,
    videoThumb: "https://img.youtube.com/vi/vcBig73ojpE/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=vcBig73ojpE",
    pdfUrl: "/pdfs/body-recomposition.pdf",
    tags: ["Recomp", "Balanced", "Lifestyle"],
    includes: [
      "Macro cycling protocol PDF",
      "Phase-based training plan",
      "Assessment checkpoint guides",
      "Video workout library",
      "Sleep & recovery guide",
    ],
    suitableFor: ["female", "male"],
    minBmi: 20, maxBmi: 30,
    activityLevel: ["light", "moderate", "active"],
  },
  {
    id: "womens-toning",
    title: "Women's Toning Program",
    description: "Sculpt and tone with resistance training, flexibility work, and a balanced nutrition guide.",
    longDescription: "The Women's Toning Program is specifically designed around female physiology. Focuses on resistance training for sculpting, flexibility and mobility work, and a balanced nutrition approach that accounts for hormonal cycles. No bulking, no extremes — just sustainable, visible results.",
    image: IMAGES.hero6,
    goal: "lifestyle",
    goalLabel: "Lifestyle",
    level: "Normal",
    durations: [
      { key: "1-week",   label: "1 Week",   price: 119 },
      { key: "1-month",  label: "1 Month",  price: 349 },
      { key: "3-months", label: "3 Months", price: 799 },
      { key: "6-months", label: "6 Months", price: 1399 },
    ],
    featured: true,
    bestseller: true,
    videoThumb: "https://img.youtube.com/vi/Mvo2snJGhtM/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Mvo2snJGhtM",
    pdfUrl: "/pdfs/womens-toning.pdf",
    tags: ["Women", "Toning", "Sculpt"],
    includes: [
      "Full toning workout plan PDF",
      "Flexibility & mobility guide",
      "Female nutrition framework",
      "Hormonal cycle training notes",
      "Home & gym workout options",
    ],
    suitableFor: ["female"],
    minBmi: 18, maxBmi: 32,
    activityLevel: ["sedentary", "light", "moderate"],
  },
];

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

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Selam Tadesse",
    role: "Lost 12kg in 3 months",
    image: IMAGES.hero1,
    rating: 5,
    text: "Naodi & Samri's Fat Burn Express plan completely changed my life. The structured program with video guides made it so easy to follow. I never felt lost.",
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
    text: "I've tried so many programs. Naodi & Samri is different — the plans are science-backed, well-structured, and actually work for Ethiopian body types and food culture.",
    plan: "Body Recomposition",
  },
  {
    id: 5,
    name: "Liya Haile",
    role: "Toning & confidence boost",
    image: IMAGES.hero6,
    rating: 5,
    text: "The Women's Toning Program gave me more than a better body — it gave me confidence. Worth every birr.",
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
    excerpt: "Proteins, carbs, and fats — understanding how each affects your body is the first step to crafting a diet that actually works for your goals.",
    image: IMAGES.hero3,
    category: "Nutrition",
    date: "August 20, 2026",
    readTime: "5 min read",
    author: "Naodi & Samri",
  },
  {
    id: "hiit-vs-steady-state",
    title: "HIIT vs Steady-State Cardio: What's Right for You?",
    excerpt: "Both have their place in a well-rounded fitness program. Here's how to know which one aligns with your current goals and fitness level.",
    image: IMAGES.hero1,
    category: "Training",
    date: "August 14, 2026",
    readTime: "4 min read",
    author: "Naodi & Samri",
  },
  {
    id: "bmi-guide",
    title: "BMI Explained: What It Means and What It Doesn't",
    excerpt: "BMI is a useful screening tool, but it's not the full picture. Here's how to interpret your BMI in context.",
    image: IMAGES.hero4,
    category: "Health",
    date: "August 8, 2026",
    readTime: "6 min read",
    author: "Naodi & Samri",
  },
  {
    id: "ethiopian-diet-fitness",
    title: "Ethiopian Foods That Fuel Your Fitness Goals",
    excerpt: "Injera, lentils, tibs — traditional Ethiopian cuisine is packed with nutrients. Here's how to leverage local foods in your fitness journey.",
    image: IMAGES.hero2,
    category: "Nutrition",
    date: "July 30, 2026",
    readTime: "7 min read",
    author: "Naodi & Samri",
  },
  {
    id: "sleep-and-recovery",
    title: "Why Sleep Is Your Most Powerful Recovery Tool",
    excerpt: "You can't out-train poor sleep. Here's the science behind sleep and muscle recovery, and practical tips to optimise yours.",
    image: IMAGES.hero5,
    category: "Recovery",
    date: "July 22, 2026",
    readTime: "5 min read",
    author: "Naodi & Samri",
  },
  {
    id: "women-weight-training",
    title: "Why Women Should Lift Heavy: Busting the Myths",
    excerpt: "Heavy lifting won't make you bulky — it will make you strong, lean, and confident. Here's the evidence-backed truth.",
    image: IMAGES.hero6,
    category: "Training",
    date: "July 15, 2026",
    readTime: "6 min read",
    author: "Naodi & Samri",
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
    q: "What is the difference between Normal, Pro, and VIP plans?",
    a: "These are quality/detail levels set by our experts when creating each plan. Normal plans cover the essentials. Pro plans include more detailed breakdowns, extra video content, and advanced guidance. VIP plans are the most comprehensive with personalised notes and bonus content.",
  },
  {
    q: "What does the duration mean?",
    a: "Duration is how long the plan covers. A 1-month plan gives you a full month of structured workouts or meals. A 3-month plan provides a longer progressive programme. Longer durations offer better value per week.",
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
    q: "Do I need gym equipment?",
    a: "It depends on the plan. Each plan detail page clearly states the equipment needed. Some plans have home-workout alternatives.",
  },
  {
    q: "Why do I need to create an account to purchase?",
    a: "An account is required so we can securely deliver your purchased content, keep your order history, and ensure only you can access what you've paid for.",
  },
];

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Calculate Your BMI",
    description: "Enter your details — age, weight, height, gender, and goals. Our calculator gives you your BMI and daily calorie target.",
  },
  {
    step: "02",
    title: "Get Recommendations",
    description: "Based on your profile, we surface the plans that best match your body, goals, and fitness level.",
  },
  {
    step: "03",
    title: "Choose Your Duration",
    description: "Each plan offers multiple duration options. Pick the timeframe that fits your goals and budget.",
  },
  {
    step: "04",
    title: "Purchase & Access",
    description: "Create an account, complete payment securely, and instantly unlock your PDF guide and video content.",
  },
];

// ─── TEAM ─────────────────────────────────────────────────────────────────────
export const TEAM = [
  {
    name: "Naodi",
    role: "Co-Founder & Fitness Coach",
    bio: "Certified fitness coach specialising in body recomposition, strength training, and women's wellness. Naodi built her own transformation and now helps others do the same.",
    image: IMAGES.naodi2,
    images: [IMAGES.naodi1, IMAGES.naodi2, IMAGES.naodi3],
  },
  {
    name: "Samri",
    role: "Co-Founder & Nutrition Expert",
    bio: "Nutrition specialist and certified personal trainer focused on sustainable diet plans, hormonal health, and helping women achieve lasting results through science-backed guidance.",
    image: IMAGES.samri2,
    images: [IMAGES.samri1, IMAGES.samri2, IMAGES.samri3],
  },
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

export function recommendPlans(profile: UserProfile): Plan[] {
  const bmi = calculateBMI(profile.weight, profile.height);
  const scored = PLANS.map((plan) => {
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
