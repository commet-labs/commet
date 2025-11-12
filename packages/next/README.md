<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">@commet/next</h3>
    </a>
  </p>
  <p>Next.js integration for Commet webhooks</p>

  <a href="https://www.npmjs.com/package/@commet/next"><img alt="NPM version" src="https://img.shields.io/npm/v/@commet/next.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://docs.commet.co/docs/library/installation/webhooks"><img alt="Documentation" src="https://img.shields.io/badge/docs-webhooks-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

## Installation

```bash
npm install @commet/next
```

## Quick Start

```typescript
// app/api/webhooks/commet/route.ts
import { Webhooks } from "@commet/next";

export const POST = Webhooks({
  webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,
  
  onSubscriptionActivated: async (payload) => {
    // Handle subscription activation
  },
});
```

## Documentation

Visit [docs.commet.co/docs/library/installation/webhooks](https://docs.commet.co/docs/library/installation/webhooks) for:

- Complete setup guide
- Event handler reference
- TypeScript integration
- Error handling patterns
- Testing strategies

## Resources

- [Webhook Documentation](https://docs.commet.co/docs/library/installation/webhooks)
- [SDK Reference](https://docs.commet.co/docs/library/quickstart)
- [GitHub](https://github.com/commet-labs/commet)
- [Issues](https://github.com/commet-labs/commet/issues)

## License

MIT

