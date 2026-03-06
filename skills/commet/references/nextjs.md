# @commet/next - Next.js Integration

## Recommended: Query State Directly

Instead of syncing state via webhooks, query the SDK directly when you need to know a customer's subscription or feature status. This is simpler, more reliable, and avoids state synchronization bugs.

```typescript
// Check subscription status on any page/action
const { data: sub } = await commet.subscriptions.get(user.id);
if (sub?.status === "active" || sub?.status === "trialing") { /* has access */ }

// Check feature access
const { data } = await commet.features.check({ code: "api_calls", externalId: user.id });

// List all features
const { data: features } = await commet.features.list(user.id);
```

## Webhooks Route Handler (Optional)

Webhooks are useful for background tasks like sending emails, provisioning external resources, or logging — but should not be the primary mechanism for access control. Always prefer querying state directly.

Create a route that auto-verifies signatures and routes events to handlers.

```typescript
// app/api/webhooks/commet/route.ts
import { Webhooks } from "@commet/next";

export const POST = Webhooks({
  webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,

  // Use for background tasks, not access control (query SDK directly for that)
  onSubscriptionActivated: async (payload) => {
    await sendWelcomeEmail(payload.data.externalId);
    await provisionResources(payload.data.externalId);
  },

  onSubscriptionCanceled: async (payload) => {
    await sendCancellationEmail(payload.data.externalId);
    await scheduleResourceCleanup(payload.data.externalId);
  },

  onSubscriptionCreated: async (payload) => { /* ... */ },
  onSubscriptionUpdated: async (payload) => { /* ... */ },

  // Catch-all handler (runs in parallel with specific handlers)
  onPayload: async (payload) => {
    console.log("Webhook received:", payload.event);
  },

  // Error handler
  onError: async (error, payload) => {
    console.error("Webhook error:", error);
  },
});
```

**Webhook payload:**
```typescript
interface WebhookPayload {
  event: "subscription.created" | "subscription.activated" | "subscription.canceled" | "subscription.updated";
  timestamp: string;
  organizationId: string;
  data: {
    id?: string;
    subscriptionId?: string;
    customerId?: string;
    externalId?: string;
    status?: string;
    name?: string;
    canceledAt?: string;
  };
}
```

The handler returns `200` for successfully processed webhooks, `403` for invalid signatures, and `200` with warning for handler errors (prevents retries).

## Customer Portal Route

Create a route that redirects authenticated users to their billing portal.

```typescript
// app/api/commet/portal/route.ts
import { CustomerPortal } from "@commet/next";
import { auth } from "@/lib/auth";

export const GET = CustomerPortal({
  apiKey: process.env.COMMET_API_KEY!,
  environment: "production",
  getCustomerId: async (req) => {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user.id ?? null;
  },
  onError: (error) => {
    console.error("Portal error:", error);
  },
});
```

Use in component:
```tsx
<Button asChild>
  <Link href="/api/commet/portal">Manage Billing</Link>
</Button>
```

## Common Next.js Patterns

### Checkout flow with server action

```typescript
"use server";

import { Commet } from "@commet/node";
import { redirect } from "next/navigation";

const commet = new Commet({ apiKey: process.env.COMMET_API_KEY!, environment: "production" });

export async function createCheckout(planCode: string) {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  // Ensure customer exists
  const customers = await commet.customers.list({ externalId: user.id, limit: 1 });
  if (!customers.data?.length) {
    await commet.customers.create({ externalId: user.id, email: user.email });
  }

  // Check existing subscription
  const existing = await commet.subscriptions.get(user.id);
  if (existing.data?.status === "active") redirect("/dashboard/billing?error=already_subscribed");
  if (existing.data?.status === "pending_payment" && existing.data.checkoutUrl) {
    redirect(existing.data.checkoutUrl);
  }

  // Create subscription -> get checkout URL
  const result = await commet.subscriptions.create({
    externalId: user.id,
    planCode,
    successUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
  });

  if (!result.data?.checkoutUrl) throw new Error("Failed to create checkout");
  redirect(result.data.checkoutUrl);
}
```

### Cached plans listing

```typescript
import { unstable_cache } from "next/cache";

const getCachedPlans = unstable_cache(
  async () => {
    const result = await commet.plans.list();
    if (!result.success || !result.data) throw new Error("Failed to load plans");
    return result.data;
  },
  ["plans"],
  { revalidate: 3600, tags: ["plans"] },
);
```

### Feature gating in server component

```typescript
export default async function Page() {
  const user = await getUser();
  const { data } = await commet.features.check({ code: "advanced_analytics", externalId: user.id });

  if (!data?.allowed) {
    return <UpgradePrompt feature="Advanced Analytics" />;
  }

  return <AdvancedAnalyticsDashboard />;
}
```
