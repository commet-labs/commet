# Fixed SaaS Example

Billing integration for a fixed-price SaaS using Commet's plan-first model.

**Stack:** Next.js 16, Better Auth, Drizzle ORM, PostgreSQL, Commet SDK

## Quick Start

```bash
# Clone this example
npx degit commet-labs/commet-node/examples/fixed-saas my-saas
cd my-saas

# Install dependencies
pnpm install

# Start database
docker-compose up -d

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
pnpm db:push

# Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

Edit `.env` with your credentials:

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
COMMET_WEBHOOK_SECRET=whsec_xxxxx
```

**Get Commet credentials:**

1. Sign up at [commet.co](https://commet.co)
2. Create a **Plan** with code `pro` and a price (e.g., $50/month)
3. Copy API key from Settings → API Keys

## Run

```bash
pnpm dev
```

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
