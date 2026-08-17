---
lastModified: 2026-07-28
title: Quota Management
description: Manage durable quota balances with the Commet SDK.
---

Quota tracks a durable, countable balance that rises and falls as customers create and delete — tasks, WhatsApp numbers, parallel automations. Commet includes an amount with the plan and bills per-unit overage automatically.

## Quota components

| Component        | Description                            | Example                                    |
| ---------------- | -------------------------------------- | ------------------------------------------ |
| **Feature Code** | The quota resource you track           | `tasks`, `whatsapp_numbers`, `automations` |
| **Count**        | Units to add, remove, or set           | `5`, `10`, `50`                            |
| **Billing**      | Overage is billed per unit on the plan | $1/task/month                              |

## Dashboard

Create a quota feature from **Features**, then **Create Feature**, and choose the **Quota** type. Feature codes must be created before use. View current balances on each customer's subscription detail page.

## Add to quota

Defaults to 1 unit if `count` is omitted.

### TypeScript

```typescript
await commet.quota.add({
  customerId: 'user_123',
  featureCode: 'tasks',
  count: 5,
})
```

### Python

```python
commet.quota.add(
    feature_code='tasks',
    count=5,
    customer_id='user_123',
)
```

### Go

```go
customerID := "user_123"
count := 5
client.Quota.Add(ctx, &commet.AddQuotaParams{
    FeatureCode: "tasks",
    Count:       &count,
    CustomerID:  &customerID,
})
```

### Java

```java
commet.quota().add(AddQuotaParams.builder("tasks").customerId("user_123").count(5L).build());
```

### PHP

```php
$commet->quota->add(
    featureCode: 'tasks',
    count: 5,
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/usage/quota \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "featureCode": "tasks",
    "count": 5
  }'
```

## Remove from quota

### TypeScript

```typescript
await commet.quota.remove({
  customerId: 'user_123',
  featureCode: 'tasks',
  count: 2,
})
```

### Python

```python
commet.quota.remove(
    feature_code='tasks',
    count=2,
    customer_id='user_123',
)
```

### Go

```go
customerID := "user_123"
count := 2
client.Quota.Remove(ctx, &commet.RemoveQuotaParams{
    FeatureCode: "tasks",
    Count:       &count,
    CustomerID:  &customerID,
})
```

### Java

```java
commet.quota().remove(RemoveQuotaParams.builder("tasks").customerId("user_123").count(2L).build());
```

### PHP

```php
$commet->quota->remove(
    featureCode: 'tasks',
    count: 2,
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X DELETE https://commet.co/api/v1/usage/quota \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "featureCode": "tasks",
    "count": 2
  }'
```

Quota can't go below zero — removing more than the current balance returns `400 insufficient_balance`.

## Set exact amount

Use `set` when syncing the balance from your system.

### TypeScript

```typescript
await commet.quota.set({
  customerId: 'user_123',
  featureCode: 'tasks',
  count: 10,
})
```

### Python

```python
commet.quota.set(
    feature_code='tasks',
    count=10,
    customer_id='user_123',
)
```

### Go

```go
customerID := "user_123"
client.Quota.Set(ctx, &commet.SetQuotaParams{
    FeatureCode: "tasks",
    Count:       10,
    CustomerID:  &customerID,
})
```

### Java

```java
commet.quota().set(SetQuotaParams.builder("tasks", 10L).customerId("user_123").build());
```

### PHP

```php
$commet->quota->set(
    featureCode: 'tasks',
    count: 10,
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X PUT https://commet.co/api/v1/usage/quota \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "featureCode": "tasks",
    "count": 10
  }'
```

## Get a quota allowance

### TypeScript

```typescript
const allowance = await commet.quota.get({
  customerId: 'user_123',
  featureCode: 'tasks',
})
```

### Python

```python
allowance = commet.quota.get(
    customer_id='user_123',
    feature_code='tasks',
)
```

### Go

```go
allowance, err := client.Quota.Get(ctx, &commet.GetQuotaAllowanceParams{
    CustomerID:  "user_123",
    FeatureCode: "tasks",
})
```

### Java

```java
var allowance = commet.quota()
        .get(GetQuotaAllowanceParams.builder("user_123", "tasks").build());
```

### PHP

```php
$allowance = $commet->quota->get(
    customerId: 'user_123',
    featureCode: 'tasks',
);
```

### cURL

```bash
curl "https://commet.co/api/v1/usage/quota?customerId=user_123&featureCode=tasks" \
  -H "x-api-key: $COMMET_API_KEY"
```

**Response:**

```json
{
  "featureCode": "tasks",
  "current": 30,
  "included": 50,
  "remaining": 20,
  "billedQuantity": 0,
  "unlimited": false,
  "overageEnabled": true
}
```

`current` is the live balance, `included` is the plan's free amount, `remaining` is what's left before overage, and `billedQuantity` is the extra units billed this period. Pass either a Commet ID (`cus_xxx`) or your external ID as `customerId`. One active subscription per customer is required.

## Get all allowances

Returns an allowance for every quota feature on the customer's active subscription.

### TypeScript

```typescript
const allowances = await commet.quota.getAll({
  customerId: 'user_123',
})
```

### Python

```python
allowances = commet.quota.get_all(
    customer_id='user_123',
)
```

### Go

```go
allowances, err := client.Quota.GetAll(ctx, &commet.GetAllQuotaAllowancesParams{
    CustomerID: "user_123",
})
```

### Java

```java
var allowances = commet.quota()
        .getAll(GetAllQuotaAllowancesParams.builder("user_123").build());
```

### PHP

```php
$allowances = $commet->quota->getAll(
    customerId: 'user_123',
);
```

### cURL

```bash
curl "https://commet.co/api/v1/usage/quota/all?customerId=user_123" \
  -H "x-api-key: $COMMET_API_KEY"
```

## Learn more

- [How Does Quota-Based Billing Work](/docs/how-does-quota-based-billing-work)

## Related

- [Configure Features](/docs/configure-features) — Create quota features on your plans
- [Manage Plans](/docs/create-plans) — Plans that include quota-based pricing
- [Track Usage](/docs/track-usage) — Send usage events for metered features
