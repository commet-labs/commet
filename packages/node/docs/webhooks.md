# Webhooks

Generated from Commet API version `2026-07-31`.

## subscription.created

Fired when a subscription record is created with status pending_payment. The first charge has not been confirmed yet — do NOT grant access here. Wait for subscription.activated.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `planId` (`string`, required) — The plan ID.
- `planName` (`string`, required) — The plan name.
- `status` (`string`, required) — Current status. One of: draft, pending_payment, trialing, active, past_due, canceled. Access is granted while trialing, active, or past_due — past_due is a permissive grace window during dunning, where you decide whether to keep serving the customer or block them.
- `startDate` (`string`, required) — ISO 8601 datetime when the subscription starts.
- `name` (`string | null`, required) — Optional custom name for the subscription.

## subscription.activated

Fired once, when the subscription's first charge succeeds and it becomes active — this is where you grant access. Never re-fired on renewals; use payment.received for per-charge notifications.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Current status. One of: draft, pending_payment, trialing, active, past_due, canceled. Access is granted while trialing, active, or past_due — past_due is a permissive grace window during dunning, where you decide whether to keep serving the customer or block them.
- `currentPeriodStart` (`string`, optional) — ISO 8601 start of the current billing period.
- `currentPeriodEnd` (`string`, optional) — ISO 8601 end of the current billing period.
- `name` (`string | null`, required) — Optional custom name for the subscription.
- `invoiceId` (`string`, required) — The invoice ID for this payment.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceTotal` (`number`, required) — Invoice total in cents (100 = $1.00).
- `invoiceCurrency` (`string`, required) — The invoice currency code.
- `provider` (`"stripe" | "commet" | "dlocal" | null`, required) — The payment provider that processed the activating charge: stripe, commet, or dlocal. Null when the subscription activated without a charge (zero-total or setup-based activation).

## subscription.reactivated

Fired when a canceled subscription is reactivated and its reactivation charge succeeds. The subscription returns to active with a fresh invoice and a billing period anchored to the reactivation date. Distinct from subscription.activated (first activation) and payment.recovered (past_due recovery, which keeps the original anchor).

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Always "active" for this event. Restore access here.
- `currentPeriodStart` (`string`, optional) — ISO 8601 start of the new billing period, anchored to the reactivation date.
- `currentPeriodEnd` (`string`, optional) — ISO 8601 end of the new billing period.
- `name` (`string | null`, required) — Optional custom name for the subscription.
- `invoiceId` (`string`, required) — The fresh reactivation invoice ID.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceTotal` (`number`, required) — Invoice total in cents (100 = $1.00).
- `invoiceCurrency` (`string`, required) — The invoice currency code.
- `provider` (`"stripe" | "commet" | "dlocal"`, required) — The payment provider that processed the reactivation charge: stripe, commet, or dlocal.

## subscription.canceled

Fired when a subscription is actually terminated. A scheduled cancellation fires it at the end of the billing period; immediate cancellations, full refunds (cancelReason refund), and exhausted dunning retries (cancelReason dunning_exhausted) fire it right away. The status is now canceled and access should be revoked. This event is NOT fired when cancellation is scheduled — that triggers subscription.updated instead. See the cancellation lifecycle below.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Always "canceled" for this event. Revoke access when you receive this.
- `canceledAt` (`string`, optional) — ISO 8601 datetime when the cancellation was requested or triggered.
- `cancelReason` (`string | null`, required) — The reason for cancellation, if provided. Set by Commet on system-initiated terminations: "refund" (full refund of a subscription invoice) or "dunning_exhausted" (all payment retries failed).
- `endDate` (`string`, optional) — ISO 8601 datetime when the subscription ended. Matches the billing period end for scheduled cancellations; for immediate terminations it is the moment of termination.

## subscription.updated

Fired when subscription details change. The most common trigger is scheduling a cancellation — when a customer cancels, the status stays "active" until the billing period ends, but canceledAt and endDate are set immediately. Use this event to show "your subscription will end on {endDate}" in your UI. Access should NOT be revoked here — wait for subscription.canceled.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Current status. When cancellation is scheduled, this is still "active" — the subscription remains usable until endDate.
- `canceledAt` (`string`, optional) — ISO 8601 datetime when cancellation was requested. Present when cancellation is scheduled, null otherwise.
- `cancelReason` (`string | null`, required) — The reason for cancellation, if provided.
- `endDate` (`string`, optional) — ISO 8601 datetime when the subscription will end. Present when cancellation is scheduled — this is the date access should be revoked (via subscription.canceled).

## subscription.plan_changed

Fired when a subscription changes from one plan to another, including upgrades, downgrades, and billing interval changes. Access does not change on this event — the subscription stays active.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `previousPlan` (`WebhookPlanRef`, required) — The previous plan (id and name).
- `currentPlan` (`WebhookPlanRef`, required) — The new plan (id and name).
- `billingInterval` (`string | null`, required) — The billing interval (monthly, yearly).
- `credit` (`number`, required) — Prorated credit in cents from the previous plan.
- `charge` (`number`, required) — Prorated charge in cents for the new plan.
- `totalCharged` (`number`, required) — Total amount charged in cents.

## subscription.cancellation_scheduled

Fired when a cancellation is scheduled for the end of the billing period. The subscription stays active until effectiveAt — do NOT revoke access here. subscription.updated also fires for backward compatibility.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Still "active" — the subscription remains usable until effectiveAt.
- `canceledAt` (`string`, optional) — ISO 8601 datetime when the cancellation was requested.
- `cancelReason` (`string | null`, required) — The reason for cancellation, if provided.
- `effectiveAt` (`string`, required) — ISO 8601 datetime when the cancellation will execute (the billing period end). subscription.canceled fires at this moment.

## subscription.cancellation_revoked

Fired when a scheduled cancellation is reverted before it executes. The subscription continues on its current plan and billing period as if it had never been canceled.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Current status — typically "active". The scheduled cancellation no longer applies.
- `currentPeriodEnd` (`string`, optional) — ISO 8601 end of the current billing period, which continues normally.

## subscription.plan_change_scheduled

Fired when a plan change (downgrade or shorter interval) is scheduled for the end of the billing period. The subscription stays on the current plan until effectiveAt, when subscription.plan_changed fires.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Current status — the subscription stays usable.
- `currentPlan` (`WebhookPlanRef`, required) — The plan currently in effect (id and name).
- `scheduledPlan` (`WebhookPlanRef`, required) — The plan that takes effect at effectiveAt (id and name).
- `billingInterval` (`string | null`, required) — The current billing interval.
- `scheduledBillingInterval` (`string | null`, required) — The new billing interval, if the change includes one. Null when only the plan changes.
- `effectiveAt` (`string`, required) — ISO 8601 datetime when the change executes (the billing period end).

## subscription.plan_change_revoked

Fired when a scheduled plan change is replaced by a different one before it executes. The replacement also fires subscription.plan_change_scheduled with the new target plan.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Current status — the subscription stays usable.
- `currentPlan` (`WebhookPlanRef`, required) — The plan currently in effect (id and name).
- `revokedPlan` (`WebhookPlanRef`, required) — The previously scheduled plan that will no longer take effect (id and name).
- `billingInterval` (`string | null`, required) — The current billing interval.
- `revokedBillingInterval` (`string | null`, required) — The previously scheduled billing interval, if the revoked change included one.

## subscription.past_due

Fired when a recurring payment fails on a previously paid subscription and its status becomes past_due. past_due is a grace window, not a cutoff: usage and seats keep working while new purchases are blocked, and dunning retries the charge — use this to notify the customer and recover the payment.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Always "past_due" for this event.
- `invoiceId` (`string`, required) — The invoice whose payment failure triggered the status.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.

## trial.started

Fired when a subscription enters its trial period after checkout. Grant access here — trialing subscriptions have full access until trialEndsAt.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Always "trialing" for this event.
- `planId` (`string`, required) — The plan ID.
- `planName` (`string`, required) — The plan name.
- `trialEndsAt` (`string`, required) — ISO 8601 datetime when the trial ends.

## trial.converted

Fired when a trialing customer converts to a paid subscription before the trial ends — today this happens when they change plan during the trial, which charges the full new plan price immediately. Trials that simply run out fire trial.expired instead.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Always "active" for this event.
- `planId` (`string`, required) — The plan ID the customer converted to.
- `planName` (`string`, required) — The plan name.

## trial.expired

Fired when a trial period runs out and the billing cycle activates the subscription. The first regular invoice is generated right after — this is the natural trial-to-paid transition.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Current status — "active" once the billing cycle has activated the subscription.
- `planId` (`string`, required) — The plan ID.
- `planName` (`string`, required) — The plan name.
- `trialEndsAt` (`string`, required) — ISO 8601 datetime when the trial ended.

## trial.will_end

Predictive event fired once, 3 days before a trial ends. Use it to remind the customer that billing starts soon. Emitted by a daily scan with a deterministic idempotency key, so it never fires twice for the same trial end date.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Always "trialing" for this event.
- `planId` (`string`, required) — The plan ID.
- `planName` (`string`, required) — The plan name.
- `trialEndsAt` (`string`, required) — ISO 8601 datetime when the trial will end.

## trial.checkout_ready

Fired when a trial checkout link is ready to share with the customer. Completing this checkout saves a payment method and starts the trial (trial.started) — the customer is not charged until the trial ends.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `planName` (`string`, required) — The plan name.
- `trialDays` (`number`, required) — The length of the trial in days.
- `checkoutUrl` (`string`, required) — The hosted checkout URL to share with the customer.

## checkout.ready

Fired when a checkout link for a subscription's first invoice is ready to share with the customer. Commet also emails the link — use this event to deliver it through your own channels.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (`string`, required) — The invoice this checkout collects.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceTotal` (`number`, required) — Invoice total in cents (100 = $1.00).
- `invoiceCurrency` (`string`, required) — The invoice currency code.
- `checkoutUrl` (`string`, required) — The hosted checkout URL to share with the customer.

## payment.received

Fired every time a payment settles successfully — the first payment and every renewal alike. subscription.activated fires alongside it only on the first one.

### Data

- `invoiceId` (`string`, required) — The invoice ID.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceTotal` (`number`, required) — Invoice total in cents (100 = $1.00).
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID.
- `paymentTransactionId` (`string | null`, required) — The payment transaction ID.
- `provider` (`"stripe" | "commet" | "dlocal" | null`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal. Null for billing-only charges with no Commet ledger row.
- `grossAmount` (`number | null`, required) — Gross amount in cents before fees.
- `currency` (`string | null`, required) — The payment currency code.
- `orgNetAmount` (`number | null`, required) — Net amount after fees in cents.
- `customerEmail` (`string | null`, required) — The customer email used for this payment.
- `paidAt` (`string`, optional) — ISO 8601 datetime when the payment was received.

## payment.failed

Fired when a recurring charge fails. This event is for recurring charge failures only — card declines during initial checkout do not trigger this event.

### Data

- `invoiceId` (`string`, required) — The invoice ID, if available.
- `invoiceNumber` (`string`, required) — The human-readable invoice number, if available.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.
- `provider` (`"stripe" | "commet" | "dlocal"`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `failureCode` (`string`, required) — The failure code from the payment processor.
- `failureMessage` (`string`, required) — A human-readable failure message.
- `recoveryUrl` (`string | null`, required) — A ready-to-use link the customer can follow to retry this payment, or null when no recovery path applies. For a first failed charge (pending_payment) it is the checkout URL; for a failed renewal (past_due) it is a signed recovery link — no separate createRecoveryLink call needed.

## payment.recovered

Fired when an outstanding invoice that previously failed is successfully paid — automatically on retry or by the customer through the portal. The subscription returns to active at the same time; use this event to close the dunning flow you opened on payment.failed.

### Data

- `invoiceId` (`string`, required) — The recovered invoice ID.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceTotal` (`number`, required) — Invoice total in cents (100 = $1.00).
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.
- `provider` (`"stripe" | "commet" | "dlocal" | null`, required) — The payment provider that recovered the payment, or null when the invoice was recovered without a processor charge.

## payment.retry_failed

Fired when all dunning retries are exhausted and the subscription is canceled. This is the terminal event of the dunning flow — payment.recovered will not follow. Revoke access when you receive this.

### Data

- `invoiceId` (`string`, required) — The invoice whose retries were exhausted.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string`, required) — The subscription ID.
- `provider` (`"stripe" | "commet" | "dlocal"`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `reason` (`string`, required) — Terminal dunning reason, usually the last processor decline code or "dunning_exhausted".

## payment.refunded

Fired when a payment is refunded, fully or partially. A full refund of a subscription invoice also cancels the subscription immediately (subscription.canceled fires with reason refund); partial refunds leave the subscription untouched.

### Data

- `paymentTransactionId` (`string`, required) — The refunded payment transaction ID.
- `provider` (`"stripe" | "commet" | "dlocal"`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `paymentLinkId` (`string | null`, required) — The payment link the payment originated from, or null when the payment did not come from a payment link.
- `invoiceId` (`string | null`, required) — The invoice the payment collected, or null for payments without an invoice.
- `invoiceNumber` (`string | null`, required) — The human-readable invoice number, if available.
- `customerId` (`string | null`, required) — The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.
- `refundAmount` (`number`, required) — The refunded amount in cents (100 = $1.00).
- `currency` (`string`, required) — The refund currency code.

## payment.disputed

Fired when a cardholder opens a dispute (chargeback) against a payment. The disputed amount is frozen from your payout balance while the dispute is open; Commet, as the Merchant of Record, handles the resolution process. payment.dispute_resolved fires with the outcome.

### Data

- `paymentTransactionId` (`string`, required) — The disputed payment transaction ID.
- `provider` (`"stripe" | "commet" | "dlocal"`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `paymentLinkId` (`string | null`, required) — The payment link the payment originated from, or null when the payment did not come from a payment link.
- `invoiceId` (`string | null`, required) — The invoice the payment collected, or null for payments without an invoice.
- `invoiceNumber` (`string | null`, required) — The human-readable invoice number, if available.
- `customerId` (`string | null`, required) — The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.
- `disputeAmount` (`number`, required) — The contested amount in cents (100 = $1.00).
- `currency` (`string`, required) — The dispute currency code.
- `disputeReason` (`string | null`, required) — The provider's reason code (e.g. fraudulent, product_not_received), or null when none is given.

## payment.dispute_resolved

Fired when a dispute is closed. Carries the same identifiers as payment.disputed plus the outcome: won restores the frozen amount to your balance, lost keeps the chargeback deducted.

### Data

- `paymentTransactionId` (`string`, required) — The disputed payment transaction ID.
- `provider` (`"stripe" | "commet" | "dlocal"`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `paymentLinkId` (`string | null`, required) — The payment link the payment originated from, or null when the payment did not come from a payment link.
- `invoiceId` (`string | null`, required) — The invoice the payment collected, or null for payments without an invoice.
- `invoiceNumber` (`string | null`, required) — The human-readable invoice number, if available.
- `customerId` (`string | null`, required) — The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.
- `disputeAmount` (`number`, required) — The contested amount in cents (100 = $1.00).
- `currency` (`string`, required) — The dispute currency code.
- `disputeReason` (`string | null`, required) — The provider's reason code, or null when none is given.
- `outcome` (`string`, required) — The resolution: "won" or "lost".

## payment_link.created

Fired when a payment link is created. The link is pending — the customer has not paid yet. Do NOT fulfill here; wait for payment_link.completed.

### Data

- `paymentId` (`string`, required) — The payment link ID.
- `status` (`string`, required) — The link status. Always "pending" for this event.
- `amount` (`number`, required) — The total amount to collect in cents (100 = $1.00).
- `currency` (`string`, required) — The payment currency code.
- `description` (`string`, required) — The payment description shown to the customer.
- `customerId` (`string | null`, required) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.

## payment_link.completed

Fired when a payment link is paid. The charge settled and a one-time invoice was generated. Fulfill the purchase on this event.

### Data

- `paymentId` (`string`, required) — The payment link ID.
- `status` (`string`, required) — The link status. Always "succeeded" for this event.
- `amount` (`number`, required) — The collected amount in cents (100 = $1.00).
- `currency` (`string`, required) — The payment currency code.
- `description` (`string`, required) — The payment description shown to the customer.
- `customerId` (`string | null`, required) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (`string`, required) — The one-time invoice generated for this payment.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `paymentTransactionId` (`string | null`, required) — The payment transaction ID for the settled charge.

## payment_link.failed

Fired when a payment link charge attempt is declined. The link stays open and can be paid again — a failed link is retryable.

### Data

- `paymentId` (`string`, required) — The payment link ID.
- `status` (`string`, required) — The link status. Always "failed" for this event.
- `amount` (`number`, required) — The amount that was attempted in cents (100 = $1.00).
- `currency` (`string`, required) — The payment currency code.
- `description` (`string`, required) — The payment description shown to the customer.
- `customerId` (`string | null`, required) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `failureCode` (`string`, required) — The failure code from the payment processor.
- `failureMessage` (`string`, required) — A human-readable failure message.

## payment_link.canceled

Fired when a pending payment link is canceled before being paid. A canceled link can no longer be paid.

### Data

- `paymentId` (`string`, required) — The payment link ID.
- `status` (`string`, required) — The link status. Always "canceled" for this event.
- `amount` (`number`, required) — The total amount of the canceled link in cents (100 = $1.00).
- `currency` (`string`, required) — The payment currency code.
- `description` (`string`, required) — The payment description shown to the customer.
- `customerId` (`string | null`, required) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.

## invoice.created

Fired when a new invoice is generated for a subscription, typically at the start of a billing period.

### Data

- `invoiceId` (`string`, required) — The invoice ID.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceStatus` (`string`, required) — The invoice status (e.g. pending, paid).
- `periodStart` (`string`, required) — ISO 8601 start of the billing period.
- `periodEnd` (`string`, required) — ISO 8601 end of the billing period.
- `issueDate` (`string`, required) — ISO 8601 date the invoice was issued.
- `dueDate` (`string`, required) — ISO 8601 date the invoice is due.
- `currency` (`string`, required) — The invoice currency code.
- `subtotal` (`number`, required) — Subtotal in cents (100 = $1.00).
- `total` (`number`, required) — Total in cents (100 = $1.00).
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.

## invoice.voided

Fired when an invoice is voided — nullified before collection, either manually or automatically when its subscription is canceled. Voiding is terminal: a void invoice is never retried or collected.

### Data

- `invoiceId` (`string`, required) — The invoice ID.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceStatus` (`string`, required) — Always "void" for this event.
- `periodStart` (`string`, required) — ISO 8601 start of the billing period.
- `periodEnd` (`string`, required) — ISO 8601 end of the billing period.
- `issueDate` (`string`, required) — ISO 8601 date the invoice was issued.
- `dueDate` (`string`, required) — ISO 8601 date the invoice was due.
- `currency` (`string`, required) — The invoice currency code.
- `subtotal` (`number`, required) — Subtotal in cents (100 = $1.00).
- `total` (`number`, required) — Total in cents (100 = $1.00).
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.

## invoice.overdue

Fired once when an outstanding invoice passes its due date without payment. The invoice keeps its outstanding status — overdue is a fact about the due date, not a new status. Use it to start your own dunning flow.

### Data

- `invoiceId` (`string`, required) — The invoice ID.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `invoiceStatus` (`string`, required) — Always "outstanding" for this event.
- `periodStart` (`string`, required) — ISO 8601 start of the billing period.
- `periodEnd` (`string`, required) — ISO 8601 end of the billing period.
- `issueDate` (`string`, required) — ISO 8601 date the invoice was issued.
- `dueDate` (`string`, required) — ISO 8601 date the invoice was due — now in the past.
- `currency` (`string`, required) — The invoice currency code.
- `subtotal` (`number`, required) — Subtotal in cents (100 = $1.00).
- `total` (`number`, required) — Total in cents (100 = $1.00).
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The subscription ID, if the invoice is linked to a subscription.

## invoice.upcoming

Predictive event fired once, 3 days before an active subscription renews. Use it to notify the customer before they are charged. Carries no amount — usage-based charges are only final at renewal, when invoice.created delivers the actual invoice.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (`string`, required) — Always "active" for this event.
- `planId` (`string`, required) — The plan ID.
- `planName` (`string`, required) — The plan name.
- `billingInterval` (`string | null`, required) — The billing interval (monthly, yearly).
- `currentPeriodEnd` (`string`, required) — ISO 8601 datetime when the current period ends and the renewal invoice is issued.

## payment_method.attached

Fired when Commet records a payment method for a subscription: after a paid checkout, when a trial starts with a card on file, or when a zero-total checkout completes. The card object carries display metadata only — full numbers never leave the payment provider.

### Data

- `subscriptionId` (`string`, required) — The subscription the payment method was saved for.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `card` (`WebhookCardInfo | null`, required) — Card display metadata: brand, last4, expMonth, expYear. Null when the method is not a card or its details cannot be retrieved.

## payment_method.updated

Fired when a customer replaces their default payment method through the customer portal. The new method applies to all of the customer's subscriptions. A payment method update is also a strong recovery signal for past-due subscriptions.

### Data

- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `card` (`WebhookCardInfo | null`, required) — Card display metadata for the new method: brand, last4, expMonth, expYear. Null when the method is not a card or its details cannot be retrieved.

## customer.created

Fired when a customer is created, via the API (including batch create), SDK, or dashboard. The payload is the customer resource exactly as GET /customers returns it.

### Data

- `id` (`string`, required) — The Commet customer ID (cus_...).
- `externalId` (`string | null`, required) — Your own identifier for this customer, if you provided one.
- `fullName` (`string | null`, required) — The customer's full name.
- `email` (`string`, required) — The customer's email.
- `taxDocument` (`string | null`, required) — The customer's tax identification number, if provided.
- `documentType` (`string | null`, required) — The local tax document type label inferred from the customer's country (e.g. CUIT, RFC, RUT), or null when no tax document was provided.
- `timezone` (`string | null`, required) — The customer's timezone.
- `metadata` (`Record<string, unknown> | null`, required) — Custom key-value metadata you attached to the customer.
- `createdAt` (`string`, required) — ISO 8601 datetime when the customer was created.
- `updatedAt` (`string`, required) — ISO 8601 datetime of the last update.

## customer.updated

Fired when a customer's details change (email, name, timezone, externalId, or metadata). Carries the same customer resource shape as customer.created with the current values.

### Data

- `id` (`string`, required) — The Commet customer ID (cus_...).
- `externalId` (`string | null`, required) — Your own identifier for this customer, if you provided one.
- `fullName` (`string | null`, required) — The customer's full name.
- `email` (`string`, required) — The customer's email.
- `taxDocument` (`string | null`, required) — The customer's tax identification number, if provided.
- `documentType` (`string | null`, required) — The local tax document type label inferred from the customer's country (e.g. CUIT, RFC, RUT), or null when no tax document was provided.
- `timezone` (`string | null`, required) — The customer's timezone.
- `metadata` (`Record<string, unknown> | null`, required) — Custom key-value metadata you attached to the customer.
- `createdAt` (`string`, required) — ISO 8601 datetime when the customer was created.
- `updatedAt` (`string`, required) — ISO 8601 datetime of this update.

## customer.state_changed

Aggregate entitlement event answering one question: what can this customer access right now? Fired on every entitlement transition (subscription lifecycle, plan changes, trials, past due, scheduled cancellations) with the customer's CURRENT subscription, plan, features, seats, and credits or balance. Handle this single event to keep access in sync instead of wiring every lifecycle event.

### Data

- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `trigger` (`string`, required) — What caused the transition. One of: subscription_created, subscription_activated, subscription_canceled, plan_change, past_due, trial_started, trial_converted, trial_expired, cancellation_scheduled, cancellation_revoked, seats_updated, addon_activated, addon_deactivated, credits_depleted, balance_depleted, quota_exceeded.
- `status` (`string`, required) — The customer's current subscription status, or "none" when no live subscription exists. Access is granted while trialing, active, or past_due — past_due is a permissive grace window during dunning.
- `subscriptionId` (`string | null`, required) — The live subscription ID, or null when status is none.
- `plan` (`WebhookPlanRef | null`, required) — The current plan (id and name), or null when status is none.
- `billingInterval` (`string | null`, required) — The current billing interval.
- `consumptionModel` (`string | null`, required) — The plan's consumption model: metered, credits, or balance.
- `features` (`Array<{ code: string; name: string; unitName: string | null; allowed: boolean; type: "boolean"; enabled: boolean } | { code: string; name: string; unitName: string | null; allowed: boolean; type: "usage"; consumption: { model: "metered"; period: { start: string; end: string }; unitsUsed: number; includedUnits: number; remainingUnits?: number; unlimited: boolean; overage: { enabled: boolean; units: number; unitPrice?: { amount: number; currency: string; scale: 10000 } } } | { model: "credits"; period: { start: string; end: string }; unitsUsed: number; creditsPerUnit: number; creditsConsumed: number; availableUnits: number } | { model: "balance"; period: { start: string; end: string }; unitsUsed: number; spent: { amount: number; currency: string }; availableUnits?: number; unitPrice?: { amount: number; currency: string; scale: 10000 } } } | { code: string; name: string; unitName: string | null; allowed: boolean; type: "seats"; usage: { period: { start: string; end: string }; unitsUsed: number; includedUnits: number; remainingUnits?: number; unlimited: boolean; overage: { enabled: boolean; units: number; unitPrice?: { amount: number; currency: string; scale: 10000 } } } } | { code: string; name: string; unitName: string | null; allowed: boolean; type: "quota"; usage: { period: { start: string; end: string }; unitsUsed: number; includedUnits: number; remainingUnits?: number; unlimited: boolean; overage: { enabled: boolean; units: number; unitPrice?: { amount: number; currency: string; scale: 10000 } }; billedUnits: number } }>`, required) — Current feature access, discriminated by type. Boolean features expose enabled; usage features expose model-specific consumption; seats and quota expose usage allowances.
- `seats` (`Array<WebhookSeatSummary>`, required) — Summary of seats-type features: code, current, included, remaining, unlimited.
- `credits` (`WebhookCreditsBalance | null`, required) — For credits plans: planCredits, purchasedCredits, totalCredits. Null otherwise.
- `balance` (`WebhookBalance | null`, required) — For balance plans: currentBalance in rate scale (10000 = $1.00). Null otherwise.

## credits.granted

Fired when non-purchase credits are granted to a subscription: plan-included credits at the start of each billing period, or a manual adjustment from the dashboard. Credit pack purchases fire credits.purchased instead.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `credits` (`number`, required) — The number of credits granted.
- `reason` (`string`, required) — Why the credits were granted: period_reset or manual_adjustment.

## credits.purchased

Fired when a customer buys a credit pack through the customer portal and the payment succeeds. Purchased credits never expire — unlike plan credits, they survive period resets. Plan-included credit grants fire credits.granted instead.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (`string`, required) — The invoice issued for the purchase.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `creditPackName` (`string`, required) — The purchased credit pack's name.
- `credits` (`number`, required) — The number of credits purchased.

## credits.low

Fired when a subscription's remaining credits cross below 10% of the credits granted for the current period. Emitted once per billing period, when the crossing happens.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `remainingCredits` (`number`, required) — Total credits remaining (plan plus purchased).
- `thresholdCredits` (`number`, required) — The low-credit threshold that was crossed: 10% of the period's granted plan credits.
- `periodCredits` (`number`, required) — The plan credits granted at the last period reset.

## credits.depleted

Fired when a subscription's credits hit zero. Usage requests that need more credits than remain are rejected from this point. Also fires customer.state_changed with trigger credits_depleted.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `remainingCredits` (`number`, required) — Credits remaining after depletion. Always 0.

## credits.expired

Fired at the period reset when unused plan credits from the previous period are discarded. Plan credits expire at period end; purchased credits never expire and are not affected.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `expiredCredits` (`number`, required) — The unused plan credits that were discarded.

## balance.topped_up

Fired when a customer on a balance plan tops up their prepaid balance through the customer portal and the payment succeeds.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (`string`, required) — The invoice issued for the top-up.
- `invoiceNumber` (`string`, required) — The human-readable invoice number.
- `amount` (`number`, required) — The topped-up value in rate scale (10000 = $1.00 of the subscription currency).
- `currency` (`string`, required) — The subscription currency.

## balance.low

Fired when a subscription's prepaid balance crosses below 10% of its last refill (period reset, top-up, or manual adjustment). Emitted once per crossing.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `currentBalance` (`number`, required) — The remaining balance in rate scale (10000 = $1.00 of the subscription currency).
- `thresholdBalance` (`number`, required) — The low-balance threshold that was crossed: 10% of the last refill, in rate scale.
- `currency` (`string`, required) — The subscription currency.

## balance.depleted

Fired when a subscription's prepaid balance crosses to zero or below. With block-on-exhaustion plans further usage is rejected; otherwise the balance can go negative. Also fires customer.state_changed with trigger balance_depleted.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `currentBalance` (`number`, required) — The balance after depletion in rate scale. Zero, or negative when overage is allowed.
- `currency` (`string`, required) — The subscription currency.

## quota.threshold_reached

Fired when a metered feature's usage crosses 80% of its included quantity for the current period. Emitted once per feature per billing period, when the crossing happens.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `featureCode` (`string`, required) — The metered feature code.
- `currentUsage` (`number`, required) — Total usage in the current period after the crossing.
- `includedAmount` (`number`, required) — The included quantity for the period.
- `periodStart` (`string`, required) — ISO 8601 start of the usage period.

## quota.exceeded

Fired when a metered feature passes its included quantity. With overage enabled it means overage billing began; with overage disabled it means the hard limit was hit and further usage is rejected (this case also fires customer.state_changed with trigger quota_exceeded). Emitted once per feature per billing period.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `featureCode` (`string`, required) — The metered feature code.
- `currentUsage` (`number`, required) — Total usage in the current period.
- `includedAmount` (`number`, required) — The included quantity for the period.
- `overageEnabled` (`boolean`, required) — True when overage billing began; false when the hard limit was hit and usage is now blocked.
- `periodStart` (`string`, required) — ISO 8601 start of the usage period.

## seats.updated

Fired when a customer's seat count changes for a seats-type feature — via the SDK seats endpoints or the dashboard. Also fires customer.state_changed with trigger seats_updated.

### Data

- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string | null`, required) — The live subscription ID, or null when the customer has no live subscription.
- `featureCode` (`string`, required) — The seats feature code.
- `previousSeats` (`number`, required) — The seat count before the change.
- `currentSeats` (`number`, required) — The seat count after the change.

## seats.limit_reached

Fired when a seat change reaches or passes the included seat limit of the customer's plan. Emitted once per crossing — only when the count moves from below the limit to at or above it.

### Data

- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (`string`, required) — The subscription ID.
- `featureCode` (`string`, required) — The seats feature code.
- `currentSeats` (`number`, required) — The seat count after the change.
- `includedSeats` (`number`, required) — The included seat limit of the plan.

## addon.activated

Fired when an add-on is activated on a subscription — via the API or a customer portal purchase. The prorated activation charge, if any, has already succeeded. Also fires customer.state_changed with trigger addon_activated.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `addon` (`WebhookAddonRef`, required) — The add-on: id and name.
- `featureCode` (`string`, required) — The feature the add-on unlocks or extends.
- `proratedPrice` (`number`, required) — The prorated amount charged at activation in rate scale (10000 = $1.00). Zero when nothing was charged.
- `currency` (`string`, required) — The subscription currency.

## addon.deactivated

Fired when an active add-on is deactivated from a subscription. Also fires customer.state_changed with trigger addon_deactivated.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `addon` (`WebhookAddonRef`, required) — The add-on: id and name.
- `featureCode` (`string`, required) — The feature the add-on unlocked or extended.

## usage.recorded

Fired for every processed usage event. HIGH VOLUME: this fires once per tracked event, so it is excluded from family select-all in the dashboard — subscribe to it explicitly and make sure your endpoint can absorb your own ingest rate.

### Data

- `subscriptionId` (`string`, required) — The subscription ID.
- `customerId` (`string`, required) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `usageEventId` (`string`, required) — The usage event ID.
- `featureCode` (`string`, required) — The feature code the usage was tracked against.
- `value` (`number`, required) — The recorded quantity. For AI model events this is the total token count.
- `ts` (`string`, required) — ISO 8601 timestamp of the usage event.

## payout.available

Organization-level event about YOUR money as the merchant. Fired when payment funds the provider was holding become available to pay out to your bank.

### Data

- `availableAmount` (`number`, required) — Your full available payout balance in cents (100 = $1.00) at the time of the event — not just the newly released funds.
- `currency` (`string`, required) — The payout balance currency. Always "usd".

## payout.created

Fired when a payout of your available balance is requested and the transfer toward your bank is initiated. The lifecycle continues with payout.paid or payout.failed.

### Data

- `payoutId` (`string`, required) — The payout ID.
- `amount` (`number`, required) — Gross payout amount in cents (100 = $1.00).
- `fee` (`number`, required) — Provider transfer fee in cents.
- `netAmount` (`number`, required) — What reaches your bank in cents (amount minus fee).
- `currency` (`string`, required) — The payout currency. Always "usd".
- `status` (`string`, required) — The payout status. "pending" at creation.
- `destinationBank` (`WebhookBankRef | null`, required) — Destination bank display metadata: bankName and last4. Full account numbers never appear in webhook payloads.
- `createdAt` (`string`, required) — ISO 8601 datetime when the payout was created.

## payout.paid

Fired when the bank settlement of a payout completes — the moment the money actually reaches your bank account, confirmed by the payment provider. Fires exactly once per payout.

### Data

- `payoutId` (`string`, required) — The payout ID.
- `amount` (`number`, required) — Gross payout amount in cents (100 = $1.00).
- `fee` (`number`, required) — Provider transfer fee in cents.
- `netAmount` (`number`, required) — What reached your bank in cents (amount minus fee).
- `currency` (`string`, required) — The payout currency. Always "usd".
- `status` (`string`, required) — Always "paid" for this event.
- `destinationBank` (`WebhookBankRef | null`, required) — Destination bank display metadata: bankName and last4.
- `paidAt` (`string | null`, required) — ISO 8601 datetime when the provider confirmed the deposit arrived.

## payout.failed

Fired when the provider reports a payout could not be completed — most commonly a bank rejection (closed account, invalid details). The funds return to your available balance.

### Data

- `payoutId` (`string`, required) — The payout ID.
- `amount` (`number`, required) — Gross payout amount in cents (100 = $1.00).
- `fee` (`number`, required) — Provider transfer fee in cents.
- `netAmount` (`number`, required) — What would have reached your bank in cents.
- `currency` (`string`, required) — The payout currency. Always "usd".
- `status` (`string`, required) — Always "failed" for this event.
- `destinationBank` (`WebhookBankRef | null`, required) — Destination bank display metadata: bankName and last4.
- `failedAt` (`string | null`, required) — ISO 8601 datetime when the failure was recorded.
- `failureCode` (`string | null`, required) — The provider's failure code, when available.
- `failureMessage` (`string | null`, required) — A human-readable failure message, when available.
