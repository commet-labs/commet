---
title: Credit Packs
description: Sell credit packs, let customers buy a chosen quantity of credits at the plan price, and top up credits automatically at a threshold.
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

## Buy a chosen quantity of credits

Set a price per credit on the plan to let customers buy any whole quantity instead of a fixed pack. Open **Plans**, select a credits plan, and edit **Credit purchases**: **Price per credit** and an optional **Minimum purchase**.

```typescript
await commet.subscriptions.purchaseCredits({
  id: 'sub_xxx',
  quantity: 500,
})
```

Commet charges the saved payment method at the plan's price per credit and adds purchased credits. Send `creditPackId` instead of `quantity` to buy a pack. Both fire [`credits.purchased`](/docs/webhooks/credits-purchased).

| Response                | Cause                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| `400 validation_error`  | The quantity is below the plan's minimum, or the plan doesn't sell credits |
| `402 no_payment_method` | The subscription has no saved payment method Commet can charge             |
| `402 payment_failed`    | The charge was declined                                                    |

The effective minimum is the larger of the configured minimum and the smallest quantity that reaches the currency's minimum charge.

## Top up credits automatically

Auto top-up buys credits with the saved payment method when the subscription's credits fall to a threshold.

```typescript
await commet.subscriptions.updateAutoTopUp({
  id: 'sub_xxx',
  enabled: true,
  threshold: 100,
  quantity: 500,
  maxPerPeriod: 3,
})
```

| Parameter      | Type      | Description                                                     |
| -------------- | --------- | --------------------------------------------------------------- |
| `enabled`      | `boolean` | Turns automatic purchases on or off                             |
| `threshold`    | `integer` | Plan and purchased credits at or below which a top-up is bought |
| `quantity`     | `integer` | Credits each top-up buys. At least the plan's minimum           |
| `maxPerPeriod` | `integer` | Successful top-ups per credit renewal period. `1` to `100`      |

Send only the fields that change. Enabling requires a plan with a price per credit. Read the current settings, `status`, `topUpsThisPeriod`, and `lastFailure` with `getAutoTopUp`.

Auto top-up pauses after 3 consecutive failed top-ups, or after one whose charge couldn't be refunded. It resumes when the payment method changes, a credit purchase succeeds, or you save it enabled again.

Customers turn it on and edit it in the [Customer Portal](/docs/customer-portal) under **Auto top-up**. In the dashboard, it appears on the subscription detail.
