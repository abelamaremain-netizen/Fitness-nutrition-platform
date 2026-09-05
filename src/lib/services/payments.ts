import type { PaymentMethod } from "@/src/types/database.types";

// ---------------------------------------------------------------------------
// Payment integration preparation (Telebirr H5 Web Payment)
//
// This module prepares the payment flow for Telebirr integration.
// The actual Telebirr API calls happen in edge functions where the
// secret keys (appId, appKey, publicKey, shortCode) are stored securely
// and never exposed to the browser.
//
// Telebirr H5 Web Payment Flow:
// 1. Customer selects a plan + duration → frontend calls create-order edge function
// 2. Edge function creates the order (server-verified price) → returns order + tx_ref
// 3. Edge function builds a Telebirr prepay request, encrypts it with RSA using
//    the Telebirr public key, and sends it to Telebirr's createOrder endpoint
// 4. Telebirr returns a toPayUrl (payment landing page) → customer is redirected there
// 5. After payment, Telebirr sends a notification to the telebirr-notify edge function
//    (the notifyUrl) with the payment result
// 6. The notify edge function verifies the payment, marks order as completed,
//    and unlocks order_access
// 7. Customer requests paid content → get-paid-content edge function checks access
//    and returns a temporary signed Storage URL
// ---------------------------------------------------------------------------

export const TELEBIRR_API_BASE = "https://app.ethiotelecom.et";

export interface TelebirrPaymentRequest {
  appId: string;
  nonce: string;
  notifyUrl: string;
  outTradeNo: string;
  returnUrl: string;
  shortCode: string;
  subject: string;
  timeoutExpress: string;
  timestamp: string;
  totalAmount: string;
  receiveName?: string;
}

export interface TelebirrPaymentResponse {
  code: string;
  msg: string;
  data?: {
    toPayUrl: string;
  };
}

export interface TelebirrNotifyPayload {
  outTradeNo: string;
  tradeNo: string;
  tradeStatus: string;
  totalAmount: string;
  sign: string;
}

/**
 * Payment method labels for display.
 */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  telebirr: "Telebirr",
  cbe: "CBE (Commercial Bank of Ethiopia)",
  chapa: "Chapa",
  card: "Card",
};

/**
 * The edge function names that handle payment operations.
 */
export const EDGE_FUNCTION_NAMES = {
  createOrder: "create-order",
  telebirrNotify: "telebirr-notify",
  getPaidContent: "get-paid-content",
} as const;
