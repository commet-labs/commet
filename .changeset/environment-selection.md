---
"commet": patch
---

Add environment selection during login to support isolated sandbox and production platforms

- Login now prompts user to select between Sandbox (sandbox.commet.co) and Production (billing.commet.co)
- Authentication tokens are now environment-specific
- Updated URLs: sandbox uses sandbox.commet.co, production uses billing.commet.co
- Link and switch commands now use the authenticated environment instead of hardcoded sandbox
- Updated documentation to clarify that sandbox and production are completely isolated platforms

**Breaking Change**: Users will need to re-authenticate after upgrading to select their environment.

