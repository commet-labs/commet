---
lastModified: 2026-08-17
title: "customer.state_changed"
description: "Aggregate entitlement event — what can this customer access right now."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `trigger` (string) — What caused the transition. One of: subscription\_created, subscription\_activated, subscription\_canceled, plan\_change, past\_due, trial\_started, trial\_converted, trial\_expired, cancellation\_scheduled, cancellation\_revoked, seats\_updated, addon\_activated, addon\_deactivated, credits\_depleted, balance\_depleted, quota\_exceeded, plan\_access\_granted, plan\_access\_ended.
- `status` (string) — The customer's current subscription status, or "none" when no live subscription exists. Access is granted while trialing, active, or past\_due — past\_due is a permissive grace window during dunning.
- `subscriptionId` (string | null) — The live subscription ID, or null when status is none.
- `plan` (WebhookPlanRef | null) — The current plan (id and name), or null when status is none.
- `billingInterval` (string | null) — The current billing interval.
- `consumptionModel` (string | null) — The plan's consumption model: metered, credits, or balance.
- `features` (unknown\[]) — Current feature access, discriminated by type. Boolean features expose enabled; usage features expose model-specific consumption; seats and quota expose usage allowances.
- `seats` (WebhookSeatSummary\[]) — Summary of seats-type features: code, current, included, remaining, unlimited.
- `credits` (WebhookCreditsBalance | null) — For credits plans: planCredits, purchasedCredits, totalCredits. Null otherwise.
- `balance` (WebhookBalance | null) — For balance plans: currentBalance in rate scale (10000 = $1.00). Null otherwise.

```json
{
  "event": "customer.state_changed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "customerId": "user_123",
    "trigger": "subscription_activated",
    "status": "active",
    "subscriptionId": "sub_1a2b3c4d",
    "plan": {
      "id": "pln_pro_monthly",
      "name": "Pro"
    },
    "billingInterval": "monthly",
    "consumptionModel": "metered",
    "features": [
      {
        "code": "api_calls",
        "name": "API Calls",
        "unitName": "request",
        "type": "usage",
        "allowed": true,
        "consumption": {
          "model": "metered",
          "period": {
            "start": "2026-07-01T00:00:00.000Z",
            "end": "2026-08-01T00:00:00.000Z"
          },
          "unitsUsed": 120,
          "includedUnits": 1000,
          "remainingUnits": 880,
          "unlimited": false,
          "overage": {
            "enabled": true,
            "units": 0,
            "unitPrice": {
              "amount": 50,
              "currency": "usd",
              "scale": 10000
            }
          }
        }
      },
      {
        "code": "editors",
        "name": "Editors",
        "unitName": "seat",
        "type": "seats",
        "allowed": true,
        "usage": {
          "period": {
            "start": "2026-07-01T00:00:00.000Z",
            "end": "2026-08-01T00:00:00.000Z"
          },
          "unitsUsed": 3,
          "includedUnits": 5,
          "remainingUnits": 2,
          "unlimited": false,
          "overage": {
            "enabled": false,
            "units": 0
          }
        }
      }
    ],
    "seats": [
      {
        "code": "editors",
        "current": 3,
        "included": 5,
        "remaining": 2,
        "unlimited": false
      }
    ],
    "credits": null,
    "balance": null
  }
}
```

## One event to sync access

Instead of handling every lifecycle event (`subscription.activated`, `subscription.canceled`, `trial.expired`, ...) to keep your access flags in sync, handle this single event. Every entitlement transition fires it with the customer's **current** state, computed at delivery time:

| trigger                  | When                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `subscription_created`   | A subscription was created (status `pending_payment` — no access yet).                                       |
| `subscription_activated` | A payment confirmed the subscription.                                                                        |
| `trial_started`          | A trial began.                                                                                               |
| `trial_converted`        | A trialing customer converted to paid via plan change.                                                       |
| `trial_expired`          | A trial ran out and regular billing began.                                                                   |
| `plan_change`            | A plan change executed (immediate or scheduled).                                                             |
| `cancellation_scheduled` | A cancellation was scheduled — access continues until period end.                                            |
| `cancellation_revoked`   | A scheduled cancellation was reverted.                                                                       |
| `subscription_canceled`  | The subscription terminated — `status` becomes `none`.                                                       |
| `past_due`               | A recurring payment failed — a grace window begins: usage and seats keep working, new purchases are blocked. |
| `seats_updated`          | A customer's seat count changed.                                                                             |
| `addon_activated`        | An add-on was activated on the subscription.                                                                 |
| `addon_deactivated`      | An add-on was deactivated from the subscription.                                                             |
| `credits_depleted`       | The subscription ran out of credits.                                                                         |
| `balance_depleted`       | The subscription ran out of prepaid balance.                                                                 |
| `quota_exceeded`         | Usage passed a feature's included quantity.                                                                  |
| `plan_access_granted`    | A Plan Grant temporarily expanded the customer's access without changing subscription billing.               |
| `plan_access_ended`      | A Plan Grant expired or was revoked; the payload contains the resulting current state.                       |

## Handling the payload

Use `status` as the access gate (`trialing` and `active` grant access), `features` for per-feature limits, and `credits`/`balance` for consumption headroom on credits/balance plans. The payload reflects the state at delivery time — if two transitions happen back to back, the later event always carries the final state, so processing events in `timestamp` order converges to the correct result.

See [Plan Grants](/docs/plan-grants) for the temporary access lifecycle.
