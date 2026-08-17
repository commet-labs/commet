---
lastModified: 2026-07-10
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

Customers receive credits with their subscription. Feature usage consumes credits. When credits run out, customers can purchase [Credit Packs](/docs/credit-packs) or wait for the next billing cycle.

| Feature             | Credits per Use |
| ------------------- | --------------- |
| AI Image Generation | 10 credits      |
| AI Text Generation  | 2 credits       |
| AI Voice Synthesis  | 25 credits      |

> **Note**
>
> Plan credits reset each billing period. Credits purchased via Credit Packs **never expire**.

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

| Aspect               | Metered                                                                                             | Credits                        | Balance                                   |
| -------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------- |
| **When exceeded**    | Overage at period end                                                                               | Blocked or buy packs           | Overage at period end                     |
| **Reset behavior**   | Usage resets to 0 each period                                                                       | Plan credits reset each period | Balance resets to plan amount each period |
| **Purchased extras** | N/A                                                                                                 | Credits persist forever        | Top-ups reset at period                   |
| **Reset frequency**  | Weekly plans reset every 7 days. Monthly, quarterly, yearly, one-time, and free plans reset monthly | Same                           | Same                                      |
| **Customer portal**  | View usage                                                                                          | Buy credit packs               | Add balance (top-up)                      |

## Overage restrictions by plan type

| Plan type                  | Overage                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| **Paid plan**              | Fully supported                                                           |
| **Free plan**              | **Not allowed** — usage is blocked at included limits                     |
| **Trial** (on a paid plan) | **Blocked during trial** — activates when the subscription becomes active |

See [Free Plans](/docs/how-do-free-plans-work-without-payment) and [Trials](/docs/how-do-trial-periods-work) for details.

## Learn more

- [How Does Billing Work](/docs/how-does-billing-work)

## Related

- [Manage Plans](/docs/create-plans) — Create plans with consumption models
- [Credit Packs](/docs/credit-packs) — Configure credit packages for credits-based plans
- [Configure Features](/docs/configure-features) — Define what customers can access
- [Customer Portal](/docs/customer-portal) — Where customers manage their consumption
