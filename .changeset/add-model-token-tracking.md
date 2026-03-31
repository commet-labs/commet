---
'@commet/node': minor
---

Add `TrackModelTokensParams` type for tracking AI model token usage with `inputTokens`, `outputTokens`, and optional cache tokens. `TrackParams` is now a discriminated union of `TrackUsageParams` (value-based) and `TrackModelTokensParams` (token-based).
