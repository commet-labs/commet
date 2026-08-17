---
lastModified: 2026-07-10
title: "payment.refunded"
description: "A payment was refunded to the customer."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentTransactionId` (string) — The refunded payment transaction ID.
- `provider` ("stripe" | "commet" | "dlocal") — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `paymentLinkId` (string | null) — The payment link the payment originated from, or null when the payment did not come from a payment link.
- `invoiceId` (string | null) — The invoice the payment collected, or null for payments without an invoice.
- `invoiceNumber` (string | null) — The human-readable invoice number, if available.
- `customerId` (string | null) — The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID, if the invoice is linked to a subscription.
- `refundAmount` (number) — The refunded amount in cents (100 = $1.00).
- `currency` (string) — The refund currency code.

```json
{
  "event": "payment.refunded",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "paymentTransactionId": "txn_q7r8s9",
    "provider": "stripe",
    "paymentLinkId": null,
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "refundAmount": 9900,
    "currency": "usd"
  }
}
```

## When this fires

When a refund is issued for a payment — full or partial — and the payment provider confirms it. A full refund of a subscription invoice also cancels the subscription immediately (`subscription.canceled` fires with reason `refund`); a partial refund leaves the subscription untouched.

`refundAmount` is the refunded amount in cents (100 = $1.00). The invoice fields are `null` for payments that were not tied to an invoice.

Use it to mirror the refund in your own books or to notify the customer through your channels.
