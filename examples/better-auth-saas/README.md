# Better Auth SaaS Example

A showcase of the `@commet/better-auth` plugin demonstrating seamless billing integration with seats, usage tracking, and feature flags.

## Features Demonstrated

- **Customer Sync** - Automatic Commet customer creation on signup
- **Seat Management** - Add/remove team members with `authClient.seats`
- **Usage Tracking** - Track metered usage with `authClient.usage.track()`
- **Feature Flags** - Gate features with `authClient.features.canUse()`
- **Customer Portal** - Self-service billing with `authClient.customer.portal()`

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Configure Environment

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/better_auth_saas

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long
BETTER_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3002

# Commet
COMMET_API_KEY=ck_your_api_key
COMMET_ENVIRONMENT=sandbox
```

### 3. Install & Run

```bash
pnpm install
pnpm db:push
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002)

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login/Signup pages
│   ├── (protected)/      # Authenticated pages
│   │   ├── dashboard/    # Usage & features showcase
│   │   ├── team/         # Seat management
│   │   └── settings/     # Portal & subscription
│   ├── (public)/         # Landing page
│   └── api/auth/         # Better Auth handler
├── components/
│   ├── usage-card.tsx    # Usage tracking demo
│   ├── feature-gate.tsx  # Feature flag demo
│   ├── team-members.tsx  # Seat management demo
│   └── billing-portal-button.tsx
└── lib/
    ├── auth.ts           # Better Auth + Commet plugin
    ├── auth-client.ts    # Client with commetClient
    └── commet.ts         # Commet SDK instance
```

## Plugin Configuration

### Server (`lib/auth.ts`)

```typescript
import { commet, portal, subscriptions, features, usage, seats } from "@commet/better-auth";

export const auth = betterAuth({
  plugins: [
    commet({
      client: commetClient,
      createCustomerOnSignUp: true,
      use: [
        portal({ returnUrl: "/settings" }),
        subscriptions(),
        features(),
        usage(),
        seats(),
      ],
    }),
  ],
});
```

### Client (`lib/auth-client.ts`)

```typescript
import { commetClient } from "@commet/better-auth/client";

export const authClient = createAuthClient({
  plugins: [commetClient()],
});
```

## authClient API

### Customer

```typescript
// Redirect to billing portal
await authClient.customer.portal();
```

### Subscription

```typescript
// Get current subscription
const { data } = await authClient.subscription.get();

// Change plan
await authClient.subscription.changePlan({ planId: "pro" });

// Cancel
await authClient.subscription.cancel();
```

### Features

```typescript
// List all features
const { data } = await authClient.features.list();

// Check single feature
const { data } = await authClient.features.canUse("custom_branding");
```

### Usage

```typescript
// Track usage event
await authClient.usage.track({
  feature: "api_calls",
  value: 1,
});
```

### Seats

```typescript
// List seat counts
const { data } = await authClient.seats.list();

// Add seats
await authClient.seats.add({ seatType: "member", count: 1 });

// Remove seats
await authClient.seats.remove({ seatType: "member", count: 1 });

// Set exact count
await authClient.seats.set({ seatType: "member", count: 5 });
```

## Commet Setup

1. Create account at [commet.co](https://commet.co)
2. Create an organization
3. Define your plans with features:
   - Boolean features for gating (e.g., `custom_branding`, `api_access`)
   - Metered features for usage (e.g., `api_calls`)
   - Seat features for team billing (e.g., `member`)
4. Get your API key from Settings

## Differences from Other Examples

| Example | Auth Hooks | Client API | Portal | Seats | Usage |
|---------|-----------|------------|--------|-------|-------|
| fixed-saas | Manual | SDK direct | No | No | No |
| team-saas | Manual | SDK direct | No | Manual | No |
| usage-based-saas | Manual | SDK direct | No | No | Manual |
| **better-auth-saas** | Plugin | authClient | Yes | Plugin | Plugin |

## Learn More

- [Commet Documentation](https://commet.co/docs)
- [Better Auth Documentation](https://better-auth.com)
- [@commet/better-auth README](../../packages/better-auth/README.md)

