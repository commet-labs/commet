---
lastModified: 2026-07-10
title: "payment.received"
description: "Fired every time a payment settles successfully — the first payment and every renewal alike"
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `invoiceId` (string) — The invoice ID.
- `invoiceNumber` (string) — The human-readable invoice number.
- `invoiceTotal` (number) — Invoice total in cents (100 = $1.00).
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID.
- `paymentTransactionId` (string | null) — The payment transaction ID.
- `provider` ("stripe" | "commet" | "dlocal" | null) — The payment provider the charge was routed to: stripe, commet, or dlocal. Null for billing-only charges with no Commet ledger row.
- `grossAmount` (number | null) — Gross amount in cents before fees.
- `currency` (string | null) — The payment currency code.
- `orgNetAmount` (number | null) — Net amount after fees in cents.
- `customerEmail` (string | null) — The customer email used for this payment.
- `paidAt` (string, optional) — ISO 8601 datetime when the payment was received.

```json
{
  "event": "payment.received",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "invoiceTotal": 9900,
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "paymentTransactionId": "txn_q7r8s9",
    "provider": "stripe",
    "grossAmount": 9900,
    "currency": "usd",
    "orgNetAmount": 9200,
    "customerEmail": "billing@acme.com",
    "paidAt": "2026-04-25T00:05:00.000Z"
  }
}
```
