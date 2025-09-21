# @commet/sdk

TypeScript SDK for Commet billing and usage tracking.

## Install

```bash
npm install @commet/sdk
```

## Quick Start

```typescript
import { Commet } from '@commet/sdk';

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
});

// Track usage
await commet.usage.events.create({
  eventType: 'api_call',
  customerId: 'cus_123',
});

// Manage seats
await commet.seats.add('cus_123', 'admin', 5);

// Create customer
const customer = await commet.customers.create({
  legalName: 'Acme Corporation',
  currency: 'USD',
  address: { /* address info */ }
});
```

## Documentation

See [docs](https://docs.commet.co) for complete documentation.