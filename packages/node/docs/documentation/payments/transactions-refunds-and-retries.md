---
lastModified: 2026-08-16
title: Transactions, Refunds, and Retries
description: Inspect provider-neutral payment attempts, refund successful charges, and retry failed renewals safely.
---

A transaction is one payment attempt. It records the provider, amount, customer, invoice, status, and lifecycle events without exposing provider credentials.

## Inspect payment attempts

Open **Transactions** to investigate a payment from the dashboard, or list them from your application:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const response = await commet.transactions.list();
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

transactions_list_result = commet.transactions.list()
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

transactionsListResult, err := client.Transactions.List(ctx, nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.ListTransactionsParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var transactionsListResult = commet.transactions().list(ListTransactionsParams.builder().build());
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$transactionsListResult = $commet->transactions->list();
```

One invoice can have multiple transactions when a renewal is retried. The original failed transaction remains immutable; a retry creates a new attempt.

## Refund a successful transaction

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const refund = await commet.transactions.refund({ id: "transaction_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

refund = commet.transactions.refund("transaction_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

refund, err := client.Transactions.Refund(ctx, "transaction_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.RefundTransactionParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var refund = commet.transactions().refund(
    "transaction_xxx",
    RefundTransactionParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$refund = $commet->transactions->refund(id: 'transaction_xxx');
```

The operation requests a full refund and returns its actual provider-neutral status. Do not grant the refund in your product before the result is confirmed. Handle [`payment.refunded`](/docs/webhooks/payment-refunded) idempotently for downstream access or balance changes.

## Retry a failed renewal

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const transactionRetry = await commet.transactions.retry({ id: "transaction_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

transaction_retry = commet.transactions.retry("transaction_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

transactionRetry, err := client.Transactions.Retry(ctx, "transaction_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.RetryTransactionParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var transactionRetry = commet.transactions().retry(
    "transaction_xxx",
    RetryTransactionParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$transactionRetry = $commet->transactions->retry(id: 'transaction_xxx');
```

Retry is for failed subscription renewals, not arbitrary one-time charges. It keeps the failed attempt for audit and returns the new attempt honestly.

For a past-due subscription, prefer the lifecycle actions in [Handle Failed Payments](/docs/handle-failed-payments) when the customer needs a recovery link or a new payment method.

Provider routing changes do not move a saved payment method. A retry uses the connection already bound to the subscription.
