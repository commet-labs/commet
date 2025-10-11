---
"@commet/node": minor
---

**Simplified and RESTful API structure**

## Usage Events API

- **BREAKING**: Removed `UsageMetricsResource` - metrics are no longer accessible via SDK
- **BREAKING**: Simplified `UsageResource` - methods now directly on `commet.usage` instead of `commet.usage.events`
  - `commet.usage.events.create()` → `commet.usage.create()`
  - `commet.usage.events.list()` → `commet.usage.list()`
  - `commet.usage.events.retrieve()` → `commet.usage.retrieve()`
  - `commet.usage.events.delete()` → `commet.usage.delete()`
  - `commet.usage.events.createBatch()` → `commet.usage.createBatch()`

## Seats API

- **BREAKING**: Simplified endpoints to follow RESTful conventions
  - All operations now use `/api/seats` endpoint with proper HTTP verbs
  - `customerId` and `seatType` now sent in request body instead of URL path
  
- **Endpoint changes**:
  - `POST /customers/{id}/seats/{type}/add` → `POST /seats` with body `{ customerId, seatType, action: "add", count }`
  - `POST /customers/{id}/seats/{type}/remove` → `DELETE /seats` with body `{ customerId, seatType, count }`
  - `POST /customers/{id}/seats/{type}/set` → `PUT /seats` with body `{ customerId, seatType, count }`
  - `POST /customers/{id}/seats/bulk-update` → `PUT /seats/bulk` with body `{ customerId, seats }`
  - `GET /customers/{id}/seats/{type}/balance` → `GET /seats/balance?customerId=...&seatType=...`
  - `GET /customers/{id}/seats/balances` → `GET /seats/balances?customerId=...`

- **BREAKING**: Removed `getHistory()` method - use `listEvents()` instead

## HTTP Client

- Enhanced `delete()` method to support request body (valid per HTTP spec)
- Signature: `delete(endpoint, data?, options?)` instead of `delete(endpoint, options?)`

## Migration Guide

### Usage Events

```typescript
// Before
await commet.usage.events.create({ ... });
await commet.usage.metrics.list();

// After
await commet.usage.create({ ... });
// Metrics are no longer available
```

### Seats

```typescript
// Before
await commet.seats.add({ customerId: 'cus_123', seatType: 'admin', count: 5 });
await commet.seats.getHistory({ customerId: 'cus_123', seatType: 'admin' });

// After  
await commet.seats.add({ customerId: 'cus_123', seatType: 'admin', count: 5 }); // Same API, different backend endpoint
await commet.seats.listEvents({ customerId: 'cus_123', seatType: 'admin' }); // Use listEvents instead
```

**Note**: While the SDK method signatures remain mostly the same, the underlying HTTP requests have changed significantly. Backend APIs must be updated accordingly.

