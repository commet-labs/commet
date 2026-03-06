# Billing Concepts

## Plan-First Model

Plans are pricing templates that group features with limits and prices. Customers subscribe to plans.

```
Plan (pricing template)
├── Base Price ($99/month, $990/year)
└── Features:
    ├── API Calls: metered, 10k included, $0.01/extra
    ├── Team Members: seats, 5 included, $25/extra
    └── Custom Branding: boolean, enabled
```

## Feature Types

| Type | What It Is | How Charged | SDK Method |
|------|-----------|-------------|------------|
| **Boolean** | On/off access | Included in plan base | `features.check(code)` |
| **Metered** | Measurable consumption | Overage at period end | `usage.track(feature)` |
| **Seats** | Per-user licenses | Advance + prorated true-up | `seats.add/remove/set()` |

### Feature code = SDK identifier

The `feature.code` in the dashboard IS the identifier used in the SDK:
- Dashboard: Feature "API Calls" with code `api_calls`
- SDK: `commet.usage.track({ feature: "api_calls", value: 1 })`

## Charging Model

| What | When Charged |
|------|-------------|
| Plan base price | In advance (period start) |
| Boolean features | Included in plan base |
| Metered overage | True-up (previous period end) |
| Seats | Hybrid: advance + true-up for mid-period adds |

## Consumption Models (Mutually Exclusive Per Plan)

Each plan uses ONE model:

| Model | Behavior | Use Case |
|-------|----------|----------|
| **Metered** | Included units free, overage charged at period end | Traditional SaaS |
| **Credits** | X credits/month, blocks when exhausted, can buy packs | AI products |
| **Balance** | $X included, configurable block or overage on exhaustion | Platforms |

## Subscription Lifecycle

```
Create subscription
├── Free plan → Active immediately (no billing)
├── Has trial → Trialing (collects payment method)
└── Paid plan → Pending Payment → checkout → Active

Active subscription
├── Billing cron runs monthly → Generates invoices
├── Upgrade (more expensive) → Immediate + proration
├── Downgrade (cheaper) → Scheduled at renewal
└── Cancel → At period end (or immediate)
```

## Subscription Statuses

| Status | Meaning |
|--------|---------|
| `draft` | Just created, not yet processed |
| `pending_payment` | Awaiting first payment (checkoutUrl available) |
| `trialing` | In trial period |
| `active` | Paying and active |
| `paused` | Temporarily paused |
| `past_due` | Payment failed, grace period |
| `canceled` | Canceled (at period end or immediate) |
| `expired` | Subscription ended |

## Proration on Plan Changes

**Upgrade (immediate):**
- Credit: `(remainingDays / totalDays) * paidPrice` for old plan
- Charge: Full new plan price (period resets)
- Net: `newPrice - credit`

**Downgrade (at renewal):**
- No proration. Customer keeps current plan until period end.
- At renewal: switches to new plan at new price.

## Introductory Offers

Welcome discounts for new customers (no previous subscriptions):
- Percentage or fixed amount discount
- Duration in billing cycles
- Lost when changing plans
- One per customer lifetime

## Regional Pricing

Plans define canonical USD prices. Optional local currency overrides for: ARS, BRL, CLP, COP, PEN, UYU, PYG, BOB, MXN, CAD, EUR. Currency auto-detected at checkout from billing address. Subscription currency is immutable after first payment.

## Monetary Values

Always in cents (integers): $99.00 = 9900. Zero-decimal currencies (CLP, PYG) stored as whole units.
