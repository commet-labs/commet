---
"@commet/node": major
---

Adds the Payouts and Test Clock APIs and two new lookup methods. Includes breaking changes to intro offers, customer email, and a few exported type names — migration below.

**What's new**

- **Payouts** — manage payouts to your bank account: `payouts.addBankAccount()` registers a destination account, `payouts.request()` moves available balance to it, and `payouts.completeVerification()` finishes bank verification.
- **Test Clock** — simulate the passage of time in sandbox to exercise billing without waiting: `testClock.advance()` moves the clock forward, `testClock.processBilling()` runs whatever billing comes due, and `testClock.get()` reads the current clock.
- **`subscriptions.get(id)`** — fetch a single subscription by ID, alongside the existing `subscriptions.getActive()`.
- **`plans.setRegionalPricing()`** — set per-region pricing for a plan.

**Breaking changes**

- **Intro offers on `subscriptions.create()`** — the `customIntroOffer` parameter is now `introOffer`, a nested object `{ discountType, discountValue, durationCycles }`. The flat `introOfferEndsAt` / `introOfferDiscountType` / `introOfferDiscountValue` fields were removed from the subscription object; read intro-offer config from the plan price (`plan.prices[].introOffer`).
- **Customer email** — `billingEmail` is now `email` on the customer create/update params and the customer object. Rename it in your calls.
- **Exported type renames** — `CreateParams` / `UpdateParams` are now `CreateCustomerParams` / `UpdateCustomerParams`, and `CreateAddonParams` is a single interface instead of a union. Update your imports.
- **`quota.add()` / `quota.remove()`** — `count` no longer defaults to `1`. Pass it explicitly.
