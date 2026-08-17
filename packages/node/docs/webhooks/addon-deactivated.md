---
lastModified: 2026-06-12
title: "addon.deactivated"
description: "An add-on was deactivated from a subscription."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `addon` (WebhookAddonRef) — The add-on: id and name.
- `featureCode` (string) — The feature the add-on unlocked or extended.

```json
{
  "event": "addon.deactivated",
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
    "featureCode": "storage"
  }
}
```

## When this fires

When an active add-on is deactivated — via `DELETE /subscriptions/{id}/addons/{addonId}` or the customer portal. The add-on stops billing at the next renewal.

`customer.state_changed` fires alongside it with trigger `addon_deactivated`.

Use it to revoke the add-on's feature in your app.
