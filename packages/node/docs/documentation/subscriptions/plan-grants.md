---
title: Grant Temporary Plan Access
description: Temporarily expand a subscription's features and limits without changing its plan, price, invoice, or billing cycle.
---

A Plan Grant temporarily expands an active subscription's access. It does not change the subscription's plan, price, currency, billing anchor, period, invoice, payment method, or status.

Use a Plan Grant when a selected customer needs higher limits or additional features for an evaluation, migration, support exception, or negotiated access period without changing what they are billed.

## How access is resolved

The subscription keeps its immutable base-plan contract. The grant pins an immutable release of a higher plan and combines both contracts:

- boolean features are enabled when either contract enables them;
- included usage, quota, and seat limits use the higher allowance;
- unlimited access applies when either contract is unlimited; and
- paid overage is never introduced by the grant.

When the grant ends, Commet immediately evaluates access against the base subscription again. Existing seats and recorded usage are not deleted. If the customer is already above a base-plan hard limit, further use is blocked until usage resets, capacity falls below the limit, or the subscription is upgraded normally.

## Credits and Balance plans

On a Credits or Balance plan, the target plan's terms for plan credits or plan balance apply while the grant lasts: the amount included each period, unused credits or balance carried over and their cap, the daily or weekly limit, and unlimited plan credits or balance. What each unit consumes stays the base plan's: credits per unit, the balance price per unit and AI model margins. A feature only the target plan has uses the target plan's.

- When the grant starts, the plan credits or plan balance grow at once by the difference between both included amounts. A Free subscription with 50 of its 93 monthly credits left that is granted Pro, which includes 240, holds 197.
- Each renewal while the grant is active adds the target plan's included amount with the target plan's carry-over rules.
- When the grant is revoked or expires mid-period, the plan part goes down by the same difference, without going below zero or removing debt, and the base plan's limit applies again. The next renewal gives the base plan's amount. A grant that ends exactly at a renewal leaves that renewal on the base plan's amount.
- Purchased credits and balance top-ups keep being sold and charged by the base subscription's plan.

A subscription on a plan without a consumption model can be granted a Credits or Balance plan. It consumes the target plan's credits or balance while the grant lasts, and when the grant ends it can no longer use those features.

## Eligibility

The base subscription must be active and recurring. The target plan must belong to the same Plan Group and have a higher `sortOrder` than the base plan.

Grants work on Metered, Credits and Balance plans. Both plans must use the same consumption model, with two exceptions: a plan without a consumption model can be granted a plan of any model, and a Metered plan and a plan without a consumption model can be combined either way. Commet rejects a grant when:

- the base and target plans use different consumption models other than those exceptions;
- either plan bills paid overage: Metered overage or AI model pricing on a Metered plan, or Credits or Balance that can go negative;
- the subscription has active add-ons;
- a Credits or Balance target plan does not sell the subscription's billing interval; or
- a Balance target plan does not sell the subscription's country and currency, or does not price in that country a usage feature the base plan lacks.

The target plan may itself be free or paid. It never charges anything: on a Credits or Balance plan, Commet only reads the amount included by its price for the subscription's billing interval.

## Choose a duration

| Duration        | Behavior                                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cycles`        | Ends on an existing subscription billing boundary. One cycle means the current `currentPeriodEnd`; additional cycles advance from the same billing anchor. |
| `until_date`    | Ends at the exact ISO timestamp provided. The Dashboard treats the selected date as the end of that day in UTC.                                            |
| `until_revoked` | Continues until it is revoked or changed to a finite duration.                                                                                             |

Creating or updating a grant never restarts the billing cycle.

## Grant access

Create the grant with the customer, active subscription, and target plan public IDs:

```bash
curl -X POST https://commet.co/api/v1/customers/cus_xxx/plan-grants \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-07-31" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "sub_xxx",
    "planId": "pln_pro",
    "duration": "cycles",
    "durationCycles": 2,
    "reason": "Selected customer evaluation"
  }'
```

Access expands immediately. No checkout, invoice, charge, credit, or subscription plan change is created.

## Update the duration

Use the grant public ID to change its remaining duration:

```bash
curl -X PATCH https://commet.co/api/v1/customers/cus_xxx/plan-grants/grt_xxx \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-07-31" \
  -H "Content-Type: application/json" \
  -d '{
    "duration": "until_date",
    "expiresAt": "2026-10-31T23:59:59.999Z",
    "reason": "Extended evaluation"
  }'
```

You can also send `until_revoked`, or `cycles` with a new `durationCycles` value. A new cycle count is resolved from the subscription's current period and original billing anchor.

## Revoke access

Revocation restores base-plan access immediately:

```bash
curl -X POST https://commet.co/api/v1/customers/cus_xxx/plan-grants/grt_xxx/revoke \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-07-31" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Evaluation ended"}'
```

Revocation does not create a full-price obligation, re-anchor the subscription, or move it to `pending_payment`.

## Change plan during a grant

A subscription with an active grant can change plan or billing interval. When the change applies, Commet revokes the grant with source `system` and sends `plan_grant.revoked`. On a Credits or Balance plan, the plan part first goes down by the grant's difference, as on any revocation, and then the change gives the new plan's amounts with its carry-over rules.

## Plan Grants, Offers, trials, and Invoice Credit

| Need                                                                   | Use            |
| ---------------------------------------------------------------------- | -------------- |
| Temporarily expand features or limits without changing billing         | Plan Grant     |
| Temporarily change reusable commercial terms                           | Offer          |
| Delay the first recurring charge as part of the subscription lifecycle | Trial          |
| Reduce invoice totals in one currency                                  | Invoice Credit |

## Keep access in sync

Listen for [`customer.state_changed`](/docs/webhooks/customer-state-changed). `plan_access_granted` reports activation, while `plan_access_ended` reports expiration or revocation.

List a customer's grants to inspect their status and duration-change timeline:

```bash
curl https://commet.co/api/v1/customers/cus_xxx/plan-grants \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-07-31"
```

See the [Plan Grants API reference](/docs/api-reference/customers/list-plan-grants) for exact request and response schemas.
