---
"@commet/node": major
"@commet/better-auth": patch
"@commet/next": minor
"commet": minor
---

Unify auth between sandbox and production. A single login now gives access to both live and sandbox organizations.

**@commet/node (breaking):** Removed the `environment` option from `CommetConfig`. Also removed `isSandbox()`, `isProduction()`, `getEnvironment()`, and the `Environment` type. If you were passing `environment: "production"`, just drop the line.

```diff
const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY,
-  environment: "production",
});
```

**commet (CLI):**
- `commet login` no longer prompts for environment — a single token grants access to every org the user can see.
- `commet link` / `commet switch` now list both live and sandbox orgs together, showing the mode next to each.
- `commet create` filters to sandbox orgs automatically (the API still enforces sandbox-only for templates).
- `.commet/config.json` now persists `mode: "live" | "sandbox"` alongside the org; `whoami` and `info` surface it.

**@commet/next:** Removed the `environment` option from `CustomerPortal` route handler config.

**@commet/better-auth:** Docs-only update to reflect the simpler `Commet` constructor shape.
