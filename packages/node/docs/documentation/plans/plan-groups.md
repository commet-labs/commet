---
title: Plan Groups
description: Group plans for self-service upgrades and downgrades, and choose the default free plan and signup trial that new and departing customers land on.
---

A plan group is the [upgrade and downgrade path](/docs/what-happens-when-a-customer-changes-plans) between plans. Without a plan group, customers won't see upgrade or downgrade options in the [Customer Portal](/docs/customer-portal).

## Plan group components

| Component        | Description                                                 | Example            |
| ---------------- | ----------------------------------------------------------- | ------------------ |
| **Group Name**   | Name for the collection                                     | "Standard Plans"   |
| **Plans**        | Plans in the group, ordered low to high                     | Free, Starter, Pro |
| **Hierarchy**    | Drag-and-drop order defining upgrade path                   | Lowest tier first  |
| **Default plan** | Free plan customers land on when a paid plan or trial ends  | Free               |
| **Signup trial** | Paid plan new customers start on, as a trial without a card | Pro                |

## Create a plan group in the dashboard

Go to **Plans** → **Groups** and click **Create Group**. Name the group, add your plans, then drag and drop to arrange them from lowest to highest tier. Each plan can only belong to one group. Plans in a group can sell different currencies and countries with [Regional Prices](/docs/regional-prices). A subscriber can switch only to group plans that sell its currency in its country: the Customer Portal shows only those, and the API rejects the others with `422 missing_regional_price`.

This order defines the upgrade path and display order in the Customer Portal.

## Default plan and signup trial

Open the group and choose **Set as default** on a free plan, or **Set as signup trial** on a paid plan whose default price has a [trial without a payment method](/docs/trial-periods#start-a-trial-without-a-payment-method). A group has at most one of each.

A customer created with `planGroupId` starts at once on:

- the signup trial, when the group has one and the customer never had that plan;
- otherwise the default plan;
- otherwise no plan.

```typescript
await commet.customers.create({
  email: 'user@example.com',
  planGroupId: 'plg_xxx',
})
```

`customers.createBatch` accepts the same `planGroupId` for every customer in the batch. A customer that already has an open subscription keeps it.

A paid plan of the group moves to the default plan instead of being canceled when:

- the customer cancels it from the Customer Portal, at period end;
- its payment authorization is revoked;
- every payment retry fails;
- a trial without a payment method ends without a card.

Canceling through the API still cancels. A scheduled move to the default plan can be revoked like any [scheduled plan change](/docs/upgrade-and-downgrade-plans#revoke-a-scheduled-plan-change).

Removing the default plan makes later endings regular cancellations. Moves already scheduled keep their target.

## Limitations

- The default plan must be a free plan in the group.
- A signup trial plan can't remove the trial without a payment method from its default price.
- A customer gets the signup trial once per plan.
- `planGroupId` for a group with neither a default plan nor a signup trial returns `400`.
- `planGroupId` for a group with a signup trial returns `403` while the organization can't charge yet.
