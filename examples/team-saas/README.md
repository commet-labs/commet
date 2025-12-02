# Team SaaS Example - Seat-Based Billing with Commet

This example demonstrates how to implement **seat-based billing** using [Commet](https://commet.co) with Next.js, Better Auth, and Drizzle ORM.

## Features

- **Seat-Based Billing**: Users pay for team members (seats)
- **Workspace Management**: Each user gets a workspace to manage team members
- **Real-Time Seat Tracking**: Add/remove members and see billing impact instantly
- **Overage Pricing**: Included seats in plan, extra seats charged per-seat
- **Better Auth**: Complete authentication with email/password
- **Drizzle ORM**: Type-safe database operations

## How Seat Billing Works

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
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/team_saas

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001

# Commet
COMMET_API_KEY=ck_sandbox_xxxxx
COMMET_ENVIRONMENT=sandbox
COMMET_WEBHOOK_SECRET=whsec_xxxxx
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
   - **Code**: `team_members`
   - **Type**: Seats
   - **Seat Type**: member

#### Plan

1. Go to **Plans**
2. Create a plan:
   - **Name**: Team
   - **Code**: `team`
   - **Base Price**: $50/month
3. Add the `team_members` feature:
   - **Included Amount**: 3
   - **Overage Enabled**: Yes
   - **Overage Unit Price**: $10 (1000 cents)

### 6. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3001](http://localhost:3001)

## Project Structure

```
src/
├── actions/
│   ├── invite-member-action.ts    # Add member + seats.add()
│   ├── remove-member-action.ts    # Remove member + seats.remove()
│   ├── check-subscription-action.ts # Get subscription + seat balance
│   └── get-workspace-members.ts   # Fetch team members
├── app/
│   ├── (auth)/                    # Login/signup pages
│   ├── (protected)/
│   │   ├── dashboard/page.tsx     # Workspace overview
│   │   └── team/page.tsx          # Member management
│   ├── (public)/
│   │   └── checkout/              # Subscription checkout
│   └── api/
│       └── webhooks/commet/       # Webhook handler
├── components/
│   ├── seat-usage-card.tsx        # Seat usage visualization
│   ├── member-list.tsx            # Team member list
│   └── invite-member-form.tsx     # Invite form
└── lib/
    ├── auth.ts                    # Better Auth + workspace hooks
    ├── commet.ts                  # Commet SDK instance
    └── db/schema.ts               # Drizzle schema
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

The webhook handler at `/api/webhooks/commet` processes:

- `subscription.activated`: Grants access to user
- `subscription.canceled`: Revokes access

## Learn More

- [Commet Documentation](https://docs.commet.co)
- [Seat-Based Billing Guide](https://docs.commet.co/guides/seats)
- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

