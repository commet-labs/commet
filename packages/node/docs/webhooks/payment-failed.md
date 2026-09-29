---
lastModified: 2026-09-08
title: "payment.failed"
description: "Fired when a subscription charge fails, including resume charges and recovery attempts"
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentContext` (object | null) — Charge context captured for new payments. Null for historical payments with no captured context.
- `invoiceId` (string) — The invoice ID, if available.
- `invoiceNumber` (string) — The human-readable invoice number, if available.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID, if the invoice is linked to a subscription.
- `provider` ("stripe" | "commet" | "dlocal") — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `paymentMethod` (PaymentMethod | null) — The payment method: card, oxxo, or mercado\_pago. Null when unknown.
- `subPaymentMethod` (SubPaymentMethod | null) — The source of funds for this charge, when reported by the provider. Null when unavailable or unknown.
- `failureCode` (string) — The failure code from the payment processor.
- `failureMessage` (string) — A human-readable failure message.
- `recoveryUrl` (string | null) — A ready-to-use link the customer can follow to retry this payment, or null when no recovery path applies. For a first failed charge (pending\_payment) it is the checkout URL; for a failed renewal (past\_due) it is a signed recovery link — no separate createRecoveryLink call needed.

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

### Initial attempt

The original charge attempt, before recovery.

```json
{
  "event": "payment.failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-08-27",
  "data": {
    "paymentContext": {
      "reason": "recurring_billing",
      "paymentLinkId": null,
      "recovery": null
    },
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "provider": "stripe",
    "paymentMethod": "card",
    "subPaymentMethod": null,
    "failureCode": "card_declined",
    "failureMessage": "Your card was declined.",
    "recoveryUrl": "https://pay.commet.co/recover/tok_9f8e7d6c"
  }
}
```

### Manual recovery

The customer recovers an overdue subscription. The original charge reason is preserved.

```json
{
  "event": "payment.failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-08-27",
  "data": {
    "paymentContext": {
      "reason": "recurring_billing",
      "paymentLinkId": null,
      "recovery": {
        "type": "payment_recovery"
      }
    },
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "provider": "stripe",
    "paymentMethod": "card",
    "subPaymentMethod": null,
    "failureCode": "card_declined",
    "failureMessage": "Your card was declined.",
    "recoveryUrl": "https://pay.commet.co/recover/tok_9f8e7d6c"
  }
}
```

### Dunning retries

The second automatic retry of a subscription resume charge, out of four allowed retries. The reason remains subscription\_resume.

```json
{
  "event": "payment.failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-08-27",
  "data": {
    "paymentContext": {
      "reason": "subscription_resume",
      "paymentLinkId": null,
      "recovery": {
        "type": "dunning_retry",
        "attempt": 2,
        "maxAttempts": 4
      }
    },
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "provider": "stripe",
    "paymentMethod": "card",
    "subPaymentMethod": null,
    "failureCode": "card_declined",
    "failureMessage": "Your card was declined.",
    "recoveryUrl": "https://pay.commet.co/recover/tok_9f8e7d6c"
  }
}
```

### No context

The charge context was not captured. Do not infer the original reason from the subscription's current state.

```json
{
  "event": "payment.failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-08-27",
  "data": {
    "paymentContext": null,
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "provider": "stripe",
    "paymentMethod": "card",
    "subPaymentMethod": null,
    "failureCode": "card_declined",
    "failureMessage": "Your card was declined.",
    "recoveryUrl": "https://pay.commet.co/recover/tok_9f8e7d6c"
  }
}
```
