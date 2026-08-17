---
lastModified: 2026-07-10
title: "payment_link.created"
description: "A payment link was created and is ready to be paid."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentId` (string) — The payment link ID.
- `status` (string) — The link status. Always "pending" for this event.
- `amount` (number) — The total amount to collect in cents (100 = $1.00).
- `currency` (string) — The payment currency code.
- `description` (string) — The payment description shown to the customer.
- `customerId` (string | null) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.

```json
{
  "event": "payment_link.created",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "paymentId": "pay_l1m2n3",
    "status": "pending",
    "amount": 5000,
    "currency": "usd",
    "description": "One-time onboarding fee",
    "customerId": "user_123"
  }
}
```

## When this fires

When a payment link is created with [Commet Pay](/docs/accept-one-time-payments). A payment link is a one-time, customer-present charge — there's no subscription and no plan behind it. The link is `pending`: the customer has not paid yet.

Do not fulfill the purchase on this event. Wait for `payment_link.completed`.

The event fires the same way regardless of which payment provider processes the charge.
