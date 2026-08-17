---
lastModified: 2026-06-12
title: "credits.purchased"
description: "A credit pack purchase was completed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (string) — The invoice issued for the purchase.
- `invoiceNumber` (string) — The human-readable invoice number.
- `creditPackName` (string) — The purchased credit pack's name.
- `credits` (number) — The number of credits purchased.

```json
{
  "event": "credits.purchased",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "invoiceId": "inv_t1u2v3",
    "invoiceNumber": "INV-0051",
    "creditPackName": "Booster 500",
    "credits": 500
  }
}
```

## When this fires

When a customer buys a credit pack through the customer portal and the payment succeeds. Purchased credits never expire — unlike plan credits, they survive period resets.

Plan-included credits granted at each period reset fire `credits.granted` instead.

Use it to confirm top-up purchases in your own UI or analytics.
