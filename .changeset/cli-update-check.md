---
"commet": minor
---

Add update notification to CLI. Checks npm registry every 24h and shows a message when a newer version is available. Skipped in agent mode, CI, or when `COMMET_NO_UPDATE_CHECK=1` is set.
