---
"commet": patch
---

Fix CLI flags that produced requests the API rejected or ignored:

- The plans subcommands (`add-feature`, `update-feature`, `remove-feature`, `add-price`, `update-price`, `delete-price`, `set-default-price`, `set-regional-prices`, `delete-regional-prices`) sent the plan identifier as `planId`, so requests went to `/plans/undefined/...`. The `--plan-id` flag now maps to the `id` param the SDK expects.
- `--overage-enabled`/`--overage-unit-price` and the `--intro-offer-*` flags sent flat keys the API strips. They now build the nested `overage` and `introOffer` objects.
- Removed `--domain`, `--website`, `--language`, and `--industry` from `customers create`/`update` — the API does not accept these fields.
- `features create --type` help now lists the `quota` type.
- The `commet listen` example now uses a real event (`invoice.created`), and the agent help advertises the single MCP endpoint — the organization behind your credentials determines sandbox vs live mode.
