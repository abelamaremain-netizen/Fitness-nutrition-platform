/*
# Seed Data

## Overview
Populates the database with development/testing data:
- site_content: all required keys with placeholder values
- faqs: 4 sample FAQs
- testimonials: 3 sample testimonials
- blog_posts: 3 sample blog posts
- team_members: 3 sample team members
- how_it_works_steps: 4 steps
- plans: 3 sample plans (2 published, 1 draft) with durations

## Important Notes
1. Uses ON CONFLICT DO NOTHING/UPDATE for idempotency — safe to re-run.
2. The draft plan is unpublished so you can test the admin draft/publish flow.
3. Plan durations cover all 4 duration keys with sample prices in ETB.
*/

-- ============================================================
-- site_content
-- ============================================================

INSERT INTO site_content (key, value) VALUES
  ('hero_headline', 'Transform Your Body, Transform Your Life'),
  ('hero_subheadline', 'Expert-Crafted Nutrition & Fitness Plans'),
  ('hero_body', 'Achieve your health goals with scientifically-backed nutrition and fitness programs designed by certified experts. Whether you want to lose weight, build muscle, or adopt a healthier lifestyle, we have a plan for you.'),
  ('hero_cta_primary', 'Browse Plans'),
  ('hero_cta_secondary', 'How It Works'),
  ('mission_statement', 'Our mission is to make professional nutrition and fitness guidance accessible to everyone, empowering individuals to take control of their health through evidence-based programs.'),
  ('about_intro', 'We are a team of certified nutritionists and fitness trainers dedicated to helping you achieve your health and wellness goals through personalized, science-backed programs.'),
  ('contact_email', 'contact@example.com'),
  ('contact_phone', '+251 911 234 567'),
  ('contact_whatsapp', '+251911234567'),
  ('contact_location', 'Addis Ababa, Ethiopia'),
  ('social_instagram', 'https://instagram.com/example'),
  ('social_youtube', 'https://youtube.com/@example'),
  ('social_tiktok', 'https://tiktok.com/@example'),
  ('site_name', 'FitNutrition'),
  ('footer_tagline', 'Your Journey to Better Health Starts Here'),
  ('medical_disclaimer', 'Always consult with a qualified healthcare professional before starting any nutrition or fitness program. These plans are not intended to diagnose, treat, cure, or prevent any disease.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================
-- faqs
-- ============================================================

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('How do I purchase a plan?', 'Browse our catalog of published plans, choose the one that fits your goals, select a duration, and complete the payment. You will receive access to the plan content immediately after your payment is verified.', 1),
  ('What payment methods do you accept?', 'We currently accept Telebirr, CBE (Commercial Bank of Ethiopia), Chapa, and card payments. All transactions are processed securely.', 2),
  ('Can I get a refund?', 'Due to the digital nature of our products, all sales are final. However, if you experience any technical issues accessing your purchased content, please contact us and we will resolve it promptly.', 3),
  ('How long do I have access to my plan?', 'Access duration depends on the plan tier you select. You can choose from 1-week, 1-month, 3-month, or 6-month access periods.', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- testimonials
-- ============================================================

INSERT INTO testimonials (name, role, text, plan_name, image_url, rating, published, sort_order) VALUES
  ('Sarah Johnson', 'Lost 12kg in 3 months', 'The weight loss plan completely changed my life. The meal guides were easy to follow and the workout routines fit perfectly into my busy schedule. I have never felt better!', 'Weight Loss Transformation', NULL, 5, true, 1),
  ('Michael Chen', 'Gained 8kg of muscle', 'As a skinny guy, I always struggled to build muscle. The muscle gain plan gave me the exact nutrition and training schedule I needed. The results speak for themselves.', 'Muscle Building Pro', NULL, 5, true, 2),
  ('Aisha Mohammed', 'Improved energy & lifestyle', 'The lifestyle nutrition plan helped me develop sustainable healthy eating habits. It is not a diet, it is a lifestyle change. My energy levels are through the roof!', 'Healthy Lifestyle Plan', NULL, 5, true, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- blog_posts
-- ============================================================

INSERT INTO blog_posts (title, excerpt, body, category, image_url, author, published, created_at) VALUES
  ('5 Superfoods to Add to Your Diet Today', 'Discover nutrient-packed foods that can boost your energy, improve your immune system, and support your fitness goals.', 'Incorporating superfoods into your daily meals is one of the simplest ways to upgrade your nutrition. Here are five powerhouse foods that deliver exceptional health benefits.

1. Blueberries — Packed with antioxidants and vitamin C, blueberries support brain health and reduce inflammation.

2. Salmon — Rich in omega-3 fatty acids, salmon promotes heart health and supports muscle recovery.

3. Spinach — This leafy green is loaded with iron, calcium, and vitamins A and K.

4. Quinoa — A complete protein source, quinoa provides all nine essential amino acids.

5. Avocado — High in healthy monounsaturated fats, avocados support heart health and keep you feeling full longer.

Start by adding one or two of these to your meals this week and notice the difference in your energy and overall wellbeing.', 'Nutrition', NULL, 'Dr. Emily Carter', true, now() - interval '5 days'),
  ('The Science of Muscle Recovery', 'Understanding how your muscles recover after exercise is key to building strength and preventing injury.', 'Muscle recovery is just as important as the workout itself. When you exercise, you create micro-tears in your muscle fibers. It is during recovery that your body repairs and strengthens those fibers, leading to growth.

Key factors in muscle recovery:

- Protein intake: Aim for 1.6-2.2g of protein per kg of body weight daily.
- Sleep: 7-9 hours of quality sleep is non-negotiable for optimal recovery.
- Hydration: Water transports nutrients to your muscles and removes waste products.
- Active recovery: Light movement on rest days promotes blood flow and reduces soreness.
- Nutrition timing: Consuming protein and carbs within 2 hours post-workout maximizes recovery.

Remember, more training is not always better. Smart training with adequate recovery produces the best results.', 'Fitness', NULL, 'Coach James Wilson', true, now() - interval '12 days'),
  ('Building Sustainable Healthy Habits', 'Lasting health changes come from small, consistent habits rather than drastic overhauls. Here is how to build habits that stick.', 'The biggest mistake people make when trying to get healthy is attempting to change everything at once. Sustainable health is built on small, consistent habits that compound over time.

Start with these foundational habits:

1. Drink a glass of water first thing in the morning.
2. Add one vegetable to every meal.
3. Walk for 15 minutes after lunch.
4. Go to bed 30 minutes earlier than usual.
5. Replace one processed snack with a whole food alternative.

The key is to focus on one habit at a time. Once it becomes automatic, add the next one. Within a few months, you will have transformed your lifestyle without ever feeling like you were on a restrictive plan.', 'Lifestyle', NULL, 'Dr. Emily Carter', true, now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- team_members
-- ============================================================

INSERT INTO team_members (name, role, bio, image_url, sort_order) VALUES
  ('Dr. Emily Carter', 'Chief Nutritionist', 'Dr. Carter holds a PhD in Nutritional Science and has over 10 years of experience helping clients achieve their health goals through evidence-based nutrition strategies.', NULL, 1),
  ('Coach James Wilson', 'Head Fitness Trainer', 'James is a certified strength and conditioning specialist with 8 years of experience training athletes and fitness enthusiasts of all levels.', NULL, 2),
  ('Lisa Anderson', 'Wellness Coach', 'Lisa specializes in lifestyle and behavior change coaching, helping clients build sustainable healthy habits that last a lifetime.', NULL, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- how_it_works_steps
-- ============================================================

INSERT INTO how_it_works_steps (step_number, title, description, image_url, sort_order) VALUES
  (1, 'Browse Plans', 'Explore our catalog of expert-crafted nutrition and fitness plans designed for different goals and fitness levels.', NULL, 1),
  (2, 'Choose Your Duration', 'Select the access period that works for you — from 1 week to 6 months. Each plan is priced according to the duration you choose.', NULL, 2),
  (3, 'Complete Payment', 'Securely pay using your preferred payment method. We accept Telebirr, CBE, Chapa, and card payments.', NULL, 3),
  (4, 'Get Instant Access', 'Once your payment is verified, you will immediately receive access to your plan content, including PDFs and video guides.', NULL, 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- plans (with durations) — using CTEs to avoid variable name conflicts
-- ============================================================

-- Plan 1: Weight Loss (published, featured, bestseller)
WITH new_plan AS (
  INSERT INTO plans (title, description, long_description, goal, level, tags, includes, suitable_for, min_bmi, max_bmi, activity_levels, featured, bestseller, published)
  VALUES (
    'Weight Loss Transformation',
    'A comprehensive weight loss program combining targeted nutrition and progressive exercise.',
    'This 360-degree weight loss program is designed for individuals who want to shed excess weight sustainably. It includes detailed meal plans, grocery lists, progressive workout routines, and weekly progress tracking sheets. Whether you are a beginner or returning to fitness, this plan adapts to your current fitness level and gradually increases intensity as you progress.',
    'weight-loss',
    'normal',
    ARRAY['weight-loss', 'beginner-friendly', 'meal-plan'],
    ARRAY['Detailed meal plans', 'Grocery lists', 'Workout routines', 'Progress tracking sheets', 'Weekly check-ins guide'],
    ARRAY['Beginners', 'Returning to fitness', 'Busy professionals'],
    25.00,
    35.00,
    ARRAY['sedentary', 'lightly-active'],
    true,
    true,
    true
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
INSERT INTO plan_durations (plan_id, key, label, price, sort_order)
SELECT id, dur.key, dur.label, dur.price, dur.sort_order
FROM new_plan, (VALUES
  ('1-week'::plan_duration_key, '1 Week', 299.00, 1),
  ('1-month'::plan_duration_key, '1 Month', 999.00, 2),
  ('3-months'::plan_duration_key, '3 Months', 2499.00, 3),
  ('6-months'::plan_duration_key, '6 Months', 4499.00, 4)
) AS dur(key, label, price, sort_order)
ON CONFLICT (plan_id, key) DO NOTHING;

-- Plan 2: Muscle Gain (published, featured)
WITH new_plan AS (
  INSERT INTO plans (title, description, long_description, goal, level, tags, includes, suitable_for, min_bmi, max_bmi, activity_levels, featured, bestseller, published)
  VALUES (
    'Muscle Building Pro',
    'Advanced muscle-building program with periodized training and precision nutrition.',
    'Built for those serious about building lean muscle mass, this program features periodized training splits, macro-optimized meal plans, supplement guides, and recovery protocols. The plan includes detailed exercise demonstrations, set/rep schemes, and progression models to ensure continuous muscle growth.',
    'muscle-gain',
    'pro',
    ARRAY['muscle-gain', 'intermediate', 'strength'],
    ARRAY['Periodized training splits', 'Macro-optimized meal plans', 'Supplement guide', 'Recovery protocols', 'Exercise video library'],
    ARRAY['Intermediate lifters', 'Athletes', 'Hard gainers'],
    18.00,
    30.00,
    ARRAY['moderately-active', 'very-active'],
    true,
    false,
    true
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
INSERT INTO plan_durations (plan_id, key, label, price, sort_order)
SELECT id, dur.key, dur.label, dur.price, dur.sort_order
FROM new_plan, (VALUES
  ('1-week'::plan_duration_key, '1 Week', 399.00, 1),
  ('1-month'::plan_duration_key, '1 Month', 1299.00, 2),
  ('3-months'::plan_duration_key, '3 Months', 3299.00, 3),
  ('6-months'::plan_duration_key, '6 Months', 5999.00, 4)
) AS dur(key, label, price, sort_order)
ON CONFLICT (plan_id, key) DO NOTHING;

-- Plan 3: Healthy Lifestyle (draft — unpublished)
WITH new_plan AS (
  INSERT INTO plans (title, description, long_description, goal, level, tags, includes, suitable_for, min_bmi, max_bmi, activity_levels, featured, bestseller, published)
  VALUES (
    'Healthy Lifestyle Plan',
    'A sustainable lifestyle nutrition plan for long-term health and energy.',
    'This plan is perfect for those who want to adopt a healthier lifestyle without extreme diets or intense workouts. It focuses on balanced nutrition, mindful eating, gentle daily movement, and stress management techniques. Includes flexible meal templates, habit-tracking worksheets, and lifestyle optimization guides.',
    'lifestyle',
    'normal',
    ARRAY['lifestyle', 'wellness', 'sustainable'],
    ARRAY['Flexible meal templates', 'Habit tracking worksheets', 'Lifestyle optimization guide', 'Mindful eating guide', 'Stress management toolkit'],
    ARRAY['Everyone', 'Busy parents', 'Office workers'],
    NULL,
    NULL,
    ARRAY['sedentary', 'lightly-active', 'moderately-active'],
    false,
    false,
    false
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
INSERT INTO plan_durations (plan_id, key, label, price, sort_order)
SELECT id, dur.key, dur.label, dur.price, dur.sort_order
FROM new_plan, (VALUES
  ('1-week'::plan_duration_key, '1 Week', 199.00, 1),
  ('1-month'::plan_duration_key, '1 Month', 699.00, 2),
  ('3-months'::plan_duration_key, '3 Months', 1799.00, 3),
  ('6-months'::plan_duration_key, '6 Months', 3299.00, 4)
) AS dur(key, label, price, sort_order)
ON CONFLICT (plan_id, key) DO NOTHING;
