# Fixed SaaS Example

Complete billing integration for a fixed-price SaaS using Commet. Demonstrates authentication, subscription checkout, webhook handling, and protected routes.

**Stack:** Next.js 16, Better Auth, Drizzle ORM, PostgreSQL, Commet SDK

## Installation

```bash
cd examples/fixed-saas
pnpm install
```

## Database Setup

**Option A: Docker (Recommended)**

```bash
docker-compose up -d
pnpm db:push
```

**Option B: Local PostgreSQL**

```bash
createdb fixed_saas
pnpm db:push
```

## Configuration

Copy environment template:

```bash
cp .env.example .env
```

Configure required variables:

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
COMMET_PRICE_ID=uuid-from-dashboard
COMMET_WEBHOOK_SECRET=whsec_xxxxx
```

**Get Commet credentials:**

1. Sign up at [commet.co](https://commet.co)
2. Create a product with fixed price ($50/month)
3. Copy API key from Settings → API Keys
4. Copy price ID (UUID format) from product details

**Configure webhooks:**

1. Install ngrok: `brew install ngrok` or download from [ngrok.com](https://ngrok.com)
2. Expose local server: `ngrok http 3000`
3. Add webhook in Commet dashboard:
   - URL: `https://your-ngrok-url.ngrok.io/api/webhooks/commet`
   - Events: `subscription.created`, `subscription.activated`, `subscription.canceled`, `subscription.updated`
   - Copy webhook secret to `.env`

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage Flow

1. **Signup** (`/signup`) - Creates Better Auth user
2. **Checkout** (`/checkout`) - Creates Commet customer and subscription, generates `checkoutUrl`
3. **Payment** - Redirects to Stripe via `checkoutUrl`
4. **Webhook** - Commet notifies app when payment succeeds
5. **Dashboard** (`/dashboard`) - Protected route, shows subscription status

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Signup/login pages
│   ├── (protected)/         # Dashboard (requires auth)
│   ├── api/
│   │   ├── auth/            # Better Auth routes
│   │   └── webhooks/        # Commet webhook handler
│   ├── checkout/            # Subscription creation
│   └── page.tsx             # Landing page
├── lib/
│   ├── auth.ts              # Better Auth config
│   ├── auth-client.ts       # Client auth instance
│   ├── commet.ts            # Commet SDK instance
│   └── db/                  # Drizzle ORM
└── proxy.ts                 # Route protection
```

## Key Files

**Webhook Handler:** `src/app/api/webhooks/commet/route.ts`
- Verifies HMAC signature using `commet.webhooks.verifyAndParse()`
- Updates user `isPaid` status on `subscription.activated`
- Handles `subscription.created`, `subscription.canceled`, `subscription.updated`

**Checkout:** `src/app/checkout/page.tsx`
- Creates Commet customer (idempotent)
- Creates subscription with `status: "pending_payment"`
- Gets `checkoutUrl` from response
- Redirects to Stripe payment

**Auth Config:** `src/lib/auth.ts`
- Drizzle adapter for PostgreSQL
- Email/password authentication
- Custom fields: `commetCustomerId`, `subscriptionId`, `isPaid`

## Database Tools

**Drizzle Studio:**
```bash
pnpm db:studio
```

## Troubleshooting

**Webhook not received:**
- Verify ngrok is running: `curl https://your-ngrok-url.ngrok.io/api/webhooks/commet`
- Check Commet dashboard → Webhooks → Delivery Logs

**Invalid signature:**
- Verify `COMMET_WEBHOOK_SECRET` matches dashboard
- Restart server after changing `.env`

**User not updated:**
- Check webhook logs for `externalId`
- Verify customer has `externalId` set in Commet dashboard

