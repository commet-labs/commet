---
title: Consumption Models
description: Understand the three ways customers consume and pay for features in Commet plans.
---

Every plan uses one consumption model that defines how customers consume features and how they're billed. Models are mutually exclusive.

## The three models

| Model       | Description                                                                   | Example Products            |
| ----------- | ----------------------------------------------------------------------------- | --------------------------- |
| **Metered** | Base price + included usage. Overage charged at period end                    | AWS, Twilio, SendGrid       |
| **Credits** | Base price includes credits. Usage consumes credits. Buy packs when exhausted | ChatGPT, Midjourney, Jasper |
| **Balance** | Base price becomes a spending balance. Usage deducts real dollars             | Google Cloud, Anthropic     |

## Metered

Customers pay a base price and get included usage. Overage beyond the included amount is charged at the end of the billing period.

| Feature     | Included     | Overage Price    |
| ----------- | ------------ | ---------------- |
| API Calls   | 10,000/month | $0.01 per call   |
| Storage     | 100 GB       | $0.10 per GB     |
| Email Sends | 50,000/month | $0.001 per email |

## Credits

Customers receive credits with their subscription. Feature usage consumes credits. When credits run out, customers can buy [Credit Packs or a chosen quantity](/docs/credit-packs), turn on [auto top-up](/docs/credit-packs#top-up-credits-automatically), or wait for the next billing cycle.

| Feature             | Credits per Use |
| ------------------- | --------------- |
| AI Image Generation | 10 credits      |
| AI Text Generation  | 2 credits       |
| AI Voice Synthesis  | 25 credits      |

> **Note**
>
> Plan credits expire at each reset unless the plan rolls them over. Purchased credits **never expire**.

### Roll over unused plan credits

```typescript
await commet.plans.update({
  id: 'pln_xxx',
  unusedPlanCredits: { type: 'roll_over', maxPlanCredits: 2500 },
})
```

At each reset, the new allocation is added to the unused plan credits instead of replacing them. `maxPlanCredits` caps the total after the reset, including the new allocation; credits above it expire. It must be at least the included credits of every price. `null` means no cap other than 2,147,483,647 credits.

```
Plan grants 1,000 credits per month. maxPlanCredits: 2,500.

Month 1: 800 unused → 800 + 1,000 = 1,800
Month 2: 1,800 unused → 2,800, capped at 2,500. 300 expire.
```

`{ type: 'expire' }` restores the default. Changing it publishes a new [plan version](/docs/plan-versions); each subscription keeps its version's setting until you move it. A plan change applies the new plan's setting.

### Limit plan credit spending

```typescript
await commet.plans.update({
  id: 'pln_xxx',
  planCreditLimit: { credits: 100, interval: 'day' },
})
```

`planCreditLimit` caps the plan credits a subscription spends per window: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. Purchased credits are never limited.

An event past the limit uses purchased credits. Without enough, [Track Usage](/docs/track-usage#limit-plan-credit-spending) rejects it with `402 plan_credit_limit_reached`. Changing the limit publishes a new plan version; each subscription keeps its version's limit until you move it.

In the dashboard, open **Plans**, select a credits plan, and edit **Carry-over**, **Credit limit**, or **Buying credits** under **Credit rules**. The changes go into a draft until you publish it.

## Balance

Customers pay a base price that becomes their spending balance. Feature usage costs real money deducted from the balance. Overage is charged at period end.

Balance supports two pricing modes per feature:

| Pricing Mode    | How price is determined                                 | Best for                       |
| --------------- | ------------------------------------------------------- | ------------------------------ |
| **Fixed Price** | You set a price per unit                                | API calls, storage, processing |
| **AI Model**    | Commet calculates from model token prices + your margin | AI-powered features            |

### Fixed pricing

| Feature                     | Cost per Use |
| --------------------------- | ------------ |
| API Call                    | $0.001       |
| Image Processing            | $0.05        |
| Video Encoding (per minute) | $0.10        |

### AI Model pricing

Set a margin percentage instead of a fixed price. Commet looks up the model's token cost and applies your margin automatically. See [AI Token Billing](/docs/ai-token-billing) for details.

## Comparison

| Aspect               | Metered                                                                                                         | Credits                                     | Balance                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------- |
| **When exceeded**    | Overage at period end                                                                                           | Blocked or buy credits                      | Overage at period end                     |
| **Reset behavior**   | Usage resets to 0 each period                                                                                   | Plan credits reset or roll over each period | Balance resets to plan amount each period |
| **Purchased extras** | N/A                                                                                                             | Credits persist forever                     | Top-ups reset at period                   |
| **Reset frequency**  | Weekly plans reset every 7 days. Monthly, quarterly, semiannual, yearly, one-time, and free plans reset monthly | Same                                        | Same                                      |
| **Customer portal**  | View usage                                                                                                      | Buy credits, set auto top-up                | Add balance (top-up)                      |

## Overage restrictions by plan type

| Plan type                  | Overage                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| **Paid plan**              | Fully supported                                                           |
| **Free plan**              | **Not allowed** — usage is blocked at included limits                     |
| **Trial** (on a paid plan) | **Blocked during trial** — activates when the subscription becomes active |

See [Free Plans](/docs/how-do-free-plans-work-without-payment) and [Trials](/docs/how-do-trial-periods-work) for details.

## Learn more

- [How Does Billing Work](/docs/how-does-billing-work)
