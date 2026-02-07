# Usage-Based SaaS Starter

This is a starter template for building a SaaS application with **usage-based billing**. Built with Next.js, Drizzle ORM, Better Auth, and Commet.

This example demonstrates how to monetize metered products using a usage-based model where users subscribe to a plan with included usage allowances, and consumption is tracked in real-time against those limits.

## Features

- Marketing landing page (`/`) with feature highlights
- Pricing page (`/pricing`) which connects to Commet Checkout
- Usage Dashboard with real-time meters for each feature
- Usage Tracking: Send usage events and see consumption in real-time
- Dashboard pages with user settings and usage management
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
cd usage-based-saas
pnpm install
```

## Running Locally

### 1. Set up Commet

> **Important:** Plans, Features, and pricing are created in the [Commet Dashboard](https://commet.co), not in code. Your application reads these configurations via the API.

Before running the application, you need to configure your Commet account:

1. Sign up at [commet.co](https://commet.co)
2. Create a **Metered Feature** (e.g., `api_calls`, `storage`)

   > **Important:** After creating your feature, you need to update the feature code in the codebase. Replace the feature code with your chosen code in the following files:
   > - `actions/credits.ts` - Usage tracking function
   > - `app/(dashboard)/dashboard/page.tsx` - "Try Features" actions

3. Create a **Plan** with the usage-based consumption model:
   - Select your feature(s)
   - Set "Included Amount" (e.g., 1000 API calls)
   - Set "Price" (e.g., $29/mo)
   - Set "Plan Code" (e.g., `starter`)
4. Copy your **API Key** from Settings → API Keys

### 2. Configure Environment

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

This will guide you through:
- Setting up Postgres (local Docker or remote)
- Entering your Commet API Key
- Selecting Commet environment (sandbox or production)
- Generating AUTH_SECRET

Alternatively, manually create a `.env` file with:

```bash
# Database
POSTGRES_URL=postgresql://postgres:postgres@localhost:5439/usage-based-saas

# Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Commet
COMMET_API_KEY=ck_...
COMMET_ENVIRONMENT=sandbox

# App
BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Database

Run the database migrations and seed the database with a default user:

```bash
pnpm db:push
pnpm db:seed
```

This will create the following user:

- User: `test@test.com`
- Password: `admin123`

You can also create new users through the `/sign-up` route.

### 4. Start Development Server

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## How it Works

### Usage Tracking

Usage is tracked via the Commet SDK. When a user performs an action (e.g., an API call, file upload), you send a usage event:

```typescript
// actions/credits.ts
await commet.usage.track({
  feature: "api_calls",
  externalId: user.id,
  value: 1,
});
```

The platform automatically:
1. Aggregates events by feature code
2. Calculates usage against plan limits
3. Generates overage charges if limits are exceeded

### Usage Meters

The dashboard displays real-time usage meters for each feature in the user's subscription, showing included allowance vs. current consumption.

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
5. `BETTER_AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one

### Set up database

```bash
pnpm db:push
```

Note: For production, you may want to use migrations instead. Generate them with `pnpm db:generate` and run with `pnpm db:migrate`.

## Credits

- Based on [Next.js SaaS Starter](https://github.com/vercel/nextjs-saas-starter)
- UI inspired by [BillUI](https://billui.com)
- Powered by [Commet](https://commet.co)
