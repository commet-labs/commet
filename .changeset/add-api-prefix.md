---
"commet": patch
"@commet/node": patch
---

Add /api prefix to all endpoint URLs

**Changes:**
- SDK now automatically prefixes all endpoints with `/api`
- CLI commands now include `/api` prefix in URLs
- Ensures compatibility with Next.js API routes structure

**Impact:**
- SDK endpoints: `/customers` → `/api/customers`
- CLI endpoints: `/cli/organizations` → `/api/cli/organizations`
- Auth endpoints already had `/api` prefix (unchanged)

**Examples:**
- Before: `https://commet.co/customers` ❌
- After: `https://commet.co/api/customers` ✅

