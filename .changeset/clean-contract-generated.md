---
"@commet/node": major
"@commet/next": patch
"@commet/ai-sdk": patch
"@commet/better-auth": patch
"commet": patch
---

Generate the complete Node SDK HTTP surface and public wire types from the 2026-07-24 OpenAPI contract.

### New APIs

- Add `commet.pricing.createMarketGroup()`, `listMarketGroups()`, `getMarketGroup()`, `updateMarketGroup()`, and `deleteMarketGroup()` for reusable country groups.
- Extend `commet.plans.addPrice()` and `updatePrice()` with market prices, metadata, and selectable variants through `inheritsFromPriceId`.
- Add `priceId` to subscription creation so integrations can select a specific base price or market variant.
- Generate `commet.offers`, `commet.usage.check()`, `commet.usage.track()`, `commet.usage.set()`, and webhook endpoint CRUD directly from the contract.
- Generate webhook event payloads, including the discriminated `boolean`, `usage`, `seats`, and `quota` feature snapshots in `customer.state_changed`.

### Migration from v7

- Singular resource methods now return the resource directly instead of `{ success, data, error }`. List methods return the explicit `{ object, data, hasMore, nextCursor }` contract.
- Replace `commet.featureAccess.canUse()` with `commet.usage.check()`.
- Replace `commet.usage.trackEvent()` with `commet.usage.track()`.
- Use `featureCode` instead of feature IDs or the legacy `feature` field in usage and entitlement requests.
- Use `offerId` for Promotional Offer selection.
- Narrow add-on creation by `consumptionModel`: metered add-ons require `includedUnits` and `overageRate`, credits require `creditCost`, and balance requires `overageRate`.
- Read payout verification through the discriminated `outcome: "existing" | "created"` response instead of the legacy optional `alreadyExists` flag.
- Consume generated list and detail models such as `CreditPackListItem`, `InvoiceListItem`, `SubscriptionSummary`, and `TransactionListItem`; legacy handwritten wire aliases are removed.
- Read webhook feature state from its generated nested variant fields, such as `feature.consumption` for usage and `feature.usage` for seats or quota, instead of the legacy flat `WebhookFeatureAccess` shape.

### Preserved helpers

Request options, authentication, retries, idempotency, telemetry, and webhook signature verification, parsing, and dispatch remain handwritten developer ergonomics. They do not define HTTP methods or wire types.

Next.js, AI SDK, Better Auth, CLI, and all examples are updated for the v8 surface.
