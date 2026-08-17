---
lastModified: 2026-08-16
title: Manage Invoices
description: Review invoices, create adjustments, update outstanding status, send email, and generate PDF links.
---

Use **Invoices** as the accounting view of what a customer owes or paid. Use **Transactions** to inspect each payment attempt that tried to settle an invoice.

## Review invoice state

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const response = await commet.invoices.list();
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

invoices_list_result = commet.invoices.list()
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

invoicesListResult, err := client.Invoices.List(ctx, nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.ListInvoicesParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var invoicesListResult = commet.invoices().list(ListInvoicesParams.builder().build());
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$invoicesListResult = $commet->invoices->list();
```

Open an invoice in the dashboard to inspect line items, tax, subscription context, payment attempts, and customer details.

## Create an adjustment invoice

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const invoice = await commet.invoices.createAdjustment({
  customerId: "user_123",
  amount: 5000,
  description: "Customer requested",
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

invoice = commet.invoices.create_adjustment(
    customer_id="user_123",
    amount=5000,
    description="Customer requested",
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

invoice, err := client.Invoices.CreateAdjustment(ctx, &commet.CreateAdjustmentInvoiceParams{
	CustomerID: "user_123",
	Amount: 5000,
	Description: "Customer requested",
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.CreateAdjustmentInvoiceParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var invoice = commet.invoices().createAdjustment(
    CreateAdjustmentInvoiceParams.builder("user_123", 5000L, "Customer requested").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$invoice = $commet->invoices->createAdjustment(
    customerId: 'user_123',
    amount: 5000,
    description: 'Customer requested',
);
```

Use a positive amount for an extra charge and a negative amount for a credit. An adjustment invoice is a one-off accounting document; it does not change the plan or future renewals.

## Mark an outstanding invoice

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const invoice = await commet.invoices.updateStatus({
  id: "inv_xxx",
  status: "paid",
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

invoice = commet.invoices.update_status(
    "inv_xxx",
    status="paid",
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

invoice, err := client.Invoices.UpdateStatus(ctx, "inv_xxx", &commet.UpdateInvoiceStatusParams{
	Status: "paid",
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.UpdateInvoiceStatusParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var invoice = commet.invoices().updateStatus(
    "inv_xxx",
    UpdateInvoiceStatusParams.builder("paid").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$invoice = $commet->invoices->updateStatus(
    id: 'inv_xxx',
    status: 'paid',
);
```

Only outstanding invoices can be marked `paid` or `void`. This records an external settlement or a deliberate write-off; it does not create a provider transaction.

## Send or download

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const sentInvoice = await commet.invoices.send({ id: "inv_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

sent_invoice = commet.invoices.send("inv_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

sentInvoice, err := client.Invoices.Send(ctx, "inv_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.SendInvoiceParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var sentInvoice = commet.invoices().send("inv_xxx", SendInvoiceParams.builder().build());
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$sentInvoice = $commet->invoices->send(id: 'inv_xxx');
```

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const invoiceDownload = await commet.invoices.getDownloadUrl({ id: "inv_xxx" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

invoice_download = commet.invoices.get_download_url("inv_xxx")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

invoiceDownload, err := client.Invoices.GetDownloadURL(ctx, "inv_xxx", nil)
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.DownloadInvoiceParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var invoiceDownload = commet.invoices().getDownloadUrl(
    "inv_xxx",
    DownloadInvoiceParams.builder().build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$invoiceDownload = $commet->invoices->getDownloadUrl(id: 'inv_xxx');
```

The PDF link is signed and expires after seven days. Generate it when the customer requests the document instead of storing a long-lived public URL.

For automatic renewal and overage timing, read [Invoices and Billing Cycles](/docs/invoices-and-billing-cycles).
