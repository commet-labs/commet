---
lastModified: 2026-06-12
title: "addon.activated"
description: "An add-on was activated on a subscription."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `addon` (WebhookAddonRef) — The add-on: id and name.
- `featureCode` (string) — The feature the add-on unlocks or extends.
- `proratedPrice` (number) — The prorated amount charged at activation in rate scale (10000 = $1.00). Zero when nothing was charged.
- `currency` (string) — The subscription currency.

```json
{
  "event": "addon.activated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "addon": {
      "id": "adn_5e6f7g8h",
      "name": "Extra Storage"
    },
    "featureCode": "storage",
    "proratedPrice": 25000,
    "currency": "usd"
  }
}
```

## When this fires

When an add-on activation completes — via `POST /subscriptions/{id}/addons` or a customer portal purchase. Any prorated activation charge has already succeeded; `proratedPrice` is the amount charged (zero when the remaining period was free).

`customer.state_changed` fires alongside it with trigger `addon_activated`, reflecting the feature the add-on unlocked.

Use it to enable the add-on's feature in your app the moment it is paid.
