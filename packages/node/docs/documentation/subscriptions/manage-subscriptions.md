---
lastModified: 2026-09-04
title: Manage Subscriptions
description: Create, retrieve, pause, resume, cancel, and reactivate subscriptions.
---

Install the Commet Skill so your coding agent can implement the current subscription lifecycle and verify the result.

```bash
npx skills add commet-labs/skills --skill commet
```

Subscriptions connect a customer to a plan and drive checkout, invoices, feature access, usage, and renewals.

## Lifecycle

The persisted statuses are:

| Status            | Meaning                                 |
| ----------------- | --------------------------------------- |
| `draft`           | Created but not ready for billing       |
| `pending_payment` | Waiting for checkout                    |
| `trialing`        | Trial access is active                  |
| `active`          | Billing normally                        |
| `past_due`        | Renewal failed and dunning is active    |
| `paused`          | Access and renewals paused until resume |
| `canceled`        | Billing and subscription access ended   |

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

Omitting a `promoCode` or `offerId` that the pending checkout carries, including an Offer assigned through `PUT /subscriptions/{id}/offer`, replaces it with a new subscription and checkout without that benefit. Redirect to the returned `checkoutUrl`; the previous link stops working. To keep the Offer, send it again or assign it to the returned subscription ID.

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

## Pause and resume

A pause temporarily stops subscription access and renewals without canceling the subscription. You can pause a paid recurring subscription in `active` or `trialing` status. Free, one-time, pending-payment, past-due, and canceled subscriptions are not eligible. Resolve any scheduled cancellation, scheduled plan change, or pending plan-change checkout before creating a pause.

### Choose when to pause

| Mode         | Access and billing                                                                             | What happens on resume                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `immediate`  | Access stops immediately. The unused portion of the current paid or trial period is preserved. | Restores the remaining period without a new charge. Renewal moves to the end of that remaining time. |
| `period_end` | Access continues until the current billing or trial period ends. The next renewal is skipped.  | Charges a new period using the saved payment method. Access returns after successful settlement.     |

For example, an immediate pause with 10 paid days remaining preserves those 10 days. Resuming after a week still leaves 10 days before renewal.

While paused, the subscription does not generate renewal invoices. A period-end pause may still produce a final invoice for pending usage, overage, or seat/quota adjustments from the period that ended. It does not charge advance capacity for the next period.

### Set the duration

Set `durationDays` to a positive integer for an automatic resume attempt, or `null` for an indefinite pause that requires manual resume. The duration starts when the pause becomes effective, not when a future pause is scheduled.

In the Dashboard, open the subscription detail and choose **Pause**. Choose when the pause starts, then select a suggested duration or enter a number of days, weeks, or calendar months. Leave the duration empty for an indefinite pause. The dialog shows the effective date and the automatic resume attempt date before you confirm. Customers can edit an existing pause, cancel a scheduled pause, and resume a paused subscription in the [Customer Portal](/docs/customer-portal), but cannot create pauses; Commet Admin exposes them in the subscription detail. Dashboard mutations require permission to edit subscriptions.

Editing a pause derives an equivalent duration from its stored dates: weekly subscriptions prefer whole weeks; other subscriptions prefer whole calendar months, then weeks or days. Durations are always measured from the original effective date; a month ending on a shorter month uses its last day. The current pause shows its effective date and resume date. Use its actions to edit the duration, revoke a scheduled pause, or resume an effective pause.

### Create a pause

This request schedules a seven-day pause at period end:

```bash
curl -X POST https://commet.co/api/v1/subscriptions/sub_xxx/pause \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"mode":"period_end","durationDays":7}'
```

Use `"mode":"immediate"` to pause now, or `"durationDays":null` to leave the resume date open.

Creation returns the updated subscription. A future pause has `pause.status: "scheduled"` while the subscription remains `active` or `trialing`. Once effective, the subscription is `paused` and `pause.status` is `"active"`. The `pause` object includes `mode`, `effectiveAt`, and `resumeAt`; it is `null` when there is no current or scheduled pause.

### Edit or revoke a pause

Change the duration of a scheduled or effective pause:

```bash
curl -X PATCH https://commet.co/api/v1/subscriptions/sub_xxx/pause \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"durationDays":14}'
```

This sets the total duration to 14 days from the original effective date; it does not add 14 days from today. Send `null` to make the pause indefinite. This operation does not change its mode.

Revoke a pause before it becomes effective:

```bash
curl -X DELETE https://commet.co/api/v1/subscriptions/sub_xxx/pause \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27"
```

The subscription keeps its current period and access. An effective pause must be resumed instead.

### Resume and handle payment outcomes

Use `resume` for a paused subscription; `reactivate` is a separate operation for canceled or past-due subscriptions.

```bash
curl -X POST https://commet.co/api/v1/subscriptions/sub_xxx/resume \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27"
```

The response includes `subscriptionId`, `invoiceId`, and `status`. An immediate resume has no new invoice, so `invoiceId` is `null`.

| Response                      | Meaning                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `200`, `status: "succeeded"`  | Resume completed. Access is restored.                                                                  |
| `200`, `status: "processing"` | The resume payment or settlement is still pending. Do not restore access based on this response alone. |
| `402`, `charge_failed`        | The payment was declined. The subscription stays paused.                                               |
| `422`, `no_payment_method`    | A period-end resume needs a saved payment method.                                                      |
| `500`, `internal_error`       | An internal failure prevented completion; this is distinct from a declined payment.                    |

A declined resume keeps its invoice outstanding. Automatic payment retries follow days 1, 3, 5, and 7 from the original failure and reuse that invoice. The subscription stays paused during retries. If all retries fail, it is canceled and the resume invoice becomes uncollectible. Manual resume attempts do not consume automatic retry slots.

A period-end resume uses the current base price when its new invoice is created. An outstanding resume invoice keeps its original amounts and included credits or balance on retry, even if the catalog changes again. Accepted Introductory Offers and discounts preserve their unconsumed terms; resume does not grant a new Introductory Offer or redeem a promo code again.

See the [Pause API reference](/docs/api-reference/subscriptions/pause-subscription) and [Resume API reference](/docs/api-reference/subscriptions/resume-subscription) for the complete schemas.

### Keep access in sync

Use [Feature Access](/docs/api-reference/features/get-feature-access) to authorize requests against the current subscription state. Subscribe to these webhooks for asynchronous updates in your application:

- [`subscription.pause_scheduled`](/docs/webhooks/subscription-pause-scheduled): a future pause was scheduled; access has not stopped yet.
- [`subscription.pause_updated`](/docs/webhooks/subscription-pause-updated): the pause duration changed.
- [`subscription.pause_revoked`](/docs/webhooks/subscription-pause-revoked): the scheduled pause was removed.
- [`subscription.paused`](/docs/webhooks/subscription-paused): the pause became effective and subscription access stopped.
- [`subscription.resumed`](/docs/webhooks/subscription-resumed): resume completed and subscription access returned.
- [`subscription.resume_failed`](/docs/webhooks/subscription-resume-failed): resume payment failed and the subscription remains paused.

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

Canceling a paused subscription is immediate and discards its preserved time. Pending usage, overage, or seat adjustments may still produce a final invoice. To cancel while a future pause is scheduled, revoke that pause first.

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

- [Grant Temporary Plan Access](/docs/plan-grants)
- [Upgrade and Downgrade Plans](/docs/upgrade-and-downgrade-plans)
- [Handle Failed Payments](/docs/handle-failed-payments)
- [Regional and Market Pricing](/docs/regional-prices)
- [Introductory Offers](/docs/introductory-offers)
- [Customer Portal](/docs/customer-portal)
