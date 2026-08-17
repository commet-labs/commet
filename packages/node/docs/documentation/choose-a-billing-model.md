---
lastModified: 2026-08-17
title: Choose a Billing Model
description: Choose between a recurring plan, usage, credits, balance, seats, quota, and one-time payments.
---

Start with the value your customer buys, not with an API method. Commet can combine a recurring base price with features, seats, or consumption, but each plan has one consumption model.

## Choose the primary model

| You sell                                   | Start with       | Example                                 |
| ------------------------------------------ | ---------------- | --------------------------------------- |
| Access to a product or tier                | Recurring plan   | $49 per month for Pro                   |
| A measurable unit with possible overage    | Metered          | API calls, storage, messages            |
| Product-specific units                     | Credits          | Generations, exports, analyses          |
| Monetary prepaid spend                     | Balance          | Compute or infrastructure spend         |
| Licensed users or roles                    | Seats            | Editors, agents, workspaces             |
| A hard operational allowance               | Quota            | Concurrent jobs or provisioned capacity |
| A single purchase without recurring access | One-time payment | Report, license, setup fee              |

**Seats and quota are feature behaviors, not separate plan consumption models.** A plan can use Metered, Credits, or Balance and still include seat or quota features.

## Decide what belongs in the catalog

- Use a **plan** for the recurring package and its renewal interval.
- Use an **add-on** for an optional recurring capability attached to a subscription.
- Use a **credit pack** for customer-purchased credits that persist across resets.
- Use an **Offer** or **Promo Code** to change the price or phases of a sale without cloning the plan.
- Use a **plan grant** when you want to temporarily expand access without changing the subscription's billing.
- Use a **customer credit** for a specific monetary adjustment, not as the plan's normal allowance.

## Model the smallest complete version

Start with one plan and one canonical flow. Create it in sandbox, connect one test customer, and verify checkout, access, renewal, and failure recovery before adding variants.

Use the complete examples for [fixed subscriptions](https://github.com/commet-labs/commet/tree/main/examples/fixed), [metered billing](https://github.com/commet-labs/commet/tree/main/examples/metered), [credits](https://github.com/commet-labs/commet/tree/main/examples/credits), [balance](https://github.com/commet-labs/commet/tree/main/examples/balance-fixed), [seats](https://github.com/commet-labs/commet/tree/main/examples/seats), and [quota](https://github.com/commet-labs/commet/tree/main/examples/quota).

Next, configure the chosen model in [Consumption Models](/docs/consumption-models) and review its business rules in [How Billing Works](/docs/how-does-billing-work).
