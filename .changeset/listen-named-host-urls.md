---
"commet": patch
---

fix(listen): accept full URLs without an explicit port. `commet listen https://app.localhost/webhooks` now works, so apps served behind named-host dev proxies (portless and similar) can receive forwarded events. A port is still required for the bare `host:port` shorthand.
