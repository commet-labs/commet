---
"commet": patch
---

Fix CLI version display and error handling

**Changes:**
- Version now reads from package.json instead of hardcoded value
- Fixed `--version` command showing error message after displaying version
- Improved error handling for Commander.js exitOverride mode

**Before:**
```bash
$ commet --version
0.3.0
Error: 0.3.0
```

**After:**
```bash
$ commet --version
0.7.1
```

