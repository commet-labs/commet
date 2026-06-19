export type SubscriptionStatus =
  | "draft"
  | "pending_payment"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export type BillingInterval =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "one_time";

export type ConsumptionModel = "metered" | "credits" | "balance";

export type InvoiceType =
  | "recurring"
  | "overage"
  | "plan_change"
  | "adjustment"
  | "credit_purchase"
  | "balance_topup"
  | "addon_activation"
  | "one_time_payment";

export type TransactionStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded"
  | "disputed";

export type FeatureType = "boolean" | "usage" | "seats" | "quota";

export type DiscountType = "percentage" | "amount";

export type Timezone =
  | "UTC"
  | "America/New_York"
  | "America/Chicago"
  | "America/Denver"
  | "America/Los_Angeles"
  | "America/Sao_Paulo"
  | "America/Mexico_City"
  | "America/Buenos_Aires"
  | "America/Santiago"
  | "America/Bogota"
  | "America/Lima"
  | "America/Asuncion"
  | "Europe/London"
  | "Europe/Paris"
  | "Europe/Berlin"
  | "Europe/Madrid"
  | "Asia/Tokyo"
  | "Asia/Shanghai"
  | "Asia/Singapore"
  | "Asia/Dubai"
  | "Australia/Sydney";
