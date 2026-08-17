# Invoices

API version: `2026-07-31`

## getDownloadUrl

`commet.invoices.getDownloadUrl(params, options?)`

`POST /invoices/{id}/download-links` · operation `download-invoice`

Generate a signed URL to download the invoice as a PDF. The URL expires after 7 days.

### Parameters

- `id` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`InvoiceDownload`

## get

`commet.invoices.get(params)`

`GET /invoices/{id}` · operation `get-invoice`

Retrieve a single invoice by its public ID, including line items.

### Parameters

- `id` (`string`, required)

### Returns

`Invoice`

## send

`commet.invoices.send(params, options?)`

`POST /invoices/{id}/send` · operation `send-invoice`

Send the invoice to the customer via email.

### Parameters

- `id` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`SentInvoice`

## updateStatus

`commet.invoices.updateStatus(params, options?)`

`PATCH /invoices/{id}/status` · operation `update-invoice-status`

Mark an outstanding invoice as "paid" or "void" and return the updated invoice. Cannot change the status of already paid or voided invoices.

### Parameters

- `id` (`string`, required)
- `status` (`"paid" | "void"`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Invoice`

## list

`commet.invoices.list(params?)`

`GET /invoices` · operation `list-invoices`

List invoices with cursor-based pagination. Filter by customer, status, or subscription.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)
- `customerId` (`string`, optional)
- `status` (`"draft" | "outstanding" | "paid" | "void" | "uncollectible"`, optional)
- `subscriptionId` (`string`, optional)

### Returns

`{ object: "list"; data: Array<InvoiceListItem>; hasMore: boolean; nextCursor?: string }`

## createAdjustment

`commet.invoices.createAdjustment(params, options?)`

`POST /invoices` · operation `create-adjustment-invoice`

Create a one-off adjustment invoice and return the created invoice. Use a negative amount for a credit.

### Parameters

- `customerId` (`string`, required)
- `amount` (`number`, required)
- `description` (`string`, required)
- `metadata` (`Record<string, unknown>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Invoice`
