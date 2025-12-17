---
"@commet/better-auth": patch
---

Simplified client API for feature methods and fixed route paths

- Changed `features.get`, `features.check`, and `features.canUse` to accept `code: string` directly instead of `{ code: string }` object
- Fixed incorrect URL paths for `features.check` and `features.canUse` (was `/features/...`, now `/commet/features/...`)
- Simplified `seats.setAll` to accept `Record<string, number>` directly instead of `{ seats: Record<string, number> }`

