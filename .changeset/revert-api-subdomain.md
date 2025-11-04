---
"commet": patch
"@commet/node": patch
---

Revert API subdomain migration - consolidate to main domains

**Changes:**
- Production endpoint: `https://api.commet.co` → `https://commet.co`
- Sandbox endpoint: `https://api.sandbox.commet.co` → `https://sandbox.commet.co`
- Consolidated `getWebBaseURL()` and `getApiBaseURL()` into single `getBaseURL()` function
- All API routes remain at `/api/*` path within these domains

**Impact:**
- SDK and CLI now use main domains instead of api subdomains
- No code changes required for SDK users - only internal URL changes
- CLI users may need to re-authenticate if experiencing connection issues

**Example:**
- Before: `https://api.commet.co/customers`
- After: `https://commet.co/api/customers`

