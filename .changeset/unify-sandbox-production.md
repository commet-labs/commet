---
"@commet/node": major
"@commet/better-auth": patch
"@commet/next": minor
"commet": minor
---

Unify sandbox and production into a single environment. Sandbox no longer exists — everything runs on `https://commet.co`.

**@commet/node (breaking):** Removed the `environment` option from `CommetConfig`. Also removed `isSandbox()`, `isProduction()`, `getEnvironment()`, and the `Environment` type. If you were passing `environment: "production"`, just drop the line.

```diff
const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY,
-  environment: "production",
});
```

**commet (CLI):** Removed the sandbox/production selector from `commet login` and `commet create`. The `environment` field is no longer written to `~/.commet/auth.json` or `.commet/config.json` (existing files still load, the field is ignored). The sandbox-only restriction on `commet create` is gone — templates can be created in any organization.

**@commet/next:** Removed the `environment` option from `CustomerPortal` route handler config.

**@commet/better-auth:** Docs-only update to reflect the simpler `Commet` constructor shape.
