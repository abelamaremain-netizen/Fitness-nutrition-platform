/*
# Rename chapa_tx_ref to tx_ref for Telebirr migration

## Overview
Renames the `chapa_tx_ref` column to `tx_ref` in the `orders` table to make the
column name payment-provider-agnostic, as we are switching from Chapa to Telebirr.

## Changes
- `orders.chapa_tx_ref` → `orders.tx_ref` (column rename, same type, same unique constraint)
- The unique index on this column is preserved

## Important Notes
1. This is a safe rename — no data is lost. Existing transaction references remain intact.
2. The column stays nullable and unique, matching the original schema.
3. All edge functions and service code will be updated to use `tx_ref` instead of `chapa_tx_ref`.
*/

ALTER TABLE orders RENAME COLUMN chapa_tx_ref TO tx_ref;
