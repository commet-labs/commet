# commet

## 0.8.0

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

### Patch Changes

- Updated dependencies [54840ff]
  - @commet/node@0.9.0

## 0.7.4

### Patch Changes

- Updated dependencies [694275a]
  - @commet/node@0.8.0

## 0.7.3

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

- Updated dependencies [828c3c3]
  - @commet/node@0.7.2

## 0.7.2

### Patch Changes

- 737ad93: Fix CLI version display and error handling

  **Changes:**
  - Version now reads from package.json instead of hardcoded value
  - Fixed `--version` command showing error message after displaying version
  - Improved error handling for Commander.js exitOverride mode

  **Before:**

  ```bash
  $ commet --version
  0.3.0
  Error: 0.3.0
  ```

  **After:**

  ```bash
  $ commet --version
  0.7.1
  ```

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

- Updated dependencies [4303341]
  - @commet/node@0.7.1

## 0.7.0

### Minor Changes

- 58a1b3a: CLI endpoints migration to NestJS infrastructure

  **Breaking Changes:**
  - CLI endpoints migrated from Next.js to NestJS:
    - Auth flow stays in web app: `commet.co/api/auth/device/*`
    - Organization and types endpoints now at: `api.commet.co/cli/*`
    - Uses Bearer token authentication with Better Auth

  **What Changed:**
  - Device auth flow remains on web app (unchanged user experience)
  - Organization and types endpoints migrated to NestJS API
  - New URL functions: `getWebBaseURL()` for auth, `getApiBaseURL()` for data
  - CLI now connects to NestJS API for organizations and type definitions

  **Migration:**

  Users need to update to the latest CLI version. No changes to usage required - `commet login`, `commet link`, and `commet pull` work exactly the same way.

## 0.6.0

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

### Patch Changes

- Updated dependencies [e128940]
  - @commet/node@0.7.0

## 0.5.2

### Patch Changes

- Updated dependencies [911a17f]
  - @commet/node@0.6.1

## 0.5.1

### Patch Changes

- Updated dependencies [f207723]
  - @commet/node@0.6.0

## 0.5.0

### Minor Changes

- 54590c9: Refactor CLI structure and improve developer experience

  **Breaking Changes:**
  - File structure changed from `.commet` and `.commet.d.ts` to `.commet/config.json` and `.commet/types.d.ts`
  - Users need to delete old files and run `commet link` and `commet pull` again

  **New Features:**
  - Automatic `tsconfig.json` update when running `commet pull` (adds `.commet/types.d.ts` to include array)
  - Automatic `.gitignore` update in both `commet link` and `commet pull` (adds `.commet/` directory)
  - Works without `tsconfig.json` or `.gitignore` - shows warnings with instructions instead of failing
  - Cleaner output messages without emojis
  - Uses `jsonc-parser` to preserve comments and formatting in `tsconfig.json`

  **Improvements:**
  - Cleaner directory structure with `.commet/` folder containing all generated files
  - `commet unlink` now removes entire `.commet/` directory
  - Better error messages that are simple and actionable
  - Non-blocking warnings when files can't be updated automatically

## 0.4.4

### Patch Changes

- ba5f638: Fix TypeScript module augmentation for inquirer theme in generator utility

## 0.4.3

### Patch Changes

- ccc529b: Implement automatic type inference via module augmentation. Types are now automatically applied after running `commet pull` without needing to pass generic type parameters.

  **Breaking change for @commet/node users**: If you were using explicit generic types like `commet.usage.events.create<CommetEventType>()`, you can now simply use `commet.usage.events.create()` and TypeScript will automatically infer the correct types.

  **CLI improvement**: The generated `.commet.d.ts` file is now simpler and only contains the module augmentation declaration, removing the exported `CommetEventType` and `CommetSeatType` types that are no longer needed.

- Updated dependencies [ccc529b]
  - @commet/node@0.5.0

## 0.4.2

### Patch Changes

- af8c080: Improved CLI authentication flow and user experience

  **Breaking behavior change:**
  - Environment (sandbox/production) is now selected during `commet login` instead of `commet link`
  - The access token is tied to the selected environment, making it more secure and straightforward
  - `commet link` and `commet switch` now only prompt for organization selection

  **UI improvements:**
  - Migrated from `inquirer` to `@inquirer/prompts` for better theming support
  - Added custom Commet brand color (#A0DED4) with mint highlighting for selected options
  - Added graceful Ctrl+C handling with clean exit messages instead of stack traces
  - Improved visual feedback: only the currently selected option is highlighted in color

## 0.4.1

### Patch Changes

- dfc4cca: Add environment selection during login to support isolated sandbox and production platforms
  - Login now prompts user to select between Sandbox (sandbox.commet.co) and Production (billing.commet.co)
  - Authentication tokens are now environment-specific
  - Updated URLs: sandbox uses sandbox.commet.co, production uses billing.commet.co
  - Link and switch commands now use the authenticated environment instead of hardcoded sandbox
  - Updated documentation to clarify that sandbox and production are completely isolated platforms

  **Breaking Change**: Users will need to re-authenticate after upgrading to select their environment.

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

### Patch Changes

- Updated dependencies [836b309]
  - @commet/node@0.4.0
