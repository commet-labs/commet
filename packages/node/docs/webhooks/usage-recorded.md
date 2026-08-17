---
lastModified: 2026-06-12
title: "usage.recorded"
description: "A usage event was recorded. High volume — explicit opt-in."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `usageEventId` (string) — The usage event ID.
- `featureCode` (string) — The feature code the usage was tracked against.
- `value` (number) — The recorded quantity. For AI model events this is the total token count.
- `ts` (string) — ISO 8601 timestamp of the usage event.

```json
{
  "event": "usage.recorded",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "usageEventId": "evt_9f8e7d6c",
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "featureCode": "api_calls",
    "value": 25,
    "ts": "2026-06-18T09:12:00.000Z"
  }
}
```

## When this fires

Once per processed usage event, after the async processor persists it. This is the only **high-volume** webhook: it fires at your own ingest rate, so it is excluded from the family select-all in the dashboard and must be subscribed to explicitly.

Delivery is asynchronous — events are batched through the usage pipeline, so expect seconds of delay relative to the original `POST /usage/events` call. The idempotency key is the usage event ID, so retries never duplicate.

Use it to mirror usage into your own analytics store without polling.
