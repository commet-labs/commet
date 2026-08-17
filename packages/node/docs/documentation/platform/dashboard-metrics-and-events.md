---
lastModified: 2026-08-16
title: Dashboard Metrics and Usage Events
description: Understand MRR, revenue, churn, active subscriptions, and the usage-event explorer.
---

The dashboard summarizes confirmed billing records. Use it for operational review, not as a replacement for your accounting ledger or product analytics.

| Metric                   | Current calculation                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **MRR**                  | Latest successful gross payment per active subscription, normalized by billing interval    |
| **Total revenue**        | Successful gross transactions paid during the current calendar month                       |
| **Revenue growth**       | Percentage change between current and previous monthly recurring revenue                   |
| **Churn**                | Subscriptions canceled in the last 30 days divided by the eligible subscription population |
| **Active subscriptions** | Current subscriptions whose persisted status is `active`                                   |

Metrics are cached and can lag recent writes briefly. Investigate an exact payment in **Transactions** and its accounting result in **Invoices**.

## Usage Events

Open **Events** to inspect the usage records sent by your integration. Each row shows the event ID, feature, customer, timestamp, value, kind, and custom properties. Filter by customer or feature when reconciling a usage total.

The event timestamp describes when usage occurred; creation time describes when Commet received it. Stable idempotency keys prevent retries from becoming duplicate billable events.

See [Track Usage](/docs/track-usage) for implementation and [Invoices and Billing Cycles](/docs/invoices-and-billing-cycles) for settlement timing.
