# Feature Access

API version: `2026-07-31`

## get

`commet.featureAccess.get(params)`

`GET /feature-access/{code}` · operation `get-feature-access`

Get one feature's access and current usage for a customer. To evaluate a prospective consumption, use POST /usage/check.

### Parameters

- `code` (`string`, required)
- `customerId` (`string`, required)

### Returns

`FeatureAccess`

## list

`commet.featureAccess.list(params)`

`GET /feature-access` · operation `list-feature-access`

List a customer's feature access and current usage.

### Parameters

- `customerId` (`string`, required)

### Returns

`{ object: "list"; data: Array<FeatureAccess>; hasMore: boolean; nextCursor?: string }`
