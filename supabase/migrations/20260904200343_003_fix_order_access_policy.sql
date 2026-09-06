/*
# Fix order_access SELECT policy

## Changes
- Replaces the `order_access_select_email` policy (which used `current_setting('request.header.x-customer-email')`)
  with an admin-only SELECT policy.

## Rationale
The previous policy attempted to let anon users read their own order_access rows by matching email
via a request header setting. This approach is fragile (the header may not be set) and could expose
other customers' private information if misused.

Instead, order_access is now admin-only for SELECT. The edge function `get-paid-content` uses the
service role key (which bypasses RLS) to check order_access and generate signed storage URLs for
customers who have unlocked access. This keeps customer data private while still allowing the
paid-content flow to work.
*/

DROP POLICY IF EXISTS "order_access_select_email" ON order_access;
DROP POLICY IF EXISTS "order_access_select_admin" ON order_access;

CREATE POLICY "order_access_select_admin" ON order_access
  FOR SELECT TO authenticated
  USING (is_admin());
