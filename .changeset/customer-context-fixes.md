---
"@commet/node": patch
---

### CustomerContext fixes

- Fixed `customer.portal.getUrl()` using wrong endpoint (was GET `/portal/url`, now correctly uses POST `/portal/request-access`)
- Refactored `CustomerContext` to delegate to existing resources.

