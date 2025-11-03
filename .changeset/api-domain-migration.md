---
"commet": minor
---

CLI endpoints migration to NestJS infrastructure

**Breaking Changes:**

- CLI endpoints migrated from Next.js to NestJS:
  - Auth flow stays in web app: `commet.co/api/auth/device/*`
  - Organization and types endpoints now at: `api.commet.co/cli/*`
  - Uses Bearer token authentication with Better Auth

**What Changed:**

- Device auth flow remains on web app (unchanged user experience)
- Organization and types endpoints migrated to NestJS API
- New URL functions: `getWebBaseURL()` for auth, `getApiBaseURL()` for data
- CLI now connects to NestJS API for organizations and type definitions

**Migration:**

Users need to update to the latest CLI version. No changes to usage required - `commet login`, `commet link`, and `commet pull` work exactly the same way.

