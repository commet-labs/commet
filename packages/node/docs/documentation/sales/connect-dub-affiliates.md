---
title: Connect Dub Affiliates
description: Connect Dub so partners earn commission on every sale Commet charges, and sync Dub partner discounts and codes as Offers and promo codes.
---

Dub is an affiliate platform. Connected to Commet, it receives every sale Commet charges so partners earn their commission, and its partner discounts and codes become [Offers](/docs/offers) and [promo codes](/docs/promo-codes).

## 1. Connect Dub

Open **Settings → Integrations**, and on the Dub card choose **Connect**. Paste an API key from your Dub workspace.

- Live organizations need a Dub workspace on the Business plan or higher and an API key with All permissions.
- Sandbox organizations use a Dub staging workspace. Partner emails still go out, and no payouts are made.

Commet validates the key by reading your Dub catalog and stores it encrypted. Only owners and admins can connect or manage Dub.

## 2. Sync partner codes

On the Dub card, choose **Manage** and copy the **Code sync** URL. In Dub, go to **Settings → Webhooks** and create a webhook with that URL and the `discount_code.created` and `discount_code.deleted` events.

Each event makes Commet read the Dub catalog again. Without the webhook, new codes don't reach Commet.

## How Dub records appear in Commet

| In Dub           | In Commet                                                        |
| ---------------- | ---------------------------------------------------------------- |
| Partner discount | Offer with `managedBy: "dub"`                                    |
| Partner code     | Promo code with `firstPurchaseOnly: true` and `managedBy: "dub"` |

Their terms change only in Dub. Editing them in Commet returns `409 managed_by_integration`. Renaming an Offer and activating or deactivating a code still work.

A Dub code whose text already exists as a Commet promo code is not imported. **Manage** lists it under **Codes not imported**.

## What Commet sends to Dub

Sales match Dub customers by the customer's `externalId`, the same ID you track leads with in Dub.

- Every invoice Commet charges is sent as a sale.
- Refunds mark the sale refunded.
- Cancellations, trial starts, customer updates, and code deletions are sent too.

Commet retries a failed send for up to 3 days. Billing is never affected. Sends that still fail appear under **Not reaching Dub** in **Manage**, with **Resend**.

## Disconnect Dub

Choose **Disconnect** in **Manage**. Commet stops sending sales, refunds, and subscription changes to Dub, and stops following its discounts and codes. Their Offers and promo codes keep working as regular ones.

## Limitations

- Invoices first charged before Dub was connected are not sent.
- Term changes in Dub reach Commet on the next code sync event.
- Dub codes are first-purchase only: customers who already paid are refused with `first_purchase_only`.
