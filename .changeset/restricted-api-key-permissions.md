---
"@commet/node": minor
---

Accept restricted API key prefixes and allow `apiKeys.create` to send optional resource permissions. Omit permissions for a full-access key; pass `{}` for a key with no resource grants. The `api_key` resource lets a restricted key list keys (`read`) or create narrower restricted keys (`write`).
