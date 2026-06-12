---
"@commet/node": minor
---

Rate-limited (429) requests now retry by waiting exactly the `Retry-After` duration reported by the server (capped at 30s) instead of blind exponential backoff. A 429 without a valid `Retry-After` header is no longer retried.