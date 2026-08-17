---
lastModified: 2026-08-16
title: Manage Subscriptions
description: Create, retrieve, cancel, uncancel, and reactivate subscriptions with SDK v9.
---

Install the Commet Skill so your coding agent can implement the current subscription lifecycle and verify the result.

```bash
npx skills add commet-labs/skills --skill commet
```

Subscriptions connect a customer to a plan and drive checkout, invoices, feature access, usage, and renewals.

## Lifecycle

The persisted statuses are:

| Status            | Meaning                               |
| ----------------- | ------------------------------------- |
| `draft`           | Created but not ready for billing     |
| `pending_payment` | Waiting for checkout                  |
| `trialing`        | Trial access is active                |
| `active`          | Billing normally                      |
| `past_due`        | Renewal failed and dunning is active  |
| `canceled`        | Billing and subscription access ended |

Commet does not expose a paused or expired subscription status.

## Create

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const createdSubscription = await commet.subscriptions.create({
  customerId: "user_123",
  planId: "pln_xxx",
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

created_subscription = commet.subscriptions.create(
    customer_id="user_123",
    plan_id="pln_xxx",
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

createdSubscription, err := client.Subscriptions.Create(ctx, &commet.CreateSubscriptionParams{
	CustomerID: "user_123",
	PlanID: func(value string) *string { return &value }("pln_xxx"),
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.CreateSubscriptionParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var createdSubscription = commet.subscriptions().create(
    CreateSubscriptionParams.builder("user_123").planId("pln_xxx").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$createdSubscription = $commet->subscriptions->create(
    customerId: 'user_123',
    planId: 'pln_xxx',
);
```

For a paid plan, redirect the customer to `checkoutUrl`. Free plans can activate without checkout and return `checkoutUrl: null`.

The normal path needs only `customerId` and either `planCode` or `planId`. Optional selection fields are:

| Field                            | When to send it                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `billingInterval`                | The customer selected a non-default interval                                               |
| `priceId`                        | The customer selected a concrete price variant                                             |
| `offerId`                        | Your application selected an Offer directly; it overrides automatic introductory selection |
| `promoCode`                      | The customer entered a Promo Code                                                          |
| `initialSeats`                   | You know the initial seat quantities at creation                                           |
| `skipTrial` or `customTrialDays` | You intentionally override the configured trial                                            |

Omitting `priceId` preserves default price and Market resolution. Omitting `offerId` preserves automatic Introductory Offer selection.

A compatible `pending_payment` checkout may be reused. An incompatible pending selection can be replaced without duplicating a paid subscription.

## Retrieve current or historical state

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const subscription = await commet.subscriptions.getActive({ customerId: "user_123" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

subscription = commet.subscriptions.get_active(customer_id="user_123")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

subscription, err := client.Subscriptions.GetActive(ctx, &commet.GetActiveSubscriptionParams{
	CustomerID: "user_123",
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.GetActiveSubscriptionParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var subscription = commet.subscriptions().getActive(
    GetActiveSubscriptionParams.builder("user_123").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$subscription = $commet->subscriptions->getActive(customerId: 'user_123');
```

`getActive` returns the customer's current subscription relationship or `null`.

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const subscription = await commet.subscriptions.get({ id: "sub_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

subscription = commet.subscriptions.get("sub_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

subscription, err := client.Subscriptions.Get(ctx, "sub_xxx")
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;

var commet = Commet.builder().apiKey("ck_xxx").build();

var subscription = commet.subscriptions().get("sub_xxx");
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$subscription = $commet->subscriptions->get(id: 'sub_xxx');
```

Use `get` with a public subscription ID to retrieve any persisted status, including `pending_payment`, `past_due`, and `canceled`.

## Cancel

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const subscription = await commet.subscriptions.cancel({ id: "sub_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

subscription = commet.subscriptions.cancel("sub_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

subscription, err := client.Subscriptions.Cancel(ctx, "sub_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.CancelSubscriptionParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var subscription = commet.subscriptions().cancel(
    "sub_xxx",
    CancelSubscriptionParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$subscription = $commet->subscriptions->cancel(id: 'sub_xxx');
```

A normal paid active subscription schedules cancellation at period end unless `immediate: true` is sent. Free, pending-payment, and past-due relationships cancel immediately. Cancellation does not erase the stored subscription balance.

## Reverse a scheduled cancellation

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const subscription = await commet.subscriptions.uncancel({ id: "sub_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

subscription = commet.subscriptions.uncancel("sub_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

subscription, err := client.Subscriptions.Uncancel(ctx, "sub_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.UncancelSubscriptionParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var subscription = commet.subscriptions().uncancel(
    "sub_xxx",
    UncancelSubscriptionParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$subscription = $commet->subscriptions->uncancel(id: 'sub_xxx');
```

`uncancel` works only before an end-of-period cancellation takes effect. It keeps the same subscription and current period.

## Recover a past-due subscription

Reactivate retries the outstanding renewal charge and keeps the original billing relationship:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const reactivatedSubscription = await commet.subscriptions.reactivate({ id: "sub_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

reactivated_subscription = commet.subscriptions.reactivate("sub_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

reactivatedSubscription, err := client.Subscriptions.Reactivate(ctx, "sub_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.ReactivateSubscriptionParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var reactivatedSubscription = commet.subscriptions().reactivate(
    "sub_xxx",
    ReactivateSubscriptionParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$reactivatedSubscription = $commet->subscriptions->reactivate(id: 'sub_xxx');
```

If the customer must update their payment method, create a hosted recovery link:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const recoveryLink = await commet.subscriptions.createRecoveryLink({ id: "sub_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

recovery_link = commet.subscriptions.create_recovery_link("sub_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

recoveryLink, err := client.Subscriptions.CreateRecoveryLink(ctx, "sub_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.CreateSubscriptionRecoveryLinkParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var recoveryLink = commet.subscriptions().createRecoveryLink(
    "sub_xxx",
    CreateSubscriptionRecoveryLinkParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$recoveryLink = $commet->subscriptions->createRecoveryLink(id: 'sub_xxx');
```

Automatic dunning retries are anchored to the original decline on days 1, 3, 5, and 7. A successful retry returns the subscription to `active`.

## Reactivate a canceled subscription

The same `reactivate` operation charges the saved payment method, reuses the subscription record, and starts a fresh period anchored to the reactivation date. You may pass an `offerId`; accepted phases are persisted as an immutable Offer Application.

The selected price is not snapshotted. Future renewals use its current catalog value. Archiving that price prevents new selection but does not break the existing subscription.

## Related

- [Grant Paid-Plan Access Without Checkout](/docs/plan-grants)
- [Upgrade and Downgrade Plans](/docs/upgrade-and-downgrade-plans)
- [Handle Failed Payments](/docs/handle-failed-payments)
- [Regional and Market Pricing](/docs/regional-prices)
- [Introductory Offers](/docs/introductory-offers)
- [Customer Portal](/docs/customer-portal)
