---
"@commet/node": major
---

Generate the SDK resource and type layer from the OpenAPI contract (2026-06-07).

Resources, request/response models, and enums are now emitted by the codegen tool from the API contract instead of being hand-written, so the SDK stays in sync with the API by construction. The hand-written core is preserved: client, usage batching, webhook signature verification, errors, and `defineConfig`.

Breaking changes (SDK surface aligned to the contract):

- `subscriptions.create`: the intro offer parameter is renamed `customIntroOffer` → `introOffer`, and the subscription model exposes a nested `introOffer` object instead of the flat `introOfferEndsAt` / `introOfferDiscountType` / `introOfferDiscountValue` fields.
- Exported type renames: `CreateParams` / `UpdateParams` → `CreateCustomerParams` / `UpdateCustomerParams`; the `CreateAddonParams` union is replaced by a single interface.
- `quota.add` / `quota.remove` no longer default `count` to 1 client-side; the server applies the contract default (`default: 1`).
- Customer email is sent on the wire as `email` (the `billingEmail` rename landed in API version 2026-06-06).
