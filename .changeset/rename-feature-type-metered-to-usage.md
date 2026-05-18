---
"@commet/node": minor
"@commet/next": patch
"commet": patch
---

Rename feature type enum value from `metered` to `usage` to disambiguate from the plan consumption model.

Feature types are now `boolean | usage | seats`. The consumption model `metered` is unchanged.
