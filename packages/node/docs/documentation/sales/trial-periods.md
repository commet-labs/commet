---
lastModified: 2026-07-31
title: Trial Periods
description: Use free-trial Offer phases for automatic onboarding or explicit campaigns.
---

A trial is a `free_trial` phase in an Offer. It is not a separate discount system.

The phase records how long payment is delayed. The application channel decides who receives it:

| Channel                | Trial behavior                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| Introductory placement | Applied automatically to an eligible new subscription                  |
| Direct `offerId`       | Applied explicitly by your application                                 |
| `customTrialDays`      | Creates customer-specific trial terms without a reusable catalog Offer |
| `skipTrial: true`      | Bypasses the automatic trial                                           |

Promo Codes cannot distribute trial phases.

## Reusable trial

Create one Offer and reuse it:

```typescript
const trialOffer = await commet.offers.create({
  name: '14-day onboarding',
  phases: [
    { type: 'free_trial', durationDays: 14 },
  ],
})
```

Attach it to a base price in the Dashboard for automatic introductory selection, or pass it directly:

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  offerId: trialOffer.id,
})
```

An Offer can also continue into paid promotional phases after the trial.

## Customer-specific trial

Use `customTrialDays` when the terms are exclusive to one subscription and do not need a reusable catalog identity:

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  customTrialDays: 21,
})
```

Commet persists the accepted trial as a `custom` Offer Application with a `free_trial` phase.

## Skip an automatic trial

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  skipTrial: true,
})
```

`offerId` cannot be combined with `customTrialDays` or `skipTrial: true`; the explicit Offer already defines the full sequence.

## Checkout and billing

The customer provides a payment method during checkout but is not charged immediately. After setup succeeds:

1. the subscription becomes `trialing`;
2. `trialEndsAt` records the end of the free-trial phase;
3. Commet charges the current selected price when the trial ends;
4. any following Offer phase becomes active.

Accepted Offer phases remain immutable, but the selected catalog price does not. If the price changes during the trial, the first paid charge uses the current value of the selected price.

## Related

- [Offers](/docs/offers)
- [Introductory Offers](/docs/introductory-offers)
- [Promotional Offers](/docs/promotional-offers)
- [How trial periods work](/docs/how-do-trial-periods-work)
- [Handle Failed Payments](/docs/handle-failed-payments)
