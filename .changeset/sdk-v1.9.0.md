---
"@commet/node": minor
---

Add tests, typed error propagation, timeout retry, and version unification

- Add vitest with 54 tests covering webhooks, HTTP client, retry logic, and error parsing
- Fix features.check() to propagate API errors instead of swallowing them
- Remove non-JSON 404 fallback that could hide proxy/CDN errors
- Retry timeout errors (AbortError/TimeoutError) alongside network errors
- Remove unused zod dependency
- Update User-Agent to commet-node/1.9.0
