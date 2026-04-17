---
"commet": minor
---

`commet create` now resolves `workspace:*` dependencies to the latest published npm version when scaffolding a project. This lets the monorepo link `examples/*` to local packages for immediate feedback, while users who run `commet create` get a standalone project with real installable versions.
