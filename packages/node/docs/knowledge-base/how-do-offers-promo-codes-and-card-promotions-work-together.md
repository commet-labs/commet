---
lastModified: 2026-08-16
title: Offers, Promo Codes, and Card Promotions
description: Understand where commercial terms live and how each distribution channel selects them.
---

An Offer owns the economic terms: trial, percentage discount, amount off, or temporary fixed price. Introductory Offers, direct Promotional Offers, Promo Codes, and Card Promotions decide how those terms reach a customer.

| Channel                | Who selects it                                                                                                         | Additional rule                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Introductory**       | Commet selects it from the plan price                                                                                  | New-customer eligibility                          |
| **Direct Promotional** | Your application sends `offerId`                                                                                       | Your application decides the audience             |
| **Promo Code**         | Customer enters a code                                                                                                 | Plan, interval, expiration, and redemption limits |
| **Card Promotion**     | Your application preselects `cardPromotionId`, or Commet discovers an auto-apply promotion; checkout verifies the card | BIN, billing interval, and Offer compatibility    |

Only one channel applies to the initial checkout. An explicit Offer overrides automatic introductory selection. A Promo Code cannot combine with an explicit Offer, and a Card Promotion must remain conditional until the entered card is verified.

When terms are accepted, Commet stores an immutable Offer Application. Editing the catalog Offer changes future applications, not the phases already accepted by an existing subscription.

See [Offers](/docs/offers) and [Card Promotions](/docs/card-promotions) for setup.
