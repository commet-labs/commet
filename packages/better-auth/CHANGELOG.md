# @commet/better-auth

## 6.0.0

### Patch Changes

- 3d75493: Fix customer hooks against the contract: look customers up by `externalId` instead of the unsupported `search` filter (which also fixes update lookups breaking after an email change), read `customer.email` instead of the renamed `billingEmail`, and drop the `domain` field the API never accepted on create.
- Updated dependencies [3d75493]
- Updated dependencies [3bbdf3e]
  - @commet/node@6.0.0

## 5.0.0

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

## 4.0.0

### Major Changes

- 40158ef: Remove `archive()` method and `isActive` from Customer type. Pin SDK to API version `2026-05-12`.

## 3.1.0

### Minor Changes

- da80a74: Add integration registry to telemetry headers

  - `@commet/node` exports `registerIntegration(name, version)` and includes an `integrations` array in the `commet-client-info` header
  - `@commet/next`, `@commet/ai-sdk`, and `@commet/better-auth` auto-register on import
  - Server sees which integration packages are in use per request (e.g. `["@commet/next@0.4.2", "@commet/better-auth@3.0.0"]`)
  - Integration versions injected at build time via tsup — no manual tracking

## 3.0.0

### Major Changes

- 56ddb2d: Requires `@commet/node` >= 3.0.0 for API versioning support. Relaxed peer dependency ranges from exact pins to minimum versions.

### Patch Changes

- Updated dependencies [184be03]
- Updated dependencies [ed6315a]
  - @commet/node@3.0.0

## 2.0.0

### Patch Changes

- 01f32b4: Unify auth between sandbox and production. A single login now gives access to both live and sandbox organizations.

  **@commet/node (breaking):** Removed the `environment` option from `CommetConfig`. Also removed `isSandbox()`, `isProduction()`, `getEnvironment()`, and the `Environment` type. If you were passing `environment: "production"`, just drop the line.

  ```diff
  const commet = new Commet({
    apiKey: process.env.COMMET_API_KEY,
  -  environment: "production",
  });
  ```

  **commet (CLI):**

  - `commet login` no longer prompts for environment — a single token grants access to every org the user can see.
  - `commet link` / `commet switch` now list both live and sandbox orgs together, showing the mode next to each.
  - `commet create` filters to sandbox orgs automatically (the API still enforces sandbox-only for templates).
  - `.commet/config.json` now persists `mode: "live" | "sandbox"` alongside the org; `whoami` and `info` surface it.

  **@commet/next:** Removed the `environment` option from `CustomerPortal` route handler config.

  **@commet/better-auth:** Docs-only update to reflect the simpler `Commet` constructor shape.

- Updated dependencies [01f32b4]
  - @commet/node@2.0.0

## 1.3.7

### Patch Changes

- 803dfef: Sync webhook event types with the platform.

  - `@commet/node`: expand `WebhookEvent` union to include all 8 events emitted by the platform (`subscription.plan_changed`, `payment.received`, `payment.failed`, `invoice.created`). Type `WebhookData.status` as `SubscriptionStatus` so consumers get autocomplete and exhaustiveness on status switches. Grant access only when status is `"active"` or `"trialing"`; `"pending_payment"` means the first charge has not been confirmed yet — wait for `subscription.activated`.
  - `@commet/better-auth`: add dedicated handlers for the four events that were previously only reachable via `onPayload` — `onSubscriptionPlanChanged`, `onPaymentReceived`, `onPaymentFailed`, `onInvoiceCreated` — so `WebhooksConfig` now covers the full webhook event set.

- Updated dependencies [803dfef]
  - @commet/node@1.10.1

## 1.3.6

### Patch Changes

- 4c30dbc: Fix build errors: use customerId consistently across all SDK packages and add better-call as dependency to resolve DTS generation
- Updated dependencies [13e0953]
- Updated dependencies [0b1877d]
  - @commet/node@1.8.0

## 1.3.5

### Patch Changes

- d7f25e1: Improve README documentation across all packages. Add getting started guides, intro descriptions, and consistent header with badges so developers can understand and start using each package directly from the README.
- Updated dependencies [d7f25e1]
  - @commet/node@1.7.1

## 1.3.4

### Patch Changes

- cf833cb: fix: update createAuthEndpoint import to better-auth/api

  better-auth 1.5.x moved `createAuthEndpoint` from `better-auth/plugins` to `better-auth/api`. The source was already updated but the published dist was stale.

## 1.3.3

### Patch Changes

- Updated dependencies [b0b4dea]
  - @commet/node@1.7.0

## 1.3.2

### Patch Changes

- Updated dependencies [8317ff5]
  - @commet/node@1.6.2

## 1.3.1

### Patch Changes

- Updated dependencies [8231f94]
  - @commet/node@1.6.1

## 1.3.0

### Minor Changes

- 9ab31e6: Remove changePlan from @commet/node and @commet/better-auth, and align free-plan SDK types with current Commet Billing responses.

### Patch Changes

- Updated dependencies [9ab31e6]
  - @commet/node@1.6.0

## 1.2.4

### Patch Changes

- Updated dependencies [6ddf08e]
  - @commet/node@1.5.0

## 1.2.3

### Patch Changes

- Updated dependencies [1a5a14c]
  - @commet/node@1.4.3

## 1.2.2

### Patch Changes

- Updated dependencies [4452a24]
  - @commet/node@1.4.2

## 1.2.1

### Patch Changes

- 09fe25f: Updated dependencies and minor fixes
- Updated dependencies [09fe25f]
  - @commet/node@1.4.1

## 1.2.0

### Minor Changes

- 1e0577a: Removed `usage_metric` table. Usage events now use `feature.code` directly as the event identifier. Updated `usage.track()` to accept `feature` parameter instead of `eventType`.

### Patch Changes

- Updated dependencies [1e0577a]
  - @commet/node@1.4.0

## 1.1.0

### Minor Changes

- 3adc517: Renamed legalName to fullName, removed displayName from Customer schema

### Patch Changes

- Updated dependencies [3adc517]
  - @commet/node@1.3.0

## 1.0.1

### Patch Changes

- 36559e1: Simplified client API for feature methods and fixed route paths

  - Changed `features.get`, `features.check`, and `features.canUse` to accept `code: string` directly instead of `{ code: string }` object
  - Fixed incorrect URL paths for `features.check` and `features.canUse` (was `/features/...`, now `/commet/features/...`)
  - Simplified `seats.setAll` to accept `Record<string, number>` directly instead of `{ seats: Record<string, number> }`
