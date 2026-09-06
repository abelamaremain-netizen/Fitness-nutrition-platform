/*
# Create Core Database Schema

## Overview
This migration creates the complete database schema for a nutrition/fitness plan marketplace platform.
Public users browse and purchase published plans; an authenticated admin manages all content.

## Enums
- `plan_goal` — weight-loss, muscle-gain, nutrition, lifestyle
- `plan_level` — normal, pro, vip
- `plan_duration_key` — 1-week, 1-month, 3-months, 6-months
- `payment_method` — telebirr, cbe, chapa, card
- `order_status` — pending, completed, failed

## Tables

### admins
Links authenticated Supabase users to admin profiles. `id` is the same UUID as `auth.users.id`.
- `id` (uuid, PK, references auth.users)
- `name` (text, not null)
- `email` (text, not null, unique)
- `created_at` (timestamptz, default now())

### plans
Stores nutrition/fitness plans created by the admin.
- `id` (uuid PK)
- `title`, `description`, `long_description`, `goal` (enum), `level` (enum)
- `image_url`, `video_url`, `pdf_url`, `video_thumb` (text, nullable)
- `tags`, `includes`, `suitable_for` (text[], default empty array)
- `min_bmi`, `max_bmi` (numeric, nullable)
- `activity_levels` (text[], default empty array)
- `featured`, `bestseller` (boolean, default false)
- `published` (boolean, default false)
- `created_at`, `updated_at` (timestamptz)

### plan_durations
Pricing tiers per plan. Each (plan_id, key) pair is unique.
- `id` (uuid PK)
- `plan_id` (uuid FK → plans, cascade delete)
- `key` (enum plan_duration_key)
- `label` (text)
- `price` (numeric(10,2), not null)
- `sort_order` (integer, default 0)

### orders
Customer purchase records. Amount is set server-side, never trusted from the client.
- `id` (uuid PK)
- `customer_name`, `customer_email`, `customer_phone` (text)
- `plan_id` (uuid FK → plans)
- `duration_key` (enum), `duration_label` (text)
- `amount` (numeric(10,2))
- `currency` (text, default 'ETB')
- `payment_method` (enum)
- `status` (enum order_status, default 'pending')
- `chapa_tx_ref` (text, nullable, unique)
- `created_at`, `updated_at` (timestamptz)

### order_access
Controls access to paid content. Only unlocked after server-side payment verification.
- `id` (uuid PK)
- `order_id` (uuid FK → orders, cascade delete)
- `plan_id` (uuid FK → plans)
- `email` (text, not null)
- `unlocked` (boolean, default false)
- `unlocked_at` (timestamptz, nullable)

### faqs
- `id`, `question`, `answer`, `sort_order` (int default 0), `created_at`

### testimonials
- `id`, `name`, `role`, `text`, `plan_name`, `image_url`, `rating` (int 1-5), `published` (bool), `sort_order`, `created_at`

### blog_posts
- `id`, `title`, `excerpt`, `body`, `category`, `image_url`, `author`, `published` (bool), `created_at`, `updated_at`

### team_members
- `id`, `name`, `role`, `bio`, `image_url`, `sort_order`, `created_at`

### how_it_works_steps
- `id`, `step_number` (int), `title`, `description`, `image_url`, `sort_order`, `created_at`

### contact_messages
- `id`, `name`, `email`, `subject`, `message`, `is_read` (bool default false), `created_at`

### site_content
Key-value store for site-wide content. `key` is the primary key.
- `key` (text PK)
- `value` (text)
- `updated_at` (timestamptz)

## Indexes
- `plan_durations` on (plan_id, key) unique
- `plan_durations` on (plan_id, sort_order)
- `orders` on (plan_id), (status), (customer_email), (chapa_tx_ref unique)
- `order_access` on (order_id), (plan_id), (email)
- `blog_posts` on (published, created_at)
- `testimonials` on (published, sort_order)
- `faqs` on (sort_order)
- `team_members` on (sort_order)
- `how_it_works_steps` on (sort_order)
- `contact_messages` on (is_read, created_at)
- `plans` on (published), (featured), (bestseller), (goal), (level)

## Triggers
- `update_updated_at_column()` — auto-updates `updated_at` on any row change
- Applied to: plans, orders, blog_posts, site_content

## Security
- RLS enabled on every table (policies added in a separate migration)
*/

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE plan_goal AS ENUM ('weight-loss', 'muscle-gain', 'nutrition', 'lifestyle');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE plan_level AS ENUM ('normal', 'pro', 'vip');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE plan_duration_key AS ENUM ('1-week', '1-month', '3-months', '6-months');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('telebirr', 'cbe', 'chapa', 'card');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- admins
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- plans
-- ============================================================

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  goal plan_goal NOT NULL DEFAULT 'nutrition',
  level plan_level NOT NULL DEFAULT 'normal',
  image_url text,
  video_url text,
  pdf_url text,
  video_thumb text,
  tags text[] NOT NULL DEFAULT '{}',
  includes text[] NOT NULL DEFAULT '{}',
  suitable_for text[] NOT NULL DEFAULT '{}',
  min_bmi numeric(5,2),
  max_bmi numeric(5,2),
  activity_levels text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  bestseller boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_plans_published ON plans (published);
CREATE INDEX IF NOT EXISTS idx_plans_featured ON plans (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_plans_bestseller ON plans (bestseller) WHERE bestseller = true;
CREATE INDEX IF NOT EXISTS idx_plans_goal ON plans (goal);
CREATE INDEX IF NOT EXISTS idx_plans_level ON plans (level);

DROP TRIGGER IF EXISTS trg_plans_updated_at ON plans;
CREATE TRIGGER trg_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- plan_durations
-- ============================================================

CREATE TABLE IF NOT EXISTS plan_durations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  key plan_duration_key NOT NULL,
  label text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE plan_durations ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_plan_durations_plan_key ON plan_durations (plan_id, key);
CREATE INDEX IF NOT EXISTS idx_plan_durations_plan_sort ON plan_durations (plan_id, sort_order);

-- ============================================================
-- orders
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL DEFAULT '',
  plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  duration_key plan_duration_key NOT NULL,
  duration_label text NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'ETB',
  payment_method payment_method NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  chapa_tx_ref text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_orders_plan_id ON orders (plan_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_chapa_tx_ref ON orders (chapa_tx_ref);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- order_access
-- ============================================================

CREATE TABLE IF NOT EXISTS order_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  email text NOT NULL,
  unlocked boolean NOT NULL DEFAULT false,
  unlocked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_access ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_order_access_order_id ON order_access (order_id);
CREATE INDEX IF NOT EXISTS idx_order_access_plan_id ON order_access (plan_id);
CREATE INDEX IF NOT EXISTS idx_order_access_email ON order_access (email);

-- ============================================================
-- faqs
-- ============================================================

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON faqs (sort_order);

-- ============================================================
-- testimonials
-- ============================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  text text NOT NULL,
  plan_name text NOT NULL DEFAULT '',
  image_url text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_testimonials_published_sort ON testimonials (published, sort_order);

-- ============================================================
-- blog_posts
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  image_url text,
  author text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created ON blog_posts (published, created_at DESC);

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- team_members
-- ============================================================

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_team_members_sort_order ON team_members (sort_order);

-- ============================================================
-- how_it_works_steps
-- ============================================================

CREATE TABLE IF NOT EXISTS how_it_works_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE how_it_works_steps ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_how_it_works_sort_order ON how_it_works_steps (sort_order);

-- ============================================================
-- contact_messages
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read_created ON contact_messages (is_read, created_at DESC);

-- ============================================================
-- site_content
-- ============================================================

CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_site_content_updated_at ON site_content;
CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
