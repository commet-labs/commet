---
"@commet/node": minor
---

Add client telemetry headers for SDK usage analytics

- Send `User-Agent` with SDK version, runtime, and platform (e.g. `commet-node/3.0.1 node/22.5.0 darwin/arm64`)
- Send `commet-client-info` header with detailed runtime metadata (SDK version, language, platform, arch, runtime detection for Node/Bun/Deno)
- Send `commet-client-telemetry` header with last request latency metrics (request ID + duration in ms)
- SDK version is now injected from package.json at build time — no manual version tracking
- Opt-out via `new Commet({ apiKey: "...", telemetry: false })`
- Export `SDK_VERSION` constant
