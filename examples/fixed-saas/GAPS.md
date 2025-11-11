# Commet SDK/API Gaps & Missing Features

This document outlines the missing features discovered while building the Fixed SaaS example.

## 🔴 Critical Gaps

### 1. ✅ RESOLVED: `checkoutUrl` in Subscription Response

**Status:** ✅ Implemented in SDK v0.x.x

**Current Behavior:**
```json
// POST /api/v1/subscriptions
{
  "success": true,
  "data": {
    "id": "sub_xxx",
    "customerId": "cus_xxx",
    "status": "draft",
    "startDate": "2024-01-01T00:00:00Z",
    ...
    // ❌ No checkoutUrl field
  }
}
```

**✅ Implemented Behavior:**
```json
{
  "success": true,
  "data": {
    "id": "sub_xxx",
    "customerId": "cus_xxx",
    "status": "pending_payment",
    "startDate": "2024-01-01T00:00:00Z",
    "checkoutUrl": "https://app.commet.co/checkout/sub_xxx",
    ...
  }
}
```

**Usage:**
```typescript
const subscription = await commet.subscriptions.create({
  externalId: "user_123",
  items: [{ priceId: "price_xxx", quantity: 1 }],
  status: "pending_payment" // This generates the checkoutUrl
});

// Redirect user to payment
window.location.href = subscription.data.checkoutUrl;
```

**Impact:**
- Cannot redirect users to payment after signup
- Requires manual workarounds or external payment integration
- Breaks the automated billing flow

**Workaround:**
Currently simulating payment with a demo button. See `src/app/checkout/page.tsx` for implementation.

**Proposed Solution:**
1. Add `checkoutUrl` field to subscription response
2. Generate secure payment link when subscription is created with `status: "draft"`
3. Link should expire after 24 hours for security
4. Include customizable success/cancel URLs

**Implementation Notes:**
- Should follow Stripe Checkout pattern
- Token-based URL security
- Support for different payment methods
- Mobile-responsive checkout page

---

### 2. No Webhook Support

**Current Situation:**
No webhook system exists to notify when:
- Payment is successful
- Subscription is activated
- Subscription is canceled
- Payment fails

**Impact:**
- Cannot automatically update user's subscription status
- Requires polling Commet API to check status
- Poor user experience (manual refresh needed)
- No real-time synchronization

**Workaround:**
Created placeholder webhook endpoint at `/api/webhooks/commet/route.ts` with expected structure.

**Expected Webhook Events:**

#### Event: `subscription.paid`
```json
{
  "event": "subscription.paid",
  "id": "evt_xxx",
  "created": "2024-01-01T00:00:00Z",
  "data": {
    "subscriptionId": "sub_xxx",
    "customerId": "cus_xxx",
    "status": "active",
    "paymentId": "pay_xxx",
    "amount": 5000,
    "currency": "USD"
  }
}
```

#### Event: `subscription.canceled`
```json
{
  "event": "subscription.canceled",
  "id": "evt_xxx",
  "created": "2024-01-01T00:00:00Z",
  "data": {
    "subscriptionId": "sub_xxx",
    "customerId": "cus_xxx",
    "status": "canceled",
    "reason": "customer_request"
  }
}
```

#### Event: `subscription.payment_failed`
```json
{
  "event": "subscription.payment_failed",
  "id": "evt_xxx",
  "created": "2024-01-01T00:00:00Z",
  "data": {
    "subscriptionId": "sub_xxx",
    "customerId": "cus_xxx",
    "status": "past_due",
    "paymentId": "pay_xxx",
    "errorCode": "card_declined",
    "errorMessage": "Your card was declined"
  }
}
```

**Proposed Solution:**
1. **Webhook Configuration**:
   - Allow users to configure webhook endpoints in dashboard
   - Support multiple endpoints per organization
   - Event filtering (subscribe to specific events)

2. **Security**:
   - Sign webhook payloads with HMAC signature
   - Include signature in `X-Commet-Signature` header
   - Provide webhook secret for verification

3. **Reliability**:
   - Retry failed webhooks (exponential backoff)
   - Webhook logs in dashboard
   - Manual retry option
   - Webhook health monitoring

4. **SDK Support**:
   ```typescript
   // Verify webhook in your endpoint
   import { commet } from '@commet/node';
   
   const isValid = commet.webhooks.verify(
     payload,
     signature,
     webhookSecret
   );
   ```

---

### 3. Manual Subscription Status Checking

**Current Workaround:**
```typescript
// src/app/actions/check-subscription-action.ts
export async function checkSubscriptionStatus() {
  const subscriptions = await commet.subscriptions.list({
    externalId: userId,
    status: "active",
  });
  
  return subscriptions.data?.[0] || null;
}
```

**Issues:**
- Requires API call on every dashboard visit
- Race condition between payment and status check
- Increased API usage
- Poor performance

**Proposed Solution:**
Once webhooks are implemented, this becomes unnecessary. The webhook will update local database immediately upon payment.

---

## 🟡 Nice-to-Have Features

### 4. Subscription Status Updates

**Feature Request:**
Add endpoint to manually update subscription status:
```typescript
await commet.subscriptions.update(subscriptionId, {
  status: "active"
});
```

**Use Case:**
- Admin overrides
- Free trial activations
- Testing and development

---

### 5. Customer Portal URL

**Feature Request:**
Generate customer portal URL for self-service:
```json
{
  "portalUrl": "https://portal.commet.co/customer?token=xxx"
}
```

**Features:**
- View invoices
- Update payment method
- Cancel subscription
- Download receipts

---

### 6. Invoice Retrieval

**Feature Request:**
Add invoice endpoints to SDK:
```typescript
// List customer invoices
const invoices = await commet.invoices.list({
  customerId: "cus_xxx"
});

// Get specific invoice
const invoice = await commet.invoices.retrieve("inv_xxx");

// Download PDF
const pdf = await commet.invoices.downloadPdf("inv_xxx");
```

---

## 🔧 Implementation Priority

### Phase 1 (Critical - Blocks Production Use)
1. ✅ **DONE: checkoutUrl in subscription response** - Implemented with `pending_payment` status
2. ⏳ **Basic webhook system** - In Progress
3. ⏳ **Webhook signature verification** - Pending

### Phase 2 (Important - Quality of Life)
4. Customer portal
5. Invoice endpoints in SDK
6. Subscription update endpoint

### Phase 3 (Nice to Have)
7. Webhook retry dashboard
8. Advanced webhook filtering
9. Webhook testing tools

---

## 📋 Testing Checklist

Once features are implemented:

- [ ] Create subscription returns `checkoutUrl`
- [ ] Checkout URL loads payment page
- [ ] Payment success triggers `subscription.paid` webhook
- [ ] Webhook signature verification works
- [ ] Failed payments trigger `subscription.payment_failed` webhook
- [ ] Subscription cancellation triggers webhook
- [ ] Webhook retries on failure
- [ ] Dashboard shows webhook logs

---

## 💬 Feedback & Questions

This example was built to expose real-world integration issues. If you have questions or suggestions:

1. Check the [Commet Documentation](https://docs.commet.co)
2. Open an issue in the GitHub repository
3. Contact support@commet.co

---

## 📝 Notes for Commet Team

### Current Example Workarounds

1. **Checkout Simulation**: `src/app/api/webhooks/commet/simulate/route.ts`
   - Simulates successful payment
   - Should be replaced with real checkout flow

2. **Manual Status Check**: `src/app/actions/check-subscription-action.ts`
   - Polls API for subscription status
   - Should be replaced with webhook updates

3. **Visual Gap Indicators**: `src/app/checkout/page.tsx`
   - Shows yellow warning about missing `checkoutUrl`
   - Educational for developers

### Database Schema Considerations

The example uses Better Auth's user schema with additional fields:
```typescript
{
  commetCustomerId: string;
  subscriptionId: string;
  isPaid: boolean;
}
```

When webhooks are implemented, update logic:
```typescript
// In webhook handler
await updateUser(userId, {
  isPaid: true,
  subscriptionId: subscriptionId
});
```

---

**Last Updated**: Generated during example creation  
**Status**: Awaiting Commet team response

