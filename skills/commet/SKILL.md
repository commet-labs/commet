---
name: commet
description: Integrate Commet billing and payments into any application. Use when working with @commet/node, @commet/next, @commet/better-auth, the Commet CLI, or building billing features like subscriptions, usage tracking, seat management, checkout, customer portal, webhooks, feature gating, or payment flows. Triggers on imports from "@commet/node", "@commet/next", "@commet/better-auth", commet SDK usage, billing integration tasks, or mentions of Commet.
---

# Commet Integration

Commet is an all-in-one billing and payments platform. Merchant of Record handling taxes, compliance, refunds, and payouts. Integrate with a few lines of code.

## Packages

| Package | Purpose | Install |
|---------|---------|---------|
| `@commet/node` | Core SDK - customers, subscriptions, usage, seats, features, portal, webhooks | `npm i @commet/node` |
| `@commet/next` | Next.js helpers - webhook route handler, customer portal route | `npm i @commet/next` |
| `@commet/better-auth` | Better Auth plugin - auto customer sync, auth-scoped billing | `npm i @commet/better-auth` |
| `@commet/cli` | CLI - login, link project, pull types for autocomplete | `npm i -g @commet/cli` |

## Quick Start

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!, // ck_xxx format
  environment: "production", // "sandbox" | "production"
});
```

Sandbox: `https://sandbox.commet.co`. Production: `https://commet.co`.

## Integration Workflow

1. **Setup**: `commet login` -> `commet link` -> `commet pull` (generates `.commet/types.d.ts` for autocomplete)
2. **Create customer**: On user signup, create Commet customer with `externalId` = your user ID
3. **Create subscription**: Call `subscriptions.create()` -> redirect to `checkoutUrl`
4. **Handle activation**: Webhook `subscription.activated` or poll `subscriptions.get()`
5. **Track usage**: `usage.track()` for metered features, `seats.add/remove/set()` for seats
6. **Feature gating**: `features.check()`, `features.canUse()`, `features.get()`
7. **Customer portal**: `portal.getUrl()` -> redirect for self-service billing management

## SDK Reference

See [references/sdk.md](references/sdk.md) for the complete API surface of `@commet/node`.

## Next.js Integration

See [references/nextjs.md](references/nextjs.md) for `@commet/next` webhook handlers and customer portal routes.

## Better Auth Integration

See [references/better-auth.md](references/better-auth.md) for the `@commet/better-auth` plugin that auto-syncs customers and provides auth-scoped billing endpoints.

## Billing Concepts

See [references/billing-concepts.md](references/billing-concepts.md) for plan structure, feature types, consumption models, and charging behavior.

## Key Patterns

### Customer identification

Always use `externalId` (your user/org ID) to identify customers. The SDK accepts either `customerId` (Commet's `cus_xxx`) or `externalId` - prefer `externalId` to avoid storing Commet IDs.

### Customer-scoped context

```typescript
const customer = commet.customer("user_123");
await customer.usage.track("api_calls", 1);
await customer.features.canUse("team_members");
await customer.seats.add("editor");
await customer.subscription.get();
await customer.portal.getUrl();
```

### Idempotency

All POST requests auto-generate idempotency keys. For critical operations, pass explicit keys:

```typescript
await commet.usage.track({
  externalId: "user_123",
  feature: "api_calls",
  idempotencyKey: `req_${requestId}`,
});
```

### Error handling

```typescript
import { CommetAPIError, CommetValidationError } from "@commet/node";

try {
  await commet.subscriptions.create({ ... });
} catch (error) {
  if (error instanceof CommetValidationError) {
    console.log(error.validationErrors); // { field: ["message"] }
  }
  if (error instanceof CommetAPIError) {
    console.log(error.statusCode, error.code);
  }
}
```

### Environment variables

```env
COMMET_API_KEY=ck_xxx           # API key from dashboard
COMMET_ENVIRONMENT=sandbox      # sandbox | production
COMMET_WEBHOOK_SECRET=whsec_xxx # Webhook secret for signature verification
```
