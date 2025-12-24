# @commet/better-auth

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
