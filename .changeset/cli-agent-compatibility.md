---
"commet": minor
---

Improve CLI for both human and agent use

- Add `commet agent-info` command: JSON output with project status, setup hints, and every command's non-interactive usage string
- Add `commet orgs` command: list organizations with `--json` support
- Add `--org <slug-or-id>` flag to `link` and `switch` to skip interactive selection
- Add `--json` flag to `list` for structured output
- Add branded default screen (`commet` with no args) showing status and available commands
- Add detailed `--help` with examples to every command
- Remove `whoami` and `info` (redundant with default screen and agent-info)
- Fix exit codes: all error paths now use `process.exit(1)` consistently
