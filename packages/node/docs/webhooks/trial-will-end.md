---
lastModified: 2026-06-12
title: "trial.will_end"
description: "Predictive event fired once, 3 days before a trial ends."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Always "trialing" for this event.
- `planId` (string) — The plan ID.
- `planName` (string) — The plan name.
- `trialEndsAt` (string) — ISO 8601 datetime when the trial will end.

```json
{
  "event": "trial.will_end",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "trialing",
    "planId": "pln_pro_monthly",
    "planName": "Pro",
    "trialEndsAt": "2026-04-08T00:00:00.000Z"
  }
}
```

## When this fires

A daily scan finds trials ending within the next 3 days and emits this event once per trial. The idempotency key is derived from the subscription and the trial end date, so re-running the scan never sends a duplicate.

Use it to remind the customer that billing starts on `trialEndsAt` — the single most effective moment to prevent involuntary churn and surprise charges.

If the trial end date changes after this event fired (for example, the customer converts early), `trial.converted` or `trial.expired` reflects the final outcome.
