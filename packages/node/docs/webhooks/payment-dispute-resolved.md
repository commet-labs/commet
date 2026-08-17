---
lastModified: 2026-07-10
title: "payment.dispute_resolved"
description: "A payment dispute was resolved as won or lost."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentTransactionId` (string) — The disputed payment transaction ID.
- `provider` ("stripe" | "commet" | "dlocal") — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `paymentLinkId` (string | null) — The payment link the payment originated from, or null when the payment did not come from a payment link.
- `invoiceId` (string | null) — The invoice the payment collected, or null for payments without an invoice.
- `invoiceNumber` (string | null) — The human-readable invoice number, if available.
- `customerId` (string | null) — The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID, if the invoice is linked to a subscription.
- `disputeAmount` (number) — The contested amount in cents (100 = $1.00).
- `currency` (string) — The dispute currency code.
- `disputeReason` (string | null) — The provider's reason code, or null when none is given.
- `outcome` (string) — The resolution: "won" or "lost".

```json
{
  "event": "payment.dispute_resolved",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "paymentTransactionId": "txn_q7r8s9",
    "provider": "stripe",
    "paymentLinkId": "pay_l1m2n3",
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "disputeAmount": 9900,
    "currency": "usd",
    "disputeReason": "fraudulent",
    "outcome": "won"
  }
}
```

## When this fires

When the payment provider closes a dispute that previously fired `payment.disputed`. The payload carries the same identifiers plus the `outcome`:

- `won` — the dispute was resolved in your favor; the frozen amount is restored to your payout balance and the payment returns to succeeded.
- `lost` — the chargeback stands; the disputed amount stays deducted.

Use it to close the internal flag you opened on `payment.disputed`, and on `lost` to revoke whatever the original payment was funding.
