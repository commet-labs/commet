---
lastModified: 2026-07-27
title: Payment Providers
description: Connect your own Stripe or dLocal account to Commet and route payments without changing your billing integration.
---

Commet can process payments through its own rail or through a payment service provider (PSP) account that you connect. The billing API and checkout stay the same; the connection determines where the payment is processed and which merchant identity applies.

## Connect a provider from the dashboard

Open **Settings → Payments** in your Commet dashboard. The page shows the providers connected to your organization, the countries assigned to each one, and the current default provider.

To connect your own account:

1. Select **Add payment provider**.
2. Choose **Stripe** or **dLocal**.
3. Enter the credentials for the organization's current mode.
4. Save the connection. Commet validates the credentials and stores them encrypted.
5. Add the provider's invoice issuer details before assigning it countries or making it the default.

Commet registers and consumes the provider webhooks required to keep payment, refund, dispute, and setup events synchronized. You do not need to create a second billing integration for the connected account.

### Stripe credentials

Provide the Stripe **secret key** and **publishable key** for the account you own. In sandbox mode, use `sk_test_...` and `pk_test_...` keys. In live mode, use `sk_live_...` and `pk_live_...` keys. Commet rejects keys from the wrong mode.

### dLocal credentials

Provide the credentials issued for the matching dLocal environment: **X-Login**, **X-Trans-Key**, **Secret Key**, and the **API key (dlocal.js)**. Commet validates the account before saving the connection.

## Sandbox and live credentials

Sandbox and live credentials belong to different payment environments. Keep test credentials in the Commet sandbox organization and live credentials in the live organization. Never copy a live secret into sandbox or a test key into live.

The provider account is also part of the connection. A sandbox Stripe account and a live Stripe account are separate payment destinations even when they belong to the same team. Verify the provider dashboard and the key mode before testing a checkout.

## One transaction model across providers

Commet gives every payment the same billing and transaction model regardless of the provider that processes it. In the dashboard, **Transactions** is the central view for payment status, amount, customer, invoice, and lifecycle events. The API and webhooks expose the provider that processed a payment as `stripe`, `commet`, or `dlocal`.

Commet continues to manage the billing lifecycle around the provider: invoices, subscription state, retries, recovery links, refunds, and normalized webhook events. Provider-specific errors are preserved as failure codes while the customer-facing payment state remains consistent.

The transaction record is centralized in Commet, but funds are not pooled across providers. The connected Stripe or dLocal account owns its own charges, fees, disputes, and payouts. The Commet rail owns the corresponding provider-side records for Commet charges.

## Add or replace a provider without migrating billing

Adding a provider does not migrate customers, invoices, subscriptions, or payment methods. Connect the provider, configure its invoice issuer details, and assign countries to it for new activity.

Routing changes apply to new charges. A subscription with a saved payment method keeps using the connection where that method was saved, and Commet does not copy the method to another provider. This avoids charging an old customer from an unexpected account.

If a connection already has payment history, Commet does not hard-delete it. Keep it connected for its existing billing history and route new countries or new customers to another provider. To move an existing customer, use a new checkout or the Customer Portal to collect a payment method on the new connection; this is a new payment-method setup, not a database migration.

See [Payment Orchestration](/docs/payment-orchestration) for country routing, defaults, and provider-bound payment methods.

## Related

- [Use Commet alongside your PSPs](/docs/merchant-of-record#use-commet-alongside-your-psps) — Understand when Commet is the MoR and when your PSP is the MoR
- [Handle Failed Payments](/docs/handle-failed-payments) — Retries, provider errors, and recovery paths
- [Testing in the Sandbox](/docs/testing-sandbox) — Test billing without live charges
