---
"@commet/node": minor
---

Production-ready billing integration with checkout URLs and webhook verification

### Checkout URLs

Subscriptions created with `status: "pending_payment"` now return a `checkoutUrl` for payment collection.

```typescript
const subscription = await commet.subscriptions.create({
  externalId: userId,
  items: [{ priceId: "price-uuid", quantity: 1 }],
  status: "pending_payment" // Generates checkoutUrl
});

// Redirect user to payment
window.location.href = subscription.data.checkoutUrl;
```

### Webhook Verification

New `webhooks` resource provides secure signature verification methods.

```typescript
// Verify and parse in one step
const payload = commet.webhooks.verifyAndParse(
  rawBody,
  request.headers.get('x-commet-signature'),
  process.env.COMMET_WEBHOOK_SECRET
);

if (!payload) {
  return new Response('Invalid signature', { status: 401 });
}

// Handle verified webhook
if (payload.event === 'subscription.activated') {
  await updateUserStatus(payload.data.externalId, { isPaid: true });
}
```

**Available methods:**
- `commet.webhooks.verify(payload, signature, secret)` - Returns boolean
- `commet.webhooks.verifyAndParse(payload, signature, secret)` - Returns parsed payload or null

**Supported events:**
- `subscription.created`
- `subscription.activated`
- `subscription.canceled`
- `subscription.updated`

### Breaking Changes

**Subscription status enum updated:**
- Added: `pending_payment` (awaiting payment)
- Status flow: `draft` → `pending_payment` → `active` → `completed`/`canceled`

**TypeScript changes:**
```typescript
interface Subscription {
  status: "draft" | "pending_payment" | "active" | "completed" | "canceled";
  checkoutUrl?: string; // Present when status is "pending_payment"
}

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  organizationId: string;
  data: WebhookData;
}
```

### Migration Guide

Update subscription status checks:

```typescript
// Before
if (subscription.status === 'draft') { /* ... */ }

// After
if (subscription.status === 'pending_payment') {
  // Show checkout UI with subscription.checkoutUrl
}
```

See `examples/fixed-saas` for complete integration example.

