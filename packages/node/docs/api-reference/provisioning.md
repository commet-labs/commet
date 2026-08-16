# Provisioning

API version: `2026-07-31`

## createClaimLink

`commet.provisioning.createClaimLink(options?)`

`POST /claim-link` · operation `create-claim-link`

Issue a fresh claim link for an organization that was provisioned headlessly and has not been claimed yet. Any previously issued link stops working.

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`ClaimLink`
