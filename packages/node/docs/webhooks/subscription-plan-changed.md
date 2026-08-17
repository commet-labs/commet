---
lastModified: 2026-03-28
title: "subscription.plan_changed"
description: "Fired when a subscription changes plans"
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `previousPlan` (WebhookPlanRef) — The previous plan (id and name).
- `currentPlan` (WebhookPlanRef) — The new plan (id and name).
- `billingInterval` (string | null) — The billing interval (monthly, yearly).
- `credit` (number) — Prorated credit in cents from the previous plan.
- `charge` (number) — Prorated charge in cents for the new plan.
- `totalCharged` (number) — Total amount charged in cents.

```json
{
  "event": "subscription.plan_changed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "previousPlan": {
      "id": "pln_starter",
      "name": "Starter"
    },
    "currentPlan": {
      "id": "pln_pro",
      "name": "Pro"
    },
    "billingInterval": "monthly",
    "credit": 1500,
    "charge": 4900,
    "totalCharged": 3400
  }
}
```
