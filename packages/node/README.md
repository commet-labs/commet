<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">Commet</h3>
    </a>
  </p>
  <p>TypeScript SDK for Commet billing platform</p>

  <a href="https://www.npmjs.com/package/@commet/node"><img alt="NPM version" src="https://img.shields.io/npm/v/@commet/node.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://commet.co/docs/library/quickstart"><img alt="Documentation" src="https://img.shields.io/badge/docs-SDK-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

## Installation

```bash
npm install @commet/node
```

## Quick Start

```typescript
import { Commet } from '@commet/node';

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY,
  environment: 'production' // or 'sandbox'
});
```

## Usage

```typescript
// Track usage events
await commet.usage.create({
  eventType: 'api_call',
  customerId: 'cus_123'
});

// Manage seats
await commet.seats.add({
  customerId: 'cus_123',
  seatType: 'admin',
  count: 5
});

// Create subscriptions
await commet.subscriptions.create({
  productId: 'prod_xxx',
  customerId: 'cus_123',
  status: 'active'
});

// Manage customers
await commet.customers.create({
  legalName: 'Acme Corp',
  billingEmail: 'billing@acme.com'
});

// Generate customer portal access
await commet.portal.requestAccess({
  externalId: 'my-customer-123'
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

This generates type-safe autocomplete for your event types, seat types, and products.

## Documentation

Visit [commet.co/docs/library/quickstart](https://commet.co/docs/library/quickstart) for:

- Complete API reference
- Advanced usage examples
- Error handling
- Best practices

## Resources

- [CLI Documentation](https://commet.co/docs/library/cli/overview)
- [SDK Reference](https://commet.co/docs/library/quickstart)
- [GitHub](https://github.com/commet-labs/commet)
- [Issues](https://github.com/commet-labs/commet/issues)

## License

MIT
