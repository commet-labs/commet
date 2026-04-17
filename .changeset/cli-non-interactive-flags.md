---
"commet": minor
---

`commet create` now supports fully non-interactive usage for CI, scripts, and AI coding agents. Every prompt has an equivalent flag, and missing required inputs fail fast with a helpful message instead of hanging.

New flags:
- `--org <slug>` — select organization by slug or ID
- `--skills` / `--no-skills` — skip the agent skills prompt
- `-y, --yes` — accept defaults for optional prompts

Non-TTY detection: when stdin is not a TTY, missing inputs produce a clear error listing the required flag and available values, rather than silently hanging on an inquirer prompt.

Example:
```bash
commet create my-app --template=fixed --org=my-sandbox --no-skills
```
