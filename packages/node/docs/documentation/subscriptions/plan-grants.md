---
lastModified: 2026-08-16
title: Grant Paid-Plan Access Without Checkout
description: Give selected customers paid-plan entitlements for a fixed number of cycles, until a date, or until you revoke access.
---

Plan Grants move a customer from an active Free subscription to a paid plan without checkout, card details, or Invoice Credit. Use them when you want a selected customer to evaluate the real paid plan rather than a separate promotional plan.

The customer receives the target plan's features and limits. Commet keeps the grant and every duration change in a separate audit timeline.

## Before you create a grant

The customer must have an active Free subscription. The target must be a paid plan with a default recurring price for the selected billing interval.

The grant is eligible when:

- the customer has no active add-ons;
- paid non-seat feature overage is disabled;
- a Balance plan blocks usage when its balance is exhausted; and
- the customer's current seats do not already exceed the target plan's included allowance.

One-time prices cannot receive Plan Grants.

## Choose a duration

| Duration        | Behavior                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `cycles`        | Grants an exact number of the target price's weekly, monthly, quarterly, or yearly billing cycles.                        |
| `until_date`    | Ends access at the exact ISO timestamp you provide. The Dashboard treats the selected date as the end of that day in UTC. |
| `until_revoked` | Continues until you revoke it or replace it with a finite duration.                                                       |

You can change the duration of an active grant. For example, an unlimited evaluation can later become “one remaining month” by updating it to one monthly cycle.

## Grant access

Create the grant with the customer's public ID and the paid plan's public ID:

```bash
curl -X POST https://commet.co/api/v1/customers/cus_xxx/plan-grants \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "pln_starter",
    "billingInterval": "monthly",
    "duration": "cycles",
    "durationCycles": 2,
    "reason": "Selected customer evaluation"
  }'
```

The subscription moves to the paid plan immediately. Commet creates the plan period without opening checkout or asking for payment credentials.

## Update the duration

Use the grant's public ID to change its remaining duration:

```bash
curl -X PATCH https://commet.co/api/v1/customers/cus_xxx/plan-grants/grt_xxx \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "duration": "until_date",
    "expiresAt": "2026-10-31T23:59:59.999Z",
    "reason": "Extended evaluation"
  }'
```

You can also send `until_revoked`, or a new `cycles` duration with `durationCycles`.

## Revoke access

Revocation ends the grant at the time of the request:

```bash
curl -X POST https://commet.co/api/v1/customers/cus_xxx/plan-grants/grt_xxx/revoke \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Evaluation ended"}'
```

## Billing lifecycle

While the grant is active, Commet produces normal plan periods and invoices the paid plan base at `0`. The grant does not consume Invoice Credit, and there is no retroactive charge for covered periods.

At natural expiration or revocation:

1. complimentary access ends;
2. a new full-price period starts at that instant;
3. the subscription becomes `pending_payment`; and
4. Commet creates checkout for the new invoice.

Commet does not automatically move the customer back to Free. Your integration decides whether to send the customer to checkout or start a Free subscription through the normal [subscription lifecycle](/docs/manage-subscriptions).

If the customer pays, the subscription becomes active and its paid billing cycle remains anchored to the new invoice period. If your integration chooses Free, the customer receives the Free plan's entitlements instead.

## Seats, add-ons, and usage

The grant covers the paid plan's base price and included entitlements. Seats added after activation keep their independent payment flow.

Active add-ons and paid non-seat feature overage are not supported during a Plan Grant. Remove those obligations before granting access. A Balance plan must block when its balance is exhausted so it cannot create an uncovered charge.

## Plan Grants, Offers, and Invoice Credit

| Use                                                                              | Choose         |
| -------------------------------------------------------------------------------- | -------------- |
| Give selected customers paid-plan access without checkout or payment credentials | Plan Grant     |
| Define reusable commercial pricing or an introductory phase selected at checkout | Offer          |
| Reduce the monetary total of recurring invoices in one currency                  | Invoice Credit |

These are separate resources: a Plan Grant changes access, an Offer changes pricing terms, and Invoice Credit pays invoice amounts.

## Keep access in sync

Listen for [`customer.state_changed`](/docs/webhooks/customer-state-changed). `plan_access_granted` reports activation, while `plan_access_ended` reports expiration or revocation and the resulting current state.

## Audit grants

List the customer's grants to inspect the current status and the complete duration-change timeline:

```bash
curl https://commet.co/api/v1/customers/cus_xxx/plan-grants \
  -H "x-api-key: $COMMET_API_KEY"
```

See the [Plan Grants API reference](/docs/api-reference/customers/list-plan-grants) for the exact request and response schemas.

## Related

- [Manage Subscriptions](/docs/manage-subscriptions)
- [Introductory Offers](/docs/introductory-offers)
- [Customer State Changed](/docs/webhooks/customer-state-changed)
- [Handle Failed Payments](/docs/handle-failed-payments)
