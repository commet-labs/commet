---
"@commet/ai-sdk": patch
---

Fix token usage tracking timeout in serverless environments. Tracking now runs in the stream's `flush()` phase, ensuring it completes before the HTTP connection closes.
