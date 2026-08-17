---
lastModified: 2026-07-28
title: Add-ons
description: Offer optional features customers can activate on their subscriptions for an additional price.
---

Add-ons are optional features with their own price and consumption model that customers activate on their subscriptions. They extend a subscription without modifying the base plan — think SSO, SMS channels, or premium support.

## How add-ons work

| Aspect                   | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| **Pricing**              | Fixed base price per billing period, prorated on activation |
| **Charge on activation** | Immediate charge for remaining days in current period       |
| **Recurring billing**    | Base price added to the plan's invoice each cycle           |
| **Deactivation**         | No refund — the feature stops immediately                   |
| **Feature access**       | The add-on's feature appears alongside plan features        |

Each add-on maps to exactly one feature. When activated, that feature becomes available through `featureAccess.get`, `usage.check`, and `featureAccess.list` — no different from a plan feature.

## Consumption models

Add-ons declare their own consumption model. Boolean add-ons are compatible with any plan. All other models require matching the plan's model.

| Model       | Description                                | Compatible Plans | Example                         |
| ----------- | ------------------------------------------ | ---------------- | ------------------------------- |
| **Boolean** | Unlocks access, no usage tracking          | All plans        | SSO, HIPAA compliance           |
| **Metered** | Included units + overage at period end     | Metered plans    | SMS: 1000 included, $0.03/extra |
| **Credits** | Usage consumes from the plan's credit pool | Credits plans    | AI summaries: 5 credits/use     |
| **Balance** | Usage deducts from the plan's balance pool | Balance plans    | Image processing: $0.015/unit   |

> **Note**
>
> Credits and balance add-ons consume from the plan's **shared pool** — there's no separate pool for the add-on. If the pool runs out, the add-on's feature is blocked too.

## Create add-ons in the dashboard

Go to **Add-ons** and click **Create Add-on**. Configure the name, base price, feature, and consumption model. For metered add-ons, set included units and overage rate. For credits, set the credit cost per unit.

The feature dropdown only shows features not already assigned to another add-on. Once created, the add-on is available to any customer whose plan is compatible.

## Availability by subscription status

Add-ons can be activated on any subscription with a payment method:

| Status        | Can activate add-ons                              |
| ------------- | ------------------------------------------------- |
| **Active**    | Yes                                               |
| **Trialing**  | Yes — card was captured during trial checkout     |
| **Free plan** | Yes — first purchase prompts for a payment method |

## Manage add-ons

Add-ons are managed through the dashboard, the customer portal, or the API.

| Action                                | Where                                                        |
| ------------------------------------- | ------------------------------------------------------------ |
| **Create / update / archive add-ons** | Dashboard → Add-ons, or the `addons` API resource            |
| **Activate / deactivate**             | Dashboard (subscription detail), Customer Portal, or the API |
| **List active add-ons**               | API, Dashboard, or Customer Portal                           |

Activate or deactivate an add-on on a subscription via the SDK. Activation charges the prorated amount for the current period; deactivation stops the feature immediately with no refund.

```typescript
await commet.subscriptions.activateAddon({
  id: 'sub_abc123',
  addonId: 'adn_xyz789',
})

await commet.subscriptions.deactivateAddon({
  id: 'sub_abc123',
  addonId: 'adn_xyz789',
})
```

REST equivalents: `POST /api/v1/subscriptions/{id}/addons` and `DELETE /api/v1/subscriptions/{id}/addons/{addonId}`. Add-ons themselves support full CRUD through the `addons` resource: `commet.addons.list`, `get`, `create`, `update`, and `delete`.

## Feature access

Add-on features work exactly like plan features — no special handling needed:

### TypeScript

```typescript
// Check boolean add-on
const sso = await commet.featureAccess.get({
  customerId: 'user_123',
  code: 'sso',
})
// { allowed: true, type: 'boolean', enabled: true }

// Track metered add-on usage
await commet.usage.track({
  customerId: 'user_123',
  featureCode: 'sms_messages',
  value: 50,
})

// List all features (plan + add-ons combined)
const features = await commet.featureAccess.list({
  customerId: 'user_123',
})
```

### Python

```python
# Check boolean add-on
sso = commet.feature_access.get('sso', customer_id='user_123')
# sso.allowed == True, sso.type == 'boolean'

# Track metered add-on usage
commet.usage.track(customer_id='user_123', feature_code='sms_messages', value=50)

# List all features (plan + add-ons combined)
features = commet.feature_access.list(customer_id='user_123')
```

### Go

```go
// Check boolean add-on
sso, _ := client.FeatureAccess.Get(ctx, "sso", &commet.GetFeatureAccessParams{
  CustomerID: "user_123",
})
// sso.Allowed == true, *sso.Type == "boolean"

// Track metered add-on usage
value := 50
client.Usage.Track(ctx, &commet.TrackUsageParams{
  CustomerID: "user_123",
  FeatureCode: "sms_messages",
  Value:      &value,
})

// List all features (plan + add-ons combined)
features, _ := client.FeatureAccess.List(ctx, &commet.ListFeatureAccessParams{
  CustomerID: "user_123",
})
```

### Java

```java
// Check boolean add-on
var sso = commet.featureAccess()
    .get("sso", GetFeatureAccessParams.builder("user_123").build());
// sso.allowed() == true

// Track metered add-on usage
commet.usage().track(
    TrackUsageParams.builder("sms_messages", "user_123").value(50.0).build()
);

// List all features (plan + add-ons combined)
var features = commet.featureAccess()
    .list(ListFeatureAccessParams.builder("user_123").build());
```

### PHP

```php
// Check boolean add-on
$sso = $commet->featureAccess->get('sso', 'user_123');
// $sso->allowed === true, $sso->enabled === true

// Track metered add-on usage
$commet->usage->track(
    featureCode: 'sms_messages',
    customerId: 'user_123',
    value: 50,
);

// List all features (plan + add-ons combined)
$features = $commet->featureAccess->list('user_123');
```

### cURL

```bash
# Check boolean add-on
curl "https://commet.co/api/v1/feature-access/sso?customerId=user_123" \
  -H "x-api-key: $COMMET_API_KEY"

# Track metered add-on usage
curl -X POST https://commet.co/api/v1/usage/events \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "featureCode": "sms_messages",
    "customerId": "user_123",
    "value": 50
  }'

# List all features (plan + add-ons combined)
curl "https://commet.co/api/v1/feature-access?customerId=user_123" \
  -H "x-api-key: $COMMET_API_KEY"
```

## Billing behavior

### Activation charge

When a customer activates a $50/month add-on on day 11 of a 31-day period (20 days remaining):

|                  | Value                      |
| ---------------- | -------------------------- |
| **Full price**   | $50.00                     |
| **Prorated**     | $50 × (20/31) = **$32.26** |
| **Invoice type** | `addon_activation`         |

The charge goes through the subscription's payment provider immediately with its own invoice.

### Recurring invoices

Starting from the next full billing cycle, the add-on base price appears as a separate line in the plan's invoice:

```
Plan Pro (base)                             $99.00
API Calls: 12,500 (2,500 overage × $0.01)  $25.00

Add-ons
  SMS Channel (base)                        $15.00
  SMS: 1,800 (800 overage × $0.03)         $24.00
  SSO                                       $50.00

Subtotal                                   $213.00
```

### Multi-currency

Add-on prices are defined in USD. For non-USD subscriptions, the price is converted using the plan's exchange rate — the same mechanism used for plan base prices.

## Customer portal

Customers can self-service add-ons from the portal:

- **Available add-ons** — see compatible add-ons with pricing
- **Activate** — confirmation dialog with prorated charge preview
- **Active add-ons** — manage active add-ons
- **Deactivate** — instant, no refund

> **Note**
>
> Add-ons whose feature already exists in the customer's plan are hidden from the portal automatically.

## Learn more

- [How Does Billing Work](/docs/how-does-billing-work)

## Related

- [Consumption Models](/docs/consumption-models) — Metered, Credits, and Balance explained
- [Configure Features](/docs/configure-features) — Define features that add-ons can unlock
- [Credit Packs](/docs/credit-packs) — Another way to extend plan capabilities
- [Manage Subscriptions](/docs/manage-subscriptions) — Subscription lifecycle and management
- [Customer Portal](/docs/customer-portal) — Where customers activate add-ons
