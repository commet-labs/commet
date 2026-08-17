---
lastModified: 2026-06-12
title: "quota.exceeded"
description: "Usage passed a feature's included quantity."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `featureCode` (string) — The metered feature code.
- `currentUsage` (number) — Total usage in the current period.
- `includedAmount` (number) — The included quantity for the period.
- `overageEnabled` (boolean) — True when overage billing began; false when the hard limit was hit and usage is now blocked.
- `periodStart` (string) — ISO 8601 start of the usage period.

```json
{
  "event": "quota.exceeded",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "featureCode": "api_calls",
    "currentUsage": 1080,
    "includedAmount": 1000,
    "overageEnabled": true,
    "periodStart": "2026-06-01T00:00:00.000Z"
  }
}
```

## When this fires

Once per feature per billing period, when period usage passes the included quantity:

- **Overage enabled** (`overageEnabled: true`): overage billing began — every unit past the included amount will be charged at renewal.
- **Overage disabled** (`overageEnabled: false`): the hard limit was hit — further usage requests for this feature are rejected. This case also fires `customer.state_changed` with trigger `quota_exceeded`, since the customer's access changed.

Use it to surface overage charges in your UI, or to block the feature when the limit is hard.
