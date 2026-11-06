---
title: Plan Versions
description: "Edit a plan without changing what existing subscribers pay: publish a new version or an experiment, then move subscribers when you choose."
---

Every subscription is pinned to one version of its plan. A version holds the complete terms: prices, trials, features, credit and balance rules, add-ons, credit packs, and country prices. The plan points at its current version, which every new buyer gets.

Editing a plan publishes a new version and moves nobody. Existing subscribers keep the prices, features, and rules of their version, at renewal too, until you move them.

## What a version holds

| Versioned                                                                            | Not versioned                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Prices per billing interval, trial days, and the interval shown first                | Name and description                                   |
| The Introductory Offer of each price                                                 | Visibility                                             |
| Features, included amounts, overage prices, and limits                               | [Market](/docs/regional-prices#create-a-market) prices |
| Credit and balance rules: carry-over, spending limits, credit purchases, and top-ups |                                                        |
| The add-ons and credit packs the plan sells, with their prices                       |                                                        |
| Countries with their currency and prices                                             |                                                        |

**Edit details** changes the name, description, and visibility at once, for everyone. Market prices apply to every version: an edit to a Market price reaches the subscribers who pay it at their next renewal.

The plan's versions are numbered 1, 2, 3. An experiment's own versions carry its code, such as `price-test 2`.

## Edit in the dashboard

Open a plan from **Plans**. Its page has four tabs: **Plan**, **Regional prices**, **Subscribers**, and **History**. The version menu opens the current version, drafts, experiments, and older versions.

1. Edit any version. The first change starts a draft from it. A draft is saved as you edit, and nobody sees it until you publish it.
2. Open **Changes in this draft** to review the changes or undo any of them, or choose **Discard draft**.
3. Choose **Review and publish**, then publish it as:
   - **The current version**, which new buyers get.
   - **A new experiment**, sold only through its own code. Only for drafts started from the current version.
   - **Next version of an experiment**, for drafts started from an experiment's latest version.
4. Choose what happens to subscribers of earlier versions: **Keep them on their version**, **Move them at their next renewal**, or **Move them now**. When some of them don't fit the new version, the dialog lists each one with what would make it fit.

A draft publishes exactly its content. A draft started from an older version undoes what later versions changed, and the review lists those changes.

Publishing stops while a country is missing a price, or when the current version would drop the trial without a payment method of the plan group's [signup trial](/docs/plan-groups#default-plan-and-signup-trial).

To move subscribers later, open **Subscribers**, select them, and choose **Move to another version**.

## Edit through the API

Every plan edit made through the API, MCP, or the CLI publishes a new current version at once and moves nobody. That includes adding, changing, or removing prices and features, regional pricing, and the credit and balance rules of `PATCH /plans/{id}`. New buyers get the new version; existing subscribers stay on theirs until you [move them](#move-subscribers).

To prepare several changes and publish them together, start a draft:

```bash
curl -X POST https://commet.co/api/v1/plans/pln_xxx/drafts \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{}'
```

The draft starts from the current version unless you send `fromVersionId`. Change it with `PATCH /plans/{id}/drafts/{draftId}` and the blocks `prices`, `countries`, `rules`, and `undo`. Each block you send replaces that block, so `prices` lists every interval the draft sells:

```bash
curl -X PATCH https://commet.co/api/v1/plans/pln_xxx/drafts/plr_draft \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"prices":[{"billingInterval":"monthly","price":5900,"isDefault":true},{"billingInterval":"yearly","price":59000}]}'
```

Publish it with `"preview": true` first to check everything without publishing:

```bash
curl -X POST https://commet.co/api/v1/plans/pln_xxx/drafts/plr_draft/publish \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"publishAs":"current","move":"period_end","preview":true}'
```

| Field       | Values                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| `publishAs` | `current`, `experiment` with `experimentCode`, or `experiment_version`                                       |
| `move`      | `keep` (default), `period_end`, or `now`, for subscribers of earlier versions. An experiment takes no `move` |
| `changes`   | Per-subscriber changes that make each one fit. See [Resolve conflicts](#resolve-conflicts)                   |

Features and the add-ons and credit packs a plan sells are not part of an API draft: their own endpoints publish a new version at once. Introductory Offers are set in a dashboard draft.

`POST /plans/{id}/versions` publishes a new current version without a draft. It changes only money terms: prices, included credits or balance, per-currency amounts, and the carry-over cap.

## Move subscribers

Only you move subscribers, and a move changes a subscription's version, never its plan. Move one subscription with `change-version`:

```bash
curl -X POST https://commet.co/api/v1/subscriptions/sub_xxx/change-version \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"planVersionId":"plr_new","effective":"period_end"}'
```

Repeating the same request changes nothing, and a new one replaces the pending move. Move many at once with `POST /plans/{id}/moves`, sending `subscriptionIds` (up to 10,000) or `fromVersionId` to move every subscription of that version:

```bash
curl -X POST https://commet.co/api/v1/plans/pln_xxx/moves \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"fromVersionId":"plr_old","toVersionId":"plr_new","effective":"period_end","preview":true}'
```

| `effective`  | What changes                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `now`        | Features, limits, and included credits or balance change today, without resetting usage. The new price is charged from the next renewal |
| `period_end` | Everything changes at the next renewal                                                                                                  |

A move never prorates or refunds. With `now`, a larger included amount first pays any plan credit or balance debt, a smaller one never creates new debt, and purchased credits and balance are untouched.

### What a move keeps

- **Currency, country, interval, and price.** A move never changes a subscription's currency. A version that doesn't sell its currency returns `422 missing_regional_price`, and one that doesn't sell the price it pays returns `404 price_not_found`.
- **Market prices.** A subscription that pays a Market price keeps paying it.
- **Free or paid.** A free version moves only to a free version, and a paid one only to a paid one (`400 validation_error`).

### Who can move

- Subscriptions move only to a newer version (`422 version_not_newer`). One on a running experiment moves only to a later version of that experiment.
- Only `active`, `trialing`, and `past_due` subscriptions move. A plan move leaves out the others, such as paused ones, and listed subscriptions already on the destination; they stay on their version. A scheduled cancellation, pause, downgrade, or interval change doesn't leave a subscription out.
- An active add-on the version doesn't sell (`409 addon_unavailable`), or more seats than the version allows (`400 seat_limit_exceeded`), keeps a subscription from moving until you resolve it.

### Resolve conflicts

A plan move, a publish with `move`, and an experiment archive check every subscriber first. If any of them doesn't fit, nobody moves and the response is `409 subscribers_do_not_fit`, listing each one with the reasons. Send a change for each one in `changes`:

| Change                | Effect at the subscriber's renewal             |
| --------------------- | ---------------------------------------------- |
| `billingInterval`     | Moves it to another interval the version sells |
| `seatLimit: true`     | Lowers its seats to the version's limit        |
| `removeAddonIds`      | Stops charging the listed add-ons              |
| `keepOnVersion: true` | Leaves it on its version                       |

```json
{
  "fromVersionId": "plr_old",
  "toVersionId": "plr_new",
  "effective": "now",
  "changes": [{ "subscriptionId": "sub_xxx", "removeAddonIds": ["adn_xxx"] }]
}
```

A subscriber with a change always moves at its renewal, even in a move made now.

### Track and cancel moves

- `GET /plans/{id}/moves/{moveId}` reports each subscriber as `moving`, `moved`, `needs_a_change`, `left_out`, `canceled`, or `kept_on_version`.
- `POST /plans/{id}/moves/{moveId}/cancel` cancels the move for everyone who hasn't moved yet. `POST /plans/{id}/moves/{moveId}/subscriptions/{subscriptionId}/cancel` cancels it for one.
- `DELETE /subscriptions/{id}/scheduled-version-change` revokes one subscription's pending move.

A move scheduled for renewal is checked again at the renewal. If the subscription no longer fits, it renews on its version and appears in `GET /plans/{id}/needs-a-change` and under **Needs a change** on the Subscribers tab. Move it again with a change, or leave it with `POST /plans/{id}/needs-a-change/{subscriptionId}/keep`.

## Run an experiment

An experiment sells a version only to the buyers you send to it; everyone else keeps buying the current version. Publish a draft started from the current version as **A new experiment**, or create one with `POST /plans/{id}/experiments`. Its code uses lowercase letters, numbers, hyphens, and underscores, and is never reused in the plan.

Sell it by sending the experiment code after the plan code:

```bash
curl -X POST https://commet.co/api/v1/subscriptions \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "commet-version: 2026-08-27" \
  -H "Content-Type: application/json" \
  -d '{"customerId":"user_123","planCode":"pro:price-test"}'
```

An unknown experiment code returns `404 plan_experiment_not_found`.

| Action                   | Endpoint                                           | Result                                                                                                                                                             |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Publish its next version | `POST /plans/{id}/experiments/{code}/versions`     | Its code sells the new version; earlier subscribers of the experiment stay on theirs                                                                               |
| Make it current          | `POST /plans/{id}/experiments/{code}/make-current` | Its latest version becomes the plan's current version with the next number. Its subscribers are already on it, and its code sells the current version from then on |
| Archive it               | `POST /plans/{id}/experiments/{code}/archive`      | Its code sells the current version, so links already shared keep working. `subscribers` chooses `keep`, `period_end`, or `now` for its subscribers                 |

Making an experiment current through the API moves nobody else. The dashboard also asks what happens to subscribers of earlier versions.

## Sell a specific version

Send `planVersionId` on `POST /subscriptions` to create the subscription on any published version, current or not, including an experiment's versions. Checkout charges that version's price, and activation grants its credits, add-ons, and credit packs. Sending `planVersionId` with an experiment code returns `400`.

An unpaid checkout keeps the price of the version it was opened on. After you edit the plan, a new `POST /subscriptions` for that customer creates a checkout on the current version and replaces the old one: its invoice is voided and its link stops working.

## Add-ons, credit packs, and countries

Each version lists the add-ons and credit packs it sells, with their prices. Creating or editing an add-on or credit pack publishes a new version of each plan that sells it. A subscriber buys only what its version sells: an add-on or pack added in a newer version returns `409 addon_unavailable` or `409 credit_pack_unavailable` until you move the subscriber. See [Add-ons](/docs/add-ons#add-ons-and-plan-versions) and [Credit Packs](/docs/credit-packs#credit-packs-and-plan-versions).

Each version also sets countries with their own currency and prices. See [Set prices by country](/docs/regional-prices#set-prices-by-country).

## Read versions

| Request                                                                 | Returns                                                                                |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `GET /plans/{id}/versions`                                              | The plan's published versions, newest first, with their prices and subscription counts |
| `GET /plans/{id}/versions/{versionId}`                                  | One version                                                                            |
| `GET /plans/{id}/versions/{versionId}/changes?against={otherVersionId}` | Every term that differs between two versions                                           |

Versions published before Commet recorded every term are not listed, and reading one by ID returns `404 plan_version_not_found`.

Every subscription includes `planVersion`, with its `id` and `label`, and `scheduledVersionChange`, with the `planVersionId`, `label`, and `effectiveAt` of the move pending for its next renewal, or `null`. Filter `GET /subscriptions` by version with `planVersionId`.

## Webhooks

| Event                                                                                         | When it fires                                                                                                                                                         |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`subscription.version_changed`](/docs/webhooks/subscription-version-changed)                 | A subscription changed version: a move made now or a scheduled move at renewal. Making an experiment current moves nobody, so it sends none                           |
| [`subscription.version_change_canceled`](/docs/webhooks/subscription-version-change-canceled) | A pending move will not happen. `reason` is `canceled_by_merchant` when you canceled it, `version_change_failed`, or the code of what the subscription no longer fits |

Both reach only the webhook endpoints that list them. Add them to your endpoint's events to receive them.
