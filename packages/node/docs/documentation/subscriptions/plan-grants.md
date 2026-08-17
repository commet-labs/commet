---
lastModified: 2026-08-17
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

## Eligibility

The base subscription must be active and recurring. The target plan must belong to the same Plan Group and have a higher `sortOrder` than the base plan.

The initial release supports metered plans with boolean features and hard-capped usage, quota, or seat limits. Commet rejects a grant when either plan uses:

- Credits or Balance consumption;
- paid overage;
- AI model pricing; or
- active subscription add-ons.

The target plan may itself be free or paid. Its prices and billing intervals are irrelevant because the grant does not use them.

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

## Related

- [Manage Subscriptions](/docs/manage-subscriptions)
- [Introductory Offers](/docs/introductory-offers)
- [Customer State Changed](/docs/webhooks/customer-state-changed)
