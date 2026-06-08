---
"@commet/better-auth": patch
---

Fix customer hooks against the contract: look customers up by `externalId` instead of the unsupported `search` filter (which also fixes update lookups breaking after an email change), read `customer.email` instead of the renamed `billingEmail`, and drop the `domain` field the API never accepted on create.
