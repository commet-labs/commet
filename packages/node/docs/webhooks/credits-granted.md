---
lastModified: 2026-06-12
title: "credits.granted"
description: "Non-purchase credits were granted to a subscription."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `credits` (number) — The number of credits granted.
- `reason` (string) — Why the credits were granted: period\_reset or manual\_adjustment.

```json
{
  "event": "credits.granted",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "credits": 500,
    "reason": "period_reset"
  }
}
```

## When this fires

Plan-included credits are granted at the start of every billing period (`reason: "period_reset"`), and manual adjustments from the dashboard grant purchased credits (`reason: "manual_adjustment"`). Credit pack purchases are a separate flow and fire `credits.purchased` instead.

The idempotency key is derived from the billing operation that granted the credits, so engine retries never send a duplicate.

Use it to reset in-app usage meters at the start of a period or to confirm a support-driven credit grant reached the customer.
