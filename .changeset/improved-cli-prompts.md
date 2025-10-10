---
"commet": patch
---

Improved CLI authentication flow and user experience

**Breaking behavior change:**
- Environment (sandbox/production) is now selected during `commet login` instead of `commet link`
- The access token is tied to the selected environment, making it more secure and straightforward
- `commet link` and `commet switch` now only prompt for organization selection

**UI improvements:**
- Migrated from `inquirer` to `@inquirer/prompts` for better theming support
- Added custom Commet brand color (#A0DED4) with mint highlighting for selected options
- Added graceful Ctrl+C handling with clean exit messages instead of stack traces
- Improved visual feedback: only the currently selected option is highlighted in color

