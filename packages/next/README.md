<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">@commet/next</h3>
    </a>
  </p>
  <p>Next.js integration for Commet</p>

  <a href="https://www.npmjs.com/package/@commet/next"><img alt="NPM version" src="https://img.shields.io/npm/v/@commet/next.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://commet.co/docs"><img alt="Documentation" src="https://img.shields.io/badge/docs-commet-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

Ready-to-use Next.js route handlers for [Commet](https://commet.co) webhooks and customer portal. Drop them into your App Router and you're set.

## Installation

```bash
npm install @commet/next @commet/node
```

## Getting Started

### 1. Set up your environment

Get your API key and webhook secret from your [Commet dashboard](https://commet.co).

```bash
# .env
COMMET_API_KEY=ck_...
COMMET_WEBHOOK_SECRET=whsec_...
```

### 2. Add webhook handler

Create a route handler to receive billing events from Commet:

```typescript
// app/api/webhooks/commet/route.ts
import { Webhooks } from "@commet/next";

export const POST = Webhooks({
  webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,
  onSubscriptionActivated: async (payload) => {
    // Grant access to your product
  },
  onSubscriptionCanceled: async (payload) => {
    // Revoke access
  },
  onSubscriptionCreated: async (payload) => {
    // Handle new subscriptions
  },
  onSubscriptionUpdated: async (payload) => {
    // Handle plan changes
  },
  onPayload: async (payload) => {
    // Catch-all for any event
  },
});
```

Then register the URL `https://yourapp.com/api/webhooks/commet` in your Commet dashboard under **Settings → Webhooks**.

### 3. Add customer portal

Let your customers manage their billing (update payment method, view invoices, cancel) without leaving your app:

```typescript
// app/api/commet/portal/route.ts
import { CustomerPortal } from "@commet/next";
import { auth } from "@/lib/auth";

export const GET = CustomerPortal({
  apiKey: process.env.COMMET_API_KEY!,
  getCustomerId: async (req) => {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user.id ?? null;
  },
});
```

Then link to it from your dashboard:

```tsx
<Button asChild>
  <Link href="/api/commet/portal">Manage Billing</Link>
</Button>
```

## Note About Webhooks

Webhooks are optional in Commet. You can always query the current state directly using [`@commet/node`](https://www.npmjs.com/package/@commet/node):

```typescript
const subscription = await commet.subscriptions.get({ externalId: userId });
const features = await commet.features.list({ externalId: userId });
```

Webhooks are useful when you want to react immediately to changes — send emails, update your database, revoke access, etc.

## Documentation

Visit [commet.co/docs](https://commet.co/docs) for the full guide on webhooks, portal customization, and more.

## License

MIT
