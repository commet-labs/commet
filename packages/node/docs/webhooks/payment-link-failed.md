---
lastModified: 2026-07-10
title: "payment_link.failed"
description: "A payment link charge attempt failed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentId` (string) — The payment link ID.
- `status` (string) — The link status. Always "failed" for this event.
- `amount` (number) — The amount that was attempted in cents (100 = $1.00).
- `currency` (string) — The payment currency code.
- `description` (string) — The payment description shown to the customer.
- `customerId` (string | null) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `failureCode` (string) — The failure code from the payment processor.
- `failureMessage` (string) — A human-readable failure message.

```json
{
  "event": "payment_link.failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "paymentId": "pay_l1m2n3",
    "status": "failed",
    "amount": 5000,
    "currency": "usd",
    "description": "One-time onboarding fee",
    "customerId": "user_123",
    "failureCode": "card_declined",
    "failureMessage": "Your card was declined."
  }
}
```

## When this fires

When a charge attempt on a [payment link](/docs/accept-one-time-payments) is declined. The link stays open — a failed link is retryable, and the customer can pay it again. A later successful attempt fires `payment_link.completed`.

`failureCode` is the processor's code (for example `card_declined`) and `failureMessage` is the human-readable reason, or `null` when the provider gives none.

The event fires the same way regardless of which payment provider processes the charge.
