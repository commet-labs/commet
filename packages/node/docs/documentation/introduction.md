---
lastModified: 2026-09-07
title: Introduction
description: Measure consumption, manage subscriptions, and accept payments for your SaaS or AI product with Commet.
---

Commet is a billing and payments platform for SaaS and AI products. It connects what your customers use with what they pay: subscriptions, usage charges, credits, and one-time payments.

You define what you sell and how you price it. Commet manages the billing cycle, invoices, and payment flows. Your application reports consumption and uses Commet's access checks and events to decide what each customer can do.

- [**Quickstart**](/docs/choose-a-billing-model)
- [**Build with an agent**](/docs/mcp-server)

## What can you build with Commet?

### Subscriptions that match your product

Sell a monthly or annual plan with a fixed price, usage charges, or a combination of both. Define [features](/docs/configure-features) such as API calls, team seats, storage, or access to a capability, then package them into [plans](/docs/create-plans).

A [subscription](/docs/manage-subscriptions) connects a customer to a plan. Commet manages its billing cycle and invoices as the subscription renews or changes. You can offer [trials](/docs/trial-periods), handle [upgrades and downgrades](/docs/upgrade-and-downgrade-plans), and configure [failed-payment recovery](/docs/handle-failed-payments).

### Pricing based on consumption

An AI request, an API call, and a stored file represent different kinds of usage. Commet lets you define how that usage affects the customer's bill or available allowance.

Each plan has one [consumption model](/docs/consumption-models):

| Model       | How it treats usage                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| **Metered** | Measures usage against each feature's included allowance, with overage charges when configured.                    |
| **Credits** | Deducts credits from a shared pool as customers use features.                                                      |
| **Balance** | Converts usage into monetary amounts drawn from the customer's balance, with overage behavior defined by the plan. |

Your application [reports usage](/docs/track-usage) to Commet. For AI products, [token billing](/docs/ai-token-billing) uses the model and token counts you report to calculate consumption with your configured margin. You can also manage [team seats](/docs/seat-management) and [quantities such as stored resources](/docs/quota-management).

### One-time purchases and optional extras

[Accept a one-time payment](/docs/accept-one-time-payments) without creating a plan or subscription. This is useful for a standalone purchase or service alongside your recurring product.

For subscribers, offer [add-ons](/docs/add-ons) to extend a plan, [credit packs](/docs/credit-packs) for more consumption, or [balance top-ups](/docs/balance-and-top-ups). These give customers a way to buy more without changing their entire subscription.

### A billing experience customers can manage themselves

Use checkout to collect payment and the [customer portal](/docs/customer-portal) to let customers view invoices, update payment methods, and review usage. Configure [plan groups](/docs/plan-groups) to offer self-service plan changes.

You can also create reusable [offers](/docs/offers), distribute them through [promo codes](/docs/promo-codes), and configure [regional prices](/docs/regional-prices) for different markets and currencies.

## Choose how you accept payments

Use Commet's [Merchant of Record](/docs/merchant-of-record) offering, or connect your own [Stripe or dLocal account](/docs/payment-providers).

For payments processed through its Merchant of Record offering, Commet handles tax collection and remittance, compliance, refunds, and disputes on your behalf. With your own Stripe or dLocal account, you remain the merchant and manage funds and payouts with that provider. Commet provides the billing layer in either setup.

The guides cover [payment routing](/docs/payment-orchestration), [transactions and refunds](/docs/transactions-refunds-and-retries), and [finance and payouts](/docs/finance-overview). Before using Commet as Merchant of Record, review [supported countries](/docs/supported-countries) and [verification requirements](/docs/payouts-verification).

## Integrate the way you work

Start in the dashboard to configure your product, then connect your application with an [API key](/docs/create-api-key). Choose a guide for your stack:

| Stack                         | Integration guides                                                                                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JavaScript and TypeScript** | [Next.js](/docs/integrate-with-nextjs), [Nuxt](/docs/integrate-with-nuxt), [SvelteKit](/docs/integrate-with-sveltekit), [Express](/docs/integrate-with-express), or the [Node.js SDK reference](/docs/sdk-reference). |
| **Python**                    | [Python](/docs/integrate-with-python), [FastAPI](/docs/integrate-with-fastapi), [Django](/docs/integrate-with-django), and [Flask](/docs/integrate-with-flask).                                                       |
| **Go, Java, and PHP**         | [Go](/docs/integrate-with-go), [Java](/docs/integrate-with-java), [PHP](/docs/integrate-with-php), and [Laravel](/docs/integrate-with-laravel).                                                                       |

Using Better Auth? The [Commet plugin](/docs/better-auth) connects customer creation and billing to your authentication flow. For complete applications you can adapt, explore the [examples](/docs/examples).

### Tools for developers and agents

The [CLI](/docs/cli) lets you manage Commet from your terminal and work with billing configuration as code. The [REST API reference](/docs/api-reference) documents the endpoints available to your own tools and integrations.

For an AI coding assistant, install the [Commet skill](/docs/commet-skill) for integration guidance. Connect the [MCP server](/docs/mcp-server) when the assistant also needs to read documentation and work with resources in your organization. The skill provides guidance; MCP provides access to tools.

## Connect billing to your application

Build your first flow in [sandbox](/docs/testing-sandbox), where you can exercise checkout and billing without real charges. Use [access and usage checks](/docs/track-usage) in your application to enforce the plan you sell.

Connect [signed webhooks](/docs/webhooks/introduction) to keep your application in sync with subscription and payment outcomes. Review [error handling](/docs/error-handling) before moving the integration to production.

Ready to start? Follow the [quickstart](/docs/choose-a-billing-model) to create a feature, plan, customer, subscription, and test payment in order.
