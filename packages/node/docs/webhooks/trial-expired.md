---
lastModified: 2026-07-28
title: "trial.expired"
description: "Fired when a trial period runs out and regular billing begins."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Current status — "active" once the billing cycle has activated the subscription.
- `planId` (string) — The plan ID.
- `planName` (string) — The plan name.
- `trialEndsAt` (string) — ISO 8601 datetime when the trial ended.

```json
{
  "event": "trial.expired",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "planId": "pln_pro_monthly",
    "planName": "Pro",
    "trialEndsAt": "2026-04-08T00:00:00.000Z"
  }
}
```

## When this fires

The trial reached `trialEndsAt`. The billing cycle activates the subscription (`status: "active"`), starts the first regular billing period, and generates the first invoice — `invoice.created` and payment events follow as the charge is processed.

Access does not change at this moment: the customer already had full access while trialing. A retryable first-charge failure moves the subscription to `past_due` recovery; a missing payment method or a customer-action-required outcome leaves it in `pending_payment` until checkout is completed.
