---
lastModified: 2026-07-31
title: API Versioning
description: How Commet versions its API and webhooks so your integration never breaks unexpectedly.
---

Commet uses date-based API versioning inspired by Stripe. Every breaking change is gated behind a version, and your integration stays on its pinned version until you explicitly upgrade.

## Version format

Versions use the date they were released: `YYYY-MM-DD` (e.g. `2026-05-01`).

The current version is **2026-07-31**.

## How versions are resolved

Every API request and webhook delivery resolves a version using this priority:

| Priority | Source                  | Description                                    |
| -------- | ----------------------- | ---------------------------------------------- |
| 1        | `Commet-Version` header | Per-request override (API only)                |
| 2        | Endpoint pin            | Per-webhook-endpoint version (webhooks only)   |
| 3        | Organization pin        | Set when your org was created or last upgraded |
| 4        | Current version         | Latest version, used as fallback               |

For API requests, send the `Commet-Version` header to override your organization pin for that request:

```bash
curl https://commet.co/api/v1/subscriptions \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Commet-Version: 2026-07-31"
```

For webhooks, each endpoint can have its own pinned version. If not set, it falls back to your organization's pin.

## What changes between versions

A new version ships whenever a breaking change needs one — sometimes several land in the same month, sometimes months pass without any. This never affects a running integration: your organization and webhook endpoints stay on their pinned version regardless of how many versions ship after it. A breaking change is anything that:

- Removes a field from a response
- Renames a field
- Changes a field's type
- Changes the structure of a nested object
- Alters default behavior

Non-breaking changes ship continuously and never require a version bump:

- New fields added to responses
- New event types
- New API endpoints
- New optional request parameters

## Backward compatibility policy

When a new version is released:

1. Your existing pin continues to work unchanged — responses keep the shape of your pinned version
2. Pins never expire: there is no support window and no automatic upgrade. Your version changes only when you change it
3. If a pin references a version that no longer exists, requests on it resolve to the current version
4. The legacy unversioned `/api/*` paths (predating `/api/v1`) return `Deprecation: true` and `Sunset` headers with a `Link` to their `/api/v1` successor — versioned endpoints never carry these headers

## Upgrading your version

1. Review the changelog for breaking changes between your current and target version
2. Update your code to handle the new response shapes
3. Test with the `Commet-Version` header before committing
4. Change your organization's pinned version from the dashboard

For webhooks, you can pin a new endpoint to the latest version while keeping the old one active. Both receive events transformed to their respective versions, letting you validate in production before switching.

## SDK behavior

Each SDK release ships pinned to the API version it was built against and sends the `Commet-Version` header automatically. This prevents the class of bug where upgrading an SDK version silently changes response shapes.

Every SDK also lets you pin a different version at client construction — no SDK upgrade required:

| SDK     | Pin option                                 |
| ------- | ------------------------------------------ |
| Node.js | `apiVersion` in the constructor options    |
| Python  | `api_version` in the constructor           |
| Go      | `commet.WithApiVersion(...)` client option |
| Java    | `Commet.builder().apiVersion(...)`         |
| PHP     | `apiVersion` constructor argument          |

## Webhook versioning

Webhook payloads include an `apiVersion` field in the envelope so you always know which version shaped the data:

```json
{
  "event": "subscription.activated",
  "timestamp": "2026-05-12T14:30:00.000Z",
  "organizationId": "org_abc123",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": { ... }
}
```

Each webhook endpoint can be pinned independently. When migrating, create a second endpoint pinned to the new version — both receive every event, each transformed to its own version. Once the new endpoint is working, delete the old one.
