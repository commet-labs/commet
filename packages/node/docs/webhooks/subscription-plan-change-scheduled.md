---
lastModified: 2026-07-28
title: "subscription.plan_change_scheduled"
description: "Fired when a downgrade or interval change is scheduled for the end of the billing period."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Current status — the subscription stays usable.
- `currentPlan` (WebhookPlanRef) — The plan currently in effect (id and name).
- `scheduledPlan` (WebhookPlanRef) — The plan that takes effect at effectiveAt (id and name).
- `billingInterval` (string | null) — The current billing interval.
- `scheduledBillingInterval` (string | null) — The new billing interval, if the change includes one. Null when only the plan changes.
- `effectiveAt` (string) — ISO 8601 datetime when the change executes (the billing period end).

```json
{
  "event": "subscription.plan_change_scheduled",
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
    "scheduledPlan": {
      "id": "pln_starter",
      "name": "Starter"
    },
    "billingInterval": "monthly",
    "scheduledBillingInterval": null,
    "effectiveAt": "2026-04-25T00:00:00.000Z"
  }
}
```

## Scheduled plan change lifecycle

Interval direction takes precedence: a shorter interval is scheduled for the end of the paid period and a longer interval changes immediately. When the interval is unchanged, Plan Groups use `sortOrder`: lower-ordered plans are scheduled and higher-ordered plans change immediately. Paid-to-free changes are always scheduled.

| Moment                         | Event                                                                     | What to do                                                                          |
| ------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Downgrade requested            | `subscription.plan_change_scheduled`                                      | Show "changing to {scheduledPlan.name} on {effectiveAt}". Keep current plan access. |
| A different change replaces it | `subscription.plan_change_revoked` + `subscription.plan_change_scheduled` | Update the notice to the new target plan.                                           |
| Billing period ends            | `subscription.plan_changed`                                               | Apply the new plan's entitlements.                                                  |

Immediate upgrades skip this event entirely — they fire `subscription.plan_changed` right away.
