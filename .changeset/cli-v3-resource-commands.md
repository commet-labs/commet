---
"commet": minor
---

Add resource commands to CLI and fix API key prefix.

**CLI:**

- 15 resources with 86 subcommands — every SDK method available as `commet <resource> <action> [--flags]`
- `commet link` auto-generates and stores an API key for the linked org
- `commet --output agent` now includes full resource schema for agent discovery
- `commet api-key` deprecated in favor of `commet api-keys create`
- Declarative registry + factory pattern — no per-resource command files