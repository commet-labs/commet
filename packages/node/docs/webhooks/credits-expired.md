---
lastModified: 2026-06-12
title: "credits.expired"
description: "Unused plan credits expired at the period reset."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `expiredCredits` (number) — The unused plan credits that were discarded.

```json
{
  "event": "credits.expired",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "expiredCredits": 120
  }
}
```

## When this fires

Plan credits expire at the end of each billing period: the period reset discards whatever remained and grants the new period's credits (which fires `credits.granted`). This event reports the discarded amount. Purchased credits never expire and are not affected.

It only fires when there was something to discard — a customer who used all plan credits gets no `credits.expired`.

Use it for end-of-period usage summaries ("you left 120 credits on the table").
