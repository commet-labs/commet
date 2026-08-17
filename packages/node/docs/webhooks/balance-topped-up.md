---
lastModified: 2026-06-12
title: "balance.topped_up"
description: "A prepaid balance top-up was completed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (string) — The invoice issued for the top-up.
- `invoiceNumber` (string) — The human-readable invoice number.
- `amount` (number) — The topped-up value in rate scale (10000 = $1.00 of the subscription currency).
- `currency` (string) — The subscription currency.

```json
{
  "event": "balance.topped_up",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "invoiceId": "inv_t1u2v3",
    "invoiceNumber": "INV-0051",
    "amount": 500000,
    "currency": "usd"
  }
}
```

## When this fires

When a customer on a balance plan tops up their prepaid balance through the customer portal and the payment succeeds.

`amount` is the topped-up value in rate scale (10000 = $1.00 of the subscription currency) — the same scale `balance.low` and `balance.depleted` use.

Use it to confirm the top-up in your own UI and to clear any low-balance warnings you raised on `balance.low`.
