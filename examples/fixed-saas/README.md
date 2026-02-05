# Fixed-Pricing SaaS Starter

This is a starter template for building a SaaS application with **fixed-price subscriptions**. Built with Next.js, Drizzle ORM, Better Auth, and Commet.

This example demonstrates how to implement a traditional subscription model where users choose a plan and pay a fixed recurring fee.

## Features

- Fixed-price subscription tiers with predictable billing
- Pricing page (`/pricing`) which connects to Commet Checkout
- Dashboard with subscription overview and billing management
- Full sidebar dashboard (Overview, General, Billing, Activity, Security)
- Subscription management with Commet Customer Portal
- Email/password authentication with JWTs stored to cookies
- Activity logging system for user events
- Account settings (update name, email, password, delete account)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Database**: [Postgres](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team)
- **Billing**: [Commet](https://commet.co)
- **Auth**: [Better Auth](https://better-auth.com)
- **UI**: [Tailwind CSS](https://tailwindcss.com) + Lucide Icons

## Getting Started

```bash
git clone <repository-url>
cd fixed-saas
pnpm install
```

## Running Locally

### 1. Set up Commet

> **Important:** Plans and Features are created in the [Commet Dashboard](https://commet.co), not in code. Your application reads these configurations via the API.

Before running the application, you need to configure your Commet account:

1. Sign up at [commet.co](https://commet.co)
2. Create a **Plan** with fixed pricing:
   - Set a "Plan Code" (e.g., `pro`)
   - Set "Price" (e.g., $20/mo)
   - Add features (boolean flags for access control)
3. Copy your **API Key** from Settings

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in the values:

```bash
# Database
POSTGRES_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Commet
COMMET_API_KEY=ck_sandbox_xxxxx
COMMET_ENVIRONMENT=sandbox

# App
BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Database

Run the database migrations:

```bash
pnpm db:push
```

You can create new users through the `/sign-up` route.

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How it Works

### Subscription Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sign Up   │ ──▶ │ Better Auth │ ──▶ │   Commet    │
│   (User)    │     │ Creates User│     │Creates Cust.│
└─────────────┘     └─────────────┘     └─────────────┘
        │
        ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Pricing    │ ──▶ │  Checkout   │ ──▶ │  Dashboard  │
│  (Select)   │     │  (Stripe)   │     │  (Active)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

1. **User signs up** - Better Auth creates the user in your database
2. **Commet plugin** - Automatically creates a matching customer in Commet
3. **User selects plan** - Redirected to Commet Checkout (Stripe)
4. **Subscription active** - User accesses dashboard features

This is configured in `lib/auth/auth.ts`:

```typescript
commet({
  client: commetClient,
  createCustomerOnSignUp: true,
  use: [portal(), subscriptions(), features()]
})
```

### Key Files

- `lib/commet.ts` - SDK initialization
- `lib/auth/auth.ts` - Better Auth + Commet plugin configuration
- `lib/payments/commet.ts` - Checkout session and portal management
- `actions/plans.ts` - Cached plan fetching from Commet
- `actions/subscription.ts` - Subscription status checks
- `actions/billing.ts` - Billing data retrieval

## Testing Payments

To test Commet payments in sandbox mode, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it

### Add environment variables

In your Vercel project settings, add all the necessary environment variables:

1. `POSTGRES_URL`: Your production database URL
2. `BETTER_AUTH_SECRET`: A random string (`openssl rand -base64 32`)
3. `BETTER_AUTH_URL`: Your production domain
4. `NEXT_PUBLIC_BETTER_AUTH_URL`: Your production domain
5. `COMMET_API_KEY`: Your Commet production API key
6. `COMMET_ENVIRONMENT`: Set to `production`
7. `BASE_URL`: Your production domain
8. `NEXT_PUBLIC_APP_URL`: Your production domain

### Set up database

```bash
pnpm db:push
```

Note: For production, you may want to use migrations instead. Generate them with `pnpm db:generate` and run with `pnpm db:migrate`.

## Credits

- Based on [Next.js SaaS Starter](https://github.com/vercel/nextjs-saas-starter)
- Powered by [Commet](https://commet.co)
