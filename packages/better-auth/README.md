# @commet/better-auth

A [Better Auth](https://github.com/better-auth/better-auth) plugin for integrating [Commet](https://commet.co) billing into your authentication flow.

## Features

- Automatic Customer creation on signup
- Customer Portal access
- Subscription management (get, change plan, cancel)
- Feature access checks (boolean, metered, seats)
- Usage event tracking
- Seat management
- Optional webhook handling

## Installation

```bash
pnpm add @commet/better-auth@^1.0.0 @commet/node@^1.0.0 better-auth
```

## Preparation

Go to your Commet Organization Settings and create an API key. Add it to your environment.

```bash
# .env
COMMET_API_KEY=ck_...
```

## Server Configuration

The Commet plugin comes with several sub-plugins that add functionality to your stack:

- **portal** - Customer portal access
- **subscriptions** - Subscription management
- **features** - Feature access checks
- **usage** - Usage event tracking for metered billing
- **seats** - Seat-based licensing
- **webhooks** - (Optional) Webhook handling

```typescript
import { betterAuth } from "better-auth";
import { commet, portal, subscriptions, features, usage, seats, webhooks } from "@commet/better-auth";
import { Commet } from "@commet/node";

const commetClient = new Commet({
  apiKey: process.env.COMMET_API_KEY,
  environment: "production" // or "sandbox"
});

const auth = betterAuth({
  // ... Better Auth config
  plugins: [
    commet({
      client: commetClient,
      createCustomerOnSignUp: true,
      getCustomerCreateParams: ({ user }) => ({
        legalName: user.name,
        metadata: { source: "signup" }
      }),
      use: [
        portal({ returnUrl: "/dashboard" }),
        subscriptions(),
        features(),
        usage(),
        seats(),
        // Webhooks are OPTIONAL - see note below
        webhooks({
          secret: process.env.COMMET_WEBHOOK_SECRET,
          onSubscriptionActivated: async (payload) => {
            // Handle activation
          },
          onSubscriptionCanceled: async (payload) => {
            // Handle cancellation
          }
        })
      ]
    })
  ]
});
```

## Client Configuration

```typescript
import { createAuthClient } from "better-auth/react";
import { commetClient } from "@commet/better-auth";

export const authClient = createAuthClient({
  plugins: [commetClient()]
});
```

## Note About Webhooks

**Webhooks are completely optional in Commet.** Unlike some billing platforms where you need webhooks to keep state synchronized, with Commet you can always query the current state directly:

```typescript
// Always query current state - no webhooks needed!
const { data: subscription } = await authClient.subscription.get();
const { data: features } = await authClient.features.list();
const { data: canUse } = await authClient.features.canUse({ code: "api_calls" });
```

Webhooks are only useful if you want to:
- React immediately to changes (e.g., send email on cancellation)
- Avoid polling latency in critical cases
- Logging/auditing of events

## Configuration Options

### Main Plugin Options

```typescript
commet({
  // Required: Commet SDK client instance
  client: commetClient,
  
  // Optional: Auto-create Commet customer on user signup (default: false)
  createCustomerOnSignUp: true,
  
  // Optional: Customize customer creation parameters
  getCustomerCreateParams: ({ user }) => ({
    legalName: user.name,
    displayName: user.name,
    domain: "example.com",
    metadata: { plan: "starter" }
  }),
  
  // Required: Array of sub-plugins to use
  use: [...]
})
```

### Portal Plugin

```typescript
portal({
  // Optional: URL to return to after leaving the portal
  returnUrl: "/dashboard"
})
```

### Subscriptions Plugin

```typescript
subscriptions({
  // Optional: Plan mappings for slug-based plan changes
  plans: [
    { planId: "plan_123", slug: "starter" },
    { planId: "plan_456", slug: "pro" },
    { planId: "plan_789", slug: "enterprise" }
  ]
})
```

### Webhooks Plugin

```typescript
webhooks({
  // Required: Webhook secret for signature verification
  secret: process.env.COMMET_WEBHOOK_SECRET,
  
  // Optional handlers
  onSubscriptionCreated: async (payload) => {},
  onSubscriptionActivated: async (payload) => {},
  onSubscriptionCanceled: async (payload) => {},
  onSubscriptionUpdated: async (payload) => {},
  onPayload: async (payload) => {} // Catch-all
})
```

## Client Usage Examples

### Customer Portal

```typescript
// Redirect to the Commet customer portal
await authClient.customer.portal();
```

### Subscription Management

```typescript
// Get current subscription
const { data: subscription } = await authClient.subscription.get();
console.log(subscription?.status); // "active", "trialing", etc.

// Change plan (upgrade/downgrade)
await authClient.subscription.changePlan({
  planId: "plan_456", // or use slug if configured
  billingInterval: "yearly"
});

// Cancel subscription
await authClient.subscription.cancel({
  reason: "switching_to_competitor",
  immediate: false // Cancel at end of period
});
```

### Feature Access

```typescript
// List all features
const { data: features } = await authClient.features.list();

// Get specific feature
const { data: feature } = await authClient.features.get({ code: "team_members" });
console.log(feature?.current, feature?.included, feature?.remaining);

// Check if feature is enabled (boolean)
const { data: check } = await authClient.features.check({ code: "custom_branding" });
if (!check?.allowed) {
  redirect("/upgrade");
}

// Check if user can use one more unit
const { data: canUse } = await authClient.features.canUse({ code: "api_calls" });
if (!canUse?.allowed) {
  return { error: "Limit reached. Please upgrade." };
}
if (canUse?.willBeCharged) {
  // Show confirmation: "This will incur overage charges"
}
```

### Usage Tracking

```typescript
// Track a usage event
await authClient.usage.track({
  eventType: "api_call",
  idempotencyKey: `req_${requestId}`,
  properties: {
    endpoint: "/users",
    method: "GET"
  }
});
```

### Seat Management

```typescript
// List all seat balances
const { data: seats } = await authClient.seats.list();

// Add seats
await authClient.seats.add({
  seatType: "editor",
  count: 5
});

// Remove seats
await authClient.seats.remove({
  seatType: "editor",
  count: 2
});

// Set specific count
await authClient.seats.set({
  seatType: "editor",
  count: 10
});

// Set all seat types at once
await authClient.seats.setAll({
  seats: {
    editor: 10,
    viewer: 50
  }
});
```

## API Endpoints

All endpoints are prefixed with `/commet/` to avoid collisions with other plugins.

| Plugin | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| portal | `/commet/portal` | GET | Generates portal URL and redirects |
| subscriptions | `/commet/subscription` | GET | Gets active subscription |
| subscriptions | `/commet/subscription/change-plan` | POST | Changes plan |
| subscriptions | `/commet/subscription/cancel` | POST | Cancels subscription |
| features | `/commet/features` | GET | Lists all features |
| features | `/commet/features/:code` | GET | Gets a specific feature |
| features | `/commet/features/:code/check` | GET | Checks if feature is enabled |
| features | `/commet/features/:code/can-use` | GET | Checks if user can use +1 |
| usage | `/commet/usage/track` | POST | Tracks usage event |
| seats | `/commet/seats` | GET | Lists seat balances |
| seats | `/commet/seats/add` | POST | Adds seats |
| seats | `/commet/seats/remove` | POST | Removes seats |
| seats | `/commet/seats/set` | POST | Sets seat count |
| seats | `/commet/seats/set-all` | POST | Sets all seat types |
| webhooks | `/commet/webhooks` | POST | Receives webhooks (optional) |

## Resources

- [Commet Documentation](https://commet.co/docs)
- [Better Auth Documentation](https://www.better-auth.com)
- [@commet/node SDK](https://www.npmjs.com/package/@commet/node)

## License

MIT

