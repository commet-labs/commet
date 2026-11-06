---
"@commet/node": minor
"commet": minor
"@commet/next": minor
---

Sync the Node SDK, the CLI and the Next.js webhooks with the current API `2026-08-27` contract, which adds plan versions:

- Plans have versions. Editing a plan publishes a new version, and existing subscriptions stay on theirs until moved. `plans.listVersions`, `plans.getVersion`, `plans.compareVersions` and `plans.createVersion` read and publish versions; `plans.createDraft`, `plans.updateDraft`, `plans.publishDraft` and the other draft methods prepare one; `plans.createExperiment`, `plans.makeExperimentCurrent`, `plans.archiveExperiment` and the other experiment methods sell a version through its own code; `plans.createMove`, `plans.cancelMove` and the other move methods move subscribers to a newer version; `plans.listSubscribersNeedingAChange` and `plans.keepSubscriberOnVersion` handle the subscribers that do not fit it.
- `subscriptions.changeVersion` moves one subscription to a newer version of its plan, now or at the end of the period, and `subscriptions.revokeScheduledVersionChange` cancels a pending move. Subscriptions return `planVersion` and `scheduledVersionChange`.
- `subscriptions.create` accepts `planVersionId`, and `planCode` as `<plan code>:<experiment code>` to sell an experiment. `subscriptions.list` filters by `planVersionId`.
- Plans return `countries`. `addons.create`, `addons.update`, `creditPacks.create` and `creditPacks.update` accept `planIds`, and add-ons and credit packs return them. `subscriptions.previewChange` returns `deactivatedAddons`.
- New webhook events `subscription.version_changed` and `subscription.version_change_canceled`.
- New errors `plan_version_not_found`, `plan_experiment_not_found`, `subscribers_do_not_fit`, `version_not_newer`, `addon_unavailable` and `credit_pack_unavailable`.

The CLI adds the matching commands and flags, such as `commet plans list-versions`, `commet plans create-move`, `commet subscriptions change-version` and `--plan-version-id`, and `commet push` notes that existing subscriptions stay on their plan version. `@commet/next` adds the `onSubscriptionVersionChanged` and `onSubscriptionVersionChangeCanceled` handlers. The bundled documentation and webhook descriptions match the current contract.
