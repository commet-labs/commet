<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">Commet</h3>
    </a>
  </p>
  <p>TypeScript SDK for Commet billing platform</p>

  <a href="https://www.npmjs.com/package/@commet/node"><img alt="NPM version" src="https://img.shields.io/npm/v/@commet/node.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://commet.co/docs"><img alt="Documentation" src="https://img.shields.io/badge/docs-SDK-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

[Commet](https://commet.co) is an all-in-one billing and payments platform for SaaS and AI products. `@commet/node` is the core SDK — use it to manage customers, track usage, handle subscriptions, and more from your server.

## Installation

```bash
npm install @commet/node
```

## Getting Started

### 1. Create a Commet account

Sign up at [commet.co](https://commet.co) and create an organization. Go to **Settings → API Keys** to get your key.

```bash
# .env
COMMET_API_KEY=ck_...
```

### 2. Initialize the SDK

```typescript
import { Commet } from '@commet/node';

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY,
});
```

### 3. Start using it

```typescript
// Create a customer
const customer = await commet.customers.create({
  fullName: 'Acme Corp',
  billingEmail: 'billing@acme.com'
});

// Subscribe them to a plan
await commet.subscriptions.create({
  externalId: 'user_123',
  planCode: 'pro', // autocomplete works after `commet pull`
  billingInterval: 'yearly',
});

// Track usage events
await commet.usage.create({
  feature: 'api_call',
  value: 1,
  customerId: 'cus_123'
});

// Manage seats
await commet.seats.add({
  customerId: 'cus_123',
  seatType: 'admin',
  count: 5
});

// Check feature access
const feature = await commet.features.check({
  externalId: 'user_123',
  code: 'api_calls'
});

// Generate customer portal link
const portal = await commet.portal.getUrl({
  externalId: 'user_123'
});
```

## Type Safety

Use the [Commet CLI](https://www.npmjs.com/package/commet) to generate TypeScript types from your organization:

```bash
npm install -g commet
commet login
commet link
commet pull
```

This generates type-safe autocomplete for your plan codes, feature codes, and seat types.

## Documentation

Visit [commet.co/docs](https://commet.co/docs) for:

- Complete API reference
- Advanced usage examples
- Error handling
- Best practices

## Resources

- [CLI Documentation](https://commet.co/docs)
- [SDK Reference](https://commet.co/docs)
- [GitHub](https://github.com/commet-labs/commet)
- [Issues](https://github.com/commet-labs/commet/issues)

## License

MIT
