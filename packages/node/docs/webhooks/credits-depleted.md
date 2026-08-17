---
lastModified: 2026-06-12
title: "credits.depleted"
description: "A subscription ran out of credits."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `remainingCredits` (number) — Credits remaining after depletion. Always 0.

```json
{
  "event": "credits.depleted",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "remainingCredits": 0
  }
}
```

## When this fires

The async usage processor fires this once when a deduction moves the credit balance from positive to zero. From this point, usage requests that need more credits than remain are rejected with `insufficient_credits`.

`customer.state_changed` fires alongside it with trigger `credits_depleted`, carrying the customer's full current entitlement state.

Use it to block gated features in your app and drive the customer to a credit pack purchase.
