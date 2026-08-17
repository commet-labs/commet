---
lastModified: 2026-07-10
title: Better Auth
description: Better Auth Plugin for Billing and Subscriptions using Commet
---

[Better Auth](https://better-auth.com) is a modern authentication library for TypeScript. This plugin integrates Commet directly into your Better Auth setup.

## Features

- Automatic customer creation on signup
- Customer Portal for self-service billing management
- Subscription management (get, cancel)
- Feature access control (boolean, metered, seats)
- Usage tracking for metered billing
- Seat management for per-user pricing
- Optional webhook handling with signature verification

## Installation

### pnpm

```bash
pnpm add better-auth @commet/better-auth @commet/node
```

### npm

```bash
npm install better-auth @commet/better-auth @commet/node
```

### yarn

```bash
yarn add better-auth @commet/better-auth @commet/node
```

### bun

```bash
bun add better-auth @commet/better-auth @commet/node
```

## Preparation

Get your API key from the Commet dashboard under **Settings → API Keys**. Use a key from a sandbox organization while you're integrating; switch to a live-org key when you go to production.

```bash title=".env"
COMMET_API_KEY=ck_...
```

## Server Configuration

```typescript title="auth.ts"
import { betterAuth } from "better-auth";
import {
  commet,
  portal,
  subscriptions,
  features,
  usage,
  seats,
} from "@commet/better-auth";
import { Commet } from "@commet/node";

const commetClient = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
});

export const auth = betterAuth({
  // ... your config
  plugins: [
    commet({
      client: commetClient,
      createCustomerOnSignUp: true,
      use: [
        portal(),
        subscriptions(),
        features(),
        usage(),
        seats(),
      ],
    }),
  ],
});
```

## Client Configuration

```typescript title="auth-client.ts"
import { createAuthClient } from "better-auth/react";
import { commetClient } from "@commet/better-auth";

export const authClient = createAuthClient({
  plugins: [commetClient()],
});
```

## Configuration Options

```typescript
commet({
  client: commetClient,                    // Required: Commet SDK instance
  createCustomerOnSignUp: true,            // Auto-create customer on signup
  getCustomerCreateParams: ({ user }) => ({
    fullName: user.name,
    metadata: { source: "web" },
  }),
  use: [/* plugins */],
})
```

> **Note**
>
> When `createCustomerOnSignUp` is enabled, a Commet customer is automatically created using the user's ID as the `customerId`. No database mapping required.

## Portal Plugin

Redirects users to the Commet customer portal for self-service billing management.

```typescript title="Server"
import { commet, portal } from "@commet/better-auth";

commet({
  client: commetClient,
  use: [
    portal({ returnUrl: "/dashboard" }),
  ],
})
```

```typescript title="Client"
// Redirects to Commet customer portal
await authClient.customer.portal();
```

## Subscriptions Plugin

Manage customer subscriptions.

```typescript title="Server"
import { commet, subscriptions } from "@commet/better-auth";

commet({
  client: commetClient,
  use: [subscriptions()],
})
```

```typescript title="Client"
// Get current subscription
const { data: subscription } = await authClient.subscription.get();

// Cancel subscription
await authClient.subscription.cancel({
  reason: "Too expensive",
  immediate: false, // Cancel at period end
});
```

## Features Plugin

Check feature access for the authenticated user.

```typescript title="Server"
import { commet, features } from "@commet/better-auth";

commet({
  client: commetClient,
  use: [features()],
})
```

```typescript title="Client"
// List all features
const { data: featuresList } = await authClient.features.list();

// Get specific feature
const { data: feature } = await authClient.features.get("api_calls");

// Check if feature is enabled (boolean)
const { data: check } = await authClient.features.check("sso");

// Check if user can use one more unit (metered)
const { data: canUse } = await authClient.features.canUse("api_calls");
// Returns: { allowed: boolean, willBeCharged: boolean }
```

## Usage Plugin

Track usage events for metered billing.

```typescript title="Server"
import { commet, usage } from "@commet/better-auth";

commet({
  client: commetClient,
  use: [usage()],
})
```

```typescript title="Client"
await authClient.usage.track({
  feature: "api_calls",
  value: 1,
  idempotencyKey: `evt_${Date.now()}`
});
```

> **Note**
>
> The authenticated user is automatically associated with the event.

## Seats Plugin

Manage seat-based licenses.

```typescript title="Server"
import { commet, seats } from "@commet/better-auth";

commet({
  client: commetClient,
  use: [seats()],
})
```

```typescript title="Client"
// List all seat balances
const { data: seatBalances } = await authClient.seats.list();

// Add seats
await authClient.seats.add({ featureCode: "member", count: 5 });

// Remove seats
await authClient.seats.remove({ featureCode: "member", count: 2 });

// Set exact count
await authClient.seats.set({ featureCode: "admin", count: 3 });

// Set all seat types at once
await authClient.seats.setAll({ admin: 2, member: 10, viewer: 50 });
```

## Webhooks Plugin

Handle Commet webhooks. This is optional since you can always query state directly.

```typescript title="Server"
import { commet, webhooks } from "@commet/better-auth";

commet({
  client: commetClient,
  use: [
    webhooks({
      secret: process.env.COMMET_WEBHOOK_SECRET,
      onPayload: (payload) => {
        // Catch-all handler
      },
      onSubscriptionCreated: (payload) => {},
      onSubscriptionActivated: (payload) => {},
      onSubscriptionCanceled: (payload) => {},
      onSubscriptionUpdated: (payload) => {},
    }),
  ],
})
```

Configure the webhook endpoint in your Commet dashboard: `/api/auth/commet/webhooks`

## Full Example

1. ### Server Setup
   ```typescript title="auth.ts"
   import { betterAuth } from "better-auth";
   import { drizzleAdapter } from "better-auth/adapters/drizzle";
   import {
     commet as commetPlugin,
     portal,
     subscriptions,
     features,
     usage,
     seats,
   } from "@commet/better-auth";
   import { Commet } from "@commet/node";
   import { db } from "./db";
   import * as schema from "./schema";

   const commetClient = new Commet({
     apiKey: process.env.COMMET_API_KEY!,
   });

   export const auth = betterAuth({
     database: drizzleAdapter(db, { provider: "pg", schema }),
     emailAndPassword: { enabled: true },
     plugins: [
       commetPlugin({
         client: commetClient,
         createCustomerOnSignUp: true,
         getCustomerCreateParams: ({ user }) => ({
           fullName: user.name,
         }),
         use: [
           portal({ returnUrl: "/dashboard" }),
           subscriptions(),
           features(),
           usage(),
           seats(),
         ],
       }),
     ],
   });
   ```

2. ### Client Setup
   ```typescript title="auth-client.ts"
   import { createAuthClient } from "better-auth/react";
   import { commetClient } from "@commet/better-auth";

   export const authClient = createAuthClient({
     baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
     plugins: [commetClient()],
   });

   export const { signIn, signUp, signOut, useSession } = authClient;
   ```

3. ### Usage in Components
   ```tsx title="dashboard.tsx"
   "use client";

   import { authClient } from "@/lib/auth-client";

   export function BillingSection() {
     const handlePortal = async () => {
       await authClient.customer.portal();
     };

     const checkFeature = async () => {
       const { data } = await authClient.features.canUse("api_calls");
       if (data?.allowed) {
         // Proceed with action
         await authClient.usage.track({ feature: "api_calls" });
       }
     };

     return (
       <div>
         <button onClick={handlePortal}>Manage Billing</button>
         <button onClick={checkFeature}>Use Feature</button>
       </div>
     );
   }
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Usage Events](/docs/track-usage)
- [Seat Management](/docs/seat-management)
- [Customer Portal](/docs/customer-portal)
