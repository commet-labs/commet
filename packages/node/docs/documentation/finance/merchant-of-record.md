---
lastModified: 2026-07-10
title: Merchant of Record
description: What a Merchant of Record is and how Commet handles taxes, compliance, refunds, and payouts on your behalf.
---

A Merchant of Record (MoR) is the legal entity that sells your product to the end customer. Commet acts as the MoR, taking responsibility for global sales taxes, refunds, disputes, and compliance so you can focus on building your product.

## PSP vs MoR

| Aspect             | PSP (e.g. Stripe)              | MoR (e.g. Commet)       |
| ------------------ | ------------------------------ | ----------------------- |
| Tax handling       | You handle it                  | Platform handles it     |
| Refunds & disputes | You handle it                  | Platform handles it     |
| API complexity     | Low-level, flexible            | High-level, opinionated |
| Fees               | Lower per transaction          | Higher per transaction  |
| Control            | Full control over payment flow | Managed payment flow    |

## What should you choose

**Choose a PSP if** you're already integrated with Stripe, comfortable handling international taxes yourself, or want full control over your payment flow.

**Choose Commet if** you want to go live today without worrying about tax registrations, need a billing tool your whole team can use, or want subscription and pricing management built in.

## When Commet is the MoR

Commet is the Merchant of Record when you run on Commet's payment rail — the default. If you connect your own Stripe or dLocal account instead, you remain the merchant and Commet acts as your billing layer on top.

## Use Commet alongside your PSPs

You can use both rails in the same organization. Commet is the MoR for countries routed to the Commet provider. Countries routed to your connected Stripe or dLocal account are charged through that provider, under your own merchant identity.

Commet decides which provider to use from the country route configured in **Settings → Payments**. If a checkout does not include a country, Commet uses the organization's default provider. Once a customer has a saved payment method or a subscription has been stamped with a connection, recurring charges continue through that provider so the payment method is not moved silently between accounts.

See [Payment Providers](/docs/payment-providers) to connect your accounts and [Payment Orchestration](/docs/payment-orchestration) to configure routing rules and defaults.

## Our vision

We believe the best companies of the future will be small teams of 5 to 30 people. Technology enables small teams to build incredible products, but monetization complexity shouldn't be a barrier.

Commet exists to be the simplest, developer-preferred tool for monetization. We don't aim to solve every use case — we want to be the tool small teams choose when they want to monetize simply, globally, and without hassle.

## Related

- [Finance Overview](/docs/finance-overview) — Balances, payouts, and transaction history
- [Acceptable Use Policy](/docs/acceptable-use) — What products and services can be sold through Commet
- [Supported Countries](/docs/supported-countries) — 112 countries where Commet operates
- [Payment Providers](/docs/payment-providers) — Connect Commet, Stripe, and dLocal payment rails
