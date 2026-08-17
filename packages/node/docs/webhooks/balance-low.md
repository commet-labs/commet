---
lastModified: 2026-06-12
title: "balance.low"
description: "Prepaid balance dropped below 10% of the last refill."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `currentBalance` (number) — The remaining balance in rate scale (10000 = $1.00 of the subscription currency).
- `thresholdBalance` (number) — The low-balance threshold that was crossed: 10% of the last refill, in rate scale.
- `currency` (string) — The subscription currency.

```json
{
  "event": "balance.low",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "currentBalance": 90000,
    "thresholdBalance": 100000,
    "currency": "usd"
  }
}
```

## When this fires

The async usage processor watches every balance deduction. When a batch moves the prepaid balance from above to at-or-below 10% of the last refill (period reset, top-up, or manual adjustment), this event fires once per crossing. A top-up re-arms it.

Amounts are in rate scale (10000 = $1.00) in the subscription currency.

Use it to prompt the customer to top up before usage gets blocked.
