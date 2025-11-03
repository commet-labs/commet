---
"@commet/node": minor
"commet": minor
---

API endpoint migration to NestJS infrastructure

**Breaking Changes:**

- Base URLs updated to new API domains:
  - Sandbox: `https://sandbox.commet.co` → `https://api.sandbox.commet.co`
  - Production: `https://billing.commet.co` → `https://api.commet.co`
- No code changes required on user side - only internal URL changes

**What Changed:**

- HTTP client now points to new API infrastructure
- All endpoints remain the same, only domain changed
- Debug logging shows updated URLs
- CLI now connects to new API endpoints

**Migration:**

Users need to update to the latest version to continue using the SDK. No changes to your code are required. CLI users may need to re-authenticate with `commet login` if experiencing connection issues.

