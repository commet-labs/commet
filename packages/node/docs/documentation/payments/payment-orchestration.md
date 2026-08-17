---
lastModified: 2026-07-27
title: Payment Orchestration
description: Route payments across Commet and your connected PSPs using country rules, defaults, and provider-bound payment methods.
---

Payment orchestration is the layer that chooses which connected provider handles a payment. Commet supports its own payment rail and your connected Stripe or dLocal accounts through the same billing integration.

## Payment method management

To manage provider connections and routing, open **Settings → Payments** in the Commet dashboard. The page includes the payment routing map, the list of connected providers, country assignments, the default provider, and the **Add payment provider** action.

To inspect a customer's saved method, open **Customers**, select the customer, and view the **Billing** section. Commet only displays non-sensitive details such as the card brand and last four digits. The full payment method stays with the provider that vaulted it.

Customers can update their method through the [Customer Portal](/docs/customer-portal). The new method is collected through the connection used by that customer's subscription. Do not assume that changing an organization's country routing will move an existing method.

## Routing rules

In **Settings → Payments**, use **Payment routing** to assign countries to connected providers. You can select individual countries or region presets, then save the assignment. The map and routing list show which provider will handle each country.

For a new checkout or other new activity, Commet resolves the customer's billing country as an ISO country code and looks up that country's route. For example, a customer whose billing address has `BR` uses the provider assigned to Brazil. The route is based on the billing address supplied to Commet, not on the customer's IP address.

If a subscription already has a saved payment connection, recurring charges continue through that connection. This preserves the location of the vaulted payment method. When there is no saved connection, Commet uses the country route; when no country is available, it uses the organization's default provider.

## Fallback providers

The **default provider** is the fallback for a checkout that has no country code. Choose it from the provider list in **Settings → Payments**. Commet starts every organization with the Commet provider as the default, so there is a working route until you configure another one.

This default is a routing fallback, not an automatic outage failover. If a provider declines a payment or becomes unavailable, Commet records the failure and exposes the provider's failure code. Automatic retries and recovery links retry the affected billing flow; they do not silently move a saved payment method to another provider.

If you need new traffic to use another provider, connect it and reassign the relevant countries or make it the default for countryless checkouts. Existing subscriptions remain on their stamped connection until the customer completes a new payment-method setup.

## Reuse payment methods

**Coming soon:** reuse a saved payment method across different providers.

Today, a saved payment method belongs to the provider connection that collected it. Commet does not copy card credentials between Stripe, dLocal, and Commet, and a routing change cannot make the same vaulted method chargeable by another provider. Customers must complete a new setup or checkout on the new connection.

## Related

- [Payment Providers](/docs/payment-providers) — Connect and configure Stripe, dLocal, and Commet
- [Use Commet alongside your PSPs](/docs/merchant-of-record#use-commet-alongside-your-psps) — Understand the MoR boundary for each rail
- [Handle Failed Payments](/docs/handle-failed-payments) — Provider errors, retries, and self-serve recovery
