---
"@commet/node": patch
"commet": major
---

Align the CLI with v8 by adding Offers, pricing Market Groups, selectable price variants, Offer-aware subscription flows, and the current customer and subscription fields.

This release replaces `usage track --feature` with `--feature-code`, replaces its inline idempotency key with `--event-id`, replaces `feature-access can-use` with `usage check`, makes Promo Codes reference Promotional Offers, and sends quota idempotency keys as HTTP request options.

Document Offers, pricing Markets, selectable price variants, and the current plan-change behavior in the Node SDK.
