---
lastModified: 2026-07-28
title: Seat Management
description: Manage seat-based licenses with the Commet SDK.
---

Seats are per-user licenses that let you charge based on team size. Commet tracks seat changes and bills them automatically — included seats at the start of the period, additional seats prorated.

## Seat components

| Component        | Description                            | Example                     |
| ---------------- | -------------------------------------- | --------------------------- |
| **Feature Code** | Category of user license               | `editor`, `admin`, `viewer` |
| **Count**        | Number of seats to add, remove, or set | `5`, `10`, `50`             |
| **Billing**      | Seats are billed per unit on the plan  | $25/seat/month              |

## Dashboard

Seat features are created in **Features** → **Create Feature** with type **Seats** — the feature's code is what you pass as `featureCode`. Feature codes must be created in the dashboard before use. The **Seats** page shows seat balances and seat events per customer; balances also appear on each customer's subscription detail page.

## Add seats

### TypeScript

```typescript
await commet.seats.add({
  customerId: 'user_123',
  featureCode: 'editor',
  count: 5,
})
```

### Python

```python
commet.seats.add(
    feature_code='editor',
    count=5,
    customer_id='user_123',
)
```

### Go

```go
client.Seats.Add(ctx, &commet.AddSeatsParams{
    FeatureCode: "editor",
    Count:       5,
    CustomerID:  "user_123",
})
```

### Java

```java
commet.seats().add("editor", 5, "user_123", null);
```

### PHP

```php
$commet->seats->add(
    featureCode: 'editor',
    count: 5,
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/seats \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "featureCode": "editor",
    "count": 5
  }'
```

## Remove seats

### TypeScript

```typescript
await commet.seats.remove({
  customerId: 'user_123',
  featureCode: 'editor',
  count: 2,
})
```

### Python

```python
commet.seats.remove(
    feature_code='editor',
    count=2,
    customer_id='user_123',
)
```

### Go

```go
client.Seats.Remove(ctx, &commet.RemoveSeatsParams{
    FeatureCode: "editor",
    Count:       2,
    CustomerID:  "user_123",
})
```

### Java

```java
commet.seats().remove("editor", 2, "user_123", null);
```

### PHP

```php
$commet->seats->remove(
    featureCode: 'editor',
    count: 2,
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X DELETE https://commet.co/api/v1/seats \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "featureCode": "editor",
    "count": 2
  }'
```

Seats cannot go below zero — removing more than the current count will fail.

## Set exact count

Use `set` when syncing seat counts from your system.

### TypeScript

```typescript
await commet.seats.set({
  customerId: 'user_123',
  featureCode: 'editor',
  count: 10,
})
```

### Python

```python
commet.seats.set(
    feature_code='editor',
    count=10,
    customer_id='user_123',
)
```

### Go

```go
client.Seats.Set(ctx, &commet.SetSeatsParams{
    FeatureCode: "editor",
    Count:       10,
    CustomerID:  "user_123",
})
```

### Java

```java
commet.seats().set("editor", 10, "user_123", null);
```

### PHP

```php
$commet->seats->set(
    featureCode: 'editor',
    count: 10,
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X PUT https://commet.co/api/v1/seats \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "featureCode": "editor",
    "count": 10
  }'
```

## Set all feature codes

Use `setAll` to sync multiple feature codes at once. Useful when your system tracks all roles and you want a single call to reconcile.

### TypeScript

```typescript
await commet.seats.setAll({
  customerId: 'user_123',
  seats: { editor: 5, viewer: 20, admin: 2 },
})
```

### Python

```python
commet.seats.set_all(
    seats={'editor': 5, 'viewer': 20, 'admin': 2},
    customer_id='user_123',
)
```

### Go

```go
client.Seats.SetAll(ctx, &commet.BulkSetSeatsParams{
    Seats:      map[string]int{"editor": 5, "viewer": 20, "admin": 2},
    CustomerID: "user_123",
})
```

### Java

```java
commet.seats().setAll(Map.of("editor", 5, "viewer", 20, "admin", 2), "user_123", null);
```

### PHP

```php
$commet->seats->setAll(
    seats: ['editor' => 5, 'viewer' => 20, 'admin' => 2],
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X PUT https://commet.co/api/v1/seats/bulk \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user_123",
    "seats": { "editor": 5, "viewer": 20, "admin": 2 }
  }'
```

## Get balance

### TypeScript

```typescript
const balance = await commet.seats.getBalance({
  customerId: 'user_123',
  featureCode: 'editor',
})
```

### Python

```python
balance = commet.seats.get_balance(
    feature_code='editor',
    customer_id='user_123',
)
```

### Go

```go
balance, err := client.Seats.GetBalance(ctx, &commet.GetSeatBalanceParams{
    FeatureCode: "editor",
    CustomerID:  "user_123",
})
```

### Java

```java
var balance = commet.seats().getBalance("editor", "user_123");
```

### PHP

```php
$balance = $commet->seats->getBalance(
    featureCode: 'editor',
    customerId: 'user_123',
);
```

### cURL

```bash
curl "https://commet.co/api/v1/seats/balance?customerId=user_123&featureCode=editor" \
  -H "x-api-key: $COMMET_API_KEY"
```

Pass either a Commet ID (`cus_xxx`) or your external ID as `customerId`. One active subscription per customer is required.

## Get all balances

Returns balances for every feature code on the customer's active subscription.

### TypeScript

```typescript
const balances = await commet.seats.getAllBalances({
  customerId: 'user_123',
})
// { editor: { included: 5, used: 3, ... }, viewer: { ... } }
```

### Python

```python
balances = commet.seats.get_all_balances(
    customer_id='user_123',
)
```

### Go

```go
balances, err := client.Seats.GetAllBalances(ctx, &commet.GetAllSeatBalancesParams{
    CustomerID: "user_123",
})
```

### Java

```java
var balances = commet.seats().getAllBalances("user_123");
```

### PHP

```php
$balances = $commet->seats->getAllBalances(
    customerId: 'user_123',
);
```

### cURL

```bash
curl "https://commet.co/api/v1/seats/balances?customerId=user_123" \
  -H "x-api-key: $COMMET_API_KEY"
```

## Learn more

- [How Does Seat-Based Billing Work](/docs/how-does-seat-based-billing-work)

## Related

- [Configure Features](/docs/configure-features) — Create seat features on your plans
- [Manage Plans](/docs/create-plans) — Plans that include seat-based pricing
- [Manage Subscriptions](/docs/manage-subscriptions) — Assign plans with initial seats
