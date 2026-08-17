---
lastModified: 2026-07-28
title: One-Time Payments
description: Sell lifetime access or one-time purchases with a single charge and no recurring billing.
---

A one-time payment plan charges the customer once at checkout and never bills again for the plan base. Use it for lifetime deals, one-off purchases, or any plan where recurring billing doesn't apply.

> **Note**
>
> This page covers one-time charges billed as a **plan**. To charge a customer once with **no subscription or plan** — a standalone invoice with tax and receipt — use [Accept One-Time Payments](/docs/accept-one-time-payments) instead.

One-time plans behave like any other plan — they support [trials](/docs/trial-periods), [intro offers](/docs/introductory-offers), [add-ons](/docs/add-ons), and all [consumption models](/docs/consumption-models). The only differences are:

| Aspect               | Behavior                                                                  |
| -------------------- | ------------------------------------------------------------------------- |
| **Billing**          | Plan base charged once at checkout. Overage billed at each billing cycle. |
| **Cancellation**     | Not allowed — the subscription stays active permanently                   |
| **Interval changes** | Not allowed — cannot switch from one-time to a recurring interval         |

## Configure in the dashboard

In the dashboard, go to **Plans**, edit a plan, and add a price with interval **One-time (lifetime)**. You can combine one-time prices with recurring intervals on the same plan — each price has its own interval.

## Create a one-time subscription

### TypeScript

```typescript
const subscription = await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  billingInterval: 'one_time',
})

if (!subscription.checkoutUrl) {
  throw new Error('Commet did not return a checkout URL')
}

redirect(subscription.checkoutUrl)
```

### Python

```python
subscription = commet.subscriptions.create(
    customer_id='user_123',
    plan_code='pro',
    billing_interval='one_time',
)

if not subscription.checkout_url:
    raise RuntimeError('Commet did not return a checkout URL')

redirect(subscription.checkout_url)
```

### Go

```go
planCode := "pro"
billingInterval := "one_time"
subscription, err := client.Subscriptions.Create(ctx, &commet.CreateSubscriptionParams{
    CustomerID:      "user_123",
    PlanCode:        &planCode,
    BillingInterval: &billingInterval,
})
if err != nil {
    log.Fatal(err)
}
if subscription.CheckoutURL == nil {
    log.Fatal("Commet did not return a checkout URL")
}
http.Redirect(w, r, *subscription.CheckoutURL, http.StatusSeeOther)
```

### Java

```java
CreateSubscriptionParams params = CreateSubscriptionParams.builder()
    .customerId("user_123")
    .planCode("pro")
    .billingInterval("one_time")
    .build();
var subscription = commet.subscriptions().create(params);
if (subscription.checkoutUrl() == null) {
    throw new IllegalStateException("Commet did not return a checkout URL");
}
redirect(subscription.checkoutUrl());
```

### PHP

```php
$result = $commet->subscriptions->create(
    customerId: 'user_123',
    planCode: 'pro',
    billingInterval: 'one_time',
);

if ($result->checkoutUrl === null) {
    throw new RuntimeException('Commet did not return a checkout URL');
}
redirect($result->checkoutUrl);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/subscriptions \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "planCode": "pro",
    "billingInterval": "one_time"
  }'
```

The `billingInterval` must be `one_time` and the plan must have a one-time price configured. If the plan's default price is already one-time, you can omit the `billingInterval` parameter.

## Invoicing

The initial invoice includes the plan base price as a one-time charge. After that, subsequent billing cycles only generate invoices for overage — the plan base is never charged again.

| Invoice               | What's included                                                          |
| --------------------- | ------------------------------------------------------------------------ |
| **Initial**           | `plan_base` (once) + any applicable intro offer discount                 |
| **Subsequent cycles** | `feature_overage`, `feature_seats`, `addon_base` — only if charges exist |

If there's no overage or additional charges at a billing cycle, no invoice is generated.

## Customer portal

In the [Customer Portal](/docs/customer-portal), one-time subscriptions display the interval as **Lifetime**. The cancel button is hidden since cancellation is not allowed. Customers can still change plans if the plan belongs to a [Plan Group](/docs/plan-groups).

## Related

- [Manage Plans](/docs/create-plans) — Create and configure plans
- [Manage Subscriptions](/docs/manage-subscriptions) — Full subscription lifecycle
- [Invoices and Billing Cycles](/docs/invoices-and-billing-cycles) — How invoicing works
- [Consumption Models](/docs/consumption-models) — Metered, Credits, and Balance explained
