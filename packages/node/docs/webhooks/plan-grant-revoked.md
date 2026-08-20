---
lastModified: 2026-08-18
title: "plan_grant.revoked"
description: "A plan grant was revoked."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `id` (string) — The public plan grant ID.
- `customerId` (string) — The public customer ID.
- `subscriptionId` (string) — The public subscription ID.
- `basePlanId` (string) — The public ID of the subscribed base plan.
- `targetPlanId` (string) — The public ID of the plan whose access was granted.
- `targetPlanReleaseId` (string) — The public ID of the immutable target plan release.
- `status` ("active" | "expired" | "revoked") — The plan grant status at this transition.
- `duration` ("cycles" | "until\_date" | "until\_revoked") — How the plan grant duration is defined at this transition.
- `durationCycles` (integer | null) — The cycle count when duration is cycles.
- `startsAt` (string) — When the plan grant started.
- `expiresAt` (string | null) — The effective expiration deadline, if any.
- `reason` (string) — The reason recorded for this transition.
- `source` ("dashboard" | "api" | "system") — Where this transition originated.
- `revokedAt` (string | null) — When the plan grant was revoked, otherwise null.
- `createdAt` (string) — When the plan grant was created.
- `updatedAt` (string) — When the represented transition occurred.
- `events` (WebhookPlanGrantTimelineEvent\[]) — The grant timeline through the represented transition.

```json
{
  "event": "plan_grant.revoked",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "id": "pgr_1a2b3c4d",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "basePlanId": "pln_starter",
    "targetPlanId": "pln_pro",
    "targetPlanReleaseId": "plr_1a2b3c4d",
    "status": "revoked",
    "duration": "until_revoked",
    "durationCycles": null,
    "startsAt": "2026-08-01T00:00:00.000Z",
    "expiresAt": null,
    "reason": "Evaluation completed",
    "source": "api",
    "revokedAt": "2026-08-20T14:00:00.000Z",
    "createdAt": "2026-08-01T00:00:00.000Z",
    "updatedAt": "2026-08-20T14:00:00.000Z",
    "events": [
      {
        "id": "gre_1a2b3c4d",
        "type": "created",
        "reason": "Open-ended evaluation",
        "source": "api",
        "previousExpiresAt": null,
        "expiresAt": null,
        "duration": "until_revoked",
        "durationCycles": null,
        "requestedExpiresAt": null,
        "createdAt": "2026-08-01T00:00:00.000Z"
      },
      {
        "id": "gre_m3n4o5p6",
        "type": "revoked",
        "reason": "Evaluation completed",
        "source": "api",
        "previousExpiresAt": null,
        "expiresAt": null,
        "duration": null,
        "durationCycles": null,
        "requestedExpiresAt": null,
        "createdAt": "2026-08-20T14:00:00.000Z"
      }
    ]
  }
}
```

## When this fires

After an active Plan Grant is manually revoked through the API or dashboard. The payload is the grant at revocation, and its last timeline event is `revoked`.

`customer.state_changed` also fires with trigger `plan_access_ended`.
