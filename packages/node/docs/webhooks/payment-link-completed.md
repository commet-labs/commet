---
lastModified: 2026-07-10
title: "payment_link.completed"
description: "A payment link was paid successfully."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentId` (string) — The payment link ID.
- `status` (string) — The link status. Always "succeeded" for this event.
- `amount` (number) — The collected amount in cents (100 = $1.00).
- `currency` (string) — The payment currency code.
- `description` (string) — The payment description shown to the customer.
- `customerId` (string | null) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (string) — The one-time invoice generated for this payment.
- `invoiceNumber` (string) — The human-readable invoice number.
- `paymentTransactionId` (string | null) — The payment transaction ID for the settled charge.

```json
{
  "event": "payment_link.completed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "paymentId": "pay_l1m2n3",
    "status": "succeeded",
    "amount": 5000,
    "currency": "usd",
    "description": "One-time onboarding fee",
    "customerId": "user_123",
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0044",
    "paymentTransactionId": "txn_q7r8s9"
  }
}
```

## When this fires

When a customer pays a [payment link](/docs/accept-one-time-payments) on the hosted pay page and the charge settles. Commet generates a one-time invoice (`invoiceType: "one_time_payment"`) and a payment transaction at the same time; the payload carries the `invoiceId` and `paymentTransactionId`.

This is the event to fulfill the purchase on — the money has been collected.

The event fires the same way regardless of which payment provider processes the charge.
