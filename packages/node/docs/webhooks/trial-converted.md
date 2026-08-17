---
lastModified: 2026-06-12
title: "trial.converted"
description: "Fired when a trialing customer converts to a paid subscription before the trial ends."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Always "active" for this event.
- `planId` (string) — The plan ID the customer converted to.
- `planName` (string) — The plan name.

```json
{
  "event": "trial.converted",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "planId": "pln_pro_monthly",
    "planName": "Pro"
  }
}
```

## When this fires

A customer on a trial changes plan before the trial runs out. The trial ends immediately, the full new plan price is charged (no proration credit — trials are free), and the subscription becomes `active`.

`subscription.plan_changed` fires alongside this event with the charge details. Use `trial.converted` for conversion analytics and lifecycle messaging; use `subscription.plan_changed` for entitlement updates.

Trials that simply run out fire `trial.expired` instead — that is the natural trial-to-paid transition.
