---
lastModified: 2026-07-28
title: Billing Intervals
description: How weekly, monthly, quarterly, and yearly billing works and when your customers get charged
---

Plans can be billed weekly, monthly, quarterly, or yearly. Even on quarterly and yearly plans, Commet checks for usage charges **every month**. Here's what your customers can expect.

## Weekly Plans

Your customer is billed every 7 days. The billing period, consumption resets, and invoicing all happen on a weekly cycle.

- Plan base charged every week
- Usage (credits, balance, metered) resets every week
- Extra seats charged every week
- The billing day anchors to the day of the week the subscription started (e.g., every Monday)

> **Note**
>
> Weekly plans reset consumption **every 7 days**, not monthly. A customer on a weekly plan with 1,000 included API calls gets 1,000 calls each week.

## Monthly Plans

Straightforward: your customer is billed every month for their plan base, extra usage, and extra seats.

## Quarterly and Yearly Plans

Your customer pays the plan base every 3 or 12 months, but **usage charges can happen every month**. Here's how it works:

### Example: Quarterly plan at $300/quarter

```
Month 1:
  → Your customer used extra API calls? They get a small invoice for just the overage.
  → No extra usage? No invoice at all.

Month 2:
  → Same thing — only charged if they had extra usage.

Month 3 (renewal month):
  → Full invoice: plan base ($300) + any extra usage + any extra seats.
  → Billing cycle resets for the next quarter.
```

> **Warning**
>
> Usage resets **every month**, not every quarter or year. A customer on a quarterly plan with 10,000 included API calls gets 10,000 calls each month — they don't accumulate.

## What Your Customer Sees

|                       | Months between renewals | Renewal month           |
| --------------------- | ----------------------- | ----------------------- |
| Plan base             | Not charged             | Charged                 |
| Extra usage           | Charged (if any)        | Charged                 |
| Extra seats           | Not charged             | Charged                 |
| No extra usage at all | No invoice              | Invoice (has plan base) |

## Plan Changes Mid-Cycle

If your customer upgrades a quarterly or yearly plan mid-cycle, they get credit for the unused portion and start a new cycle from the change date. See [Proration](/docs/how-is-proration-calculated-when-changing-plans) for the exact calculation.

### Example

```
Your customer is on Plan A at $300/quarter (January 1 – April 1).
They upgrade to Plan B at $600/quarter on February 15.

→ They get credit for the unused portion of Plan A.
→ They're charged Plan B's full price minus that credit.
→ Their new cycle starts February 15, next renewal May 15.
```

## Related

- [Invoices](/docs/what-invoices-do-customers-receive-and-when) — What invoices your customers receive and when
- [Proration](/docs/how-is-proration-calculated-when-changing-plans) — How mid-cycle charges are calculated
- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans) — Upgrades, downgrades, and switching
