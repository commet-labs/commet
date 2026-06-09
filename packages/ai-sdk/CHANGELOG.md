# @commet/ai-sdk

## 4.0.0

### Patch Changes

- Updated dependencies [3d75493]
- Updated dependencies [3bbdf3e]
  - @commet/node@6.0.0

## 3.0.0

### Major Changes

- 7b62b9c: Pin API version to 2026-05-25 with breaking type changes.

  **Breaking changes:**

  - Remove `externalId` from `Customer` response type and all request params — use `customerId` on resources, `id` on customer create
  - Remove `seatType` from `SeatEvent` — use `featureCode`
  - Remove `CustomerContext` — all methods now take `customerId` as a direct param
  - Remove `features.check()` — use `canUse()` instead
  - Rename `subscriptions.get()` to `getActive()`
  - Remove envelope fields (`object`, `livemode`) from response types for 2026-05-25 clients
  - Remove `provider`, `providerFee`, `commetFee`, `orgNetAmount` from `TransactionListItem`
  - Remove `providerChargeId`, `providerPaymentIntentId`, `providerNetAmount`, `presentmentAmount` from `TransactionDetail`
  - `seats.add()` and `seats.remove()` — `count` is now optional, defaults to 1

  **New resources:**

  - `apiKeys` — list, create, delete
  - `invoices` — list, get, createAdjustment, getDownloadUrl, send, updateStatus
  - `transactions` — list, get, refund, retry
  - `promoCodes` — list, get, create, update
  - `planGroups` — list, get, create, update, delete, addPlan, removePlan, reorderPlans

  **New methods on existing resources:**

  - `subscriptions` — list, previewChange, activateAddon, deactivateAddon, adjustBalance, topupBalance, purchaseCredits
  - `plans` — full admin CRUD (create, update, delete, features, prices, visibility, regional pricing)
  - `features` — create, update, delete
  - `addons` — list, get, create, update, delete
  - `creditPacks` — create, update, delete
  - `webhooks` — list, create, delete, test

  **HTTP client improvements:**

  - Idempotency keys auto-generated for POST/PUT/PATCH when retries > 0
  - Enhanced error parsing with `type`, `param`, `doc_url` fields
  - Debug mode via `debug: true` constructor option

## 2.1.0

### Minor Changes

- da80a74: Add integration registry to telemetry headers

  - `@commet/node` exports `registerIntegration(name, version)` and includes an `integrations` array in the `commet-client-info` header
  - `@commet/next`, `@commet/ai-sdk`, and `@commet/better-auth` auto-register on import
  - Server sees which integration packages are in use per request (e.g. `["@commet/next@0.4.2", "@commet/better-auth@3.0.0"]`)
  - Integration versions injected at build time via tsup — no manual tracking

## 2.0.0

### Major Changes

- 56ddb2d: Requires `@commet/node` >= 3.0.0 for API versioning support.

### Patch Changes

- Updated dependencies [184be03]
- Updated dependencies [ed6315a]
  - @commet/node@3.0.0

## 1.0.0

### Patch Changes

- Updated dependencies [01f32b4]
  - @commet/node@2.0.0

## 0.2.5

### Patch Changes

- Updated dependencies [37ded39]
  - @commet/node@1.10.0

## 0.2.4

### Patch Changes

- Updated dependencies [06d0041]
  - @commet/node@1.9.0

## 0.2.3

### Patch Changes

- 4c30dbc: Fix build errors: use customerId consistently across all SDK packages and add better-call as dependency to resolve DTS generation
- Updated dependencies [13e0953]
- Updated dependencies [0b1877d]
  - @commet/node@1.8.0

## 0.2.2

### Patch Changes

- d7f25e1: Improve README documentation across all packages. Add getting started guides, intro descriptions, and consistent header with badges so developers can understand and start using each package directly from the README.
- Updated dependencies [d7f25e1]
  - @commet/node@1.7.1

## 0.2.1

### Patch Changes

- e3a9f5b: Fix token usage tracking timeout in serverless environments. Tracking now runs in the stream's `flush()` phase, ensuring it completes before the HTTP connection closes.

## 0.2.0

### Minor Changes

- ac36992: Rename `commetAI` to `tracked` for better readability. The function wraps an AI SDK model to track token usage, and the name now reflects what it returns: a tracked model.

## 0.1.1

### Patch Changes

- b0b4dea: Add README with installation guide, usage examples, and API reference.
- Updated dependencies [b0b4dea]
  - @commet/node@1.7.0
