---
"@commet/node": major
"@commet/next": patch
"@commet/ai-sdk": patch
"@commet/better-auth": patch
"commet": patch
---

Generate the complete Node SDK HTTP surface and public wire types from the 2026-07-24 OpenAPI contract.

The v8 SDK returns resources directly, exposes explicit list envelopes, uses `featureCode` and `offerId`, provides `usage.track()` from the contract, and generates webhook endpoint CRUD. Handwritten webhook code now only verifies, parses, and dispatches signed events. Next.js, AI SDK, Better Auth, and CLI integrations are updated for the v8 surface.

Legacy `ApiResponse` and handwritten wire aliases are removed; request options, authentication, retries, idempotency, telemetry, and webhook signature helpers remain handwritten.
