<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">Commet</h3>
    </a>
  </p>
  <p>Vercel AI SDK middleware for usage-based billing</p>

  <a href="https://www.npmjs.com/package/@commet/ai-sdk"><img alt="NPM version" src="https://img.shields.io/npm/v/@commet/ai-sdk.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://commet.co/docs"><img alt="Documentation" src="https://img.shields.io/badge/docs-AI_SDK-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

If you're using the [Vercel AI SDK](https://sdk.vercel.ai), this middleware automatically tracks token usage (input, output, cache) through Commet. Wrap your model and every `generateText` / `streamText` call gets billed — zero manual tracking.

## Installation

```bash
npm install @commet/ai-sdk @commet/node
```

## Quick Start

Wrap any AI SDK model with `tracked` to automatically track token usage through Commet.

```typescript
import { Commet } from '@commet/node';
import { tracked } from '@commet/ai-sdk';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const commet = new Commet({ apiKey: process.env.COMMET_API_KEY });

const result = await generateText({
  model: tracked(openai('gpt-4o'), {
    commet,
    feature: 'ai_chat',
    customerId: 'cus_123', // or an external ID like 'user_123'
  }),
  prompt: 'Hello!',
});
```

Every `generateText` and `streamText` call automatically reports input tokens, output tokens, and cache tokens to Commet.

## Streaming

Works the same way with `streamText` — usage is reported when the stream finishes.

```typescript
import { streamText } from 'ai';

const result = streamText({
  model: tracked(openai('gpt-4o'), {
    commet,
    feature: 'ai_chat',
    customerId: 'cus_123',
  }),
  prompt: 'Explain billing models',
});
```

## Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `commet` | `Commet` | Yes | Commet SDK instance |
| `feature` | `GeneratedFeatureCode` | Yes | Feature code to track usage against |
| `customerId` | `string` | Yes | Commet customer ID (`cus_*`) or external ID |
| `idempotencyKey` | `string` | No | Prevent duplicate tracking for retries |
| `onTrackingError` | `(error: Error) => void` | No | Custom error handler. Defaults to `console.warn` |

## How It Works

`tracked` wraps the model with AI SDK middleware that intercepts `generate` and `stream` completions. After each call, it reports to Commet:

- **Input tokens** (including cache read/write breakdown)
- **Output tokens**
- **Model ID** (automatically detected)

Tracking runs in the stream's `flush` phase — it completes before the HTTP connection closes, so it works reliably in serverless environments without blocking the user's response.

## Requirements

- `ai` >= 6.0.0
- `@commet/node` >= 1.6.0

## Documentation

Visit [commet.co/docs](https://commet.co/docs) for the full guide.

## License

MIT
