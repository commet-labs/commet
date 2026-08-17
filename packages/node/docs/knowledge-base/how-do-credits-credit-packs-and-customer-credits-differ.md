---
lastModified: 2026-08-17
title: Credits, Credit Packs, and Customer Credits
description: Choose the correct credit mechanism based on what the customer receives and how it expires.
---

These mechanisms share a name but affect different ledgers.

| Mechanism           | Represents                                                     | Reset or expiry                    | Used by                              |
| ------------------- | -------------------------------------------------------------- | ---------------------------------- | ------------------------------------ |
| **Plan credits**    | Recurring product units included in a Credits plan             | Reset with the plan allowance      | Usage events                         |
| **Credit pack**     | Product units the customer buys                                | Persists across plan resets        | Usage events after recurring credits |
| **Customer credit** | Money that reduces eligible recurring invoices in one currency | Optional expiration; consumed FIFO | Invoice calculation before tax       |
| **Plan grant**      | Temporary access beyond the subscribed plan                    | Ends when revoked or expired       | Feature access, not a credit ledger  |

Use plan credits and packs when the customer thinks in actions such as generations or exports. Use customer credit when the adjustment is monetary, such as USD 25 after a service incident. Use a plan grant when no invoice should exist at all.

Revoking unused customer credit does not rewrite invoices that already consumed it. Purchased credit packs do not disappear at the next plan reset.

See [Credit Packs](/docs/credit-packs), [Customer Credits](/docs/customer-credits), and [Plan Grants](/docs/plan-grants) for implementation.
