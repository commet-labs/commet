---
lastModified: 2026-07-28
title: Credit Packs
description: Configure credit packages that customers can purchase from the Commet Customer Portal.
---

Credit Packs are additional credit packages customers can purchase when they run out of included plan credits. Only available for plans using the **Credits** [consumption model](/docs/consumption-models).

## Credit pack components

| Component     | Description                   | Example                      |
| ------------- | ----------------------------- | ---------------------------- |
| **Pack Name** | Customer-facing name          | "Starter Pack", "Power Pack" |
| **Credits**   | Number of credits in the pack | 100, 500, 2000               |
| **Price**     | How much the pack costs       | $10.00, $40.00               |

## Availability by subscription status

Credit packs can be purchased on any subscription with a payment method — including during a trial and on free plans. Free plan customers are prompted to enter a payment method on their first purchase.

## Create credit packs in the dashboard

Go to **Credit Packs** and click **Create Credit Pack**. Pack names must be unique within your organization. Packs are available to all credits-based plans.

## List credit packs via SDK

### TypeScript

```typescript
const { data } = await commet.creditPacks.list()
```

### Python

```python
response = commet.credit_packs.list()
```

### Go

```go
result, err := client.CreditPacks.List(ctx)
```

### Java

```java
var creditPacks = commet.creditPacks().list();
```

### PHP

```php
$result = $commet->creditPacks->list();
```

### cURL

```bash
curl https://commet.co/api/v1/credit-packs \
  -H "x-api-key: $COMMET_API_KEY"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "cpk_abc123",
      "name": "Starter Pack",
      "description": "100 credits for light usage",
      "credits": 100,
      "price": 1000,
      "currency": "usd"
    }
  ]
}
```

The `price` field is in **cents** (1000 = $10.00). Prices are always in USD.

## Related

- [Consumption Models](/docs/consumption-models) — How credits-based billing works
- [Manage Plans](/docs/create-plans) — Create plans with consumption models
- [Customer Portal](/docs/customer-portal) — Where customers purchase credit packs
- [Configure Features](/docs/configure-features) — Define credit costs per feature
