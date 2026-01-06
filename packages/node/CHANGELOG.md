# @commet/node

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
