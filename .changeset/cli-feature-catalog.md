---
"commet": patch
---

The `features` command now manages the feature catalog: `commet features list` returns every feature definition in your organization and `commet features get --code <code>` fetches one. Checking a customer's access moved to the new `feature-access` command group:

- `commet feature-access list --customer-id <id>`
- `commet feature-access get --customer-id <id> --code <code>`
- `commet feature-access can-use --customer-id <id> --code <code>`

`commet pull` / `commet push` continue to read the catalog through `features.list()`; config sync behavior is unchanged.
