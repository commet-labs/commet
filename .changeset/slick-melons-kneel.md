---
"@commet/better-auth": minor
"@commet/node": minor
---

Removed `usage_metric` table. Usage events now use `feature.code` directly as the event identifier. Updated `usage.track()` to accept `feature` parameter instead of `eventType`.
