---
lastModified: 2026-08-16
title: Examples
description: Explore complete applications for the main Commet billing models and lifecycle patterns.
---

The examples are runnable applications, not isolated API snippets. Each one shows how product state, Commet configuration, server actions, and customer access work together.

## Billing models

| Example                                                                                 | What it demonstrates                                       |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Fixed subscription](https://github.com/commet-labs/commet/tree/main/examples/fixed)    | A recurring plan, checkout, and subscription-backed access |
| [Metered usage](https://github.com/commet-labs/commet/tree/main/examples/metered)       | Included usage, event tracking, and overage                |
| [Credits](https://github.com/commet-labs/commet/tree/main/examples/credits)             | Recurring credits and credit-aware product actions         |
| [Fixed balance](https://github.com/commet-labs/commet/tree/main/examples/balance-fixed) | Prepaid monetary balance and top-ups                       |
| [AI balance](https://github.com/commet-labs/commet/tree/main/examples/balance-ai)       | AI token costs charged against a balance                   |
| [Seats](https://github.com/commet-labs/commet/tree/main/examples/seats)                 | Team membership synchronized with seat quantities          |
| [Quota](https://github.com/commet-labs/commet/tree/main/examples/quota)                 | Capacity checks and quota mutations                        |

## Lifecycle

The [webhooks example](https://github.com/commet-labs/commet/tree/main/examples/webhooks) shows subscription activation, past-due recovery, cancellation, signed event handling, and UI derived from confirmed billing state.

## Run an example

Clone the repository, open one example directory, copy `.env.example`, and use a sandbox API key. Keep the example's database and Commet organization disposable; Test Clock operations and fixture cards are sandbox-only.

```bash
git clone https://github.com/commet-labs/commet.git
cd commet/examples/metered
cp .env.example .env
pnpm install
pnpm dev
```

Read the example together with the relevant conceptual guide. The source shows one implementation; [How Billing Works](/docs/how-does-billing-work) defines the rules that remain true across frameworks.
