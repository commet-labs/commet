---
lastModified: 2026-08-16
title: Payment Routing
description: Understand how Commet chooses a provider and why existing saved methods stay on their original connection.
---

For a new checkout, Commet uses the payment connection assigned to the customer's country. If no country route matches, it uses the organization's default connection.

Once a subscription stores a payment method, renewals and retries continue through that same connection. Changing a country route or the default affects new selection; it does not copy an existing card between Commet, Stripe, and dLocal.

This means routing is not automatic failover. A provider decline or outage is recorded as a failure. Commet does not silently move the charge to another provider account.

To move an existing customer, collect a new payment method through checkout or the Customer Portal on the intended connection. That is a new setup, not a database migration of card credentials.

Use the dashboard under **Settings → Payments** to connect providers, assign countries, and choose the default. Inspect the provider and connection on **Transactions** when diagnosing a payment.

See [Payment Orchestration](/docs/payment-orchestration) for configuration.
