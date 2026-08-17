---
lastModified: 2026-07-28
title: Manage Customers
description: Create and manage customers using the current Commet SDKs and dashboard.
---

Install the Commet Skill so your coding agent can integrate customers using the current API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

A customer represents the business or person you bill. Each customer can have one active subscription relationship at a time.

## Dashboard

Navigate to **Customers** to search customers, inspect billing state, assign a plan, and manage the subscription.

## Create a customer

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const customer = await commet.customers.create({ email: "user@example.com" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

customer = commet.customers.create(email="user@example.com")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

customer, err := client.Customers.Create(ctx, &commet.CreateCustomerParams{
	Email: "user@example.com",
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.CreateCustomerParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var customer = commet.customers().create(
    CreateCustomerParams.builder("user@example.com").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$customer = $commet->customers->create(email: 'user@example.com');
```

`create` is idempotent when you supply your own `id`: a retry with the same ID returns the existing customer.

Use:

- `id` for the stable identifier from your application.
- `email` for billing communication.
- `address` and `taxDocument` for billing and tax context.
- `metadata` for application-specific values that do not control billing behavior.

## Create customers in batch

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const customerBatch = await commet.customers.createBatch({ customers: [{ email: "user@example.com" }] });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

customer_batch = commet.customers.create_batch(customers=[{"email": "user@example.com"}])
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

customerBatch, err := client.Customers.CreateBatch(ctx, &commet.BatchCreateCustomersParams{
	Customers: []commet.BatchCreateCustomersParamsCustomersItem{{
		Email: "user@example.com",
	}},
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.models.BatchCreateCustomersParamsCustomersItem;
import co.commet.params.BatchCreateCustomersParams;
import java.util.List;

var commet = Commet.builder().apiKey("ck_xxx").build();

var customerBatch = commet.customers().createBatch(
    BatchCreateCustomersParams.builder(List.of(new BatchCreateCustomersParamsCustomersItem("user@example.com", null, null, null, null, null, null, null))).build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$customerBatch = $commet->customers->createBatch(
    customers: [['email' => 'user@example.com']],
);
```

A batch accepts up to 100 customers and returns successful and failed items independently.

## Retrieve a customer

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const customer = await commet.customers.get({ id: "cus_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

customer = commet.customers.get("cus_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

customer, err := client.Customers.Get(ctx, "cus_xxx")
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;

var commet = Commet.builder().apiKey("ck_xxx").build();

var customer = commet.customers().get("cus_xxx");
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$customer = $commet->customers->get(id: 'cus_xxx');
```

## Update a customer

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const customer = await commet.customers.update({ id: "cus_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

customer = commet.customers.update("cus_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

customer, err := client.Customers.Update(ctx, "cus_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.UpdateCustomerParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var customer = commet.customers().update(
    "cus_xxx",
    UpdateCustomerParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$customer = $commet->customers->update(id: 'cus_xxx');
```

Updates use `PATCH` semantics: send only the fields that should change.

## List customers

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const response = await commet.customers.list();
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

customers_list_result = commet.customers.list()
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

customersListResult, err := client.Customers.List(ctx, nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.ListCustomersParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var customersListResult = commet.customers().list(ListCustomersParams.builder().build());
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$customersListResult = $commet->customers->list();
```

Lists return `{ object, data, hasMore, nextCursor }`. Pass `nextCursor` back as `cursor` to request the next page. Singular customer operations return the customer directly.

See the [Customers API reference](/docs/api-reference/customers/list-customers) for the exact generated request and response fields.

## Related

- [Customer Portal](/docs/customer-portal)
- [Manage Subscriptions](/docs/manage-subscriptions)
- [Offers & Pricing changelog and migration checklist](/changelog/offers-and-pricing)
