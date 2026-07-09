import type {
  WebhookAddonRef,
  WebhookBalance,
  WebhookBankRef,
  WebhookCardInfo,
  WebhookCreditsBalance,
  WebhookFeatureAccess,
  WebhookPlanRef,
  WebhookSeatSummary,
} from "./models";

import type { PaymentProvider } from "./enums";

export type WebhookEvent =
  | "subscription.created"
  | "subscription.activated"
  | "subscription.reactivated"
  | "subscription.canceled"
  | "subscription.updated"
  | "subscription.plan_changed"
  | "subscription.cancellation_scheduled"
  | "subscription.cancellation_revoked"
  | "subscription.plan_change_scheduled"
  | "subscription.plan_change_revoked"
  | "subscription.past_due"
  | "trial.started"
  | "trial.converted"
  | "trial.expired"
  | "trial.will_end"
  | "trial.checkout_ready"
  | "checkout.ready"
  | "payment.received"
  | "payment.failed"
  | "payment.recovered"
  | "payment.retry_failed"
  | "payment.refunded"
  | "payment.disputed"
  | "payment.dispute_resolved"
  | "payment_link.created"
  | "payment_link.completed"
  | "payment_link.failed"
  | "payment_link.canceled"
  | "invoice.created"
  | "invoice.voided"
  | "invoice.overdue"
  | "invoice.upcoming"
  | "payment_method.attached"
  | "payment_method.updated"
  | "customer.created"
  | "customer.updated"
  | "customer.state_changed"
  | "credits.granted"
  | "credits.purchased"
  | "credits.low"
  | "credits.depleted"
  | "credits.expired"
  | "balance.topped_up"
  | "balance.low"
  | "balance.depleted"
  | "quota.threshold_reached"
  | "quota.exceeded"
  | "seats.updated"
  | "seats.limit_reached"
  | "addon.activated"
  | "addon.deactivated"
  | "usage.recorded"
  | "payout.available"
  | "payout.created"
  | "payout.paid"
  | "payout.failed";

/** Fired when a subscription record is created with status pending_payment. The first charge has not been confirmed yet — do NOT grant access here. Wait for subscription.activated. */
export interface SubscriptionCreatedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The plan ID. */
  planId: string;
  /** The plan name. */
  planName: string;
  /** Current status. One of: draft, pending_payment, trialing, active, past_due, canceled. Access is granted while trialing, active, or past_due — past_due is a permissive grace window during dunning, where you decide whether to keep serving the customer or block them. */
  status: string;
  /** ISO 8601 datetime when the subscription starts. */
  startDate: string;
  /** Optional custom name for the subscription. */
  name: string | null;
}

/** Fired once, when the subscription's first charge succeeds and it becomes active — this is where you grant access. Never re-fired on renewals; use payment.received for per-charge notifications. */
export interface SubscriptionActivatedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Current status. One of: draft, pending_payment, trialing, active, past_due, canceled. Access is granted while trialing, active, or past_due — past_due is a permissive grace window during dunning, where you decide whether to keep serving the customer or block them. */
  status: string;
  /** ISO 8601 start of the current billing period. */
  currentPeriodStart?: string;
  /** ISO 8601 end of the current billing period. */
  currentPeriodEnd?: string;
  /** Optional custom name for the subscription. */
  name: string | null;
  /** The invoice ID for this payment. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** Invoice total in cents (100 = $1.00). */
  invoiceTotal: number;
  /** The invoice currency code. */
  invoiceCurrency: string;
}

/** Fired when a canceled subscription is reactivated and its reactivation charge succeeds. The subscription returns to active with a fresh invoice and a billing period anchored to the reactivation date. Distinct from subscription.activated (first activation) and payment.recovered (past_due recovery, which keeps the original anchor). */
export interface SubscriptionReactivatedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Always "active" for this event. Restore access here. */
  status: string;
  /** ISO 8601 start of the new billing period, anchored to the reactivation date. */
  currentPeriodStart?: string;
  /** ISO 8601 end of the new billing period. */
  currentPeriodEnd?: string;
  /** Optional custom name for the subscription. */
  name: string | null;
  /** The fresh reactivation invoice ID. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** Invoice total in cents (100 = $1.00). */
  invoiceTotal: number;
  /** The invoice currency code. */
  invoiceCurrency: string;
}

/** Fired when a subscription is actually terminated at the end of the billing period. The status is now canceled and access should be revoked. This event is NOT fired when cancellation is scheduled — that triggers subscription.updated instead. See the cancellation lifecycle below. */
export interface SubscriptionCanceledData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Always "canceled" for this event. Revoke access when you receive this. */
  status: string;
  /** ISO 8601 datetime when the customer originally requested cancellation. */
  canceledAt?: string;
  /** The reason for cancellation, if provided. */
  cancelReason: string | null;
  /** ISO 8601 datetime when the subscription ended (matches the billing period end). */
  endDate?: string;
}

/** Fired when subscription details change. The most common trigger is scheduling a cancellation — when a customer cancels, the status stays "active" until the billing period ends, but canceledAt and endDate are set immediately. Use this event to show "your subscription will end on {endDate}" in your UI. Access should NOT be revoked here — wait for subscription.canceled. */
export interface SubscriptionUpdatedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Current status. When cancellation is scheduled, this is still "active" — the subscription remains usable until endDate. */
  status: string;
  /** ISO 8601 datetime when cancellation was requested. Present when cancellation is scheduled, null otherwise. */
  canceledAt?: string;
  /** The reason for cancellation, if provided. */
  cancelReason: string | null;
  /** ISO 8601 datetime when the subscription will end. Present when cancellation is scheduled — this is the date access should be revoked (via subscription.canceled). */
  endDate?: string;
}

/** Fired when a subscription changes from one plan to another, including upgrades, downgrades, and billing interval changes. Access does not change on this event — the subscription stays active. */
export interface SubscriptionPlanChangedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The previous plan (id and name). */
  previousPlan: WebhookPlanRef;
  /** The new plan (id and name). */
  currentPlan: WebhookPlanRef;
  /** The billing interval (monthly, yearly). */
  billingInterval: string | null;
  /** Prorated credit in cents from the previous plan. */
  credit: number;
  /** Prorated charge in cents for the new plan. */
  charge: number;
  /** Total amount charged in cents. */
  totalCharged: number;
}

/** Fired when a cancellation is scheduled for the end of the billing period. The subscription stays active until effectiveAt — do NOT revoke access here. subscription.updated also fires for backward compatibility. */
export interface SubscriptionCancellationScheduledData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Still "active" — the subscription remains usable until effectiveAt. */
  status: string;
  /** ISO 8601 datetime when the cancellation was requested. */
  canceledAt?: string;
  /** The reason for cancellation, if provided. */
  cancelReason: string | null;
  /** ISO 8601 datetime when the cancellation will execute (the billing period end). subscription.canceled fires at this moment. */
  effectiveAt: string;
}

/** Fired when a scheduled cancellation is reverted before it executes. The subscription continues on its current plan and billing period as if it had never been canceled. */
export interface SubscriptionCancellationRevokedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Current status — typically "active". The scheduled cancellation no longer applies. */
  status: string;
  /** ISO 8601 end of the current billing period, which continues normally. */
  currentPeriodEnd?: string;
}

/** Fired when a plan change (downgrade or shorter interval) is scheduled for the end of the billing period. The subscription stays on the current plan until effectiveAt, when subscription.plan_changed fires. */
export interface SubscriptionPlanChangeScheduledData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Current status — the subscription stays usable. */
  status: string;
  /** The plan currently in effect (id and name). */
  currentPlan: WebhookPlanRef;
  /** The plan that takes effect at effectiveAt (id and name). */
  scheduledPlan: WebhookPlanRef;
  /** The current billing interval. */
  billingInterval: string | null;
  /** The new billing interval, if the change includes one. Null when only the plan changes. */
  scheduledBillingInterval: string | null;
  /** ISO 8601 datetime when the change executes (the billing period end). */
  effectiveAt: string;
}

/** Fired when a scheduled plan change is replaced by a different one before it executes. The replacement also fires subscription.plan_change_scheduled with the new target plan. */
export interface SubscriptionPlanChangeRevokedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Current status — the subscription stays usable. */
  status: string;
  /** The plan currently in effect (id and name). */
  currentPlan: WebhookPlanRef;
  /** The previously scheduled plan that will no longer take effect (id and name). */
  revokedPlan: WebhookPlanRef;
  /** The current billing interval. */
  billingInterval: string | null;
  /** The previously scheduled billing interval, if the revoked change included one. */
  revokedBillingInterval: string | null;
}

/** Fired when a recurring payment fails on a previously paid subscription and its status becomes past_due. Access is cut immediately for past_due subscriptions — use this to notify the customer and recover the payment. */
export interface SubscriptionPastDueData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Always "past_due" for this event. */
  status: string;
  /** The invoice whose payment failure triggered the status. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
}

/** Fired when a subscription enters its trial period after checkout. Grant access here — trialing subscriptions have full access until trialEndsAt. */
export interface TrialStartedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Always "trialing" for this event. */
  status: string;
  /** The plan ID. */
  planId: string;
  /** The plan name. */
  planName: string;
  /** ISO 8601 datetime when the trial ends. */
  trialEndsAt: string;
}

/** Fired when a trialing customer converts to a paid subscription before the trial ends — today this happens when they change plan during the trial, which charges the full new plan price immediately. Trials that simply run out fire trial.expired instead. */
export interface TrialConvertedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Always "active" for this event. */
  status: string;
  /** The plan ID the customer converted to. */
  planId: string;
  /** The plan name. */
  planName: string;
}

/** Fired when a trial period runs out and the billing cycle activates the subscription. The first regular invoice is generated right after — this is the natural trial-to-paid transition. */
export interface TrialExpiredData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Current status — "active" once the billing cycle has activated the subscription. */
  status: string;
  /** The plan ID. */
  planId: string;
  /** The plan name. */
  planName: string;
  /** ISO 8601 datetime when the trial ended. */
  trialEndsAt: string;
}

/** Predictive event fired once, 3 days before a trial ends. Use it to remind the customer that billing starts soon. Emitted by a daily scan with a deterministic idempotency key, so it never fires twice for the same trial end date. */
export interface TrialWillEndData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Always "trialing" for this event. */
  status: string;
  /** The plan ID. */
  planId: string;
  /** The plan name. */
  planName: string;
  /** ISO 8601 datetime when the trial will end. */
  trialEndsAt: string;
}

/** Fired when a trial checkout link is ready to share with the customer. Completing this checkout saves a payment method and starts the trial (trial.started) — the customer is not charged until the trial ends. */
export interface TrialCheckoutReadyData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The plan name. */
  planName: string;
  /** The length of the trial in days. */
  trialDays: number;
  /** The hosted checkout URL to share with the customer. */
  checkoutUrl: string;
}

/** Fired when a checkout link for a subscription's first invoice is ready to share with the customer. Commet also emails the link — use this event to deliver it through your own channels. */
export interface CheckoutReadyData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The invoice this checkout collects. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** Invoice total in cents (100 = $1.00). */
  invoiceTotal: number;
  /** The invoice currency code. */
  invoiceCurrency: string;
  /** The hosted checkout URL to share with the customer. */
  checkoutUrl: string;
}

/** Fired every time a payment settles successfully — the first payment and every renewal alike. subscription.activated fires alongside it only on the first one. */
export interface PaymentReceivedData {
  /** The invoice ID. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** Invoice total in cents (100 = $1.00). */
  invoiceTotal: number;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID. */
  subscriptionId: string | null;
  /** The payment transaction ID. */
  paymentTransactionId: string | null;
  /** The payment provider the charge was routed to: stripe, commet, or dlocal. Null for billing-only charges with no Commet ledger row. */
  provider: PaymentProvider | null;
  /** Gross amount in cents before fees. */
  grossAmount: number | null;
  /** The payment currency code. */
  currency: string | null;
  /** Net amount after fees in cents. */
  orgNetAmount: number | null;
  /** The customer email used for this payment. */
  customerEmail: string | null;
  /** ISO 8601 datetime when the payment was received. */
  paidAt?: string;
}

/** Fired when a recurring charge fails. This event is for recurring charge failures only — card declines during initial checkout do not trigger this event. */
export interface PaymentFailedData {
  /** The invoice ID, if available. */
  invoiceId: string;
  /** The human-readable invoice number, if available. */
  invoiceNumber: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
  /** The failure code from the payment processor. */
  failureCode: string;
  /** A human-readable failure message. */
  failureMessage: string;
  /** A ready-to-use link the customer can follow to retry this payment, or null when no recovery path applies. For a first failed charge (pending_payment) it is the checkout URL; for a failed renewal (past_due) it is a signed recovery link — no separate createRecoveryLink call needed. */
  recoveryUrl: string | null;
}

/** Fired when an outstanding invoice that previously failed is successfully paid — automatically on retry or by the customer through the portal. The subscription returns to active at the same time; use this event to close the dunning flow you opened on payment.failed. */
export interface PaymentRecoveredData {
  /** The recovered invoice ID. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** Invoice total in cents (100 = $1.00). */
  invoiceTotal: number;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
}

/** Fired when all dunning retries are exhausted and the subscription is canceled. This is the terminal event of the dunning flow — payment.recovered will not follow. Revoke access when you receive this. */
export interface PaymentRetryFailedData {
  /** The invoice whose retries were exhausted. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID. */
  subscriptionId: string;
  /** Terminal dunning reason, usually the last processor decline code or "dunning_exhausted". */
  reason: string;
}

/** Fired when a payment is refunded, fully or partially. A full refund of a subscription invoice also cancels the subscription immediately (subscription.canceled fires with reason refund); partial refunds leave the subscription untouched. */
export interface PaymentRefundedData {
  /** The refunded payment transaction ID. */
  paymentTransactionId: string;
  /** The payment provider the charge was routed to: stripe, commet, or dlocal. */
  provider: PaymentProvider;
  /** The payment link the payment originated from, or null when the payment did not come from a payment link. */
  paymentLinkId: string | null;
  /** The invoice the payment collected, or null for payments without an invoice. */
  invoiceId: string | null;
  /** The human-readable invoice number, if available. */
  invoiceNumber: string | null;
  /** The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string | null;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
  /** The refunded amount in cents (100 = $1.00). */
  refundAmount: number;
  /** The refund currency code. */
  currency: string;
}

/** Fired when a cardholder opens a dispute (chargeback) against a payment. The disputed amount is frozen from your payout balance while the dispute is open; Commet, as the Merchant of Record, handles the resolution process. payment.dispute_resolved fires with the outcome. */
export interface PaymentDisputedData {
  /** The disputed payment transaction ID. */
  paymentTransactionId: string;
  /** The payment provider the charge was routed to: stripe, commet, or dlocal. */
  provider: PaymentProvider;
  /** The payment link the payment originated from, or null when the payment did not come from a payment link. */
  paymentLinkId: string | null;
  /** The invoice the payment collected, or null for payments without an invoice. */
  invoiceId: string | null;
  /** The human-readable invoice number, if available. */
  invoiceNumber: string | null;
  /** The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string | null;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
  /** The contested amount in cents (100 = $1.00). */
  disputeAmount: number;
  /** The dispute currency code. */
  currency: string;
  /** The provider's reason code (e.g. fraudulent, product_not_received), or null when none is given. */
  disputeReason: string | null;
}

/** Fired when a dispute is closed. Carries the same identifiers as payment.disputed plus the outcome: won restores the frozen amount to your balance, lost keeps the chargeback deducted. */
export interface PaymentDisputeResolvedData {
  /** The disputed payment transaction ID. */
  paymentTransactionId: string;
  /** The payment provider the charge was routed to: stripe, commet, or dlocal. */
  provider: PaymentProvider;
  /** The payment link the payment originated from, or null when the payment did not come from a payment link. */
  paymentLinkId: string | null;
  /** The invoice the payment collected, or null for payments without an invoice. */
  invoiceId: string | null;
  /** The human-readable invoice number, if available. */
  invoiceNumber: string | null;
  /** The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string | null;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
  /** The contested amount in cents (100 = $1.00). */
  disputeAmount: number;
  /** The dispute currency code. */
  currency: string;
  /** The provider's reason code, or null when none is given. */
  disputeReason: string | null;
  /** The resolution: "won" or "lost". */
  outcome: string;
}

/** Fired when a payment link is created. The link is pending — the customer has not paid yet. Do NOT fulfill here; wait for payment_link.completed. */
export interface PaymentLinkCreatedData {
  /** The payment link ID. */
  paymentId: string;
  /** The link status. Always "pending" for this event. */
  status: string;
  /** The total amount to collect in cents (100 = $1.00). */
  amount: number;
  /** The payment currency code. */
  currency: string;
  /** The payment description shown to the customer. */
  description: string;
  /** The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string | null;
}

/** Fired when a payment link is paid. The charge settled and a one-time invoice was generated. Fulfill the purchase on this event. */
export interface PaymentLinkCompletedData {
  /** The payment link ID. */
  paymentId: string;
  /** The link status. Always "succeeded" for this event. */
  status: string;
  /** The collected amount in cents (100 = $1.00). */
  amount: number;
  /** The payment currency code. */
  currency: string;
  /** The payment description shown to the customer. */
  description: string;
  /** The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string | null;
  /** The one-time invoice generated for this payment. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** The payment transaction ID for the settled charge. */
  paymentTransactionId: string | null;
}

/** Fired when a payment link charge attempt is declined. The link stays open and can be paid again — a failed link is retryable. */
export interface PaymentLinkFailedData {
  /** The payment link ID. */
  paymentId: string;
  /** The link status. Always "failed" for this event. */
  status: string;
  /** The amount that was attempted in cents (100 = $1.00). */
  amount: number;
  /** The payment currency code. */
  currency: string;
  /** The payment description shown to the customer. */
  description: string;
  /** The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string | null;
  /** The failure code from the payment processor. */
  failureCode: string;
  /** A human-readable failure message. */
  failureMessage: string;
}

/** Fired when a pending payment link is canceled before being paid. A canceled link can no longer be paid. */
export interface PaymentLinkCanceledData {
  /** The payment link ID. */
  paymentId: string;
  /** The link status. Always "canceled" for this event. */
  status: string;
  /** The total amount of the canceled link in cents (100 = $1.00). */
  amount: number;
  /** The payment currency code. */
  currency: string;
  /** The payment description shown to the customer. */
  description: string;
  /** The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string | null;
}

/** Fired when a new invoice is generated for a subscription, typically at the start of a billing period. */
export interface InvoiceCreatedData {
  /** The invoice ID. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** The invoice status (e.g. pending, paid). */
  invoiceStatus: string;
  /** ISO 8601 start of the billing period. */
  periodStart: string;
  /** ISO 8601 end of the billing period. */
  periodEnd: string;
  /** ISO 8601 date the invoice was issued. */
  issueDate: string;
  /** ISO 8601 date the invoice is due. */
  dueDate: string;
  /** The invoice currency code. */
  currency: string;
  /** Subtotal in cents (100 = $1.00). */
  subtotal: number;
  /** Total in cents (100 = $1.00). */
  total: number;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
}

/** Fired when an invoice is voided — nullified before collection, either manually or automatically when its subscription is canceled. Voiding is terminal: a void invoice is never retried or collected. */
export interface InvoiceVoidedData {
  /** The invoice ID. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** Always "void" for this event. */
  invoiceStatus: string;
  /** ISO 8601 start of the billing period. */
  periodStart: string;
  /** ISO 8601 end of the billing period. */
  periodEnd: string;
  /** ISO 8601 date the invoice was issued. */
  issueDate: string;
  /** ISO 8601 date the invoice was due. */
  dueDate: string;
  /** The invoice currency code. */
  currency: string;
  /** Subtotal in cents (100 = $1.00). */
  subtotal: number;
  /** Total in cents (100 = $1.00). */
  total: number;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
}

/** Fired once when an outstanding invoice passes its due date without payment. The invoice keeps its outstanding status — overdue is a fact about the due date, not a new status. Use it to start your own dunning flow. */
export interface InvoiceOverdueData {
  /** The invoice ID. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** Always "outstanding" for this event. */
  invoiceStatus: string;
  /** ISO 8601 start of the billing period. */
  periodStart: string;
  /** ISO 8601 end of the billing period. */
  periodEnd: string;
  /** ISO 8601 date the invoice was issued. */
  issueDate: string;
  /** ISO 8601 date the invoice was due — now in the past. */
  dueDate: string;
  /** The invoice currency code. */
  currency: string;
  /** Subtotal in cents (100 = $1.00). */
  subtotal: number;
  /** Total in cents (100 = $1.00). */
  total: number;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID, if the invoice is linked to a subscription. */
  subscriptionId: string | null;
}

/** Predictive event fired once, 3 days before an active subscription renews. Use it to notify the customer before they are charged. Carries no amount — usage-based charges are only final at renewal, when invoice.created delivers the actual invoice. */
export interface InvoiceUpcomingData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Always "active" for this event. */
  status: string;
  /** The plan ID. */
  planId: string;
  /** The plan name. */
  planName: string;
  /** The billing interval (monthly, yearly). */
  billingInterval: string | null;
  /** ISO 8601 datetime when the current period ends and the renewal invoice is issued. */
  currentPeriodEnd: string;
}

/** Fired when Commet records a payment method for a subscription: after a paid checkout, when a trial starts with a card on file, or when a zero-total checkout completes. The card object carries display metadata only — full numbers never leave the payment provider. */
export interface PaymentMethodAttachedData {
  /** The subscription the payment method was saved for. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Card display metadata: brand, last4, expMonth, expYear. Null when the method is not a card or its details cannot be retrieved. */
  card: WebhookCardInfo | null;
}

/** Fired when a customer replaces their default payment method through the customer portal. The new method applies to all of the customer's subscriptions. A payment method update is also a strong recovery signal for past-due subscriptions. */
export interface PaymentMethodUpdatedData {
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Card display metadata for the new method: brand, last4, expMonth, expYear. Null when the method is not a card or its details cannot be retrieved. */
  card: WebhookCardInfo | null;
}

/** Fired when a customer is created, via the API (including batch create), SDK, or dashboard. The payload is the customer resource exactly as GET /customers returns it. */
export interface CustomerCreatedData {
  /** The Commet customer ID (cus_...). */
  id: string;
  /** Your own identifier for this customer, if you provided one. */
  externalId: string | null;
  /** The customer's full name. */
  fullName: string | null;
  /** The customer's email. */
  email: string;
  /** The customer's tax identification number, if provided. */
  taxDocument: string | null;
  /** The local tax document type label inferred from the customer's country (e.g. CUIT, RFC, RUT), or null when no tax document was provided. */
  documentType: string | null;
  /** The customer's timezone. */
  timezone: string | null;
  /** Custom key-value metadata you attached to the customer. */
  metadata: Record<string, unknown> | null;
  /** ISO 8601 datetime when the customer was created. */
  createdAt: string;
  /** ISO 8601 datetime of the last update. */
  updatedAt: string;
}

/** Fired when a customer's details change (email, name, timezone, externalId, or metadata). Carries the same customer resource shape as customer.created with the current values. */
export interface CustomerUpdatedData {
  /** The Commet customer ID (cus_...). */
  id: string;
  /** Your own identifier for this customer, if you provided one. */
  externalId: string | null;
  /** The customer's full name. */
  fullName: string | null;
  /** The customer's email. */
  email: string;
  /** The customer's tax identification number, if provided. */
  taxDocument: string | null;
  /** The local tax document type label inferred from the customer's country (e.g. CUIT, RFC, RUT), or null when no tax document was provided. */
  documentType: string | null;
  /** The customer's timezone. */
  timezone: string | null;
  /** Custom key-value metadata you attached to the customer. */
  metadata: Record<string, unknown> | null;
  /** ISO 8601 datetime when the customer was created. */
  createdAt: string;
  /** ISO 8601 datetime of this update. */
  updatedAt: string;
}

/** Aggregate entitlement event answering one question: what can this customer access right now? Fired on every entitlement transition (subscription lifecycle, plan changes, trials, past due, scheduled cancellations) with the customer's CURRENT subscription, plan, features, seats, and credits or balance. Handle this single event to keep access in sync instead of wiring every lifecycle event. */
export interface CustomerStateChangedData {
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** What caused the transition. One of: subscription_created, subscription_activated, subscription_canceled, plan_change, past_due, trial_started, trial_converted, trial_expired, cancellation_scheduled, cancellation_revoked, seats_updated, addon_activated, addon_deactivated, credits_depleted, balance_depleted, quota_exceeded. */
  trigger: string;
  /** The customer's current subscription status, or "none" when no live subscription exists. Access is granted while trialing, active, or past_due — past_due is a permissive grace window during dunning. */
  status: string;
  /** The live subscription ID, or null when status is none. */
  subscriptionId: string | null;
  /** The current plan (id and name), or null when status is none. */
  plan: WebhookPlanRef | null;
  /** The current billing interval. */
  billingInterval: string | null;
  /** The plan's consumption model: metered, credits, or balance. */
  consumptionModel: string | null;
  /** Current feature access, one entry per plan feature: code, name, type, allowed, enabled, current, included, remaining, overageQuantity, overageUnitPrice, unlimited, overageEnabled, billedQuantity. Fields that do not apply to a feature type are null. */
  features: Array<WebhookFeatureAccess>;
  /** Summary of seats-type features: code, current, included, remaining, unlimited. */
  seats: Array<WebhookSeatSummary>;
  /** For credits plans: planCredits, purchasedCredits, totalCredits. Null otherwise. */
  credits: WebhookCreditsBalance | null;
  /** For balance plans: currentBalance in rate scale (10000 = $1.00). Null otherwise. */
  balance: WebhookBalance | null;
}

/** Fired when non-purchase credits are granted to a subscription: plan-included credits at the start of each billing period, or a manual adjustment from the dashboard. Credit pack purchases fire credits.purchased instead. */
export interface CreditsGrantedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The number of credits granted. */
  credits: number;
  /** Why the credits were granted: period_reset or manual_adjustment. */
  reason: string;
}

/** Fired when a customer buys a credit pack through the customer portal and the payment succeeds. Purchased credits never expire — unlike plan credits, they survive period resets. Plan-included credit grants fire credits.granted instead. */
export interface CreditsPurchasedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The invoice issued for the purchase. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** The purchased credit pack's name. */
  creditPackName: string;
  /** The number of credits purchased. */
  credits: number;
}

/** Fired when a subscription's remaining credits cross below 10% of the credits granted for the current period. Emitted once per billing period, when the crossing happens. */
export interface CreditsLowData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Total credits remaining (plan plus purchased). */
  remainingCredits: number;
  /** The low-credit threshold that was crossed: 10% of the period's granted plan credits. */
  thresholdCredits: number;
  /** The plan credits granted at the last period reset. */
  periodCredits: number;
}

/** Fired when a subscription's credits hit zero. Usage requests that need more credits than remain are rejected from this point. Also fires customer.state_changed with trigger credits_depleted. */
export interface CreditsDepletedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** Credits remaining after depletion. Always 0. */
  remainingCredits: number;
}

/** Fired at the period reset when unused plan credits from the previous period are discarded. Plan credits expire at period end; purchased credits never expire and are not affected. */
export interface CreditsExpiredData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The unused plan credits that were discarded. */
  expiredCredits: number;
}

/** Fired when a customer on a balance plan tops up their prepaid balance through the customer portal and the payment succeeds. */
export interface BalanceToppedUpData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The invoice issued for the top-up. */
  invoiceId: string;
  /** The human-readable invoice number. */
  invoiceNumber: string;
  /** The topped-up value in rate scale (10000 = $1.00 of the subscription currency). */
  amount: number;
  /** The subscription currency. */
  currency: string;
}

/** Fired when a subscription's prepaid balance crosses below 10% of its last refill (period reset, top-up, or manual adjustment). Emitted once per crossing. */
export interface BalanceLowData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The remaining balance in rate scale (10000 = $1.00 of the subscription currency). */
  currentBalance: number;
  /** The low-balance threshold that was crossed: 10% of the last refill, in rate scale. */
  thresholdBalance: number;
  /** The subscription currency. */
  currency: string;
}

/** Fired when a subscription's prepaid balance crosses to zero or below. With block-on-exhaustion plans further usage is rejected; otherwise the balance can go negative. Also fires customer.state_changed with trigger balance_depleted. */
export interface BalanceDepletedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The balance after depletion in rate scale. Zero, or negative when overage is allowed. */
  currentBalance: number;
  /** The subscription currency. */
  currency: string;
}

/** Fired when a metered feature's usage crosses 80% of its included quantity for the current period. Emitted once per feature per billing period, when the crossing happens. */
export interface QuotaThresholdReachedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The metered feature code. */
  featureCode: string;
  /** Total usage in the current period after the crossing. */
  currentUsage: number;
  /** The included quantity for the period. */
  includedAmount: number;
  /** ISO 8601 start of the usage period. */
  periodStart: string;
}

/** Fired when a metered feature passes its included quantity. With overage enabled it means overage billing began; with overage disabled it means the hard limit was hit and further usage is rejected (this case also fires customer.state_changed with trigger quota_exceeded). Emitted once per feature per billing period. */
export interface QuotaExceededData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The metered feature code. */
  featureCode: string;
  /** Total usage in the current period. */
  currentUsage: number;
  /** The included quantity for the period. */
  includedAmount: number;
  /** True when overage billing began; false when the hard limit was hit and usage is now blocked. */
  overageEnabled: boolean;
  /** ISO 8601 start of the usage period. */
  periodStart: string;
}

/** Fired when a customer's seat count changes for a seats-type feature — via the SDK seats endpoints or the dashboard. Also fires customer.state_changed with trigger seats_updated. */
export interface SeatsUpdatedData {
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The live subscription ID, or null when the customer has no live subscription. */
  subscriptionId: string | null;
  /** The seats feature code. */
  featureCode: string;
  /** The seat count before the change. */
  previousSeats: number;
  /** The seat count after the change. */
  currentSeats: number;
}

/** Fired when a seat change reaches or passes the included seat limit of the customer's plan. Emitted once per crossing — only when the count moves from below the limit to at or above it. */
export interface SeatsLimitReachedData {
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The subscription ID. */
  subscriptionId: string;
  /** The seats feature code. */
  featureCode: string;
  /** The seat count after the change. */
  currentSeats: number;
  /** The included seat limit of the plan. */
  includedSeats: number;
}

/** Fired when an add-on is activated on a subscription — via the API or a customer portal purchase. The prorated activation charge, if any, has already succeeded. Also fires customer.state_changed with trigger addon_activated. */
export interface AddonActivatedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The add-on: id and name. */
  addon: WebhookAddonRef;
  /** The feature the add-on unlocks or extends. */
  featureCode: string;
  /** The prorated amount charged at activation in rate scale (10000 = $1.00). Zero when nothing was charged. */
  proratedPrice: number;
  /** The subscription currency. */
  currency: string;
}

/** Fired when an active add-on is deactivated from a subscription. Also fires customer.state_changed with trigger addon_deactivated. */
export interface AddonDeactivatedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The add-on: id and name. */
  addon: WebhookAddonRef;
  /** The feature the add-on unlocked or extended. */
  featureCode: string;
}

/** Fired for every processed usage event. HIGH VOLUME: this fires once per tracked event, so it is excluded from family select-all in the dashboard — subscribe to it explicitly and make sure your endpoint can absorb your own ingest rate. */
export interface UsageRecordedData {
  /** The subscription ID. */
  subscriptionId: string;
  /** The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId. */
  customerId: string;
  /** The usage event ID. */
  usageEventId: string;
  /** The feature code the usage was tracked against. */
  featureCode: string;
  /** The recorded quantity. For AI model events this is the total token count. */
  value: number;
  /** ISO 8601 timestamp of the usage event. */
  ts: string;
}

/** Organization-level event about YOUR money as the merchant. Fired when payment funds the provider was holding become available to pay out to your bank. */
export interface PayoutAvailableData {
  /** Your full available payout balance in cents (100 = $1.00) at the time of the event — not just the newly released funds. */
  availableAmount: number;
  /** The payout balance currency. Always "usd". */
  currency: string;
}

/** Fired when a payout of your available balance is requested and the transfer toward your bank is initiated. The lifecycle continues with payout.paid or payout.failed. */
export interface PayoutCreatedData {
  /** The payout ID. */
  payoutId: string;
  /** Gross payout amount in cents (100 = $1.00). */
  amount: number;
  /** Provider transfer fee in cents. */
  fee: number;
  /** What reaches your bank in cents (amount minus fee). */
  netAmount: number;
  /** The payout currency. Always "usd". */
  currency: string;
  /** The payout status. "pending" at creation. */
  status: string;
  /** Destination bank display metadata: bankName and last4. Full account numbers never appear in webhook payloads. */
  destinationBank: WebhookBankRef | null;
  /** ISO 8601 datetime when the payout was created. */
  createdAt: string;
}

/** Fired when the bank settlement of a payout completes — the moment the money actually reaches your bank account, confirmed by the payment provider. Fires exactly once per payout. */
export interface PayoutPaidData {
  /** The payout ID. */
  payoutId: string;
  /** Gross payout amount in cents (100 = $1.00). */
  amount: number;
  /** Provider transfer fee in cents. */
  fee: number;
  /** What reached your bank in cents (amount minus fee). */
  netAmount: number;
  /** The payout currency. Always "usd". */
  currency: string;
  /** Always "paid" for this event. */
  status: string;
  /** Destination bank display metadata: bankName and last4. */
  destinationBank: WebhookBankRef | null;
  /** ISO 8601 datetime when the provider confirmed the deposit arrived. */
  paidAt: string | null;
}

/** Fired when the provider reports a payout could not be completed — most commonly a bank rejection (closed account, invalid details). The funds return to your available balance. */
export interface PayoutFailedData {
  /** The payout ID. */
  payoutId: string;
  /** Gross payout amount in cents (100 = $1.00). */
  amount: number;
  /** Provider transfer fee in cents. */
  fee: number;
  /** What would have reached your bank in cents. */
  netAmount: number;
  /** The payout currency. Always "usd". */
  currency: string;
  /** Always "failed" for this event. */
  status: string;
  /** Destination bank display metadata: bankName and last4. */
  destinationBank: WebhookBankRef | null;
  /** ISO 8601 datetime when the failure was recorded. */
  failedAt: string | null;
  /** The provider's failure code, when available. */
  failureCode: string | null;
  /** A human-readable failure message, when available. */
  failureMessage: string | null;
}

export interface WebhookEventEnvelope<E extends WebhookEvent, D> {
  event: E;
  timestamp: string;
  organizationId: string;
  mode: "live" | "sandbox";
  /** API version date, e.g. "2026-06-10" */
  apiVersion: string;
  data: D;
}

export type WebhookEventPayload =
  | WebhookEventEnvelope<"subscription.created", SubscriptionCreatedData>
  | WebhookEventEnvelope<"subscription.activated", SubscriptionActivatedData>
  | WebhookEventEnvelope<
      "subscription.reactivated",
      SubscriptionReactivatedData
    >
  | WebhookEventEnvelope<"subscription.canceled", SubscriptionCanceledData>
  | WebhookEventEnvelope<"subscription.updated", SubscriptionUpdatedData>
  | WebhookEventEnvelope<
      "subscription.plan_changed",
      SubscriptionPlanChangedData
    >
  | WebhookEventEnvelope<
      "subscription.cancellation_scheduled",
      SubscriptionCancellationScheduledData
    >
  | WebhookEventEnvelope<
      "subscription.cancellation_revoked",
      SubscriptionCancellationRevokedData
    >
  | WebhookEventEnvelope<
      "subscription.plan_change_scheduled",
      SubscriptionPlanChangeScheduledData
    >
  | WebhookEventEnvelope<
      "subscription.plan_change_revoked",
      SubscriptionPlanChangeRevokedData
    >
  | WebhookEventEnvelope<"subscription.past_due", SubscriptionPastDueData>
  | WebhookEventEnvelope<"trial.started", TrialStartedData>
  | WebhookEventEnvelope<"trial.converted", TrialConvertedData>
  | WebhookEventEnvelope<"trial.expired", TrialExpiredData>
  | WebhookEventEnvelope<"trial.will_end", TrialWillEndData>
  | WebhookEventEnvelope<"trial.checkout_ready", TrialCheckoutReadyData>
  | WebhookEventEnvelope<"checkout.ready", CheckoutReadyData>
  | WebhookEventEnvelope<"payment.received", PaymentReceivedData>
  | WebhookEventEnvelope<"payment.failed", PaymentFailedData>
  | WebhookEventEnvelope<"payment.recovered", PaymentRecoveredData>
  | WebhookEventEnvelope<"payment.retry_failed", PaymentRetryFailedData>
  | WebhookEventEnvelope<"payment.refunded", PaymentRefundedData>
  | WebhookEventEnvelope<"payment.disputed", PaymentDisputedData>
  | WebhookEventEnvelope<"payment.dispute_resolved", PaymentDisputeResolvedData>
  | WebhookEventEnvelope<"payment_link.created", PaymentLinkCreatedData>
  | WebhookEventEnvelope<"payment_link.completed", PaymentLinkCompletedData>
  | WebhookEventEnvelope<"payment_link.failed", PaymentLinkFailedData>
  | WebhookEventEnvelope<"payment_link.canceled", PaymentLinkCanceledData>
  | WebhookEventEnvelope<"invoice.created", InvoiceCreatedData>
  | WebhookEventEnvelope<"invoice.voided", InvoiceVoidedData>
  | WebhookEventEnvelope<"invoice.overdue", InvoiceOverdueData>
  | WebhookEventEnvelope<"invoice.upcoming", InvoiceUpcomingData>
  | WebhookEventEnvelope<"payment_method.attached", PaymentMethodAttachedData>
  | WebhookEventEnvelope<"payment_method.updated", PaymentMethodUpdatedData>
  | WebhookEventEnvelope<"customer.created", CustomerCreatedData>
  | WebhookEventEnvelope<"customer.updated", CustomerUpdatedData>
  | WebhookEventEnvelope<"customer.state_changed", CustomerStateChangedData>
  | WebhookEventEnvelope<"credits.granted", CreditsGrantedData>
  | WebhookEventEnvelope<"credits.purchased", CreditsPurchasedData>
  | WebhookEventEnvelope<"credits.low", CreditsLowData>
  | WebhookEventEnvelope<"credits.depleted", CreditsDepletedData>
  | WebhookEventEnvelope<"credits.expired", CreditsExpiredData>
  | WebhookEventEnvelope<"balance.topped_up", BalanceToppedUpData>
  | WebhookEventEnvelope<"balance.low", BalanceLowData>
  | WebhookEventEnvelope<"balance.depleted", BalanceDepletedData>
  | WebhookEventEnvelope<"quota.threshold_reached", QuotaThresholdReachedData>
  | WebhookEventEnvelope<"quota.exceeded", QuotaExceededData>
  | WebhookEventEnvelope<"seats.updated", SeatsUpdatedData>
  | WebhookEventEnvelope<"seats.limit_reached", SeatsLimitReachedData>
  | WebhookEventEnvelope<"addon.activated", AddonActivatedData>
  | WebhookEventEnvelope<"addon.deactivated", AddonDeactivatedData>
  | WebhookEventEnvelope<"usage.recorded", UsageRecordedData>
  | WebhookEventEnvelope<"payout.available", PayoutAvailableData>
  | WebhookEventEnvelope<"payout.created", PayoutCreatedData>
  | WebhookEventEnvelope<"payout.paid", PayoutPaidData>
  | WebhookEventEnvelope<"payout.failed", PayoutFailedData>;

export interface WebhookEventDataMap {
  "subscription.created": SubscriptionCreatedData;
  "subscription.activated": SubscriptionActivatedData;
  "subscription.reactivated": SubscriptionReactivatedData;
  "subscription.canceled": SubscriptionCanceledData;
  "subscription.updated": SubscriptionUpdatedData;
  "subscription.plan_changed": SubscriptionPlanChangedData;
  "subscription.cancellation_scheduled": SubscriptionCancellationScheduledData;
  "subscription.cancellation_revoked": SubscriptionCancellationRevokedData;
  "subscription.plan_change_scheduled": SubscriptionPlanChangeScheduledData;
  "subscription.plan_change_revoked": SubscriptionPlanChangeRevokedData;
  "subscription.past_due": SubscriptionPastDueData;
  "trial.started": TrialStartedData;
  "trial.converted": TrialConvertedData;
  "trial.expired": TrialExpiredData;
  "trial.will_end": TrialWillEndData;
  "trial.checkout_ready": TrialCheckoutReadyData;
  "checkout.ready": CheckoutReadyData;
  "payment.received": PaymentReceivedData;
  "payment.failed": PaymentFailedData;
  "payment.recovered": PaymentRecoveredData;
  "payment.retry_failed": PaymentRetryFailedData;
  "payment.refunded": PaymentRefundedData;
  "payment.disputed": PaymentDisputedData;
  "payment.dispute_resolved": PaymentDisputeResolvedData;
  "payment_link.created": PaymentLinkCreatedData;
  "payment_link.completed": PaymentLinkCompletedData;
  "payment_link.failed": PaymentLinkFailedData;
  "payment_link.canceled": PaymentLinkCanceledData;
  "invoice.created": InvoiceCreatedData;
  "invoice.voided": InvoiceVoidedData;
  "invoice.overdue": InvoiceOverdueData;
  "invoice.upcoming": InvoiceUpcomingData;
  "payment_method.attached": PaymentMethodAttachedData;
  "payment_method.updated": PaymentMethodUpdatedData;
  "customer.created": CustomerCreatedData;
  "customer.updated": CustomerUpdatedData;
  "customer.state_changed": CustomerStateChangedData;
  "credits.granted": CreditsGrantedData;
  "credits.purchased": CreditsPurchasedData;
  "credits.low": CreditsLowData;
  "credits.depleted": CreditsDepletedData;
  "credits.expired": CreditsExpiredData;
  "balance.topped_up": BalanceToppedUpData;
  "balance.low": BalanceLowData;
  "balance.depleted": BalanceDepletedData;
  "quota.threshold_reached": QuotaThresholdReachedData;
  "quota.exceeded": QuotaExceededData;
  "seats.updated": SeatsUpdatedData;
  "seats.limit_reached": SeatsLimitReachedData;
  "addon.activated": AddonActivatedData;
  "addon.deactivated": AddonDeactivatedData;
  "usage.recorded": UsageRecordedData;
  "payout.available": PayoutAvailableData;
  "payout.created": PayoutCreatedData;
  "payout.paid": PayoutPaidData;
  "payout.failed": PayoutFailedData;
}
