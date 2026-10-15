---
title: Customer Portal
description: Self-service page where customers change plans, view usage, buy credits and see invoices, with a fresh portal URL generated on each visit.
---

Self-service page where customers manage their subscription, view usage, change plans, and purchase credits. Automatically created with every subscription.

## What customers can do

- View current subscription and billing cycle
- See usage across all features
- Upgrade or downgrade plans (requires a [Plan Group](/docs/plan-groups))
- Purchase [Credit Packs](/docs/credit-packs), balance top-ups, and [Add-ons](/docs/add-ons)
- Manage saved payment methods and billing details
- View invoice history
- Cancel subscription

Purchases are available on active, trialing, and free plan subscriptions. Free plan customers are prompted to add a payment method on their first purchase.

## Saved payment methods

Your customers can save several cards and choose their default payment method. A new card becomes the default unless the customer saves it as an alternative. The first saved card is always the default.

While a subscription is open:

- Customers must choose another default before removing the current one.
- They cannot remove the last saved method or the last method usable with the subscription's payment connection.

Without an open subscription, customers can remove any saved method. Changing the default or removing methods is blocked while a payment or automatic retry is in progress.

Commet can also use saved methods for [automatic payment retries](/docs/handle-failed-payments#saved-payment-methods).

## Generate a portal URL

Portal URLs are not single-use — the customer can revisit the link while the session is alive. A session expires after **30 minutes** of inactivity, auto-refreshes while the customer is active, and is capped at **2 hours** from creation. Generate a fresh URL on each visit.

### TypeScript

```typescript
const portal = await commet.portal.getUrl({ customerId: 'user_123' })

redirect(portal.portalUrl)
```

### Python

```python
portal = commet.portal.get_url(customer_id='user_123')

redirect(portal.portal_url)
```

### Go

```go
portal, err := client.Portal.GetURL(ctx, &commet.GetPortalURLParams{
    CustomerID: "user_123",
})

// redirect(portal.PortalURL)
```

### Java

```java
var portal = commet.portal().getUrl(RequestPortalAccessParams.builder().customerId("user_123").build());

// redirect(portal.portalUrl())
```

### PHP

```php
$portal = $commet->portal->getUrl(customerId: 'user_123');

redirect($portal->portalUrl);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/portal/request-access \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "user_123"}'
```

You can identify customers by `customerId` (Commet ID or your external ID) or `email`.

## Next.js helper

`@commet/next` (Node.js only) provides a one-line route handler that generates portal URLs and redirects automatically.

```typescript title="app/api/commet/portal/route.ts"
import { CustomerPortal } from '@commet/next'

export const GET = CustomerPortal({
  apiKey: process.env.COMMET_API_KEY!,
  getCustomerId: async (req) => {
    return 'user_123'
  },
})
```

```tsx
<a href="/api/commet/portal">Manage Billing</a>
```

## Custom domains

Serve the portal from your own domain (e.g., `billing.acme.com`) instead of `commet.co`. Go to **Settings** → **Custom Domains**, add the domain, and point the DNS records shown — portal links use your domain once it verifies.

Each custom domain serves one surface: **portal** or **checkout**. Checkout pages support custom domains the same way.
