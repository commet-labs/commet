---
"@commet/node": minor
---

Add execution-context telemetry: the SDK now detects when it runs under a test runner (Vitest/Jest/Bun) or CI and reports it via the `commet-client-info` header, so the platform can flag requests that came from a test pointed at the live API instead of a mock.

Also aligns the client-info field names to snake_case (`sdk_version`, `lang_version`, `runtime_version`) to match what the platform reads — previously these were sent as camelCase and silently dropped server-side.
