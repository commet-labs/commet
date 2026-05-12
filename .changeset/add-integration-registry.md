---
"@commet/node": minor
"@commet/next": minor
"@commet/ai-sdk": minor
"@commet/better-auth": minor
---

Add integration registry to telemetry headers

- `@commet/node` exports `registerIntegration(name, version)` and includes an `integrations` array in the `commet-client-info` header
- `@commet/next`, `@commet/ai-sdk`, and `@commet/better-auth` auto-register on import
- Server sees which integration packages are in use per request (e.g. `["@commet/next@0.4.2", "@commet/better-auth@3.0.0"]`)
- Integration versions injected at build time via tsup — no manual tracking
