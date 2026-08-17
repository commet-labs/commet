---
lastModified: 2026-06-12
title: "quota.threshold_reached"
description: "Usage crossed 80% of a feature's included quantity."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `featureCode` (string) — The metered feature code.
- `currentUsage` (number) — Total usage in the current period after the crossing.
- `includedAmount` (number) — The included quantity for the period.
- `periodStart` (string) — ISO 8601 start of the usage period.

```json
{
  "event": "quota.threshold_reached",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "featureCode": "api_calls",
    "currentUsage": 850,
    "includedAmount": 1000,
    "periodStart": "2026-06-01T00:00:00.000Z"
  }
}
```

## When this fires

For metered plans, the async usage processor compares each feature's period usage against its included quantity. When usage crosses 80% of the included amount, this fires once for that feature and billing period. Unlimited features never fire it.

If a single burst jumps straight past the included amount, only `quota.exceeded` fires.

Use it to warn the customer they are approaching their limit.
