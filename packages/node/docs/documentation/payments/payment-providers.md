---
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

### Connect several accounts of the same provider

An organization can connect more than one Stripe or dLocal account, for example one dLocal account for Argentina and another for Brazil and Mexico. Each additional account starts with no countries and is not the default.

Give each account a label with **Edit alias** in its menu, then assign its countries in **Payment routing**. When you have several accounts of the same provider, Payment routing shows each connection ID (`pcon_...`) to copy.

To pin a subscription's first checkout to one account, pass its connection ID as `provider` when [creating the subscription](/docs/manage-subscriptions#create). `provider: "stripe"` or `"dlocal"` uses the oldest connected account of that provider.

### Stripe credentials

Provide the Stripe **secret key** and **publishable key** for the account you own. In sandbox mode, use `sk_test_...` and `pk_test_...` keys. In live mode, use `sk_live_...` and `pk_live_...` keys. Commet rejects keys from the wrong mode.

### dLocal credentials

Provide the credentials issued for the matching dLocal environment: **X-Login**, **X-Trans-Key**, **Secret Key**, and the **API key (dlocal.js)**. Commet validates the account before saving the connection.

## Choose payment methods per connection

Stripe and Commet connections accept cards. A dLocal connection can also offer local methods; each one applies only to that connection.

Open **Settings → Payments**, open the connection menu, and choose **Payment methods**. Enable a method in your dLocal account before turning it on in Commet.

| Method       | Where it's offered        |
| ------------ | ------------------------- |
| Card         | All countries             |
| Google Pay   | All countries             |
| Mercado Pago | Argentina, in ARS         |
| OXXO         | Mexico, as a cash voucher |
| SmartPix     | Brazil, in BRL            |

A country method appears under **Not available for this connection** until its country is assigned to the connection. Google Pay asks for the **dLocal gateway merchant ID**, the **Google merchant ID** (optional in sandbox), and the **Business name** buyers see.

The `paymentMethod` of each [transaction](/docs/transactions-refunds-and-retries) names the method used: `card`, `google_pay`, `mercado_pago`, `oxxo`, or `smartpix`.

### Limit the methods of one checkout

To offer only some methods in a subscription's first checkout, pass `paymentMethodTypes` when [creating the subscription](/docs/manage-subscriptions#create), for example `["oxxo"]`. The list only narrows what the checkout already offers for the buyer's country and connection: it never turns on a method or changes which connection the checkout uses. With `["card", "oxxo"]`, a buyer in Mexico sees card and OXXO, and a buyer in Argentina sees only card. Pass `provider` as well to choose the connection.

Every method in the list must be turned on in the `provider` connection, or in one of your connections when you don't pass `provider`. Otherwise the request fails with `validation_error` naming that method. A plan that starts with a card trial also rejects methods that can't be saved for renewals, such as OXXO.

When no method in the list is available to the buyer, the checkout shows that it can't accept payments and charges nothing. A new checkout for the same invoice, for example after an OXXO voucher expires, keeps the list.

### Mercado Pago

The customer authorizes Mercado Pago once in checkout. Commet charges the first payment after the authorization is active, and charges renewals to it automatically.

If the customer revokes the authorization in Mercado Pago, Commet removes the saved method and sends the `payment_method.detached` webhook; the subscription does not change. If no other usable method is saved when the next renewal is due, the payment fails and the subscription follows [failed-payment recovery](/docs/what-happens-when-a-payment-fails). The customer can authorize Mercado Pago again from the [Customer Portal](/docs/customer-portal).

### OXXO

OXXO is a cash voucher. Checkout shows it inline with the amount, the expiration date, the barcode, and the reference, which the customer can copy or save. The subscription activates when dLocal confirms the payment.

Cash can't renew. A subscription paid with OXXO and no other saved payment method [ends after its paid periods](/docs/pay-in-advance#end-oxxo-subscriptions-after-their-paid-periods) unless the customer adds a card. Combine OXXO with [Pay in Advance](/docs/pay-in-advance) to sell several periods with one voucher.

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
