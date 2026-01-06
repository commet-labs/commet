# Usage-Based SaaS Example

Billing integration for a usage-based SaaS using Commet's plan-first model. Simplified to cover signup → checkout → webhooks/portal (sin UI de tracking de uso).

**Stack:** Next.js 16, Better Auth, Drizzle ORM, PostgreSQL, Commet SDK

## Installation

From the monorepo root:

```bash
pnpm install
```

## Database Setup

```bash
cd examples/usage-based-saas
docker-compose up -d
pnpm db:push
```

## Configuration

```bash
cp .env.example .env
```

Configure:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/usage_based_saas

# Better Auth
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Commet
COMMET_API_KEY=ck_sandbox_xxxxx
COMMET_ENVIRONMENT=sandbox
COMMET_PLAN_ID=plan_xxxxx
COMMET_WEBHOOK_SECRET=whsec_xxxxx
```

**Get Commet credentials:**

1. Sign up at [commet.co](https://commet.co)
2. Create a **Metered Feature** (e.g., "Storage" with code `storage`)
3. Create a **Plan** with that feature configured (e.g., 100 GB included, $0.10/GB extra)
4. Copy API key from Settings → API Keys
5. Copy Plan ID from Plans page

**Note:** The feature code (e.g., `storage`) is used directly as the event identifier when tracking usage. No separate event type configuration is needed.

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Flow

1. **Signup** - Creates Better Auth user
2. **Checkout** - Creates customer + subscription with plan
3. **Payment** - Commet handles checkout via Stripe
4. **Webhooks** - Activate access on payment success (`subscription.activated`)
5. **Dashboard** - Shows subscription status + portal link

## Key Files

- `src/lib/commet.ts` - SDK initialization with `COMMET_PLAN_ID`
- `src/actions/create-subscription-action.ts` - Creates subscription with `planId`
- `src/actions/check-subscription-action.ts` - Uses `subscriptions.get()` for status
- `src/actions/get-portal-url-action.ts` - Uses `portal.getUrl()` for billing portal
- `src/app/api/webhooks/commet/route.ts` - Webhook handler

## Usage-Based Billing

Track usage by sending events with the feature code:

```typescript
// The feature code "storage" is the event identifier
await commet.usage.track({
  feature: "storage",  // Must match feature.code in Commet
  externalId: userId,
  value: 1
});
```

The platform automatically:
1. Aggregates events by feature code
2. Calculates usage against plan limits
3. Generates overage charges if limits exceeded

Este ejemplo está listo para planes con features metered en Commet, pero la UI se enfoca en el flujo de suscripción y portal. El tracking de uso debe integrarse en tu app/reporting de backend si lo necesitas.

## Webhooks (for local testing)

```bash
ngrok http 3000
```

Add webhook in Commet dashboard:
- URL: `https://your-ngrok-url.ngrok.io/api/webhooks/commet`
- Events: `subscription.activated`, `subscription.canceled`


