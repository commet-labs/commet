# @commet/ai-sdk - AI Token Tracking

Middleware for the Vercel AI SDK that automatically tracks token usage for billing. Wraps any language model to report input/output/cache tokens to Commet.

## Setup

```typescript
import { Commet } from "@commet/node";
import { tracked } from "@commet/ai-sdk";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
  environment: "production",
});

const model = tracked(anthropic("claude-3-opus"), {
  commet,                          // Commet SDK instance
  feature: "ai_generation",       // Feature code (autocomplete after `commet pull`)
  customerId: "user_123",         // externalId or cus_xxx
  idempotencyKey?: string,        // Optional dedup key
  onTrackingError?: (error) => {  // Optional error handler
    console.error("Tracking failed:", error);
  },
});

// Use normally - tokens are tracked automatically
const result = await generateText({
  model,
  prompt: "Explain quantum computing",
});
```

## How It Works

1. `tracked()` wraps a language model with middleware
2. On `generate()`: runs the model, then reports token usage to Commet
3. On `stream()`: intercepts the stream finish event, then reports token usage
4. Reports: `inputTokens`, `outputTokens`, `cacheReadTokens`, `cacheWriteTokens`
5. Commet calculates costs from the AI model catalog with configured margins
6. For balance model subscriptions, cost is deducted from balance in real-time

## Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `commet` | `Commet` | Yes | Commet SDK instance |
| `feature` | `string` | Yes | Feature code for billing |
| `customerId` | `string` | Yes | Customer's externalId or `cus_xxx` |
| `idempotencyKey` | `string` | No | Prevent duplicate tracking |
| `onTrackingError` | `(error: Error) => void` | No | Custom error handler (defaults to console.warn) |

## Customer Identification

Accepts both Commet customer IDs and external IDs:

```typescript
// Using externalId (recommended)
tracked(model, { commet, feature: "ai", customerId: "user_123" });

// Using Commet customer ID
tracked(model, { commet, feature: "ai", customerId: "cus_abc123" });
```

IDs starting with `cus_` are sent as `customerId`, others as `externalId`.

## Streaming Support

Works with both `generateText()` and `streamText()`. For streaming, tokens are reported after the stream completes (on the `finish` chunk).

```typescript
const result = await streamText({
  model: tracked(anthropic("claude-3-opus"), options),
  prompt: "Write a story",
});

// Tokens reported automatically after stream finishes
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

## Error Handling

Token tracking failures are non-blocking. If reporting fails:
- If `onTrackingError` is provided, it's called with the error
- Otherwise, a warning is logged to console
- The AI model response is always returned regardless of tracking success

## Prerequisites

- Feature must be configured with `pricingMode: "ai_model"` in the Commet dashboard
- AI model must exist in Commet's AI model catalog (synced automatically)
- For balance-based billing, customer needs sufficient balance (unless `blockOnExhaustion = false`)
