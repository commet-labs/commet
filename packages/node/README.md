# @commet/node

TypeScript SDK for Commet billing platform - track usage, manage seats, and handle customers.

## Installation

```bash
npm install @commet/node
# or
pnpm add @commet/node
# or
yarn add @commet/node
```

## Quick Start

```typescript
import { Commet } from '@commet/node';

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
  environment: 'production', // or 'sandbox' (default)
  debug: false, // Enable debug logging
});
```

## Usage Examples

### Usage Events (Consumption-Based Billing)

```typescript
// Send a single event using customerId (Commet's ID)
await commet.usage.create({
  eventType: 'api_call',
  customerId: 'cus_123',
  timestamp: new Date().toISOString(),
  properties: [
    { property: 'endpoint', value: '/api/users' },
    { property: 'method', value: 'GET' }
  ]
});

// OR use your own externalId
await commet.usage.create({
  eventType: 'api_call',
  externalId: 'my-customer-123', // Your own customer ID
  timestamp: new Date().toISOString(),
  properties: [
    { property: 'endpoint', value: '/api/users' },
    { property: 'method', value: 'GET' }
  ]
});

// Batch events
await commet.usage.createBatch({
  events: [
    { eventType: 'api_call', externalId: 'my-customer-123' },
    { eventType: 'api_call', customerId: 'cus_456' },
  ]
});

// List events
const events = await commet.usage.list({
  externalId: 'my-customer-123', // Or use customerId
  limit: 100
});
```

### Seat Management (Per-Seat Licensing)

```typescript
// Add seats using customerId or externalId
await commet.seats.add({
  externalId: 'my-customer-123', // Or use customerId: 'cus_123'
  seatType: 'admin',
  count: 5
});

// Remove seats
await commet.seats.remove({
  externalId: 'my-customer-123',
  seatType: 'admin',
  count: 2
});

// Set exact count
await commet.seats.set({
  externalId: 'my-customer-123',
  seatType: 'admin',
  count: 10
});

// Get balance
const balance = await commet.seats.getBalance({
  externalId: 'my-customer-123',
  seatType: 'admin'
});
console.log(balance.data.current); // 10

// Get all balances for a customer
const allBalances = await commet.seats.getAllBalances({
  externalId: 'my-customer-123'
});

// Bulk update multiple seat types
await commet.seats.bulkUpdate({
  externalId: 'my-customer-123',
  seats: {
    admin: 5,
    editor: 20,
    viewer: 100
  }
});

// List seat events
const events = await commet.seats.listEvents({
  externalId: 'my-customer-123',
  limit: 50
});
```

### Customer Management

```typescript
// Create customer
const customer = await commet.customers.create({
  legalName: 'Acme Corporation',
  displayName: 'Acme',
  currency: 'USD',
  taxStatus: 'TAXED',
  address: {
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'US'
  },
  billingEmail: 'billing@acme.com'
});

// Update customer
await commet.customers.update('cus_123', {
  displayName: 'Acme Inc',
  billingEmail: 'finance@acme.com'
});

// List customers
const customers = await commet.customers.list({
  isActive: true,
  limit: 50
});

// Deactivate customer
await commet.customers.deactivate('cus_123');
```

## API Reference

### Configuration

```typescript
interface CommetConfig {
  apiKey: string;           // Required: Your Commet API key
  environment?: 'sandbox' | 'production'; // Default: 'sandbox'
  debug?: boolean;          // Default: false
  timeout?: number;         // Request timeout in ms (default: 30000)
  retries?: number;         // Max retry attempts (default: 3)
}
```

### Resources

- `commet.usage` - Usage event tracking
- `commet.seats` - Seat management
- `commet.customers` - Customer CRUD operations

### Error Handling

```typescript
import { CommetAPIError, CommetValidationError } from '@commet/node';

try {
  await commet.usage.create({ ... });
} catch (error) {
  if (error instanceof CommetValidationError) {
    console.error('Validation errors:', error.validationErrors);
  } else if (error instanceof CommetAPIError) {
    console.error('API error:', error.statusCode, error.message);
  }
}
```

## Environment Detection

```typescript
// Check environment
console.log(commet.getEnvironment()); // 'sandbox' | 'production'
console.log(commet.isSandbox());      // boolean
console.log(commet.isProduction());   // boolean
```

## TypeScript Support

Fully typed with TypeScript. All API responses and parameters are type-safe.

```typescript
import type {
  Customer,
  UsageEvent,
  SeatBalance,
  Currency
} from '@commet/node';
```

## Links

- [Documentation](https://docs.commet.co)
- [API Reference](https://docs.commet.co/api)
- [GitHub](https://github.com/commet-labs/commet-node)
- [Issues](https://github.com/commet-labs/commet-node/issues)

## License

MIT

