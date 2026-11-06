---
title: Pricing Changes
description: New customers pay a new price at once; existing subscribers keep the prices of their plan version until you move them, except Market prices.
---

When you change a price, Commet publishes a new [version](/docs/plan-versions) of the plan. **New customers pay the new price immediately.** **Existing subscribers keep the prices of their version**, also at renewal, whether you raise or lower them, until you move them to the new version.

The rule is the same for every price of the plan: base and variant prices, overage, seats, quota, and the add-ons and credit packs it sells. The exception is a [Market](/docs/regional-prices#create-a-market) price, which is not versioned.

## Base and Variant Prices

The subscription keeps the selected price ID and reads its amount from the subscription's plan version.

|                     | New customers | Existing subscribers                   |
| ------------------- | ------------- | -------------------------------------- |
| You raise the price | Pay new price | Keep their version's price until moved |
| You lower the price | Pay new price | Keep their version's price until moved |

### Example

```
You change Plan Pro from $99/mo to $129/mo. That publishes version 2.

A new customer signs up today → pays $129/mo on version 2.
An existing customer on version 1 → keeps paying $99/mo, also at renewal.
You move them at their next renewal → they pay $129/mo from then on.
```

> **Note**
>
> Archiving a price prevents new selection but does not break subscriptions already bound to it. Accepted Offer phases remain snapshotted separately.

## Usage, Seat, and Quota Prices

Per-unit prices follow the same rule, in both directions: existing subscribers keep their version's overage, seat, and quota prices until you move them.

### Example

```
You raise the overage price from $0.002/call to $0.005/call.

A new customer → charged $0.005 per extra call
An existing customer → still charged $0.002 per extra call until you move them

You lower the extra seat price from $35/seat to $25/seat.

A new customer → $25 per extra seat
An existing customer → $35 per extra seat until you move them
```

## Market Prices

Market prices apply to every version. When you edit a Market price, new customers get it at once, and subscribers who pay it get it at their next renewal, whether you raise or lower it. A move to another version keeps a subscriber's Market price.

## Moving Existing Subscribers

When you publish a draft in the dashboard, choose whether subscribers of earlier versions stay on their version, move at their next renewal, or move now. Through the API, move them with `POST /subscriptions/{id}/change-version` or `POST /plans/{id}/moves`.

A move never prorates or refunds, and it never changes a subscription's currency. A move made now changes features and limits today and the price from the next renewal. See [Move subscribers](/docs/plan-versions#move-subscribers).
