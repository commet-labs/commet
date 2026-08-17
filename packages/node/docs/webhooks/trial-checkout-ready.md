---
lastModified: 2026-06-12
title: "trial.checkout_ready"
description: "A trial checkout link is ready to share with the customer."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `planName` (string) — The plan name.
- `trialDays` (number) — The length of the trial in days.
- `checkoutUrl` (string) — The hosted checkout URL to share with the customer.

```json
{
  "event": "trial.checkout_ready",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "planName": "Pro",
    "trialDays": 14,
    "checkoutUrl": "https://pay.commet.co/checkout/tok_9f8e7d6c"
  }
}
```

## When this fires

When a subscription with a trial is created and the customer still needs to add a payment method, Commet generates a checkout link that starts the trial once completed and fires this event as soon as the link is ready.

Completing this checkout saves the card and fires `trial.started`; the customer is not charged until the trial ends. Paid (non-trial) checkouts fire `checkout.ready` instead.

Use the `checkoutUrl` and `trialDays` to drive your own "start your X-day trial" messaging.
