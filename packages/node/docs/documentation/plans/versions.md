---
lastModified: 2026-10-04
title: Plan versions
description: Publish complete plan terms and explicitly move subscribers between versions.
---

A plan version contains its intervals, prices by country, included allowances, feature rates and limits, introductory offer assignments, add-ons, and credit packs. The plan's free/paid setting and consumption model are chosen when the plan is created and cannot change between versions.

## Draft and publish

Open **Plans → your plan → Versions**. Create a draft from the main version or another publication, edit its terms, and save. Drafts do not change purchases or existing subscriptions. Publish as **main** to serve ordinary new purchases, or publish for **testing** to allow explicit version selection. Promoting a test version makes it main for new purchases.

Published terms are immutable. Create another draft for subsequent changes. The history starts with the representative version already in use when version authoring begins; it does not reconstruct older edits.

## API version

These endpoints require `commet-version: 2026-10-04`. An explicit header takes precedence over the organization's pinned version. Requests without either use the current API version.

| Operation          | Endpoint                                             |
| ------------------ | ---------------------------------------------------- |
| List versions      | `GET /v1/plans/{id}/versions`                        |
| Create draft       | `POST /v1/plans/{id}/versions`                       |
| Read or edit draft | `GET` or `PATCH /v1/plans/{id}/versions/{versionId}` |
| Publish draft      | `POST /v1/plans/{id}/versions/{versionId}/publish`   |
| Promote to main    | `POST /v1/plans/{id}/versions/{versionId}/promote`   |
| Retire from sale   | `POST /v1/plans/{id}/versions/{versionId}/retire`    |
| Discard draft      | `DELETE /v1/plans/{id}/versions/{versionId}`         |

Updates require the current `expectedRevision`. Publication, promotion and retirement also require `expectedMainVersionId`; a conflict returns 409. Reload before deciding whether to retry.

Pass `planVersionId` when creating a subscription to select a sellable version explicitly. Omit it for the main version. Pending checkout retries retain the terms already accepted, including their interval. Retiring a version prevents new purchases and preserves accepted subscriptions.

## Move subscribers within a plan

Publishing does not move subscribers. From a version's subscriber list, select a subset, choose a target and timing, preview compatibility, and confirm. Each subscription is evaluated independently. The subscription detail also supports previewing, scheduling and canceling its move.

Use `POST /v1/subscriptions/{id}/version-adoptions/preview`, then `POST /v1/subscriptions/{id}/version-adoptions` with `versionId` and `timing`:

- `next_cycle` (default): apply at the next billing renewal, not an intermediate monthly allowance reset on an annual subscription. Closing usage uses the source terms; the new period uses the target terms.
- `now`: apply the complete target terms immediately when compatible. There is no immediate prorated price adjustment. Usage billed later in the current period uses the target rates, including usage recorded before the move.

An incompatible seat/quota limit, insufficient allowance, missing interval/currency price, or unavailable acquired add-on keeps the subscription on its source version. The request remains pending until it can apply or is canceled. Purchased credits remain separate from the plan allowance. Different-plan changes retain their existing scheduling and proration rules.

Read the accepted version through `GET /v1/subscriptions/{id}/plan-version`. Read requests through `GET /v1/subscriptions/{id}/version-adoptions` and cancel a pending request with `DELETE /v1/subscriptions/{id}/version-adoptions/{adoptionId}`.

## Extras and offers

Add-ons and credit packs must be included in the version with explicit currency prices before they can be purchased. Creating a legacy organization-level extra creates a pending catalog identity; it does not offer that extra on every plan. Previously acquired add-ons and purchased credits remain on their subscriptions.

Versions reference shared introductory Offer IDs. Editing an Offer's definition does not create a plan version. An accepted subscription preserves its applied offer terms. Promotional, card and directly assigned offers remain independent of version publication.

## Older integrations

Existing API versions retain their paths and response shapes. New version endpoints are unavailable and `planVersionId` is rejected on those versions. Country-only data is projected for legacy currency readers using the first configured country in creation order, with country code as a stable tie-breaker. Ambiguous legacy writes are rejected without partially updating countries.

Two intentional behavior changes apply to legacy writers: plan edits affect new purchases while accepted subscribers retain their terms; creating an add-on or credit pack no longer makes it globally purchasable. Update the integration to API `2026-10-04` to author complete versions and request explicit subscriber moves.
