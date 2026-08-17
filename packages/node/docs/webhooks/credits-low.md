---
lastModified: 2026-06-12
title: "credits.low"
description: "Remaining credits dropped below 10% of the period grant."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `remainingCredits` (number) — Total credits remaining (plan plus purchased).
- `thresholdCredits` (number) — The low-credit threshold that was crossed: 10% of the period's granted plan credits.
- `periodCredits` (number) — The plan credits granted at the last period reset.

```json
{
  "event": "credits.low",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "remainingCredits": 42,
    "thresholdCredits": 50,
    "periodCredits": 500
  }
}
```

## When this fires

The async usage processor watches every credit deduction. When a batch of usage moves the remaining credits (plan plus purchased) from above to at-or-below 10% of the credits granted at the last period reset, this event fires once. It does not re-fire while the balance stays low, and the next period reset re-arms it.

If a single burst of usage jumps straight past zero, only `credits.depleted` fires.

Use it to prompt the customer to buy a credit pack before they hit zero.
