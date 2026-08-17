---
lastModified: 2026-07-28
title: Integrate with Next.js
description: Add billing and payments to your Next.js application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pnpm
   ```bash
   pnpm add @commet/node @commet/next
   ```
   ### npm
   ```bash
   npm install @commet/node @commet/next
   ```
   ### yarn
   ```bash
   yarn add @commet/node @commet/next
   ```
   ### bun
   ```bash
   bun add @commet/node @commet/next
   ```

2. ## Configure
   ```bash title=".env.local"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   ```typescript title="lib/commet.ts"
   import { Commet } from '@commet/node'

   export const commet = new Commet({
     apiKey: process.env.COMMET_API_KEY!,
   })
   ```

3. ## Create Customer and Subscribe
   `customers.create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```typescript title="app/actions/billing.ts"
   'use server'

   import { redirect } from 'next/navigation'
   import { commet } from '@/lib/commet'

   export async function subscribe(customerId: string) {
     await commet.customers.create({
       email: 'user@example.com',
       id: customerId,
     })

     const subscription = await commet.subscriptions.create({
       customerId,
       planCode: 'pro',
     })

     const checkoutUrl = subscription.checkoutUrl
     if (checkoutUrl) {
       redirect(checkoutUrl)
     }
   }
   ```
   The customer is redirected to checkout to complete payment. When `checkoutUrl` is `null` no payment is needed and the subscription is already active.

4. ## Check Access
   ```typescript title="app/actions/billing.ts"
   export async function getSubscription(customerId: string) {
     const subscription = await commet.subscriptions.getActive({ customerId })

     return subscription
   }
   ```
   ```typescript title="app/actions/features.ts"
   export async function canUseFeature(customerId: string, feature: string) {
     const access = await commet.featureAccess.get({ code: feature, customerId })

     return access.allowed
   }
   ```

5. ## Track Usage
   ```typescript title="app/actions/usage.ts"
   export async function trackApiCall(customerId: string) {
     await commet.usage.track({
       customerId,
       featureCode: 'api_calls',
       value: 1,
     })
   }
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
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

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
