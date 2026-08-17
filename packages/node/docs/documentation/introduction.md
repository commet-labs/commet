---
lastModified: 2026-08-16
title: Introduction
description: Commet is a billing and payments platform for SaaS and AI products.
---

Commet is a billing and payments platform for SaaS and AI products. It handles recurring billing, taxes, compliance, and payouts so you can focus on your product.

To build your first complete flow:

1. [Create a sandbox API key](/docs/create-api-key).
2. [Choose the billing model](/docs/choose-a-billing-model) that matches what customers buy.
3. Follow the quickstart for your language, then run the matching [example application](/docs/examples).
4. Confirm subscription and payment outcomes with signed webhooks.

## Quickstart

- [**Next.js**](/docs/integrate-with-nextjs)
- [**Remix**](/docs/integrate-with-remix)
- [**Nuxt**](/docs/integrate-with-nuxt)
- [**SvelteKit**](/docs/integrate-with-sveltekit)
- [**Astro**](/docs/integrate-with-astro)
- [**Express**](/docs/integrate-with-express)
- [**Hono**](/docs/integrate-with-hono)
- [**Bun**](/docs/integrate-with-bun)

## The Plan-First Model

You define what you sell, package it into a plan, and connect it to a customer. Billing runs automatically from there.

1. **Features** — define capabilities like API calls, seats, or SSO access
2. **Plan** — bundle features with pricing and a consumption model
3. **Customer** — assign the plan and a subscription is created
4. **Billing** — invoices, usage tracking, and payments happen without intervention

## Consumption Models

Every plan uses one consumption model. This defines how customers consume and pay for features.

| Model       | How it works                               | Examples                   |
| ----------- | ------------------------------------------ | -------------------------- |
| **Metered** | Base price + overage billed at period end  | Twilio, Resend, AWS        |
| **Credits** | Prepaid credits consumed by usage          | Midjourney, Cursor, Replit |
| **Balance** | Prepaid dollar balance drawn down by usage | Supabase, Railway, Vercel  |

Models are mutually exclusive — each plan uses exactly one. [Learn more about consumption models](/docs/consumption-models).

## Explore

- [**Customers**](/docs/manage-customers)
- [**Plans**](/docs/create-plans)
- [**Subscriptions**](/docs/manage-subscriptions)
- [**Usage Tracking**](/docs/track-usage)
- [**Invoicing**](/docs/invoices-and-billing-cycles)
- [**Payments**](/docs/accept-one-time-payments)
- [**Customer Portal**](/docs/customer-portal)
- [**Finance & Payouts**](/docs/finance-overview)
- [**SDK Reference**](/docs/sdk-reference)
