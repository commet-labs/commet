# @commet/better-auth - Better Auth Integration

Plugin that connects Commet billing with Better Auth authentication. Auto-creates Commet customers on signup and provides auth-scoped billing endpoints.

## Server Setup

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { Commet } from "@commet/node";
import { commet, portal, subscriptions, features, usage, seats, webhooks } from "@commet/better-auth";

const commetClient = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
  environment: "production",
});

export const auth = betterAuth({
  plugins: [
    commet({
      client: commetClient,
      createCustomerOnSignUp: true,
      getCustomerCreateParams: ({ user }) => ({
        fullName: user.name,
        metadata: { source: "signup" },
      }),
      use: [
        portal({ returnUrl: "/dashboard" }),
        subscriptions(),
        features(),
        usage(),
        seats(),
        // Webhooks are OPTIONAL - prefer querying state directly via SDK
        // Use only for background tasks like sending emails or provisioning
        webhooks({
          secret: process.env.COMMET_WEBHOOK_SECRET!,
          onSubscriptionActivated: async (payload) => { /* send welcome email */ },
          onSubscriptionCanceled: async (payload) => { /* send cancellation email */ },
        }),
      ],
    }),
  ],
});
```

### Plugin options

| Plugin | Purpose |
|--------|---------|
| `portal()` | Customer portal endpoint at `/api/auth/commet/portal` |
| `subscriptions()` | Get/change/cancel subscription endpoints |
| `features()` | Feature access check endpoints |
| `usage()` | Usage tracking endpoint |
| `seats()` | Seat management endpoints |
| `webhooks()` | Webhook handler (optional - can always query state directly) |

### Customer auto-creation

When `createCustomerOnSignUp: true`, the plugin hooks into Better Auth's `user.create` lifecycle. On signup, it creates a Commet customer with `externalId = user.id` and `billingEmail = user.email`.

## Client Setup

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { commetClient } from "@commet/better-auth";

export const authClient = createAuthClient({
  plugins: [commetClient()],
});
```

## Client API

All methods are auth-scoped to the current user session.

```typescript
// Subscription
const { data: subscription } = await authClient.subscription.get();
await authClient.subscription.changePlan({ planId: "plan_xxx", billingInterval: "yearly" });
await authClient.subscription.changePlan({ slug: "pro" }); // with plan mapping
await authClient.subscription.cancel({ reason: "too_expensive" });

// Features
const { data: features } = await authClient.features.list();
const { data: feature } = await authClient.features.get("api_calls");
const { data: check } = await authClient.features.check("custom_branding");
const { data: canUse } = await authClient.features.canUse("team_members");
// canUse: { allowed: boolean, willBeCharged: boolean }

// Usage tracking
await authClient.usage.track({ feature: "api_calls", value: 1 });
await authClient.usage.track({ feature: "api_calls", value: 1, properties: { endpoint: "/users" } });

// Seats
const { data: seats } = await authClient.seats.list();
await authClient.seats.add({ seatType: "editor", count: 1 });
await authClient.seats.remove({ seatType: "editor", count: 1 });
await authClient.seats.set({ seatType: "editor", count: 10 });
await authClient.seats.setAll({ editor: 10, viewer: 50 });

// Customer portal - redirects to Commet portal
await authClient.customer.portal();
```
