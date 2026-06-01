---
"@commet/node": minor
---

Add `quota` resource for durable balance tracking (the `quota` feature type). `quota.add`, `quota.set` and `quota.remove` mutate the balance; `quota.get` and `quota.getAll` read the current allowance (units held vs included in the plan, remaining, and whether overage is enabled). `quota` is now a recognized `FeatureType`, so `features.get` and `features.list` return access (current, included, overage and overage price) for quota features too.
