---
"@commet/node": minor
---

Add webhook signature verification methods

Added `webhooks` resource to the SDK with methods for verifying webhook signatures from Commet platform:

- `commet.webhooks.verify(payload, signature, secret)` - Verify HMAC-SHA256 signature and return boolean
- `commet.webhooks.verifyAndParse(payload, signature, secret)` - Verify signature and parse JSON payload in one step

This enables secure webhook handling in client applications with built-in protection against timing attacks using `crypto.timingSafeEqual()`.

Usage example:
```typescript
const payload = commet.webhooks.verifyAndParse(
  rawBody,
  request.headers.get('x-commet-signature'),
  process.env.COMMET_WEBHOOK_SECRET
);

if (!payload) {
  return new Response('Invalid signature', { status: 401 });
}

// Handle verified webhook event
if (payload.event === 'subscription.activated') {
  // ...
}
```

Supported webhook events:
- `subscription.created`
- `subscription.activated`
- `subscription.canceled`
- `subscription.updated`

