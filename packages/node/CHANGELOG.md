# @commet/node

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
    process.env.COMMET_WEBHOOK_SECRET,
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
