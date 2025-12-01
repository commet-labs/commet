# Fixed SaaS Example

Billing integration for a fixed-price SaaS using Commet's plan-first model.

**Stack:** Next.js 16, Better Auth, Drizzle ORM, PostgreSQL, Commet SDK

## Installation

From the monorepo root:

```bash
pnpm install
```

## Database Setup

```bash
cd examples/fixed-saas
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
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fixed_saas

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
2. Create a **Plan** with a price (e.g., $50/month)
3. Copy API key from Settings → API Keys
4. Copy Plan ID from Plans page

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Flow

1. **Signup** - Creates Better Auth user
2. **Checkout** - Creates customer + subscription with plan
3. **Payment** - Commet handles checkout via Stripe
4. **Dashboard** - Shows subscription status with `subscriptions.get()`

## Key Files

- `src/lib/commet.ts` - SDK initialization with `COMMET_PLAN_ID`
- `src/actions/create-subscription-action.ts` - Creates subscription with `planId`
- `src/actions/check-subscription-action.ts` - Uses `subscriptions.get()` for status
- `src/actions/get-portal-url-action.ts` - Uses `portal.getUrl()` for billing portal
- `src/app/api/webhooks/commet/route.ts` - Webhook handler

## Webhooks (for local testing)

```bash
ngrok http 3000
```

Add webhook in Commet dashboard:
- URL: `https://your-ngrok-url.ngrok.io/api/webhooks/commet`
- Events: `subscription.activated`, `subscription.canceled`
