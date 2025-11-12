# Commet SDK/API Gaps & Missing Features

This document outlines the missing features discovered while building the Fixed SaaS example.

## ✅ What's Already Implemented

All critical features for production are complete:

- ✅ **Subscription checkout flow** - `status: "pending_payment"` generates `checkoutUrl` for payment
- ✅ **Webhook system** - 4 events (`created`, `activated`, `canceled`, `updated`) with HMAC-SHA256 signatures
- ✅ **SDK webhook verification** - `commet.webhooks.verify()` and `commet.webhooks.verifyAndParse()`
- ✅ **Webhook infrastructure** - Automatic retries, delivery logs, multiple endpoints per org

**Example is production-ready** for basic fixed-price SaaS billing.

---

## ⏳ Missing Features (Nice-to-Have)

### 1. Subscription Update Endpoint

**API:** `POST /api/v1/subscriptions/:id/update`

```typescript
await commet.subscriptions.update(subscriptionId, {
  status: "active"  // or "canceled", etc.
});
```

**Why it's useful:**
- **Admin overrides** - Manually activate subscriptions for special cases (refunds, migrations)
- **Testing** - Simulate state changes during development
- **Free trials** - Activate without payment for trial conversions
- **Edge cases** - Handle subscription changes outside normal billing flow

**Current workaround:** Cancel endpoint exists (`/subscriptions/:id/cancel`), but no general update.

---

### 2. Customer Portal URL

**API:** `POST /api/v1/customers/:id/portal`

```typescript
const { portalUrl } = await commet.customers.createPortalSession(customerId, {
  returnUrl: "https://myapp.com/settings"
});

// Redirect user to portalUrl
```

**Why it's useful:**
- **Reduce support burden** - Users manage their own billing without tickets
- **Self-service billing** - View invoices, update cards, cancel subscriptions
- **Better UX** - Professional billing portal without building UI
- **Compliance** - Customers can download invoices for accounting

**Current workaround:** Users must contact support for invoice access or cancellations.

---

### 3. Invoice Endpoints in SDK

**API:** Invoice retrieval and listing

```typescript
// List customer invoices
const invoices = await commet.invoices.list({ customerId: "cus_xxx" });

// Get specific invoice with line items
const invoice = await commet.invoices.retrieve("inv_xxx");

// Download PDF for accounting
const pdfBuffer = await commet.invoices.downloadPdf("inv_xxx");
```

**Why it's useful:**
- **Customer dashboard** - Show billing history and payment status
- **Accounting integration** - Export invoices to QuickBooks, Xero, etc.
- **Support tooling** - CSRs need invoice access to resolve disputes
- **Compliance** - Tax reporting requires historical invoice data

**Current workaround:** Invoices only visible in Commet dashboard, not accessible via API.

---

### 4. Payment Failure Event

**Webhook:** `subscription.payment_failed`

```json
{
  "event": "subscription.payment_failed",
  "data": {
    "subscriptionId": "sub_xxx",
    "customerId": "cus_xxx",
    "errorCode": "card_declined",
    "errorMessage": "Insufficient funds",
    "retryAt": "2024-01-15T00:00:00Z"
  }
}
```

**Why it's useful:**
- **Dunning management** - Trigger email sequences for failed payments
- **Grace periods** - Keep access active while retry attempts occur
- **Analytics** - Track churn reasons and payment success rates
- **Customer communication** - Proactively notify users of payment issues

**Current workaround:** No notification when payments fail. Subscription just stays `pending_payment`.

---

