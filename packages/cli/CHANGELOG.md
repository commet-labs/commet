# commet

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
