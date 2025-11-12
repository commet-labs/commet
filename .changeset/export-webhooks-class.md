---
"@commet/node": patch
---

Export Webhooks class for direct usage in framework integrations

The `Webhooks` class is now exported from the main package, allowing framework-specific packages like `@commet/next` to use it for signature verification without instantiating a full Commet client.

