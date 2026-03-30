# @commet/next

## 0.3.1

### Patch Changes

- a6feeef: fix: skip empty usage columns in PricingMarkdown when no plan has data for a feature

## 0.3.0

### Minor Changes

- 8317ff5: feat: add PricingMarkdown handler for generating pricing pages as markdown

  New `PricingMarkdown` route handler that fetches plans from the Commet API and returns a Resend-style markdown document with pricing tables, usage limits, overage rates, features, and credit packs.

  Also adds `unitName` to `PlanFeature` type for human-readable unit labels in the output.

### Patch Changes

- Updated dependencies [8317ff5]
  - @commet/node@1.6.2

## 0.2.15

### Patch Changes

- 8231f94: Update SDK to handle normalized API response shapes. Error responses now use `code` instead of `error` field. Validation errors use `details` array instead of `errors` object. Success responses no longer include `message` field.
- Updated dependencies [8231f94]
  - @commet/node@1.6.1

## 0.2.14

### Patch Changes

- Updated dependencies [9ab31e6]
  - @commet/node@1.6.0

## 0.2.13

### Patch Changes

- 25481d9: Update next devDependency to 16.1.6 to fix security vulnerabilities (HTTP request deserialization DoS, PPR memory consumption, Image Optimizer DoS)

## 0.2.12

### Patch Changes

- Updated dependencies [6ddf08e]
  - @commet/node@1.5.0

## 0.2.11

### Patch Changes

- Updated dependencies [1a5a14c]
  - @commet/node@1.4.3

## 0.2.10

### Patch Changes

- Updated dependencies [4452a24]
  - @commet/node@1.4.2

## 0.2.9

### Patch Changes

- Updated dependencies [09fe25f]
  - @commet/node@1.4.1

## 0.2.8

### Patch Changes

- Updated dependencies [1e0577a]
  - @commet/node@1.4.0

## 0.2.7

### Patch Changes

- Updated dependencies [3adc517]
  - @commet/node@1.3.0

## 0.2.6

### Patch Changes

- Updated dependencies [c78acc6]
  - @commet/node@1.2.0

## 0.2.5

### Patch Changes

- 6a9d52b: Update Next.js dev dependency from 16.0.3 to 16.0.10

## 0.2.4

### Patch Changes

- Updated dependencies [c505d8f]
  - @commet/node@1.1.1

## 0.2.3

### Patch Changes

- Updated dependencies [d655a3d]
  - @commet/node@1.1.0

## 0.2.2

### Patch Changes

- Updated dependencies [1f619fe]
  - @commet/node@1.0.1

## 0.2.1

### Patch Changes

- Updated dependencies [b9b0b31]
  - @commet/node@1.0.0

## 0.2.0

### Minor Changes

- 1ccbb54: Add CustomerPortal adapter for Next.js

  New CustomerPortal helper creates route handlers for customer portal access with a single function call. Eliminates boilerplate for portal session creation and redirects.

## 0.1.1

### Patch Changes

- Updated dependencies [bb2e7b2]
  - @commet/node@0.11.0

## 0.1.0

### Initial Release

- Declarative webhook handler for Next.js
- Type-safe event handlers with autocomplete
- Automatic signature verification
- Zero boilerplate webhook integration
- Support for all Commet webhook events:
  - `subscription.activated`
  - `subscription.canceled`
  - `subscription.created`
  - `subscription.updated`
