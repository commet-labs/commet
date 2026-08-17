---
lastModified: 2026-08-16
title: Balance and Top-Ups
description: Understand recurring balance, paid top-ups, administrative adjustments, and reset behavior.
---

A Balance plan includes a monetary allowance that usage draws down. The balance amount is part of the subscription's consumption model; it is not invoice credit.

## What changes the balance?

- A plan reset restores the configured plan amount.
- A paid top-up charges the saved payment method and adds balance.
- An administrative adjustment adds or removes balance without charging.
- A usage event subtracts the feature's calculated monetary cost.

Plan balance resets monthly for monthly, quarterly, yearly, free, and one-time plans. Weekly plans reset every seven days. **Top-ups reset with the plan balance; they do not persist like credit packs.**

Use Credits instead when purchased units must remain across resets. Use Customer Credits when the goal is to reduce an invoice rather than fund product usage.

Before expensive work, check the current allowance. Track the event only after the work completes and use an idempotency key so retries do not deduct twice.

See [Balance and Top-Ups](/docs/balance-and-top-ups) for dashboard and API steps.
