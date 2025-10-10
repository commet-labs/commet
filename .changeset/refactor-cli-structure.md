---
"commet": minor
---

Refactor CLI structure and improve developer experience

**Breaking Changes:**
- File structure changed from `.commet` and `.commet.d.ts` to `.commet/config.json` and `.commet/types.d.ts`
- Users need to delete old files and run `commet link` and `commet pull` again

**New Features:**
- Automatic `tsconfig.json` update when running `commet pull` (adds `.commet/types.d.ts` to include array)
- Automatic `.gitignore` update in both `commet link` and `commet pull` (adds `.commet/` directory)
- Works without `tsconfig.json` or `.gitignore` - shows warnings with instructions instead of failing
- Cleaner output messages without emojis
- Uses `jsonc-parser` to preserve comments and formatting in `tsconfig.json`

**Improvements:**
- Cleaner directory structure with `.commet/` folder containing all generated files
- `commet unlink` now removes entire `.commet/` directory
- Better error messages that are simple and actionable
- Non-blocking warnings when files can't be updated automatically

