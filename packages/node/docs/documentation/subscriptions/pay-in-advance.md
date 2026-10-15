---
title: Pay in Advance
description: Let a customer pay several billing periods of a subscription in one payment with any checkout method.
---

Paying in advance lets a customer cover several billing periods of a subscription in one payment, with card, OXXO, or any other checkout method.

It works on weekly, monthly, quarterly, semiannual, and yearly prices. The interval never changes: each paid period renews at `$0` as a regular renewal.

Paying in advance doesn't decide whether the subscription renews afterward. To sell periods that end on their own, combine it with `cancelAtPeriodEnd: true`, described in [One-Time Payments](/docs/one-time-payments#sell-a-period-without-renewal).

## Charge several periods in the first payment

> **Warning**
>
> **Free trials don't combine with paying in advance.** With `prepaidPeriods` above `1` or `cancelAtPeriodEnd: true`, an explicit trial (`customTrialDays`, a trial Offer, or a trial Promo Code) returns `400`, and the plan's automatic introductory trial is skipped.

```bash
curl -X POST https://commet.co/api/v1/subscriptions \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"customerId":"user_123","planId":"pln_xxx","prepaidPeriods":3}'
```

Redirect the customer to `checkoutUrl`. The first payment covers 3 periods of the price's interval, including the current one: 3 months on a monthly price, 3 quarters on a quarterly one.

| Parameter           | Type      | Required | Description                                                                                                                                              |
| ------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prepaidPeriods`    | `integer` | No       | Total billing periods the first payment covers, including the current one. `1` to `60`. Default: `1`                                                     |
| `cancelAtPeriodEnd` | `boolean` | No       | `true` ends the subscription after its last paid period, with no renewal. See [One-Time Payments](/docs/one-time-payments#sell-a-period-without-renewal) |

`prepaidPeriods` above `1` requires a paid recurring price. One-time prices and free plans return `400 validation_error` with `param: "prepaidPeriods"`.

## Add periods to an existing subscription

```bash
curl -X POST https://commet.co/api/v1/subscriptions/sub_xxx/prepaid-periods \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"periods":3}'
```

Send the returned `checkoutUrl` to the customer. It opens a hosted checkout for those periods.

| Parameter    | Type      | Required | Description                                                                                           |
| ------------ | --------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `periods`    | `integer` | Yes      | Billing periods to pay. `1` to `60`. Its meaning depends on the subscription status                   |
| `offerId`    | `string`  | No       | Offer applied from the first added period for its full configured duration. Active subscriptions only |
| `successUrl` | `string`  | No       | Where the customer lands after paying                                                                 |

The subscription status decides what `periods` means:

| Status                                      | `periods`                                                                       | The new link                       |
| ------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------- |
| `active`                                    | Periods added after the last paid period, priced in the subscription's currency | Replaces any previous unpaid link  |
| `pending_payment`, before its first payment | Total periods the first payment covers, including the first one                 | Replaces the pending checkout link |

A `pending_payment` subscription that already paid and is awaiting a renewal returns `409`. A canceled subscription also returns `409`; to bring the customer back, create a new subscription with `prepaidPeriods`.

If the customer already generated an OXXO voucher for the pending checkout, Commet cancels it with the provider first. To apply an Offer to a pending subscription, send `offerId` when [creating the subscription](/docs/manage-subscriptions#create), or assign it with `PUT /subscriptions/{id}/offer` before or after this call: the checkout prices each paid period with that Offer.

Commet voids an unpaid link and emits [`invoice.voided`](/docs/webhooks/invoice-voided) when you create a new link, the plan or billing interval changes (immediately or as scheduled), or the subscription is paused, canceled immediately, or ends, including when failed payment retries cancel it. If the customer pays an OXXO voucher from a voided link, Commet refunds it automatically.

| Response                          | Cause                                                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 validation_error`            | The price is one-time or the plan is free                                                                                                                             |
| `400 validation_error`            | `offerId` has a free trial or was sent for a `pending_payment` subscription. `param` is `offerId`                                                                     |
| `400 validation_error`            | An Offer bills on another interval. See [Offers billed on another interval](#offers-billed-on-another-interval)                                                       |
| `400 validation_error`            | The total is below the minimum charge, such as with a 100% Offer. `param` is `offerId` when you sent one, `periods` otherwise. The previous unpaid link stays payable |
| `409 invalid_subscription_status` | The subscription isn't `active` or awaiting its first payment, it has a free trial, or a pause is scheduled                                                           |
| `409 charge_in_progress`          | A payment for the link being replaced couldn't be canceled, such as a generated OXXO voucher                                                                          |

## How each period is priced

Each period costs the price of the subscription's interval for the buyer's country and currency, minus the discount of the Offer phase that applies to that period.

```text
Plan: $10/month
Offer: 50% off for 2 months
Periods: 3

Period 1 → $5
Period 2 → $5
Period 3 → $10
Payment → $20
```

For the first payment, the currency and country price are resolved at checkout, as for any subscription. Offers run for their full configured duration starting at the first paid period. An Offer assigned with `PUT /v1/subscriptions/{id}/offer` to a subscription with paid periods left starts at the first renewal that charges, after the last paid period.

[Card Promotions](/docs/card-promotions) behave as on any subscription. [Promo Codes](/docs/promo-codes) do too, with two exceptions:

- A link that adds periods to an active subscription keeps the price it was created with, so a Promo Code entered there is rejected with "Promo codes can't be used on a link that adds billing periods".
- A trial Promo Code entered on a checkout that pays several periods or on a one-time purchase is rejected with "Trial codes can't be used when paying in advance".

### Offers billed on another interval

An Offer with a phase billed on a different interval than the subscription, such as `$5/month for 3 months` on a yearly price, can't combine with paying in advance. These requests return `400 validation_error`:

| Request                                                                                                           | `param`             |
| ----------------------------------------------------------------------------------------------------------------- | ------------------- |
| `POST /v1/subscriptions` with `prepaidPeriods` above `1` and that Offer through `offerId` or `promoCode`          | `prepaidPeriods`    |
| `POST /v1/subscriptions/{id}/prepaid-periods` with that `offerId`, or with that Offer already assigned or running | `offerId` when sent |
| `PUT /v1/subscriptions/{id}/offer` on a subscription with unused paid periods or an unpaid link                   | `offerId`           |

A Promo Code for that Offer entered on a prepaid checkout is rejected with "This promo code can't be used when paying several billing periods in advance".

## What the customer sees at checkout

| Purchase                                                                                                     | Checkout shows                                                |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Renews after the paid periods                                                                                | `3 months · then $10.00/mo` or `2 quarters · then $30.00/qtr` |
| One-time purchase, a subscription scheduled to end, or a first payment with a method that can't renew (OXXO) | `3 months · one-time payment, doesn't renew`                  |

On a link that adds periods to an active subscription, the label follows whether the subscription renews, not the method chosen in that checkout. An OXXO payment on a card subscription shows `then …`.

## End OXXO subscriptions after their paid periods

When a subscription is paid with OXXO and has no other saved payment method, Commet schedules its cancellation at the end of its paid periods.

- The API shows `cancelAtPeriodEnd: true` and `cancellation.effectiveAt` right after the payment.
- [`subscription.updated`](/docs/webhooks/subscription-updated) and [`subscription.cancellation_scheduled`](/docs/webhooks/subscription-cancellation-scheduled) fire, with `effectiveAt` at the end of the paid periods and `cancelReason: null`.
- The subscription isn't renewed or charged, and [`subscription.canceled`](/docs/webhooks/subscription-canceled) fires when it ends.

To keep it, the customer adds a card through the [payment method update link](/docs/handle-failed-payments#update-the-payment-method) (`POST /v1/subscriptions/{id}/payment-method/update`) or **Keep subscription** in the [Customer Portal](/docs/customer-portal). The subscription then renews normally with that card.

`POST /v1/subscriptions/{id}/uncancel` without a saved card returns `409 subscription_uncancel_failed`.

## Track paid periods after payment

- `currentPeriod` stays one billing period.
- `nextBillingDate` is the next real charge, after the last paid period.
- Each paid period renews with a paid `$0` invoice, with no charge and no payment link, also for OXXO.
- Features, credits, and balances reset on their usual schedule.

Paying in advance uses existing webhook events:

- [`payment.received`](/docs/webhooks/payment-received) and [`subscription.updated`](/docs/webhooks/subscription-updated): the periods were paid.
- [`invoice.created`](/docs/webhooks/invoice-created): a paid period renewed with a `$0` invoice.
- [`invoice.voided`](/docs/webhooks/invoice-voided): an unpaid link was voided.
- [`subscription.canceled`](/docs/webhooks/subscription-canceled): a one-time purchase or an OXXO subscription without a card ended.

## Cancel, pause, or change plan

- Cancel: paid periods aren't refunded, and a scheduled cancellation takes effect after the last paid period.
- Pause: rejected while paid periods remain.
- Plan or billing interval change: unused paid periods become [Customer Credits](/docs/customer-credits) at the price paid.

## Pay in advance from the Dashboard

Open the subscription detail, choose **Pay in advance**, enter the number of periods, and choose **Copy payment link**. The field is labeled with the unit of the subscription's interval, such as **Months** or **Quarters**.

Send the copied link to the customer. The subscription detail shows **Paid through** with the date the paid periods end.

## Limitations

- `prepaidPeriods` and `periods` accept `1` to `60` for every interval.
- Only paid recurring prices. One-time prices and free plans return `400`.
- Free trials don't combine with `prepaidPeriods` above `1` or with `cancelAtPeriodEnd`.
- Usage overage, seats, and add-ons aren't prepaid: they're billed on their usual schedule, and a renewal with a non-zero total follows the normal payment path.
