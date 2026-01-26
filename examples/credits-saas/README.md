# Credits-Based SaaS Starter

This is a starter template for building a SaaS application with **credits-based consumption** and usage-based billing. Built with Next.js, Drizzle ORM, Better Auth, and Commet.

This example demonstrates how to monetize AI or usage-based products using a "Credits" model where users have a monthly allowance (Plan Credits) and can purchase top-ups (Purchased Credits) that never expire.

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to Commet Checkout
- Credits Balance Dashboard with visual overview of plan vs. purchased credits
- Usage-Based Billing: Track consumption (e.g., AI generations, API calls) in real-time
- Credit Pack Purchases: Self-service UI to buy additional credits
- Dashboard pages with user settings and credits management
- Subscription management with Commet Customer Portal
- Email/password authentication with JWTs stored to cookies
- Global middleware to protect logged-in routes
- Activity logging system for any user events

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
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

> **Important:** Plans, Features, and Credit Packs are created in the [Commet Dashboard](https://commet.co), not in code. Your application reads these configurations via the API.

Before running the application, you need to configure your Commet account:

1. Sign up at [commet.co](https://commet.co)
2. Create a **Credits Feature** (e.g., `ai_generation`)

   > **Important:** After creating your feature, you need to update the feature code in the codebase. Replace `ai_generation` with your chosen feature code in the following files:
   > - `app/actions/credits.ts` - Usage tracking function
   > - `app/(dashboard)/dashboard/page.tsx` - "Try AI Generation" action
   > - `app/(dashboard)/dashboard/credits/page.tsx` - Feature list IDs
   > - The code snippet in the "Tracking Usage" section below

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

## Architecture

### Auth + Billing Integration

This template integrates [Better Auth](https://better-auth.com) with [Commet](https://commet.co) for seamless authentication and billing:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sign Up   │ ──▶ │ Better Auth │ ──▶ │   Commet    │
│   (User)    │     │ Creates User│     │Creates Cust.│
└─────────────┘     └─────────────┘     └─────────────┘
```

1. **User signs up** → Better Auth creates the user in your database
2. **Commet plugin** → Automatically creates a matching customer in Commet
3. **No manual sync needed** → The `externalId` in Commet matches your user ID

This is configured in `lib/auth/auth.ts`:

```typescript
commet({
  client: commetClient,
  createCustomerOnSignUp: true, // Auto-sync enabled
  use: [portal(), subscriptions(), features(), usage()]
})
```

## Testing Payments

To test Commet payments in sandbox mode, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

When you're ready to deploy your SaaS application to production:

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it
3. Follow the Vercel deployment process, which will guide you through setting up your project

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain
2. `COMMET_API_KEY`: Use your Commet API key for the production environment
3. `COMMET_ENVIRONMENT`: Set to `production`
4. `POSTGRES_URL`: Set this to your production database URL
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one

### Set up database

```bash
bun db:push
```

Note: For production, you may want to use migrations instead. Generate them with `bun db:generate` and run with `bun db:migrate`.

## Credits

- Based on [Next.js SaaS Starter](https://github.com/vercel/nextjs-saas-starter)
- UI inspired by [BillUI](https://billui.com)
- Powered by [Commet](https://commet.co)
