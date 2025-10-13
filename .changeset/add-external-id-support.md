---
"@commet/node": patch
---

Add externalId support to all resource methods. All customer-related operations now accept either `customerId` or `externalId` as an alternative identifier, allowing users to reference customers using their own internal IDs.

**Changes:**
- Seats: `add()`, `remove()`, `set()`, `bulkUpdate()`, `getBalance()`, `getAllBalances()`, `listEvents()` now accept `externalId`
- Usage: `create()`, `createBatch()`, `list()` now accept `externalId` 
- Customers: Already supported `externalId` in create, update, and list operations

**Example:**
```typescript
// Using externalId instead of customerId
await commet.seats.add({
  externalId: "stripe_cus_xyz",
  seatType: "admin",
  count: 5
});

await commet.usage.create({
  eventType: "api_call",
  externalId: "my_internal_id_123",
  properties: [{ property: "endpoint", value: "/users" }]
});
```

