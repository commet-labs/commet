---
lastModified: 2026-06-12
title: "trial.started"
description: "Fired when a subscription enters its trial period. Grant access here."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Always "trialing" for this event.
- `planId` (string) — The plan ID.
- `planName` (string) — The plan name.
- `trialEndsAt` (string) — ISO 8601 datetime when the trial ends.

```json
{
  "event": "trial.started",
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

## Trial lifecycle

Trials in Commet collect a payment method at checkout, so every trial has a clear path to revenue:

| Moment                             | Event             | What to do                               |
| ---------------------------------- | ----------------- | ---------------------------------------- |
| Checkout completes with trial days | `trial.started`   | Grant full access.                       |
| 3 days before the trial ends       | `trial.will_end`  | Remind the customer billing starts soon. |
| Customer upgrades during the trial | `trial.converted` | Trial ends early, paid plan starts now.  |
| Trial runs out                     | `trial.expired`   | Regular billing begins automatically.    |

Subscriptions with `status: "trialing"` have full access — treat them like `active` in your entitlement checks.
