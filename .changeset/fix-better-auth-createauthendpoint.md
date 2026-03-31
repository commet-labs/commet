---
"@commet/better-auth": patch
---

fix: update createAuthEndpoint import to better-auth/api

better-auth 1.5.x moved `createAuthEndpoint` from `better-auth/plugins` to `better-auth/api`. The source was already updated but the published dist was stale.
