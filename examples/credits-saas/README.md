# Credits-Based SaaS Starter

This is a starter template for building a SaaS application with **credits-based consumption** and usage-based billing. Built with Next.js, Drizzle ORM, Better Auth, and Commet.

This example demonstrates how to monetize AI or usage-based products using a "Credits" model where users have a monthly allowance (Plan Credits) and can purchase top-ups (Purchased Credits) that never expire.

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to Commet Checkout
- Credits Balance Dashboard with visual overview of plan vs. purchased credits
- Usage-Based Billing: Track consumption (e.g., AI generations, API calls) in real-time
- Credit Pack Purchases: Self-service UI to buy additional credits
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Subscription management with Commet Customer Portal
- Email/password authentication with JWTs stored to cookies
- Global middleware to protect logged-in routes
- Activity logging system for any user events
- Multi-Tenant: Full team management and isolated billing per organization

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Database**: [Postgres](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team)
- **Billing**: [Commet](https://commet.co)
- **Auth**: [Better Auth](https://better-auth.com)
- **UI**: [Tailwind CSS](https://tailwindcss.com) + Lucide Icons

## Getting Started

```bash
git clone <repository-url>
cd credits-saas
bun install
```

## Running Locally

### 1. Set up Commet

Before running the application, you need to configure your Commet account:

1. Sign up at [commet.co](https://commet.co)
2. Create a **Credits Feature** (e.g., `ai_generation`)
3. Create a **Plan** with the `Credits` consumption model:
   - Select your feature
   - Set "Included Amount" (e.g., 1000 credits)
   - Set "Price" (e.g., $20/mo)
   - Set "Plan Code" (e.g., `starter`)
4. Create **Credit Packs** (e.g., 500 credits for $10)
5. Copy your **API Key** from Settings → API Keys

### 2. Configure Environment

Use the included setup script to create your `.env` file:

```bash
bun db:setup
```

This will guide you through:
- Setting up Postgres (local Docker or remote)
- Entering your Commet API Key
- Selecting Commet environment (sandbox or production)
- Configuring webhook secret
- Generating AUTH_SECRET

Alternatively, manually create a `.env` file with:

```bash
# Database
POSTGRES_URL=postgresql://postgres:postgres@localhost:5439/credits-saas

# Auth
AUTH_SECRET=...

# Commet
COMMET_API_KEY=ck_...
COMMET_ENVIRONMENT=sandbox
COMMET_WEBHOOK_SECRET=whsec_...

# App
BASE_URL=http://localhost:3000
```

### 3. Set up Database

Run the database migrations and seed the database with a default user and team:

```bash
bun db:push
bun db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can also create new users through the `/sign-up` route.

### 4. Start Development Server

Finally, run the Next.js development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## How it Works

### Credits Logic

This example uses a **FIFO (First-In, First-Out)** deduction strategy:

1. **Plan Credits** are used first (they expire at the end of the billing period)
2. **Purchased Credits** are used only when plan credits are exhausted (they never expire)

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

## Testing Payments

To test Commet payments in sandbox mode, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

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

### Set up a production Commet webhook

1. Go to the Commet Dashboard and create a new webhook for your production environment
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/webhooks/commet`)
3. Select the events you want to listen for (e.g., `subscription.activated`, `subscription.canceled`, `subscription.updated`)

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it
3. Follow the Vercel deployment process, which will guide you through setting up your project

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain
2. `COMMET_API_KEY`: Use your Commet API key for the production environment
3. `COMMET_ENVIRONMENT`: Set to `production`
4. `COMMET_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created
5. `POSTGRES_URL`: Set this to your production database URL
6. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one

### Set up database

```bash
bun db:push
```

Note: For production, you may want to use migrations instead. Generate them with `bun db:generate` and run with `bun db:migrate`.

## Credits

- Based on [Next.js SaaS Starter](https://github.com/vercel/nextjs-saas-starter)
- UI inspired by [BillUI](https://billui.com)
- Powered by [Commet](https://commet.co)
