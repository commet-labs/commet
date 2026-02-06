# Team SaaS Example - License-Based Billing with Commet

This example demonstrates how to implement **license-based billing** using [Commet](https://commet.co) with Next.js, Better Auth, and Drizzle ORM.

## Features

- **License-Based Billing**: Users pay for team members (licenses)
- **Workspace Management**: Each user gets a workspace to manage team members
- **Real-Time Seat Tracking**: Add/remove members and see billing impact instantly
- **Overage Pricing**: Included seats in plan, extra seats charged per-seat
- **Better Auth**: Complete authentication with email/password
- **Drizzle ORM**: Type-safe database operations

## How License Billing Works

```
Plan: Team ($50/month)
├── 3 seats included
├── $10/extra seat
└── When user adds 5 team members:
    ├── 3 seats covered by plan
    └── 2 extra seats = +$20/month
```

### SDK Integration Points

| Action | SDK Method | When |
|--------|------------|------|
| Invite member | `commet.seats.add({ seatType: "member", count: 1 })` | After adding to DB |
| Remove member | `commet.seats.remove({ seatType: "member", count: 1 })` | After removing from DB |
| Check balance | `commet.seats.getBalance({ seatType: "member" })` | Dashboard/Team page |
| Sync all | `commet.seats.set({ seatType: "member", count: N })` | Reconciliation (optional) |

## Quick Start

### 1. Clone and Install

```bash
cd examples/team-saas
pnpm install
```

### 2. Set Up Environment

Create a `.env` file:

```bash
# Database
POSTGRES_URL=postgresql://postgres:postgres@localhost:54324/postgres

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long
BETTER_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3002

# Commet
COMMET_API_KEY=ck_sandbox_xxxxx
COMMET_ENVIRONMENT=sandbox

# App
BASE_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### 3. Start Database

```bash
docker compose up -d
```

### 4. Run Migrations

```bash
pnpm db:push
```

### 5. Configure Commet Dashboard

Create the following in your Commet dashboard:

#### Seat Type

1. Go to **Settings > Seat Types**
2. Create a seat type with code: `member`

#### Feature

1. Go to **Features**
2. Create a feature:
   - **Name**: Team Members
   - **Code**: `member`
   - **Type**: Seats
   - **Seat Type**: member

#### Plan

1. Go to **Plans**
2. Create a plan:
   - **Name**: Team
   - **Code**: `team`
   - **Base Price**: $50/month
3. Add the `member` feature:
   - **Included Amount**: 3
   - **Overage Enabled**: Yes
   - **Overage Unit Price**: $10 (1000 cents)

### 6. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3002](http://localhost:3002)

## Project Structure

```
├── actions/
│   ├── auth.ts                    # Auth actions (sign-in, sign-up, sign-out)
│   ├── plans.ts                   # Fetch available plans
│   ├── portal.ts                  # Billing portal URL
│   ├── subscription.ts            # Check subscription + seat balance
│   └── team.ts                    # Invite/remove members + seats.add/remove
├── app/
│   ├── (auth)/                    # Sign-in/sign-up pages
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── billing/           # Billing management
│   │   │   ├── general/           # General settings
│   │   │   ├── security/          # Security settings
│   │   │   └── team/              # Member management
│   │   └── pricing/               # Pricing page
│   ├── checkout/                  # Subscription checkout
│   └── api/auth/[...all]/         # Better Auth API route
├── components/
│   ├── auth/form-auth.tsx         # Auth form component
│   ├── billing/
│   │   ├── invite-member-form.tsx # Invite form
│   │   ├── manage-billing-button.tsx # Portal redirect
│   │   ├── member-list.tsx        # Team member list
│   │   └── seat-usage-card.tsx    # Seat usage visualization
│   ├── shared/submit-button.tsx   # Reusable submit button
│   ├── header.tsx                 # App header
│   └── ui/                        # UI primitives
├── hooks/
│   └── use-form-toast.ts         # Form toast notifications
└── lib/
    ├── auth/                      # Better Auth config + session helpers
    ├── commet.ts                  # Commet SDK instance
    ├── db/                        # Drizzle schema + connection + queries
    ├── payments/                  # Payment actions + Commet helpers
    ├── utils.ts                   # Utility functions
    └── validations/               # Zod schemas
```

## Key Flows

### User Signup

1. User signs up with Better Auth
2. `databaseHooks.user.create.after` triggers:
   - Creates Commet customer
   - Creates workspace in local DB
   - Adds owner as first member
   - Sets initial seat count to 1

### Inviting Team Members

1. User enters email/name in invite form
2. `inviteMemberAction` runs:
   - Inserts member to local DB
   - Calls `commet.seats.add({ count: 1 })`
3. Commet tracks the new seat

### Removing Team Members

1. User clicks remove on member
2. `removeMemberAction` runs:
   - Soft deletes member (status: "removed")
   - Calls `commet.seats.remove({ count: 1 })`
3. Commet updates seat count

### Billing Calculation

At billing time, Commet:
1. Checks seat count from `commet.seats.getBalance()`
2. Calculates:
   - Seats used: 5
   - Included: 3
   - Overage: 2 × $10 = $20
3. Generates receipt with seat line items

## Webhook Events

Webhooks are handled automatically by the `@commet/better-auth` plugin through the `/api/auth/[...all]` route. The plugin processes subscription lifecycle events like activation and cancellation.

## Learn More

- [Commet Documentation](https://commet.co/docs/platform/overview)
- [License-Based Billing Guide](https://commet.co/docs/platform/features/products/seat-based-pricing)
- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

