---
"@commet/node": minor
---

Add `provisioning.createClaimLink`, `usage.set`, promo-code billing intervals, subscription promo codes, USD regional pricing, checkout provider metadata, and test-clock dunning results.

This release also synchronizes public response models with additive fields already returned by the current API. Existing SDK calls and request signatures remain compatible. Applications that manually construct `PromoCode` or `TestClockBilling` values should include `billingInterval` and `dunningRetried`/`dunningFailed` respectively.
