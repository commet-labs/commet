# Customers

API version: `2026-07-31`

## revokeCredit

`commet.customers.revokeCredit(params, options?)`

`POST /customers/{id}/credits/{creditId}/revoke` · operation `revoke-customer-credit`

Revoke the unallocated remainder of a customer credit grant. Applied invoice history is unchanged.

### Parameters

- `id` (`string`, required)
- `creditId` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CustomerCreditRevocation`

## listCredits

`commet.customers.listCredits(params)`

`GET /customers/{id}/credits` · operation `list-customer-credits`

List currency-specific invoice credit grants and their remaining balances for a customer.

### Parameters

- `id` (`string`, required)

### Returns

`{ object: "list"; data: Array<CustomerCredit>; hasMore: boolean; nextCursor?: string }`

## createCredit

`commet.customers.createCredit(params, options?)`

`POST /customers/{id}/credits` · operation `create-customer-credit`

Grant monetary credit in one currency. Credit is applied FIFO before tax to eligible recurring invoices.

### Parameters

- `id` (`string`, required)
- `amount` (`number`, required) — Amount in the currency's smallest unit.
- `currency` (`"usd" | "ars" | "brl" | "clp" | "cop" | "pen" | "uyu" | "pyg" | "bob" | "mxn" | "cad" | "eur" | "jpy" | "cny" | "krw" | "hkd" | "sgd" | "twd" | "inr" | "thb"`, required)
- `reason` (`string`, required)
- `expiresAt` (`string | null`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CustomerCredit`

## revokePlanGrant

`commet.customers.revokePlanGrant(params, options?)`

`POST /customers/{id}/plan-grants/{grantId}/revoke` · operation `revoke-plan-grant`

End complimentary access immediately. The next full-price period becomes pending payment and requires checkout; no past period is billed retroactively.

### Parameters

- `id` (`string`, required)
- `grantId` (`string`, required)
- `reason` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanGrant`

## updatePlanGrant

`commet.customers.updatePlanGrant(params, options?)`

`PATCH /customers/{id}/plan-grants/{grantId}` · operation `update-plan-grant`

Give the grant a remaining number of billing cycles, set an exact deadline, or keep it active until revoked.

### Parameters

- `id` (`string`, required)
- `grantId` (`string`, required)
- `reason` (`string`, required)
- `duration` (`"cycles" | "until_date" | "until_revoked"`, required)
- `durationCycles` (`number`, optional)
- `expiresAt` (`string`, optional)

### Valid parameter combinations

- `reason` + `duration` + `durationCycles`
- `reason` + `duration` + `expiresAt`
- `reason` + `duration`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanGrant`

## listPlanGrants

`commet.customers.listPlanGrants(params)`

`GET /customers/{id}/plan-grants` · operation `list-plan-grants`

List the independent audit timeline for paid-plan access granted without checkout or payment credentials.

### Parameters

- `id` (`string`, required)

### Returns

`{ object: "list"; data: Array<PlanGrant>; hasMore: boolean; nextCursor?: string }`

## createPlanGrant

`commet.customers.createPlanGrant(params, options?)`

`POST /customers/{id}/plan-grants` · operation `create-plan-grant`

Move an active free subscription to an eligible paid plan immediately without checkout, a card, or customer credit. The grant may last for exact billing cycles, until a date, or until revoked.

### Parameters

- `id` (`string`, required)
- `planId` (`string`, required)
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly"`, required)
- `reason` (`string`, required)
- `duration` (`"cycles" | "until_date" | "until_revoked"`, required)
- `durationCycles` (`number`, optional)
- `expiresAt` (`string`, optional)

### Valid parameter combinations

- `planId` + `billingInterval` + `reason` + `duration` + `durationCycles`
- `planId` + `billingInterval` + `reason` + `duration` + `expiresAt`
- `planId` + `billingInterval` + `reason` + `duration`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanGrant`

## get

`commet.customers.get(params)`

`GET /customers/{id}` · operation `get-customer`

Retrieve a customer by their public ID, including subscription status and metadata.

### Parameters

- `id` (`string`, required)

### Returns

`Customer`

## update

`commet.customers.update(params, options?)`

`PATCH /customers/{id}` · operation `update-customer`

Update a customer's name, external ID, or metadata.

### Parameters

- `id` (`string`, required)
- `email` (`string`, optional)
- `fullName` (`string`, optional)
- `taxDocument` (`string`, optional)
- `externalId` (`string`, optional)
- `timezone` (`Timezone`, optional)
- `metadata` (`Record<string, unknown>`, optional)
- `address` (`{ line1: string; line2?: string; city: string; state?: string; postalCode: string; country: string; region?: string }`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Customer`

## createBatch

`commet.customers.createBatch(params, options?)`

`POST /customers/batch` · operation `batch-create-customers`

Create up to 100 customers in a single request.

### Parameters

- `customers` (`Array<{ email: string; id?: string; externalId?: string; fullName?: string; taxDocument?: string; timezone?: Timezone; metadata?: Record<string, unknown>; address?: { line1: string; line2?: string; city: string; state?: string; postalCode: string; country: string; region?: string } }>`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CustomerBatch`

## list

`commet.customers.list(params?)`

`GET /customers` · operation `list-customers`

List customers with cursor-based pagination.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)
- `externalId` (`string`, optional)

### Returns

`{ object: "list"; data: Array<Customer>; hasMore: boolean; nextCursor?: string }`

## create

`commet.customers.create(params, options?)`

`POST /customers` · operation `create-customer`

Create a new customer. Idempotent when customerId is provided.

### Parameters

- `id` (`string`, optional)
- `externalId` (`string`, optional)
- `fullName` (`string`, optional)
- `taxDocument` (`string`, optional)
- `address` (`{ line1: string; line2?: string; city: string; state?: string; postalCode: string; country: string; region?: string }`, optional)
- `addressId` (`string`, optional)
- `email` (`string`, required)
- `timezone` (`Timezone`, optional)
- `metadata` (`Record<string, unknown>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Customer`
