/*
# Row Level Security Policies

## Overview
This migration creates all RLS policies for the platform. The app has two access tiers:

1. **Public users (anon role)** — can read published content and create orders/contact messages.
2. **Authenticated admins** — can manage all content. Admin status is verified via the `is_admin()` helper.

## is_admin() Helper Function
A SECURITY DEFINER function that checks whether `auth.uid()` exists in the `admins` table.
This avoids exposing the admins table to the anon role and centralizes the admin check.

## Policy Summary by Table

### admins
- SELECT: admin can read own row; authenticated users can read (so auth flow works)
- INSERT/UPDATE/DELETE: admin only

### plans
- SELECT public: published = true (anon can browse)
- SELECT admin: all rows (admin sees drafts too)
- INSERT/UPDATE/DELETE: admin only

### plan_durations
- SELECT public: if parent plan is published
- SELECT admin: all rows
- INSERT/UPDATE/DELETE: admin only

### orders
- INSERT: anon can create orders (the edge function handles this, but the policy allows it)
- SELECT/UPDATE/DELETE: admin only (public users cannot read orders)

### order_access
- SELECT: admin can read all; anon can read their own rows by matching email to order_access.email
  (used to check unlock status after payment — the email is what the customer provides)
- INSERT: admin only (edge function inserts after payment verification)
- UPDATE/DELETE: admin only

### faqs
- SELECT: public (all rows — FAQs are always public)
- INSERT/UPDATE/DELETE: admin only

### testimonials
- SELECT public: published = true
- SELECT admin: all rows
- INSERT/UPDATE/DELETE: admin only

### blog_posts
- SELECT public: published = true
- SELECT admin: all rows
- INSERT/UPDATE/DELETE: admin only

### team_members
- SELECT: public (all rows)
- INSERT/UPDATE/DELETE: admin only

### how_it_works_steps
- SELECT: public (all rows)
- INSERT/UPDATE/DELETE: admin only

### contact_messages
- INSERT: public (anyone can submit a contact message)
- SELECT/UPDATE/DELETE: admin only

### site_content
- SELECT: public (all rows — site content is public)
- INSERT/UPDATE/DELETE: admin only

## Important Notes
1. The `is_admin()` function uses SECURITY DEFINER so it can read the admins table even though anon has no SELECT policy on it.
2. Orders are created via an edge function using the service role key (bypasses RLS). The INSERT policy on orders is for completeness but the edge function is the real gatekeeper.
3. order_access SELECT for anon is scoped by email match — the frontend passes the customer's email to check if their purchase is unlocked.
4. Public users can never read other customers' orders or modify payment status.
*/

-- ============================================================
-- is_admin() helper — SECURITY DEFINER
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
$$;

-- ============================================================
-- admins
-- ============================================================

DROP POLICY IF EXISTS "admins_select_own" ON admins;
CREATE POLICY "admins_select_own" ON admins
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "admins_insert_admin" ON admins;
CREATE POLICY "admins_insert_admin" ON admins
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admins_update_admin" ON admins;
CREATE POLICY "admins_update_admin" ON admins
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admins_delete_admin" ON admins;
CREATE POLICY "admins_delete_admin" ON admins
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- plans
-- ============================================================

DROP POLICY IF EXISTS "plans_select_public" ON plans;
CREATE POLICY "plans_select_public" ON plans
  FOR SELECT TO anon, authenticated
  USING (published = true OR is_admin());

DROP POLICY IF EXISTS "plans_insert_admin" ON plans;
CREATE POLICY "plans_insert_admin" ON plans
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "plans_update_admin" ON plans;
CREATE POLICY "plans_update_admin" ON plans
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "plans_delete_admin" ON plans;
CREATE POLICY "plans_delete_admin" ON plans
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- plan_durations
-- ============================================================

DROP POLICY IF EXISTS "plan_durations_select_public" ON plan_durations;
CREATE POLICY "plan_durations_select_public" ON plan_durations
  FOR SELECT TO anon, authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM plans p
      WHERE p.id = plan_durations.plan_id AND p.published = true
    )
  );

DROP POLICY IF EXISTS "plan_durations_insert_admin" ON plan_durations;
CREATE POLICY "plan_durations_insert_admin" ON plan_durations
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "plan_durations_update_admin" ON plan_durations;
CREATE POLICY "plan_durations_update_admin" ON plan_durations
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "plan_durations_delete_admin" ON plan_durations;
CREATE POLICY "plan_durations_delete_admin" ON plan_durations
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- orders
-- ============================================================

DROP POLICY IF EXISTS "orders_select_admin" ON orders;
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "orders_insert_public" ON orders;
CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "orders_update_admin" ON orders;
CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "orders_delete_admin" ON orders;
CREATE POLICY "orders_delete_admin" ON orders
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- order_access
-- ============================================================

DROP POLICY IF EXISTS "order_access_select_email" ON order_access;
CREATE POLICY "order_access_select_email" ON order_access
  FOR SELECT TO anon, authenticated
  USING (
    is_admin()
    OR email = current_setting('request.header.x-customer-email', true)
  );

DROP POLICY IF EXISTS "order_access_insert_admin" ON order_access;
CREATE POLICY "order_access_insert_admin" ON order_access
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "order_access_update_admin" ON order_access;
CREATE POLICY "order_access_update_admin" ON order_access
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "order_access_delete_admin" ON order_access;
CREATE POLICY "order_access_delete_admin" ON order_access
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- faqs
-- ============================================================

DROP POLICY IF EXISTS "faqs_select_public" ON faqs;
CREATE POLICY "faqs_select_public" ON faqs
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "faqs_insert_admin" ON faqs;
CREATE POLICY "faqs_insert_admin" ON faqs
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "faqs_update_admin" ON faqs;
CREATE POLICY "faqs_update_admin" ON faqs
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "faqs_delete_admin" ON faqs;
CREATE POLICY "faqs_delete_admin" ON faqs
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- testimonials
-- ============================================================

DROP POLICY IF EXISTS "testimonials_select_public" ON testimonials;
CREATE POLICY "testimonials_select_public" ON testimonials
  FOR SELECT TO anon, authenticated
  USING (published = true OR is_admin());

DROP POLICY IF EXISTS "testimonials_insert_admin" ON testimonials;
CREATE POLICY "testimonials_insert_admin" ON testimonials
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "testimonials_update_admin" ON testimonials;
CREATE POLICY "testimonials_update_admin" ON testimonials
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "testimonials_delete_admin" ON testimonials;
CREATE POLICY "testimonials_delete_admin" ON testimonials
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- blog_posts
-- ============================================================

DROP POLICY IF EXISTS "blog_posts_select_public" ON blog_posts;
CREATE POLICY "blog_posts_select_public" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (published = true OR is_admin());

DROP POLICY IF EXISTS "blog_posts_insert_admin" ON blog_posts;
CREATE POLICY "blog_posts_insert_admin" ON blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "blog_posts_update_admin" ON blog_posts;
CREATE POLICY "blog_posts_update_admin" ON blog_posts
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "blog_posts_delete_admin" ON blog_posts;
CREATE POLICY "blog_posts_delete_admin" ON blog_posts
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- team_members
-- ============================================================

DROP POLICY IF EXISTS "team_members_select_public" ON team_members;
CREATE POLICY "team_members_select_public" ON team_members
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "team_members_insert_admin" ON team_members;
CREATE POLICY "team_members_insert_admin" ON team_members
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "team_members_update_admin" ON team_members;
CREATE POLICY "team_members_update_admin" ON team_members
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "team_members_delete_admin" ON team_members;
CREATE POLICY "team_members_delete_admin" ON team_members
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- how_it_works_steps
-- ============================================================

DROP POLICY IF EXISTS "how_it_works_select_public" ON how_it_works_steps;
CREATE POLICY "how_it_works_select_public" ON how_it_works_steps
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "how_it_works_insert_admin" ON how_it_works_steps;
CREATE POLICY "how_it_works_insert_admin" ON how_it_works_steps
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "how_it_works_update_admin" ON how_it_works_steps;
CREATE POLICY "how_it_works_update_admin" ON how_it_works_steps
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "how_it_works_delete_admin" ON how_it_works_steps;
CREATE POLICY "how_it_works_delete_admin" ON how_it_works_steps
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- contact_messages
-- ============================================================

DROP POLICY IF EXISTS "contact_messages_insert_public" ON contact_messages;
CREATE POLICY "contact_messages_insert_public" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "contact_messages_select_admin" ON contact_messages;
CREATE POLICY "contact_messages_select_admin" ON contact_messages
  FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "contact_messages_update_admin" ON contact_messages;
CREATE POLICY "contact_messages_update_admin" ON contact_messages
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "contact_messages_delete_admin" ON contact_messages;
CREATE POLICY "contact_messages_delete_admin" ON contact_messages
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- site_content
-- ============================================================

DROP POLICY IF EXISTS "site_content_select_public" ON site_content;
CREATE POLICY "site_content_select_public" ON site_content
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "site_content_insert_admin" ON site_content;
CREATE POLICY "site_content_insert_admin" ON site_content
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "site_content_update_admin" ON site_content;
CREATE POLICY "site_content_update_admin" ON site_content
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "site_content_delete_admin" ON site_content;
CREATE POLICY "site_content_delete_admin" ON site_content
  FOR DELETE TO authenticated
  USING (is_admin());
