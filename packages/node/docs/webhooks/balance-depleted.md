---
lastModified: 2026-06-12
title: "balance.depleted"
description: "A subscription ran out of prepaid balance."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `currentBalance` (number) — The balance after depletion in rate scale. Zero, or negative when overage is allowed.
- `currency` (string) — The subscription currency.

```json
{
  "event": "balance.depleted",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "currentBalance": 0,
    "currency": "usd"
  }
}
```

## When this fires

The async usage processor fires this once when a deduction moves the prepaid balance from positive to zero or below. On plans that block on exhaustion, further usage is rejected with `insufficient_balance`; otherwise the balance goes negative and usage continues.

`customer.state_changed` fires alongside it with trigger `balance_depleted`.

Use it to cut off gated features or push an urgent top-up flow.
