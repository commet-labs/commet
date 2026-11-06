---
title: Dashboard Metrics and Usage Events
description: Customize the dashboard home, filter it by period, plan and currency, and see how MRR, revenue, churn and the usage-event explorer work.
---

The dashboard home summarizes confirmed billing records. Use it for operational review, not as a replacement for your accounting ledger or product analytics.

## Customize the dashboard

Click **Customize** on the dashboard home. Drag widgets to reorder them, drag a widget to the hidden area to hide it, or click **Add widget** to show a hidden one. Click **Save** to keep the layout, or **Reset** to restore the default.

The layout is saved for you and this organization in your browser. By default the home shows Revenue, Successful Payments, Active Subscriptions, New Customers, New Paid Subscriptions, and MRR, plus Revenue by Plan when you have more than one plan. Provider Volume is available with more than one payment provider.

Hover the info icon next to a widget title to see how it is calculated. Most widgets open a detail page when clicked.

## Filter by period, plan, and currency

The period, comparison, plan, and currency filters live in the URL, so a shared link opens the same view. Periods range from **Today** to **All time** or a **Custom range**, and their boundaries are in UTC.

The currency selector lists **All currencies**, USD, and every currency your organization has received:

- **All currencies** sums every payment in USD. A non-USD payment is converted at the previous UTC day's rate when it was made.
- A specific currency shows only the payments made in that currency, in that currency. Nothing is converted.

## Metric definitions

| Widget                         | Calculation                                                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Revenue**                    | Successful payments excluding tax. Fully refunded or disputed payments are excluded; partial refunds keep the original amount                                         |
| **Successful Payments**        | Successful transactions, including payments later refunded or disputed                                                                                                |
| **MRR**                        | Effective recurring prices net of recurring discounts at period end, normalized to a month. Excludes tax, usage overage, one-time charges, and proration              |
| **MRR after scheduled churn**  | MRR of subscriptions still in service at period end, leaving out subscriptions scheduled to cancel before then. Hidden by default                                     |
| **ARR**                        | MRR at period end × 12. A run rate, not cash collected                                                                                                                |
| **Active Subscriptions**       | Subscriptions entitled to service at period end: active, past due, or scheduled to cancel after the cutoff                                                            |
| **New Customers**              | Customers created in the period. The currency filter does not apply                                                                                                   |
| **New Paid Subscriptions**     | Subscriptions whose first successful payment happened in the period, even if later refunded or disputed                                                               |
| **Churned Subscriptions**      | Subscriptions that reached `canceled` in the period. **User Churned** and **Dunning Churned** split them by whether exhausted payment retries caused the cancellation |
| **Churned MRR**                | Effective recurring price, net of recurring discounts and normalized to a month, at each cancellation                                                                 |
| **Dunning Amount Recovered**   | Recurring invoice totals recovered by a payment retry or manual recovery                                                                                              |
| **Dunning Payments Recovered** | Payment retries or manual recoveries that settled a recurring invoice                                                                                                 |
| **Revenue by Plan**            | Revenue grouped by plan, top three                                                                                                                                    |
| **Provider Volume**            | Successful payments by payment provider, with the comparison period dotted                                                                                            |
| **Seats**                      | Each customer's latest seat count per seat feature at period end. The currency filter does not apply                                                                  |

Churn widgets count from June 4, 2026. A paused subscription is out of MRR and is not churn.

Metrics are cached and can lag recent writes briefly. Investigate an exact payment in **Transactions** and its accounting result in **Invoices**.

## Usage Events

Open **Events** to inspect the usage records sent by your integration. Each row shows the event ID, feature, customer, timestamp, value, kind, and custom properties. Filter by customer or feature when reconciling a usage total.

The event timestamp describes when usage occurred; creation time describes when Commet received it. Stable idempotency keys prevent retries from becoming duplicate billable events.

See [Track Usage](/docs/track-usage) for implementation and [Invoices and Billing Cycles](/docs/invoices-and-billing-cycles) for settlement timing.
