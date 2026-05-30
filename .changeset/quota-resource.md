---
"@commet/node": minor
---

Add `quota` resource for durable balance tracking (the `quota` feature type). `quota.add`, `quota.set` and `quota.remove` mutate the balance; `quota.get` and `quota.getAll` read the current allowance (units held vs included in the plan, remaining, and whether overage is enabled).
