---
lastModified: 2026-07-10
title: "payment_link.failed"
description: "A payment link charge attempt failed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentContext` (object | null) — Charge context captured for new payments. Null for historical payments with no captured context.
- `paymentId` (string) — The payment link ID.
- `status` (string) — The link status. Always "failed" for this event.
- `amount` (number) — The amount that was attempted in cents (100 = $1.00).
- `currency` (string) — The payment currency code.
- `description` (string) — The payment description shown to the customer.
- `customerId` (string | null) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `failureCode` (string) — The failure code from the payment processor.
- `failureMessage` (string) — A human-readable failure message.
- `paymentMethod` (PaymentMethod | null) — The payment method: card, oxxo, or mercado\_pago. Null when unknown.
- `subPaymentMethod` (SubPaymentMethod | null) — The source of funds for this charge, when reported by the provider. Null when unavailable or unknown.

### `paymentContext`

The original reason for a charge and how this attempt was initiated. Recovery never replaces the original reason. Context can be null when it was not captured, including retries of historical invoices.

`reason` (string): The original reason, preserved across payment attempts.

`paymentLinkId` (string | null): The public payment link ID, or null when the charge did not originate from a payment link. This is independent of the reason and recovery method.

`recovery` (object | null): Null when the charge does not recover a subscription. payment\_recovery identifies a manually recovered overdue subscription, a return after cancellation for non-payment, or a retry of a failed subscription resume. Initial checkout and one-time payment retries are not recovery. dunning\_retry identifies an automatic charge retry, not a webhook delivery retry.

`recovery.attempt` (integer): The charge retry position in the dunning schedule, starting at 1. The original failed charge is not a retry. Present only for dunning\_retry.

`recovery.maxAttempts` (integer): The total automatic retries applicable to this charge when the attempt began. It is not the number of retries remaining. Present only for dunning\_retry.

`first_subscription_payment`: The initial subscription payment.

`trial_conversion`: The payment when a free trial ends.

`recurring_billing`: A subscription renewal.

`plan_change`: A charge caused by a plan change.

`reactivation`: A charge to reactivate a canceled subscription.

`subscription_resume`: A charge to resume a paused subscription.

`one_time_payment`: A one-time payment, including payment links.

`overage`: A charge for usage beyond the included allowance.

`adjustment`: A charge from an adjustment invoice.

```json
{
  "event": "payment_link.failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-08-27",
  "data": {
    "paymentContext": {
      "reason": "one_time_payment",
      "paymentLinkId": "pay_l1m2n3",
      "recovery": null
    },
    "paymentId": "pay_l1m2n3",
    "status": "failed",
    "amount": 5000,
    "currency": "usd",
    "description": "One-time onboarding fee",
    "customerId": "user_123",
    "failureCode": "card_declined",
    "failureMessage": "Your card was declined.",
    "paymentMethod": "card",
    "subPaymentMethod": null
  }
}
```

## When this fires

When a charge attempt on a [payment link](/docs/accept-one-time-payments) is declined. The link stays open — a failed link is retryable, and the customer can pay it again. A later successful attempt fires `payment_link.completed`.

`failureCode` is the processor's code (for example `card_declined`) and `failureMessage` is the human-readable reason, or `null` when the provider gives none.

The event fires the same way regardless of which payment provider processes the charge.
