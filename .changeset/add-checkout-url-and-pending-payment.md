---
"@commet/node": minor
---

Add checkout URL support and pending_payment status for subscriptions

### New Features

- **Checkout URL**: Subscriptions created with `status: "pending_payment"` now return a `checkoutUrl` field for payment collection
- **New Status**: Added `pending_payment` status to subscription lifecycle

### Status Lifecycle

- `draft`: Subscription saved but not ready for billing
- `pending_payment`: Subscription ready, awaiting payment (**generates checkoutUrl**)
- `active`: Subscription paid and active
- `completed`: Subscription ended
- `canceled`: Subscription canceled

### TypeScript Updates

```typescript
interface Subscription {
  // ... other fields
  status: "draft" | "pending_payment" | "active" | "completed" | "canceled";
  checkoutUrl?: string; // Present when status is "pending_payment"
}
```

