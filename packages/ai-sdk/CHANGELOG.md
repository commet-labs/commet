# @commet/ai-sdk

## 0.2.4

### Patch Changes

- Updated dependencies [06d0041]
  - @commet/node@1.9.0

## 0.2.3

### Patch Changes

- 4c30dbc: Fix build errors: use customerId consistently across all SDK packages and add better-call as dependency to resolve DTS generation
- Updated dependencies [13e0953]
- Updated dependencies [0b1877d]
  - @commet/node@1.8.0

## 0.2.2

### Patch Changes

- d7f25e1: Improve README documentation across all packages. Add getting started guides, intro descriptions, and consistent header with badges so developers can understand and start using each package directly from the README.
- Updated dependencies [d7f25e1]
  - @commet/node@1.7.1

## 0.2.1

### Patch Changes

- e3a9f5b: Fix token usage tracking timeout in serverless environments. Tracking now runs in the stream's `flush()` phase, ensuring it completes before the HTTP connection closes.

## 0.2.0

### Minor Changes

- ac36992: Rename `commetAI` to `tracked` for better readability. The function wraps an AI SDK model to track token usage, and the name now reflects what it returns: a tracked model.

## 0.1.1

### Patch Changes

- b0b4dea: Add README with installation guide, usage examples, and API reference.
- Updated dependencies [b0b4dea]
  - @commet/node@1.7.0
