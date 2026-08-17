---
lastModified: 2026-06-18
title: "subscription.past_due"
description: "Fired when a recurring payment fails and the subscription enters a grace window while Commet retries the charge."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Always "past\_due" for this event.
- `invoiceId` (string) — The invoice whose payment failure triggered the status.
- `invoiceNumber` (string) — The human-readable invoice number.

```json
{
  "event": "subscription.past_due",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "past_due",
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043"
  }
}
```

## When this fires

A recurring charge failed on a subscription that has been paid before. Commet sets the status to `past_due` and enters dunning.

`past_due` is a permissive grace window — features, usage, and seats keep working. Only purchases and plan changes are blocked. Usage accrues as debt during this window.

Commet retries the charge on day 1, day 3, day 5, and day 7 after the failure (4 retries). If a retry succeeds the subscription returns to `active`. If all 4 retries fail the subscription is canceled.

`payment.failed` fires alongside this event with the charge failure details (`failureCode`, `failureMessage`). Use `subscription.past_due` to drive your access state and `payment.failed` to drive recovery messaging.

First-checkout card declines do NOT trigger this event — a subscription that was never paid moves back to `pending_payment` instead.
