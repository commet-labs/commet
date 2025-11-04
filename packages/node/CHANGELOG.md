# @commet/node

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