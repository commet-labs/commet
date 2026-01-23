# @commet/better-auth

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
