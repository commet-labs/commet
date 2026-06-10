---
"@commet/node": major
---

**Breaking:** Features are now split into a catalog surface and a per-customer access surface, matching the flat REST API.

- `features.list()` returns the organization's feature catalog (`Feature[]`) — every feature you have defined. It no longer takes a `customerId`.
- `features.get({ code })` returns a single catalog definition (`Feature`) by code.
- A customer's feature access moved to the new `featureAccess` resource:
  - `featureAccess.list({ customerId })` → `FeatureAccess[]` (everything the customer can use under their active subscription).
  - `featureAccess.get({ customerId, code })` → `FeatureLookup` (access details for one feature).
  - `featureAccess.canUse({ customerId, code })` → `FeatureLookup` (whether the customer can consume one more unit).
- Active add-ons now require a `customerId`: `addons.listActive({ customerId })` → `ActiveAddon[]`.

Migration:

```ts
// Feature catalog (definitions)
const { data: catalog } = await commet.features.list();
const { data: feature } = await commet.features.get({ code: "api_calls" });

// Customer feature access (what they can use)
const { data: access } = await commet.featureAccess.list({ customerId });
const { data: lookup } = await commet.featureAccess.get({ customerId, code: "api_calls" });
const { data: check } = await commet.featureAccess.canUse({ customerId, code: "api_calls" });

// Active add-ons now require a customer
const { data: addons } = await commet.addons.listActive({ customerId });
```
