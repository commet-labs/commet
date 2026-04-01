# @commet/ai-sdk

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
