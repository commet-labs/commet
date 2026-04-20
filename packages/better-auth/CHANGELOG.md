# @commet/better-auth

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
