---
lastModified: 2026-06-12
title: "subscription.plan_change_revoked"
description: "Fired when a scheduled plan change is replaced before it executes."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Current status — the subscription stays usable.
- `currentPlan` (WebhookPlanRef) — The plan currently in effect (id and name).
- `revokedPlan` (WebhookPlanRef) — The previously scheduled plan that will no longer take effect (id and name).
- `billingInterval` (string | null) — The current billing interval.
- `revokedBillingInterval` (string | null) — The previously scheduled billing interval, if the revoked change included one.

```json
{
  "event": "subscription.plan_change_revoked",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "currentPlan": {
      "id": "pln_pro",
      "name": "Pro"
    },
    "revokedPlan": {
      "id": "pln_starter",
      "name": "Starter"
    },
    "billingInterval": "monthly",
    "revokedBillingInterval": null
  }
}
```

## When this fires

A subscription can only have one pending scheduled change. When a new downgrade or interval change is scheduled while another one is still pending, the old one is replaced:

1. `subscription.plan_change_revoked` fires with the plan that will no longer take effect (`revokedPlan`).
2. `subscription.plan_change_scheduled` fires with the new target plan.

Scheduling the exact same change again is a no-op and does not fire this event. The subscription's current plan and access are unaffected — only the pending change moves.
