---
"@commet/node": major
---

API versioning support: SDK now targets `/api/v1` and always sends `commet-version` header pinned to the release version. Adds `apiVersion` option to both `CommetConfig` (client-level) and `RequestOptions` (per-request override). Exports `API_VERSION` constant.
