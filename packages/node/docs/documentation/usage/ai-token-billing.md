---
lastModified: 2026-07-28
title: AI Token Billing
description: Automatically measure and charge for AI token usage with model-aware pricing and configurable margins.
---

AI Token Billing lets you charge customers based on the actual AI model tokens they consume. Commet maintains a catalog of 180+ AI model prices, calculates the cost per request, applies your margin, and deducts from the customer's balance. Only available for plans using the **Balance** [consumption model](/docs/consumption-models).

## How it works

1. Your app calls an AI model (GPT-4o, Claude, Gemini, etc.)
2. You report the tokens consumed to Commet
3. Commet looks up the model's token price, applies your margin, and deducts from the customer's balance
4. At the end of the billing period, any overdraft is invoiced as overage

## Setup

### 1. Create a feature

Go to **Features**, create a metered feature (e.g., name: "AI Chat", code: `ai_chat`).

### 2. Add to a balance plan with AI Model pricing

Go to **Plans**, open a plan with Balance consumption model, and add the feature. Select **AI Model** as the pricing mode and set your margin percentage.

| Setting          | Description                                      |
| ---------------- | ------------------------------------------------ |
| **Pricing Mode** | Choose "AI Model" instead of "Fixed Price"       |
| **Margin**       | Your markup on top of the model cost (e.g., 20%) |

### 3. Track usage

Pass the `model`, `inputTokens`, and `outputTokens` when tracking. Commet handles the rest.

## Track AI tokens with the SDK

Use the same `track()` method in every SDK. When you pass `model`, Commet switches to AI token pricing.

### TypeScript

```typescript
await commet.usage.track({
  customerId: "user_123",
  featureCode: "ai_chat",
  model: "gpt-4o",
  inputTokens: 1500,
  outputTokens: 300,
})
```

### Python

```python
commet.usage.track(
    customer_id="user_123",
    feature_code="ai_chat",
    model="gpt-4o",
    input_tokens=1500,
    output_tokens=300,
)
```

### Go

```go
inputTokens := 1500
outputTokens := 300
model := "gpt-4o"
client.Usage.Track(ctx, &commet.TrackUsageParams{
    FeatureCode:  "ai_chat",
    CustomerID:   "user_123",
    Model:        &model,
    InputTokens:  &inputTokens,
    OutputTokens: &outputTokens,
})
```

### Java

```java
commet.usage().track(
    TrackUsageParams.builder("ai_chat", "user_123")
        .model("gpt-4o")
        .inputTokens(1500L)
        .outputTokens(300L)
        .build()
);
```

### PHP

```php
$commet->usage->track(
    featureCode: 'ai_chat',
    model: 'gpt-4o',
    inputTokens: 1500,
    outputTokens: 300,
    customerId: 'user_123',
);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/usage/events \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "featureCode": "ai_chat",
    "customerId": "user_123",
    "model": "gpt-4o",
    "inputTokens": 1500,
    "outputTokens": 300
  }'
```

For models with prompt caching, include cache tokens for accurate billing:

### TypeScript

```typescript
await commet.usage.track({
  customerId: "user_123",
  featureCode: "ai_chat",
  model: "anthropic/claude-sonnet-4.6",
  inputTokens: 10000,
  outputTokens: 2000,
  cacheReadTokens: 7000,
  cacheWriteTokens: 1000,
})
```

### Python

```python
commet.usage.track(
    customer_id="user_123",
    feature_code="ai_chat",
    model="anthropic/claude-sonnet-4.6",
    input_tokens=10000,
    output_tokens=2000,
    cache_read_tokens=7000,
    cache_write_tokens=1000,
)
```

### Go

```go
inputTokens := 10000
outputTokens := 2000
cacheReadTokens := 7000
cacheWriteTokens := 1000
model := "anthropic/claude-sonnet-4.6"
client.Usage.Track(ctx, &commet.TrackUsageParams{
    FeatureCode:     "ai_chat",
    CustomerID:       "user_123",
    Model:            &model,
    InputTokens:      &inputTokens,
    OutputTokens:     &outputTokens,
    CacheReadTokens:  &cacheReadTokens,
    CacheWriteTokens: &cacheWriteTokens,
})
```

### Java

```java
commet.usage().track(
    TrackUsageParams.builder("ai_chat", "user_123")
        .model("anthropic/claude-sonnet-4.6")
        .inputTokens(10000L)
        .outputTokens(2000L)
        .cacheReadTokens(7000L)
        .cacheWriteTokens(1000L)
        .build()
);
```

### PHP

```php
$commet->usage->track(
    featureCode: 'ai_chat',
    model: 'anthropic/claude-sonnet-4.6',
    inputTokens: 10000,
    outputTokens: 2000,
    customerId: 'user_123',
    cacheReadTokens: 7000,
    cacheWriteTokens: 1000,
);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/usage/events \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "featureCode": "ai_chat",
    "customerId": "user_123",
    "model": "anthropic/claude-sonnet-4.6",
    "inputTokens": 10000,
    "outputTokens": 2000,
    "cacheReadTokens": 7000,
    "cacheWriteTokens": 1000
  }'
```

> **Note**
>
> Cache read tokens are significantly cheaper than regular input tokens. Commet prices each token type separately so customers pay fair rates.

## Automatic tracking with `@commet/ai-sdk`

If you use the [Vercel AI SDK](https://ai-sdk.dev) (Node.js only), install `@commet/ai-sdk` to track tokens automatically.

```bash
npm install @commet/ai-sdk
```

Wrap your model with `tracked()`. Every `generateText` and `streamText` call is tracked without extra code.

```typescript
import { tracked } from "@commet/ai-sdk"
import { Commet } from "@commet/node"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

const commet = new Commet({ apiKey: process.env.COMMET_API_KEY! })

const model = tracked(openai("gpt-4o"), {
  commet,
  feature: "ai_chat",
  customerId: "user_123",
})

const result = await generateText({ model, prompt: "Hello!" })
// Tokens tracked and balance deducted automatically
```

Works with any AI SDK provider: OpenAI, Anthropic, Google, and any model available through the Vercel AI Gateway.

## Parameters

| Parameter          | Type     | Required | Description                                                         |
| ------------------ | -------- | -------- | ------------------------------------------------------------------- |
| `featureCode`      | `string` | Yes      | Event code of a metered feature                                     |
| `customerId`       | `string` | Yes      | Commet customer ID (`cus_xxx`) or your external ID                  |
| `model`            | `string` | Yes      | AI model identifier (e.g., `gpt-4o`, `anthropic/claude-sonnet-4.6`) |
| `inputTokens`      | `number` | Yes      | Number of input (prompt) tokens                                     |
| `outputTokens`     | `number` | Yes      | Number of output (completion) tokens                                |
| `cacheReadTokens`  | `number` | No       | Cached input tokens read (cheaper rate)                             |
| `cacheWriteTokens` | `number` | No       | Cached input tokens written (higher rate)                           |
| `eventId`          | `string` | No       | Caller-owned event ID for deduplicating business-event retries      |

## Model identifier formats

Commet accepts model identifiers in two formats:

| Format         | Example                       | When to use                         |
| -------------- | ----------------------------- | ----------------------------------- |
| Model ID only  | `gpt-4o`                      | Direct provider SDK usage           |
| Provider/Model | `anthropic/claude-sonnet-4.6` | AI Gateway or multi-provider setups |

## Cost calculation

For each request, Commet calculates:

```
inputCost  = nonCachedInputTokens  x  inputPrice  / 1M
outputCost = outputTokens          x  outputPrice / 1M
cacheCost  = cacheReadTokens       x  cachePrice  / 1M
             + cacheWriteTokens    x  cacheWritePrice / 1M
subtotal   = inputCost + outputCost + cacheCost
total      = subtotal  x  (1 + margin%)
```

## AI model catalog

Commet maintains a catalog of 180+ AI models with up-to-date token prices, synchronized daily from the Vercel AI Gateway. The catalog includes input, output, cache read, and cache write prices for each model.

Supported providers include OpenAI, Anthropic, Google, Meta, Mistral, Cohere, and more.

## AI Costs dashboard

View all AI token costs in the dashboard under **AI Costs**. Each entry shows the model used, token breakdown, cost calculation, margin applied, and total charged.

## Related

- [Consumption Models](/docs/consumption-models) — How Balance model works
- [Track Usage](/docs/track-usage) — Standard usage tracking
- [Configure Features](/docs/configure-features) — Create metered features
