---
lastModified: 2026-07-10
title: "subscription.reactivated"
description: "Fired when a canceled subscription is reactivated and its reactivation charge succeeds."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Always "active" for this event. Restore access here.
- `currentPeriodStart` (string, optional) — ISO 8601 start of the new billing period, anchored to the reactivation date.
- `currentPeriodEnd` (string, optional) — ISO 8601 end of the new billing period.
- `name` (string | null) — Optional custom name for the subscription.
- `invoiceId` (string) — The fresh reactivation invoice ID.
- `invoiceNumber` (string) — The human-readable invoice number.
- `invoiceTotal` (number) — Invoice total in cents (100 = $1.00).
- `invoiceCurrency` (string) — The invoice currency code.
- `provider` ("stripe" | "commet" | "dlocal") — The payment provider that processed the reactivation charge: stripe, commet, or dlocal.

```json
{
  "event": "subscription.reactivated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "currentPeriodStart": "2026-05-10T00:00:00.000Z",
    "currentPeriodEnd": "2026-06-10T00:00:00.000Z",
    "name": "Acme Corp",
    "invoiceId": "inv_q7r8s9",
    "invoiceNumber": "INV-0051",
    "invoiceTotal": 9900,
    "invoiceCurrency": "usd",
    "provider": "stripe"
  }
}
```

## When this fires

A canceled subscription was reactivated through `reactivate` and the reactivation charge succeeded. Commet generates a fresh invoice, charges the saved payment method, and sets the status back to `active` with a billing period anchored to the reactivation date.

The subscription returns to `active` at the same time, so `customer.state_changed` also fires. Restore access on either event.

This is distinct from two similar events. `subscription.activated` fires on a subscription's first activation. `payment.recovered` fires when a `past_due` subscription is recovered — that path keeps the original invoice and billing anchor, while reactivation issues a new invoice and resets the anchor to now.

Reactivation requires the plan to still be available in the subscription's currency. If the reactivation charge declines, no event fires and the API returns a `recoveryUrl` the customer can use to add a new card and pay.
