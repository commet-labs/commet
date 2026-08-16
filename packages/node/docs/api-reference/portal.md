# Portal

API version: `2026-07-31`

## getUrl

`commet.portal.getUrl(params, options?)`

`POST /portal/sessions` · operation `request-portal-access`

Generate a customer portal URL. Exactly one identifier (email or customerId) is required.

### Parameters

- `email` (`string`, optional)
- `returnUrl` (`string`, optional)
- `customerId` (`string`, optional)

### Valid parameter combinations

- `email`
- `customerId`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PortalAccess`
