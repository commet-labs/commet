---
"@commet/node": minor
---

Add customer portal access generation

New `portal.requestAccess()` method to generate secure portal URLs for customers. Supports three mutually exclusive identifiers: `externalId`, `customerId`, or `email`. TypeScript enforces proper usage through discriminated union types.

