# @commet/node

## 6.0.0

### Major Changes

- 3d75493: Adds the Payouts and Test Clock APIs and two new lookup methods. Includes breaking changes to intro offers, customer email, and a few exported type names — migration below.

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

### Minor Changes

- 3bbdf3e: Add `cancelAtPeriodEnd` to the `ActiveSubscription` object returned by `subscriptions.getActive()`. It is `true` when a subscription is scheduled to cancel at the end of the current period (a pending cancellation), and `false` otherwise.

## 5.5.1

### Patch Changes

- de7f9e8: Expose `currency` on `PreviewChangeResult` so plan-change previews report the currency their amounts are denominated in.

## 5.5.0

### Minor Changes

- f17426a: Expose enum union types for status/type fields (InvoiceStatus, InvoiceType, TransactionStatus, ConsumptionModel, etc.) that were previously typed as `string`, for better autocomplete and type-safety.

## 5.4.0

### Minor Changes

- c701f18: Add `customIntroOffer` to `subscriptions.create` to pre-apply a custom introductory offer (discountType, discountValue, durationCycles) when assigning a plan, overriding the plan's configured intro offer.

## 5.3.0

### Minor Changes

- 326ff6c: Add `successUrl` to `subscriptions.changePlan()`. When a free→paid plan change routes through checkout, the caller can now pass where to redirect after the payment completes.

## 5.2.0

### Minor Changes

- d8c151a: Add `quota` resource for durable balance tracking (the `quota` feature type). `quota.add`, `quota.set` and `quota.remove` mutate the balance; `quota.get` and `quota.getAll` read the current allowance (units held vs included in the plan, remaining, and whether overage is enabled). `quota` is now a recognized `FeatureType`, so `features.get` and `features.list` return access (current, included, overage and overage price) for quota features too.

  `QuotaAllowance` and `FeatureAccess` also expose `billedQuantity`: the period high-water-mark the customer is billed for (peak units reached, locked in until renewal even if usage drops). Use it instead of `current` to show the effective billed limit.

## 5.1.0

### Minor Changes

- 5149270: Webhook types and per-endpoint API versioning:

  - `WebhookEndpoint.object` is now `"webhook"` (was incorrectly typed as `"webhook_endpoint"`, so equality checks never matched the real payload).
  - `WebhookPayload` now includes `mode` (`"live" | "sandbox"`) and `apiVersion`, which Commet always sends on delivered events.
  - `WebhookTestResult` now includes `deliveryId`, returned by the test endpoint so you can trace the delivery.
  - Removed the phantom `WebhookData.id` field that the API never returns — use `subscriptionId` / `customerId` instead.
  - `webhooks.create` accepts an optional `apiVersion` to pin the endpoint to a specific API version. When omitted, the endpoint inherits the version of the request that creates it (i.e. the SDK's version), so the payloads you receive match the types you parse with.
  - `WebhookEndpoint` now exposes `apiVersion` (the version the endpoint is pinned to).
  - Added `webhooks.update(...)` for the new `PUT /webhooks/{id}` endpoint.

### Patch Changes

- 5b172c0: Add `webhooks.get(...)` to retrieve a single webhook endpoint via `GET /webhooks/{id}`.

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

## 4.6.0

### Minor Changes

- 370bb66: feat: add missing SDK methods and webhook handlers

  @commet/node:

  - Add `subscriptions.changePlan()` for upgrading/downgrading plans
  - Add `usage.check()` for verifying quota before consuming
  - Add `addons.getActive()` for fetching active addons
  - Export `ChangePlanParams`, `ChangePlanResult`, `UncancelParams`, `CheckUsageParams`, `UsageCheckResult`, `ActiveAddon`, `GetActiveAddonsParams` types

  @commet/next:

  - Add `onSubscriptionPlanChanged` webhook handler
  - Add `onPaymentReceived` webhook handler
  - Add `onPaymentFailed` webhook handler
  - Add `onInvoiceCreated` webhook handler

## 4.5.0

### Minor Changes

- dcdc94a: Add `subscriptions.uncancel()` method to revert a scheduled cancellation

## 4.4.1

### Patch Changes

- bdcd4ef: Remove unused `"tiered"` value from `PlanDetailFeature.overage.model` type — the platform no longer supports tiered pricing

## 4.4.0

### Minor Changes

- 1535b32: feat: config-as-code with `defineConfig()` and `commet push`/`pull`

  **@commet/node:**

  - Added `defineConfig()` for defining features and plans as code in `commet.config.ts`
  - Added `createCommet(config, options)` factory with full type inference from config
  - `Commet` and `CustomerContext` are now generic over `TConfig` — `seats.add()` only accepts seat feature codes, `usage.track()` only metered codes, `features.check()` any feature code
  - Removed `CommetGeneratedTypes` module augmentation system — types now flow directly from config via `const` generic

  **commet (CLI):**

  - Added `commet push` — syncs `commet.config.ts` to remote with interactive diff and confirmation
  - Updated `commet pull` — generates `commet.config.ts` from remote state with diff before overwriting
  - Both commands support `--yes` (skip prompt), `--dry-run` (show diff only), `--json` (structured output for agents/CI)
  - Removed `.commet/types.d.ts` generation

## 4.3.0

### Minor Changes

- c3cf2d8: Rename feature type enum value from `metered` to `usage` to disambiguate from the plan consumption model.

  Feature types are now `boolean | usage | seats`. The consumption model `metered` is unchanged.

## 4.2.0

### Minor Changes

- d559237: Add `featureCode` as the recommended param for seats operations (`add`, `remove`, `set`, `getBalance`). The `seatType` param is now deprecated but continues to work. Response objects now include both `featureCode` and `seatType` fields.

## 4.1.0

### Minor Changes

- a9bf1cf: Add `one_time` to `BillingInterval` type for lifetime/one-time payment plans

## 4.0.0

### Major Changes

- 40158ef: Remove `archive()` method and `isActive` from Customer type. Pin SDK to API version `2026-05-12`.

## 3.2.0

### Minor Changes

- da80a74: Add integration registry to telemetry headers

  - `@commet/node` exports `registerIntegration(name, version)` and includes an `integrations` array in the `commet-client-info` header
  - `@commet/next`, `@commet/ai-sdk`, and `@commet/better-auth` auto-register on import
  - Server sees which integration packages are in use per request (e.g. `["@commet/next@0.4.2", "@commet/better-auth@3.0.0"]`)
  - Integration versions injected at build time via tsup — no manual tracking

## 3.1.0

### Minor Changes

- f068bec: Add client telemetry headers for SDK usage analytics

  - Send `User-Agent` with SDK version, runtime, and platform (e.g. `commet-node/3.0.1 node/22.5.0 darwin/arm64`)
  - Send `commet-client-info` header with detailed runtime metadata (SDK version, language, platform, arch, runtime detection for Node/Bun/Deno)
  - Send `commet-client-telemetry` header with last request latency metrics (request ID + duration in ms)
  - SDK version is now injected from package.json at build time — no manual version tracking
  - Opt-out via `new Commet({ apiKey: "...", telemetry: false })`
  - Export `SDK_VERSION` constant

## 3.0.0

### Major Changes

- ed6315a: API versioning support: SDK now targets `/api/v1` and always sends `commet-version` header pinned to the release version. Adds `apiVersion` option to both `CommetConfig` (client-level) and `RequestOptions` (per-request override). Exports `API_VERSION` constant.

### Minor Changes

- 184be03: `commet.subscriptions.get(...)` now exposes scheduled cancellation and discount state.

  `ActiveSubscription` adds two optional nested objects:

  - `cancellation: { scheduledAt, reason, effectiveAt } | null` — populated when a cancellation has been requested but the period has not yet ended. `effectiveAt` is when the subscription will actually finish (= current period end).
  - `discount: { type, value, name, endsAt } | null` — populated when the subscription has an applied discount (promo code, intro offer, etc.).

  Both fields are additive — existing consumers keep working untouched.

  ```ts
  const sub = await commet.subscriptions.get("user_123");
  if (sub?.cancellation) {
    // sub will end on sub.cancellation.effectiveAt
  }
  ```

## 2.0.0

### Major Changes

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

## 1.10.1

### Patch Changes

- 803dfef: Sync webhook event types with the platform.

  - `@commet/node`: expand `WebhookEvent` union to include all 8 events emitted by the platform (`subscription.plan_changed`, `payment.received`, `payment.failed`, `invoice.created`). Type `WebhookData.status` as `SubscriptionStatus` so consumers get autocomplete and exhaustiveness on status switches. Grant access only when status is `"active"` or `"trialing"`; `"pending_payment"` means the first charge has not been confirmed yet — wait for `subscription.activated`.
  - `@commet/better-auth`: add dedicated handlers for the four events that were previously only reachable via `onPayload` — `onSubscriptionPlanChanged`, `onPaymentReceived`, `onPaymentFailed`, `onInvoiceCreated` — so `WebhooksConfig` now covers the full webhook event set.

## 1.10.0

### Minor Changes

- 37ded39: Add `consumptionModel`, `credits`, and `balance` fields to `ActiveSubscription` response from `subscriptions.get()`. Clients can now read credits or balance state for credits/balance plans instead of inferring it. `consumptionModel` is `"metered" | "credits" | "balance"` and indicates which summary (if any) is populated.

## 1.9.0

### Minor Changes

- 06d0041: Add tests, typed error propagation, timeout retry, and version unification

  - Add vitest with 54 tests covering webhooks, HTTP client, retry logic, and error parsing
  - Fix features.check() to propagate API errors instead of swallowing them
  - Remove non-JSON 404 fallback that could hide proxy/CDN errors
  - Retry timeout errors (AbortError/TimeoutError) alongside network errors
  - Remove unused zod dependency
  - Update User-Agent to commet-node/1.9.0

## 1.8.0

### Minor Changes

- 13e0953: Add address support to customer update and refactor customer context to use customerId parameter
- 0b1877d: Replace externalId with id in customers.create for simpler API surface

## 1.7.1

### Patch Changes

- d7f25e1: Improve README documentation across all packages. Add getting started guides, intro descriptions, and consistent header with badges so developers can understand and start using each package directly from the README.

## 1.7.0

### Minor Changes

- b0b4dea: Add `TrackModelTokensParams` type for tracking AI model token usage with `inputTokens`, `outputTokens`, and optional cache tokens. `TrackParams` is now a discriminated union of `TrackUsageParams` (value-based) and `TrackModelTokensParams` (token-based).

### Patch Changes

- b0b4dea: Fix documentation links in READMEs to point to commet.co/docs.

## 1.6.2

### Patch Changes

- 8317ff5: feat: add PricingMarkdown handler for generating pricing pages as markdown

  New `PricingMarkdown` route handler that fetches plans from the Commet API and returns a Resend-style markdown document with pricing tables, usage limits, overage rates, features, and credit packs.

  Also adds `unitName` to `PlanFeature` type for human-readable unit labels in the output.

## 1.6.1

### Patch Changes

- 8231f94: Update SDK to handle normalized API response shapes. Error responses now use `code` instead of `error` field. Validation errors use `details` array instead of `errors` object. Success responses no longer include `message` field.

## 1.6.0

### Minor Changes

- 9ab31e6: Remove changePlan from @commet/node and @commet/better-auth, and align free-plan SDK types with current Commet Billing responses.

## 1.5.0

### Minor Changes

- 6ddf08e: Add creditPacks.list() resource for retrieving active credit packs

## 1.4.3

### Patch Changes

- 1a5a14c: Add optional successUrl parameter to subscriptions.create() for custom checkout redirect

## 1.4.2

### Patch Changes

- 4452a24: Expose plan code field in Plan and PlanDetail types

## 1.4.1

### Patch Changes

- 09fe25f: Updated dependencies and minor fixes

## 1.4.0

### Minor Changes

- 1e0577a: Removed `usage_metric` table. Usage events now use `feature.code` directly as the event identifier. Updated `usage.track()` to accept `feature` parameter instead of `eventType`.

## 1.3.0

### Minor Changes

- 3adc517: Renamed legalName to fullName, removed displayName from Customer schema

## 1.2.0

### Minor Changes

- c78acc6: Normalize SDK method signatures for improved usability

## 1.1.1

### Patch Changes

- c505d8f: ### CustomerContext fixes
  - Fixed `customer.portal.getUrl()` using wrong endpoint (was GET `/portal/url`, now correctly uses POST `/portal/request-access`)
  - Refactored `CustomerContext` to delegate to existing resources.

## 1.1.0

### Minor Changes

- d655a3d: ### Features API

  New `commet.features` resource to check feature access without manual `.find()` on subscription data:

  ```typescript
  // Get feature details with usage
  const seats = await commet.features.get("team_members", userId);
  // { code, name, type, allowed, current, included, remaining, overage, overageUnitPrice }

  // Check boolean feature
  const { allowed } = await commet.features.check("custom_branding", userId);

  // Check if can use one more (metered/seats)
  const { allowed, willBeCharged } = await commet.features.canUse(
    "team_members",
    userId
  );

  // List all features
  const features = await commet.features.list(userId);
  ```

  ### Customer Context

  New `commet.customer()` method returns a scoped context where `externalId` is implicit:

  ```typescript
  const customer = commet.customer(userId);

  // All operations scoped to this customer
  const seats = await customer.features.get("team_members");
  const { allowed } = await customer.features.canUse("team_members");

  await customer.seats.add("member");
  await customer.usage.track("api_call");
  await customer.subscription.get();
  await customer.portal.getUrl();
  ```

  ### FeatureSummary improvements

  Added `overageUnitPrice` to `FeatureSummary` type returned by `subscriptions.get()` for metered and seats features.

## 1.0.1

### Patch Changes

- 1f619fe: Use `GeneratedPlanCode` type in `plans.get()` method for autocomplete support after `commet pull`

## 1.0.0

### Major Changes

- b9b0b31: # Plans-based billing model

  This release introduces a plan-centric approach to subscriptions, replacing the previous item-based model.

  ## @commet/node

  ### New Features

  #### Plans API

  New `commet.plans` resource for listing and retrieving pricing plans:

  ```typescript
  // List all public plans
  const plans = await commet.plans.list();

  // Include private plans
  const allPlans = await commet.plans.list({ includePrivate: true });

  // Get specific plan with full details
  const plan = await commet.plans.get("plan_pro");
  console.log(plan.data.prices); // [{ billingInterval: 'monthly', price: 9900 }]
  console.log(plan.data.features); // [{ code: 'api_calls', type: 'metered', includedAmount: 1000 }]
  ```

  #### Simplified Subscriptions

  Subscribe customers to plans directly:

  ```typescript
  // Create subscription with plan
  const sub = await commet.subscriptions.create({
    externalId: "user_123",
    planId: "plan_pro",
    billingInterval: "monthly",
    initialSeats: { editor: 5 },
  });

  // Get active subscription
  const active = await commet.subscriptions.get({ externalId: "user_123" });

  // Change plan
  await commet.subscriptions.changePlan({
    externalId: "user_123",
    planId: "plan_enterprise",
  });

  // Cancel
  await commet.subscriptions.cancel({ externalId: "user_123" });
  ```

  #### New Type Helpers

  ```typescript
  // Plan and feature type inference from `commet pull`
  type PlanCode = GeneratedPlanCode; // 'starter' | 'pro' | 'enterprise'
  type FeatureCode = GeneratedFeatureCode; // 'api_calls' | 'storage' | 'seats'
  ```

  ### Breaking Changes

  #### Portal API

  Method renamed for clarity:

  ```typescript
  // Before
  await commet.portal.requestAccess({ externalId: "user_123" });

  // After
  await commet.portal.getUrl({ externalId: "user_123" });
  ```

  #### Usage API

  Method renamed to be more intuitive:

  ```typescript
  // Before
  await commet.usage.create({ eventType: 'api_call', customerId: 'cus_123', ... })

  // After
  await commet.usage.track({ eventType: 'api_call', externalId: 'user_123', ... })
  ```

  #### Subscriptions API

  Simplified from items-based to plan-based:

  ```typescript
  // Before
  await commet.subscriptions.create({
    customerId: "cus_123",
    items: [{ priceId: "price_xxx", quantity: 1 }],
  });
  await commet.subscriptions.list({ customerId: "cus_123" });

  // After
  await commet.subscriptions.create({
    externalId: "user_123",
    planId: "plan_pro",
    billingInterval: "monthly",
  });
  await commet.subscriptions.get({ externalId: "user_123" });
  ```

  #### Seats API

  `bulkUpdate` renamed to `setAll`:

  ```typescript
  // Before
  await commet.seats.bulkUpdate({ customerId: 'cus_123', seats: [...] })

  // After
  await commet.seats.setAll({ externalId: 'user_123', seats: [...] })
  ```

  #### Type Exports

  - `GeneratedProductId` deprecated in favor of `GeneratedPlanCode`
  - New `GeneratedFeatureCode` type for feature codes
  - Several param types renamed for consistency (e.g., `CreateParams`, `UpdateParams`)

  #### Environment URL

  Sandbox environment URL changed from `sandbox.commet.co` to `beta.commet.co`.

  ***

  ## commet (CLI)

  ### Breaking Changes

  #### Type Generation

  The `commet pull` comma nd now generates plan and feature types instead of product types:
  The `commet pull` comma nd now generates plan and feature types instead of product types:

  ```typescript
  // Before (.commet/types.d.ts)
  interface CommetGeneratedTypes {
    eventType: "api_call" | "storage_used";
    seatType: "editor" | "viewer";
    productId: "prod_starter" | "prod_pro";
  }

  // After (.commet/types.d.ts)
  interface CommetGeneratedTypes {
    eventType: "api_call" | "storage_used";
    seatType: "editor" | "viewer";
    planCode: "starter" | "pro" | "enterprise";
    featureCode: "api_calls" | "storage" | "seats";
  }
  ```

  #### Environment URL

  Sandbox environment URL changed from `sandbox.commet.co` to `beta.commet.co`.

  ### Migration Guide

  1. Run `commet pull` to regenerate types with new plan/feature codes
  2. Update any code using `GeneratedProductId` to use `GeneratedPlanCode`
  3. If using sandbox environment, CLI will now connect to `beta.commet.co`

## 0.11.0

### Minor Changes

- bb2e7b2: Add customer portal access generation

  New `portal.requestAccess()` method to generate secure portal URLs for customers. Supports three mutually exclusive identifiers: `externalId`, `customerId`, or `email`. TypeScript enforces proper usage through discriminated union types.

## 0.10.1

### Patch Changes

- 9d50b27: Export Webhooks class for direct usage in framework integrations

  The `Webhooks` class is now exported from the main package, allowing framework-specific packages like `@commet/next` to use it for signature verification without instantiating a full Commet client.

## 0.10.0

### Minor Changes

- c9f67b7: Production-ready billing integration with checkout URLs and webhook verification

  ### Checkout URLs

  Subscriptions created with `status: "pending_payment"` now return a `checkoutUrl` for payment collection.

  ```typescript
  const subscription = await commet.subscriptions.create({
    externalId: userId,
    items: [{ priceId: "price-uuid", quantity: 1 }],
    status: "pending_payment", // Generates checkoutUrl
  });

  // Redirect user to payment
  window.location.href = subscription.data.checkoutUrl;
  ```

  ### Webhook Verification

  New `webhooks` resource provides secure signature verification methods.

  ```typescript
  // Verify and parse in one step
  const payload = commet.webhooks.verifyAndParse(
    rawBody,
    request.headers.get("x-commet-signature"),
    process.env.COMMET_WEBHOOK_SECRET
  );

  if (!payload) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Handle verified webhook
  if (payload.event === "subscription.activated") {
    await updateUserStatus(payload.data.externalId, { isPaid: true });
  }
  ```

  **Available methods:**

  - `commet.webhooks.verify(payload, signature, secret)` - Returns boolean
  - `commet.webhooks.verifyAndParse(payload, signature, secret)` - Returns parsed payload or null

  **Supported events:**

  - `subscription.created`
  - `subscription.activated`
  - `subscription.canceled`
  - `subscription.updated`

  ### Breaking Changes

  **Subscription status enum updated:**

  - Added: `pending_payment` (awaiting payment)
  - Status flow: `draft` → `pending_payment` → `active` → `completed`/`canceled`

  **TypeScript changes:**

  ```typescript
  interface Subscription {
    status: "draft" | "pending_payment" | "active" | "completed" | "canceled";
    checkoutUrl?: string; // Present when status is "pending_payment"
  }

  interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    organizationId: string;
    data: WebhookData;
  }
  ```

  ### Migration Guide

  Update subscription status checks:

  ```typescript
  // Before
  if (subscription.status === "draft") {
    /* ... */
  }

  // After
  if (subscription.status === "pending_payment") {
    // Show checkout UI with subscription.checkoutUrl
  }
  ```

  See `examples/fixed-saas` for complete integration example.

## 0.9.0

### Minor Changes

- 54840ff: Add product types to CLI and SDK for automatic type inference

  - CLI now fetches and generates productId types from the organization's products
  - Added products list to the API endpoint `/api/cli/types` in the backend
  - SDK includes new `GeneratedProductId` helper type for type-safe product IDs
  - Updated `CreateSubscriptionParams` to use `GeneratedProductId` for autocomplete support
  - CLI `pull` command now displays products count in the output
  - Generated types file includes all products with names and descriptions in comments
  - Module augmentation now includes `productId` in `CommetGeneratedTypes` interface

  After running `commet pull`, developers get automatic autocomplete for productId when creating subscriptions, matching the existing behavior for eventType and seatType.

## 0.8.0

### Minor Changes

- 694275a: Add simple subscriptions API - Create subscriptions with just productId and customerId. Backend auto-configures pricing, quantities, and billing based on product configuration. Supports fixed, usage-based, and seat-based products.

## 0.7.2

### Patch Changes

- 828c3c3: Add /api prefix to all endpoint URLs

  **Changes:**

  - SDK now automatically prefixes all endpoints with `/api`
  - CLI commands now include `/api` prefix in URLs
  - Ensures compatibility with Next.js API routes structure

  **Impact:**

  - SDK endpoints: `/customers` → `/api/customers`
  - CLI endpoints: `/cli/organizations` → `/api/cli/organizations`
  - Auth endpoints already had `/api` prefix (unchanged)

  **Examples:**

  - Before: `https://commet.co/customers` ❌
  - After: `https://commet.co/api/customers` ✅

## 0.7.1

### Patch Changes

- 4303341: Revert API subdomain migration - consolidate to main domains

  **Changes:**

  - Production endpoint: `https://api.commet.co` → `https://commet.co`
  - Sandbox endpoint: `https://api.sandbox.commet.co` → `https://sandbox.commet.co`
  - Consolidated `getWebBaseURL()` and `getApiBaseURL()` into single `getBaseURL()` function
  - All API routes remain at `/api/*` path within these domains

  **Impact:**

  - SDK and CLI now use main domains instead of api subdomains
  - No code changes required for SDK users - only internal URL changes
  - CLI users may need to re-authenticate if experiencing connection issues

  **Example:**

  - Before: `https://api.commet.co/customers`
  - After: `https://commet.co/api/customers`

## 0.7.0

### Minor Changes

- e128940: API endpoint migration to NestJS infrastructure

  **Breaking Changes:**

  - Base URLs updated to new API domains:
    - Sandbox: `https://sandbox.commet.co` → `https://api.sandbox.commet.co`
    - Production: `https://billing.commet.co` → `https://api.commet.co`
  - No code changes required on user side - only internal URL changes

  **What Changed:**

  - HTTP client now points to new API infrastructure
  - All endpoints remain the same, only domain changed
  - Debug logging shows updated URLs
  - CLI now connects to new API endpoints

  **Migration:**

  Users need to update to the latest version to continue using the SDK. No changes to your code are required. CLI users may need to re-authenticate with `commet login` if experiencing connection issues.

## 0.6.1

### Patch Changes

- 911a17f: Add externalId support to all resource methods. All customer-related operations now accept either `customerId` or `externalId` as an alternative identifier, allowing users to reference customers using their own internal IDs.

  **Changes:**

  - Seats: `add()`, `remove()`, `set()`, `bulkUpdate()`, `getBalance()`, `getAllBalances()`, `listEvents()` now accept `externalId`
  - Usage: `create()`, `createBatch()`, `list()` now accept `externalId`
  - Customers: Already supported `externalId` in create, update, and list operations

  **Example:**

  ```typescript
  // Using externalId instead of customerId
  await commet.seats.add({
    externalId: "stripe_cus_xyz",
    seatType: "admin",
    count: 5,
  });

  await commet.usage.create({
    eventType: "api_call",
    externalId: "my_internal_id_123",
    properties: [{ property: "endpoint", value: "/users" }],
  });
  ```

## 0.6.0

### Minor Changes

- f207723: **Simplified and RESTful API structure**

  ## Usage Events API

  - **BREAKING**: Removed `UsageMetricsResource` - metrics are no longer accessible via SDK
  - **BREAKING**: Simplified `UsageResource` - methods now directly on `commet.usage` instead of `commet.usage.events`
    - `commet.usage.events.create()` → `commet.usage.create()`
    - `commet.usage.events.list()` → `commet.usage.list()`
    - `commet.usage.events.retrieve()` → `commet.usage.retrieve()`
    - `commet.usage.events.delete()` → `commet.usage.delete()`
    - `commet.usage.events.createBatch()` → `commet.usage.createBatch()`

  ## Seats API

  - **BREAKING**: Simplified endpoints to follow RESTful conventions

    - All operations now use `/api/seats` endpoint with proper HTTP verbs
    - `customerId` and `seatType` now sent in request body instead of URL path

  - **Endpoint changes**:

    - `POST /customers/{id}/seats/{type}/add` → `POST /seats` with body `{ customerId, seatType, action: "add", count }`
    - `POST /customers/{id}/seats/{type}/remove` → `DELETE /seats` with body `{ customerId, seatType, count }`
    - `POST /customers/{id}/seats/{type}/set` → `PUT /seats` with body `{ customerId, seatType, count }`
    - `POST /customers/{id}/seats/bulk-update` → `PUT /seats/bulk` with body `{ customerId, seats }`
    - `GET /customers/{id}/seats/{type}/balance` → `GET /seats/balance?customerId=...&seatType=...`
    - `GET /customers/{id}/seats/balances` → `GET /seats/balances?customerId=...`

  - **BREAKING**: Removed `getHistory()` method - use `listEvents()` instead

  ## HTTP Client

  - Enhanced `delete()` method to support request body (valid per HTTP spec)
  - Signature: `delete(endpoint, data?, options?)` instead of `delete(endpoint, options?)`

  ## Migration Guide

  ### Usage Events

  ```typescript
  // Before
  await commet.usage.events.create({ ... });
  await commet.usage.metrics.list();

  // After
  await commet.usage.create({ ... });
  // Metrics are no longer available
  ```

  ### Seats

  ```typescript
  // Before
  await commet.seats.add({
    customerId: "cus_123",
    seatType: "admin",
    count: 5,
  });
  await commet.seats.getHistory({ customerId: "cus_123", seatType: "admin" });

  // After
  await commet.seats.add({
    customerId: "cus_123",
    seatType: "admin",
    count: 5,
  }); // Same API, different backend endpoint
  await commet.seats.listEvents({ customerId: "cus_123", seatType: "admin" }); // Use listEvents instead
  ```

  **Note**: While the SDK method signatures remain mostly the same, the underlying HTTP requests have changed significantly. Backend APIs must be updated accordingly.

## 0.5.0

### Minor Changes

- ccc529b: Implement automatic type inference via module augmentation. Types are now automatically applied after running `commet pull` without needing to pass generic type parameters.

  **Breaking change for @commet/node users**: If you were using explicit generic types like `commet.usage.events.create<CommetEventType>()`, you can now simply use `commet.usage.events.create()` and TypeScript will automatically infer the correct types.

  **CLI improvement**: The generated `.commet.d.ts` file is now simpler and only contains the module augmentation declaration, removing the exported `CommetEventType` and `CommetSeatType` types that are no longer needed.

## 0.4.0

### Minor Changes

- 836b309: Convert to monorepo structure with independent packages

  **Breaking Changes:**

  - SDK package renamed from `commet` to `@commet/node`
  - CLI remains as `commet` but is now a separate package

  **Migration Guide:**

  SDK users need to update their imports:

  ```diff
  - import { Commet } from 'commet';
  + import { Commet } from '@commet/node';
  ```

  CLI users have no changes - all commands remain the same.

  **New Features:**

  - Independent versioning for SDK and CLI
  - Smaller SDK package (no CLI dependencies)
  - Turbo-powered parallel builds
  - Changesets for automated versioning and publishing
  - Biome for fast linting and formatting

  See MIGRATION.md for complete details.
