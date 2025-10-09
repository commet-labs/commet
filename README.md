# Commet

TypeScript SDK and CLI for Commet billing platform.

## Features

- 📦 **Dual Package**: Works as both SDK and CLI
- 🔐 **OAuth Authentication**: Secure device flow for CLI
- 📝 **Type Generation**: Auto-generate TypeScript types from your Commet setup
- 🚀 **Usage Tracking**: Send events for consumption-based billing
- 💺 **Seat Management**: Manage per-seat licensing
- 👥 **Customer Management**: Create and manage customers programmatically

## Installation

### As SDK (Library)

```bash
npm install commet
```

### As CLI (Global)

```bash
npm install -g commet
```

## Quick Start

```typescript
import { Commet } from 'commet';

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

## CLI Usage

The CLI provides type-safe development with auto-generated TypeScript types.

```bash
# Authenticate
commet login

# Link project to organization
commet link

# Generate TypeScript types
commet pull
```

This generates `.commet.d.ts` with your event and seat types:

```typescript
import { Commet } from 'commet';
import type { CommetEventType, CommetSeatType } from './.commet';

const commet = new Commet({ apiKey: process.env.COMMET_API_KEY });

// Autocomplete works!
await commet.usage.sendEvent<CommetEventType>({
  customerId: 'cust_123',
  eventType: 'api_call', // ✓ Type-safe
  timestamp: new Date(),
});
```

See [CLI.md](./CLI.md) for complete CLI documentation.

## Documentation

- [SDK Documentation](https://docs.commet.co)
- [CLI Documentation](./CLI.md)
- [API Reference](https://docs.commet.co/api)