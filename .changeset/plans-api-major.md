---
"@commet/node": major
"commet": major
---

# Plans-based billing model

This release introduces a plan-centric approach to subscriptions, replacing the previous item-based model.

## @commet/node

### New Features

#### Plans API

New `commet.plans` resource for listing and retrieving pricing plans:

```typescript
// List all public plans
const plans = await commet.plans.list()

// Include private plans
const allPlans = await commet.plans.list({ includePrivate: true })

// Get specific plan with full details
const plan = await commet.plans.get('plan_pro')
console.log(plan.data.prices)   // [{ billingInterval: 'monthly', price: 9900 }]
console.log(plan.data.features) // [{ code: 'api_calls', type: 'metered', includedAmount: 1000 }]
```

#### Simplified Subscriptions

Subscribe customers to plans directly:

```typescript
// Create subscription with plan
const sub = await commet.subscriptions.create({
  externalId: 'user_123',
  planId: 'plan_pro',
  billingInterval: 'monthly',
  initialSeats: { editor: 5 }
})

// Get active subscription
const active = await commet.subscriptions.get({ externalId: 'user_123' })

// Change plan
await commet.subscriptions.changePlan({
  externalId: 'user_123',
  planId: 'plan_enterprise'
})

// Cancel
await commet.subscriptions.cancel({ externalId: 'user_123' })
```

#### New Type Helpers

```typescript
// Plan and feature type inference from `commet pull`
type PlanCode = GeneratedPlanCode      // 'starter' | 'pro' | 'enterprise'
type FeatureCode = GeneratedFeatureCode // 'api_calls' | 'storage' | 'seats'
```

### Breaking Changes

#### Portal API

Method renamed for clarity:

```typescript
// Before
await commet.portal.requestAccess({ externalId: 'user_123' })

// After
await commet.portal.getUrl({ externalId: 'user_123' })
```

#### Usage API

Method renamed to be more intuitive:

```typescript
// Before
await commet.usage.create({ eventType: 'api_call', customerId: 'cus_123', ... })

// After  
await commet.usage.track({ eventType: 'api_call', externalId: 'user_123', ... })
```

#### Subscriptions API

Simplified from items-based to plan-based:

```typescript
// Before
await commet.subscriptions.create({
  customerId: 'cus_123',
  items: [{ priceId: 'price_xxx', quantity: 1 }]
})
await commet.subscriptions.list({ customerId: 'cus_123' })

// After
await commet.subscriptions.create({
  externalId: 'user_123',
  planId: 'plan_pro',
  billingInterval: 'monthly'
})
await commet.subscriptions.get({ externalId: 'user_123' })
```

#### Seats API

`bulkUpdate` renamed to `setAll`:

```typescript
// Before
await commet.seats.bulkUpdate({ customerId: 'cus_123', seats: [...] })

// After
await commet.seats.setAll({ externalId: 'user_123', seats: [...] })
```

#### Type Exports

- `GeneratedProductId` deprecated in favor of `GeneratedPlanCode`
- New `GeneratedFeatureCode` type for feature codes
- Several param types renamed for consistency (e.g., `CreateParams`, `UpdateParams`)

#### Environment URL

Sandbox environment URL changed from `sandbox.commet.co` to `beta.commet.co`.

---

## commet (CLI)

### Breaking Changes

#### Type Generation

The `commet pull` comma nd now generates plan and feature types instead of product types:
The `commet pull` comma nd now generates plan and feature types instead of product types:

```typescript
// Before (.commet/types.d.ts)
interface CommetGeneratedTypes {
  eventType: 'api_call' | 'storage_used';
  seatType: 'editor' | 'viewer';
  productId: 'prod_starter' | 'prod_pro';
}

// After (.commet/types.d.ts)
interface CommetGeneratedTypes {
  eventType: 'api_call' | 'storage_used';
  seatType: 'editor' | 'viewer';
  planCode: 'starter' | 'pro' | 'enterprise';
  featureCode: 'api_calls' | 'storage' | 'seats';
}
```

#### Environment URL

Sandbox environment URL changed from `sandbox.commet.co` to `beta.commet.co`.

### Migration Guide

1. Run `commet pull` to regenerate types with new plan/feature codes
2. Update any code using `GeneratedProductId` to use `GeneratedPlanCode`
3. If using sandbox environment, CLI will now connect to `beta.commet.co`
