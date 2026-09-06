/*
# Fix Security Advisor Warnings

## Changes
1. Set `search_path = public` on `update_updated_at_column()` to fix the mutable search_path warning.
2. Revoke EXECUTE on `is_admin()` from `anon` — anon doesn't need to call it directly via RPC.
   The function is still callable internally by RLS policy predicates (which run with the
   table owner's privileges). Authenticated users retain EXECUTE because RLS policies
   for the `authenticated` role reference `is_admin()`.

## Rationale
- `is_admin()` always returns false for anon (auth.uid() is null), so the security risk is
  minimal, but revoking direct RPC access follows the principle of least privilege.
- `update_updated_at_column()` is a simple trigger function; setting a fixed search_path
  prevents search_path injection attacks.
*/

-- Fix 1: Set search_path on update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix 2: Revoke EXECUTE on is_admin() from anon
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
