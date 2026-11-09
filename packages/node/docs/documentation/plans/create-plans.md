---
title: Manage Plans
description: Create and manage pricing plans in Commet that automatically generate subscriptions.
---

Plans are pre-configured billing packages that combine pricing, features, and billing intervals. Assign a plan to a customer and Commet creates the subscription, customer portal, and recurring invoices automatically.

## Plan components

| Component              | Description                                       | Example                        |
| ---------------------- | ------------------------------------------------- | ------------------------------ |
| **Name & Description** | Customer-facing display information               | "Pro Plan — For growing teams" |
| **Consumption Model**  | How customers consume and pay for features        | Metered, Credits, or Balance   |
| **Prices**             | Pricing options by billing interval               | $99/month, $899/year           |
| **Features**           | What's included — boolean, metered, or seat-based | API Calls (10k), SSO, 5 Seats  |
| **Trial Days**         | Optional free trial period per interval           | 14 days                        |
| **Visibility**         | Public (pricing page) or private (internal use)   | Public or Private              |

## Free plans

A free plan has a price of $0 and no billing cycle. Customers are activated immediately without checkout. Free plans have one restriction: **overage cannot be configured**. Features on a free plan always block usage at the included limit. See [How Do Free Plans Work](/docs/how-do-free-plans-work-without-payment) for details.

## Create a plan in the dashboard

Go to **Plans** and click **Create Plan**. Fill in each component from the table above, then save. For detailed feature configuration, see [Configure Features](/docs/configure-features).

## Edit a plan

Editing a plan's prices, trials, features, rules, add-ons, credit packs, or country prices publishes a new [plan version](/docs/plan-versions). New customers get it; existing subscribers keep their version until you move them. In the dashboard, edits go into a draft that you publish when ready. The name, description, and visibility are not versioned and change at once with **Edit details**.

## Retrieve plans via SDK

### TypeScript

```typescript
const plans = await commet.plans.list()
```

### Python

```python
plans = commet.plans.list()
```

### Go

```go
plans, err := client.Plans.List(ctx, nil)
```

### Java

```java
var plans = commet.plans().list();
```

### PHP

```php
$plans = $commet->plans->list();
```

### cURL

```bash
curl https://commet.co/api/v1/plans \
  -H "x-api-key: $COMMET_API_KEY"
```

Include private plans:

### TypeScript

```typescript
const plans = await commet.plans.list({ includePrivate: 'true' })
```

### Python

```python
plans = commet.plans.list(include_private="true")
```

### Go

```go
includePrivate := "true"
plans, err := client.Plans.List(ctx, &commet.ListPlansParams{
    IncludePrivate: &includePrivate,
})
```

### Java

```java
var plans = commet.plans().list(
    ListPlansParams.builder().includePrivate("true").build()
);
```

### PHP

```php
$plans = $commet->plans->list(includePrivate: 'true');
```

### cURL

```bash
curl "https://commet.co/api/v1/plans?includePrivate=true" \
  -H "x-api-key: $COMMET_API_KEY"
```

Get a specific plan. Plan reads return the terms of the current version; list a plan's versions with `GET /plans/{id}/versions`.

### TypeScript

```typescript
const plan = await commet.plans.get({ id: 'pln_xxx' })
```

### Python

```python
plan = commet.plans.get("pln_xxx")
```

### Go

```go
plan, err := client.Plans.Get(ctx, "pln_xxx")
```

### Java

```java
var plan = commet.plans().get("pln_xxx");
```

### PHP

```php
$plan = $commet->plans->get('pln_xxx');
```

### cURL

```bash
curl https://commet.co/api/v1/plans/pln_xxx \
  -H "x-api-key: $COMMET_API_KEY"
```

## Learn more

- [How Does Billing Work](/docs/how-does-billing-work)
- [How Do Free Plans Work Without Payment](/docs/how-do-free-plans-work-without-payment)
