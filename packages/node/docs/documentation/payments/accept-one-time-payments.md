---
lastModified: 2026-07-28
title: Accept One-Time Payments
description: Charge customers once with the Commet payments resource — no subscription or plan required. Tax, invoice, and receipt handled automatically.
---

A payment is a standalone one-time charge with no subscription or plan attached.

Commet calculates tax, generates an invoice, and sends a receipt on every payment automatically.

> **Note**
>
> For lifetime deals and one-off purchases billed as a **plan** (trials, intro offers, add-ons, consumption models), use [One-Time Plans](/docs/one-time-payments) instead.

## Link vs. charge

There are two ways to take a one-time payment.

- **Link** (`payments.create`): builds a hosted payment link. The customer opens the `url` and pays with any card. Vaults the payment method on confirmation.
- **Charge** (`payments.charge`): bills a customer's already-vaulted payment method off-session. No customer interaction, no `url`.

## Create a payment link

Returns a `Payment` with a `url`. Redirect the customer to it to collect payment.

### TypeScript

```typescript
const payment = await commet.payments.create({
  amount: 25000,
  currency: 'usd',
  description: 'Annual report',
  customerId: 'user_123',
  successUrl: 'https://yourapp.com/thanks',
})

redirect(payment.url)
```

### Python

```python
payment = commet.payments.create(
    amount=25000,
    currency='usd',
    description='Annual report',
    customer_id='user_123',
    success_url='https://yourapp.com/thanks',
)

redirect(payment.url)
```

### Go

```go
payment, err := client.Payments.Create(ctx, &commet.CreatePaymentParams{
    Amount:      25000,
    Currency:    "usd",
    Description: "Annual report",
    CustomerID:  "user_123",
    SuccessURL:  "https://yourapp.com/thanks",
})

// redirect(payment.URL)
```

### Java

```java
CreatePaymentParams params = CreatePaymentParams.builder()
    .amount(25000)
    .currency("usd")
    .description("Annual report")
    .customerId("user_123")
    .successUrl("https://yourapp.com/thanks")
    .build();
var payment = commet.payments().create(params);

// redirect(payment.url())
```

### PHP

```php
$result = $commet->payments->create(
    amount: 25000,
    currency: 'usd',
    description: 'Annual report',
    customerId: 'user_123',
    successUrl: 'https://yourapp.com/thanks',
);

redirect($result->url);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/payments \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25000,
    "currency": "usd",
    "description": "Annual report",
    "customerId": "user_123",
    "successUrl": "https://yourapp.com/thanks"
  }'
```

### CLI

```bash
commet payments create \
  --amount 25000 \
  --currency usd \
  --description "Annual report" \
  --customer-id user_123 \
  --success-url https://yourapp.com/thanks
```

`amount` is in cents. `25000` is $250.00.

### Parameters

| Parameter     | Type     | Required | Description                                         |
| ------------- | -------- | -------- | --------------------------------------------------- |
| `amount`      | `number` | Yes      | Charge amount in cents                              |
| `currency`    | `string` | Yes      | ISO 4217 currency code (`usd`, `eur`, `brl`)        |
| `description` | `string` | Yes      | Shown on the payment link, invoice, and receipt     |
| `customerId`  | `string` | No       | Commet customer ID (`cus_xxx`) or your external ID  |
| `successUrl`  | `string` | No       | Where the customer lands after paying               |
| `metadata`    | `object` | No       | Key-value pairs. Shape: `{ [key: string]: string }` |

## Charge a saved payment method

Bills a customer's vaulted payment method off-session. The customer must have a payment method on file.

### TypeScript

```typescript
const payment = await commet.payments.charge({
  customerId: 'user_123',
  amount: 25000,
  currency: 'usd',
  description: 'Annual report',
})
```

### Python

```python
response = commet.payments.charge(
    customer_id='user_123',
    amount=25000,
    currency='usd',
    description='Annual report',
)
```

### Go

```go
result, err := client.Payments.Charge(ctx, &commet.ChargePaymentParams{
    CustomerID:  "user_123",
    Amount:      25000,
    Currency:    "usd",
    Description: "Annual report",
})
```

### Java

```java
ChargePaymentParams params = ChargePaymentParams.builder()
    .customerId("user_123")
    .amount(25000)
    .currency("usd")
    .description("Annual report")
    .build();
var payment = commet.payments().charge(params);
```

### PHP

```php
$result = $commet->payments->charge(
    customerId: 'user_123',
    amount: 25000,
    currency: 'usd',
    description: 'Annual report',
);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/payments/charge \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "amount": 25000,
    "currency": "usd",
    "description": "Annual report"
  }'
```

### CLI

```bash
commet payments charge \
  --customer-id user_123 \
  --amount 25000 \
  --currency usd \
  --description "Annual report"
```

### Parameters

| Parameter     | Type     | Required | Description                                         |
| ------------- | -------- | -------- | --------------------------------------------------- |
| `customerId`  | `string` | Yes      | Commet customer ID (`cus_xxx`) or your external ID  |
| `amount`      | `number` | Yes      | Charge amount in cents                              |
| `currency`    | `string` | Yes      | ISO 4217 currency code (`usd`, `eur`, `brl`)        |
| `description` | `string` | Yes      | Shown on the invoice and receipt                    |
| `metadata`    | `object` | No       | Key-value pairs. Shape: `{ [key: string]: string }` |

## Retrieve a payment

```typescript
const payment = await commet.payments.get({ id: 'pay_123' })
```

## List payments

```typescript
const { data } = await commet.payments.list({
  customerId: 'user_123',
  limit: 20,
})
```

| Parameter    | Type     | Required | Description                              |
| ------------ | -------- | -------- | ---------------------------------------- |
| `customerId` | `string` | No       | Filter to one customer                   |
| `limit`      | `number` | No       | Page size                                |
| `cursor`     | `string` | No       | Pagination cursor from the previous page |

## Cancel a payment link

Cancels a pending link so it can no longer be paid.

```typescript
await commet.payments.cancel({ id: 'pay_123' })
```

> **Warning**
>
> Only a link that has not been paid or started processing can be canceled. Charges cannot be canceled.

## The Payment object

| Field            | Type                               | Description                             |
| ---------------- | ---------------------------------- | --------------------------------------- |
| `id`             | `string`                           | Payment ID (`pay_xxx`)                  |
| `customerId`     | `string \| null`                   | Customer the payment belongs to         |
| `kind`           | `"link" \| "charge"`               | How the payment was taken               |
| `status`         | `string`                           | Current state (see below)               |
| `provider`       | `"stripe" \| "commet" \| "dlocal"` | Payment provider that processed it      |
| `amountSubtotal` | `number`                           | Pre-tax amount in cents                 |
| `taxAmount`      | `number`                           | Tax in cents                            |
| `amountTotal`    | `number`                           | Subtotal + tax in cents                 |
| `currency`       | `string`                           | ISO 4217 currency code                  |
| `description`    | `string`                           | Description set at creation             |
| `metadata`       | `object \| null`                   | Key-value pairs set at creation         |
| `url`            | `string \| null`                   | Hosted payment link. `null` for charges |
| `expiresAt`      | `string \| null`                   | When the link expires                   |
| `createdAt`      | `string`                           | ISO 8601 datetime                       |
| `updatedAt`      | `string`                           | ISO 8601 datetime                       |
| `object`         | `"payment"`                        | Object type                             |
| `livemode`       | `boolean`                          | `false` for sandbox payments            |

### Statuses

- `pending`: The link was created and is waiting for the customer to pay.
- `processing`: The payment is being confirmed with the provider.
- `succeeded`: The payment completed and an invoice was generated.
- `requires_action`: The customer must complete an extra step such as 3D Secure.
- `failed`: The payment did not go through.
- `canceled`: The link was canceled before payment.

`failed` and `requires_action` are not terminal for links: the customer can reopen the same payment link and pay with another card, as long as the link hasn't expired.

## View in the dashboard

Navigate to **Payments**. Each payment shows its status, amount, tax, customer, and the generated invoice.

## Limitations

- `amount` is in cents — minor units of the currency
- Tax is calculated automatically and added on top of `amount`
- `payments.charge` requires a vaulted payment method on the customer
- Charges cannot be canceled
- A link can only be canceled while `pending`

## Related

- [One-Time Plans](/docs/one-time-payments) — One-time charges billed as a plan
- [Invoices and Billing Cycles](/docs/invoices-and-billing-cycles) — How invoices are generated
- [Manage Customers](/docs/manage-customers) — Create customers and vault payment methods
- [SDK Reference](/docs/sdk-reference) — Node.js SDK methods
- [CLI](/docs/cli#payments) — Create payment links from the terminal
