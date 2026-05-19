---
"@commet/node": minor
"commet": minor
---

feat: config-as-code with `defineConfig()` and `commet push`/`pull`

**@commet/node:**
- Added `defineConfig()` for defining features and plans as code in `commet.config.ts`
- Added `createCommet(config, options)` factory with full type inference from config
- `Commet` and `CustomerContext` are now generic over `TConfig` — `seats.add()` only accepts seat feature codes, `usage.track()` only metered codes, `features.check()` any feature code
- Removed `CommetGeneratedTypes` module augmentation system — types now flow directly from config via `const` generic

**commet (CLI):**
- Added `commet push` — syncs `commet.config.ts` to remote with interactive diff and confirmation
- Updated `commet pull` — generates `commet.config.ts` from remote state with diff before overwriting
- Both commands support `--yes` (skip prompt), `--dry-run` (show diff only), `--json` (structured output for agents/CI)
- Removed `.commet/types.d.ts` generation
