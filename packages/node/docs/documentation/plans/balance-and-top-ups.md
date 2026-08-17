---
lastModified: 2026-08-16
title: Balance and Top-Ups
description: Configure prepaid monetary usage, adjust a subscription balance, and let customers buy more.
---

The Balance consumption model gives a subscription a monetary allowance. Billable usage draws down that balance using each feature's configured price.

## Configure a balance plan

In **Plans**, choose **Balance**, set the amount included at each reset, and add billable features. Use [AI Token Billing](/docs/ai-token-billing) when model token cost and margin determine the charge.

Plan balance resets monthly for monthly, quarterly, yearly, free, and one-time plans. Weekly plans reset every seven days. Purchased top-ups do not survive the next reset.

## Adjust balance without charging

Use an adjustment for a support correction, migration, or administrative grant:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const balanceAdjustment = await commet.subscriptions.adjustBalance({
  id: "sub_xxx",
  amount: 5000,
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

balance_adjustment = commet.subscriptions.adjust_balance(
    "sub_xxx",
    amount=5000,
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

balanceAdjustment, err := client.Subscriptions.AdjustBalance(ctx, "sub_xxx", &commet.AdjustBalanceParams{
	Amount: 5000,
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.AdjustBalanceParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var balanceAdjustment = commet.subscriptions().adjustBalance(
    "sub_xxx",
    AdjustBalanceParams.builder(5000L).build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$balanceAdjustment = $commet->subscriptions->adjustBalance(
    id: 'sub_xxx',
    amount: 5000,
);
```

A positive amount adds balance; a negative amount removes it. Adjustments do not charge the customer's payment method, so keep the reason specific.

## Charge for a top-up

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const balanceTopup = await commet.subscriptions.topupBalance({
  id: "sub_xxx",
  amount: 5000,
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

balance_topup = commet.subscriptions.topup_balance(
    "sub_xxx",
    amount=5000,
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

balanceTopup, err := client.Subscriptions.TopupBalance(ctx, "sub_xxx", &commet.TopupBalanceParams{
	Amount: 5000,
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.TopupBalanceParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var balanceTopup = commet.subscriptions().topupBalance(
    "sub_xxx",
    TopupBalanceParams.builder(5000L).build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$balanceTopup = $commet->subscriptions->topupBalance(
    id: 'sub_xxx',
    amount: 5000,
);
```

A top-up charges the payment method attached to the subscription. Customers can also buy balance from the [Customer Portal](/docs/customer-portal).

## Enforce before spending

Check usage before work that should not run with insufficient balance, then track only completed work. Use a stable idempotency key so a retry does not deduct twice.

Use **Credits** instead when customers should buy product-specific units that persist across resets.
