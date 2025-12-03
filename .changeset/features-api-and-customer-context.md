---
"@commet/node": minor
---

### Features API

New `commet.features` resource to check feature access without manual `.find()` on subscription data:

```typescript
// Get feature details with usage
const seats = await commet.features.get("team_members", userId);
// { code, name, type, allowed, current, included, remaining, overage, overageUnitPrice }

// Check boolean feature
const { allowed } = await commet.features.check("custom_branding", userId);

// Check if can use one more (metered/seats)
const { allowed, willBeCharged } = await commet.features.canUse("team_members", userId);

// List all features
const features = await commet.features.list(userId);
```

### Customer Context

New `commet.customer()` method returns a scoped context where `externalId` is implicit:

```typescript
const customer = commet.customer(userId);

// All operations scoped to this customer
const seats = await customer.features.get("team_members");
const { allowed } = await customer.features.canUse("team_members");

await customer.seats.add("member");
await customer.usage.track("api_call");
await customer.subscription.get();
await customer.portal.getUrl();
```

### FeatureSummary improvements

Added `overageUnitPrice` to `FeatureSummary` type returned by `subscriptions.get()` for metered and seats features.

