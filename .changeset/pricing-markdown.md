---
"@commet/next": minor
"@commet/node": patch
---

feat: add PricingMarkdown handler for generating pricing pages as markdown

New `PricingMarkdown` route handler that fetches plans from the Commet API and returns a Resend-style markdown document with pricing tables, usage limits, overage rates, features, and credit packs.

Also adds `unitName` to `PlanFeature` type for human-readable unit labels in the output.
