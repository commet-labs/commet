# Credits-Based SaaS Starter (Commet + BillUI Style)

A modern, production-ready SaaS starter focused on **Credits-based consumption** and usage-based billing. Built with Next.js, Drizzle ORM, Better Auth, and Commet.

This example demonstrates how to monetize AI or usage-based products using a "Credits" model where users have a monthly allowance (Plan Credits) and can purchase top-ups (Purchased Credits) that never expire.

## Features

- **Credits Balance Dashboard**: Visual overview of plan vs. purchased credits.
- **Usage-Based Billing**: Track consumption (e.g., AI generations, API calls) in real-time.
- **Credit Pack Purchases**: Self-service UI to buy additional credits.
- **Multi-Tenant**: Full team management and isolated billing per organization.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Database**: [Postgres](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team)
- **Billing**: [Commet](https://commet.co)
- **Auth**: [Better Auth](https://better-auth.com)
- **UI**: [Tailwind CSS](https://tailwindcss.com) + Lucide Icons

## Getting Started

### 1. Setup Commet

1. Sign up at [commet.co](https://commet.co).
2. Create a **Credits Feature** (e.g., `ai_generation`).
3. Create a **Plan** with the `Credits` consumption model:
   - Select your feature.
   - Set "Included Amount" (e.g., 1000).
   - Set "Price" (e.g., $20/mo).
   - Set "Plan Code" (e.g., `starter`).
4. Create **Credit Packs** (e.g., 500 credits for $10).
5. Copy your **API Key** from Settings.

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in the values:

```bash
# Database
POSTGRES_URL=postgresql://...

# Auth
AUTH_SECRET=...

# Commet
COMMET_API_KEY=ck_...
COMMET_ENVIRONMENT=sandbox
COMMET_WEBHOOK_SECRET=whsec_...

# App
BASE_URL=http://localhost:3000
```

### 3. Install & Run

```bash
bun install
docker compose up -d
bun db:push
bun dev
```

Alternatively, you can use the setup script for guided configuration:

```bash
bun db:setup
bun db:push
bun db:seed  # Optional: creates a test user
bun dev
```

## How it Works

### Credits Logic

This example uses a **FIFO (First-In, First-Out)** deduction strategy:
1. **Plan Credits** are used first (they expire at the end of the month).
2. **Purchased Credits** are used only when plan credits are exhausted (they never expire).

### Tracking Usage

Usage is tracked via the Commet SDK:

```typescript
// app/actions/credits.ts
await commet.usage.track({
  feature: "ai_generation",
  externalId: teamId,
  value: 50, // Consumes 50 credits
});
```

### Purchasing Credits

The dashboard includes a `PurchaseCreditsDialog` that initiates a checkout flow via Commet:

```typescript
// lib/payments/commet.ts
const result = await commet.subscriptions.create({
  externalId: teamId,
  planCode: "starter",
  // ...
});
```

## Webhooks

Commet webhooks allow your application to react immediately to subscription changes (activation, cancellation, updates) without polling.

### Local Development

For local development, use [ngrok](https://ngrok.com/) to expose your local server:

1. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

2. **Configure webhook in Commet dashboard:**
   - Go to Settings → Webhooks → Endpoints in your Commet dashboard
   - Add a new webhook endpoint
   - URL: `https://your-ngrok-url.ngrok.io/api/webhooks/commet`
   - Events: Select `subscription.activated`, `subscription.canceled`, `subscription.updated`
   - Copy the webhook secret to your `.env` file as `COMMET_WEBHOOK_SECRET`

3. **Test webhooks:**
   - Create a subscription in your app
   - Check your terminal logs for webhook events
   - Verify that team subscription status updates automatically

### Production

In production, configure your webhook endpoint URL in the Commet dashboard to point to your production domain:

```
https://yourdomain.com/api/webhooks/commet
```

## Going to Production

When you're ready to deploy your SaaS application to production:

### 1. Set up Production Environment

1. **Update Commet Environment:**
   - Change `COMMET_ENVIRONMENT=production` in your `.env`
   - Use your production Commet API key

2. **Configure Production Database:**
   - Set up a production PostgreSQL database (e.g., Vercel Postgres, Supabase, Neon)
   - Update `POSTGRES_URL` with your production connection string

3. **Set Environment Variables:**
   - `BASE_URL`: Your production domain (e.g., `https://yourdomain.com`)
   - `AUTH_SECRET`: Generate a secure random string (`openssl rand -base64 32`)
   - `COMMET_WEBHOOK_SECRET`: Copy from Commet dashboard webhook settings

### 2. Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Import your repository in [Vercel](https://vercel.com/)
   - Configure environment variables in project settings
   - Deploy

3. **Set up database:**
   ```bash
   bun db:push
   ```
   
   Note: For production, you may want to use migrations instead. Generate them with `bun db:generate` and run with `bun db:migrate`.

### 3. Configure Production Webhook

1. Go to Commet dashboard → Settings → Webhooks → Endpoints
2. Add production webhook endpoint: `https://yourdomain.com/api/webhooks/commet`
3. Select events: `subscription.activated`, `subscription.canceled`, `subscription.updated`
4. Copy webhook secret to your production environment variables

## Credits

- Based on [Next.js SaaS Starter](https://github.com/vercel/nextjs-saas-starter)
- UI inspired by [BillUI](https://billui.com)
- Powered by [Commet](https://commet.co)
