<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">@commet/next</h3>
    </a>
  </p>
  <p>Next.js integration for Commet</p>

  <a href="https://www.npmjs.com/package/@commet/next"><img alt="NPM version" src="https://img.shields.io/npm/v/@commet/next.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://docs.commet.co"><img alt="Documentation" src="https://img.shields.io/badge/docs-commet-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

## Installation

```bash
npm install @commet/next
```

## Webhooks

```typescript
// app/api/webhooks/commet/route.ts
import { Webhooks } from "@commet/next";

export const POST = Webhooks({
  webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,
  onSubscriptionActivated: async (payload) => {
    // Grant access
  },
});
```

## Customer Portal

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

```tsx
// Use in component
<Button asChild>
  <Link href="/api/commet/portal">Manage Billing</Link>
</Button>
```

## Documentation

- [Webhooks](https://docs.commet.co/docs/library/installation/webhooks)
- [Customer Portal](https://docs.commet.co/docs/library/features/portal-access)
- [SDK Reference](https://docs.commet.co/docs/library/quickstart)

## License

MIT

