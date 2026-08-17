---
lastModified: 2026-07-10
title: Invoices and Billing Cycles
description: How Commet generates invoices, what they contain, and when customers are charged.
---

Invoices are the financial records Commet generates automatically whenever a subscription event or billing cycle occurs.

## Invoice types

| Type                  | When Generated                                          | Example                                    |
| --------------------- | ------------------------------------------------------- | ------------------------------------------ |
| **Recurring**         | Every billing cycle                                     | $99 plan base + $12.50 overage             |
| **Overage**           | Between cycles (quarterly/yearly only)                  | 15k extra API calls billed monthly         |
| **Plan change**       | Customer upgrades mid-cycle                             | Starter to Pro, prorated $45               |
| **Credit purchase**   | Customer buys a credit pack                             | 500 credits for $40                        |
| **Balance top-up**    | Customer adds funds                                     | $50 balance top-up                         |
| **Add-on activation** | Customer activates an add-on mid-cycle                  | SMS add-on, prorated $32.26                |
| **Adjustment**        | Manual correction issued                                | $10 refund for service issue               |
| **One-time payment**  | Standalone charge (`payments.charge` or a payment link) | $250 one-off invoice, no subscription      |
| **Reactivation**      | Canceled subscription is reactivated                    | Fresh invoice, billing anchor reset to now |

The **One-time payment** type backs the [payments resource](/docs/accept-one-time-payments) — charges and payment links with no subscription. Its single line uses the `one_time` line type.

## Invoice line types

Each invoice is made of typed lines. The line type tells you what the charge is for.

| Line type             | What it is                                                                  |
| --------------------- | --------------------------------------------------------------------------- |
| `plan_base`           | The plan's recurring base price                                             |
| `feature_overage`     | Metered usage beyond the included allowance                                 |
| `feature_seats`       | Seat charges — advance for excess seats plus mid-cycle true-up              |
| `feature_quota`       | Quota charges — advance plus true-up                                        |
| `discount`            | Introductory offer discount                                                 |
| `promo_code_discount` | Promo code discount                                                         |
| `credit`              | Credit application                                                          |
| `balance_overage`     | Balance model overage when the balance is exhausted and usage isn't blocked |
| `addon_base`          | An add-on's base price                                                      |
| `one_time`            | A standalone one-time payment, with no subscription                         |

## When charges happen

| Component            | When Charged                                               | Example                                                     |
| -------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| **Plan base price**  | Advance (period start)                                     | $99 on Jan 1                                                |
| **Boolean features** | Included in plan base                                      | SSO, Custom Branding                                        |
| **Metered overage**  | True-up (period end)                                       | 2,500 extra API calls                                       |
| **Included seats**   | Advance (with base)                                        | 5 editor seats                                              |
| **Additional seats** | Hybrid: true-up for the past period + advance for the next | 3 extra seats prorated for the days used, then billed ahead |

## Billing intervals

| Interval      | Base Invoice              | Overage Invoice                   | Consumption Reset | Example                              |
| ------------- | ------------------------- | --------------------------------- | ----------------- | ------------------------------------ |
| **Weekly**    | Every 7 days              | Included in recurring invoice     | Every 7 days      | $25/week every Monday                |
| **Monthly**   | Every month               | Included in recurring invoice     | Every month       | $99/month on the 1st                 |
| **Quarterly** | Every 3 months            | Monthly                           | Every month       | $297 base quarterly, overage monthly |
| **Yearly**    | Every 12 months           | Monthly                           | Every month       | $899 base yearly, overage monthly    |
| **One-time**  | Single charge at checkout | At period end (if overage exists) | Never             | $299 lifetime, no recurring charges  |

For quarterly and yearly plans, overage is calculated and invoiced monthly even though the base charge is less frequent. For weekly plans, everything runs on a 7-day cycle. For one-time plans, the customer pays once at checkout and never receives a recurring invoice — only overage charges if applicable. See [One-Time Payments](/docs/one-time-payments) for details.

## Learn more

- [What Invoices Do Customers Receive and When](/docs/what-invoices-do-customers-receive-and-when)
- [How Do Monthly, Quarterly, and Yearly Billing Work](/docs/how-do-monthly-quarterly-and-yearly-billing-work)

## Related

- [Handle Failed Payments](/docs/handle-failed-payments) — Retry flow and grace periods for failed charges
- [Consumption Models](/docs/consumption-models) — Metered, Credits, and Balance explained
- [Finance Overview](/docs/finance-overview) — How money flows through Commet
