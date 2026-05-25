---
"commet": major
---

Agent-first CLI redesign with COMMET_API_KEY support and telemetry.

**Breaking changes:**
- Removed `agent-info` command — use `commet --output agent` instead
- Removed `switch` command — use `commet link --org <other-org>` instead
- Removed `unlink` command — use `commet link --clear` instead
- Removed `list` command — use `commet pull --dry-run` instead
- Replaced `--json` flag with `--output agent|human` (default: human)
- Error responses changed from `{error: string}` to `{error: {code, message}}`

**New features:**
- `COMMET_API_KEY` env var for CI/agent auth — no login or link required
- `commet api-key` command to generate API keys from the terminal
- `commet link` now handles switch (re-run) and unlink (`--clear`)
- `commet --output agent` returns full capabilities JSON with MCP server URLs
- Client-side telemetry (fire-and-forget, opt-out via DO_NOT_TRACK=1)
- Telemetry headers on all API requests (User-Agent, commet-client-info)
- Crash handler reports uncaught exceptions
- Structured error codes on all error paths
