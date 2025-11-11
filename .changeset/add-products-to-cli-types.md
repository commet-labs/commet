---
"commet": minor
"@commet/node": minor
---

Add product types to CLI and SDK for automatic type inference

- CLI now fetches and generates productId types from the organization's products
- Added products list to the API endpoint `/api/cli/types` in the backend
- SDK includes new `GeneratedProductId` helper type for type-safe product IDs
- Updated `CreateSubscriptionParams` to use `GeneratedProductId` for autocomplete support
- CLI `pull` command now displays products count in the output
- Generated types file includes all products with names and descriptions in comments
- Module augmentation now includes `productId` in `CommetGeneratedTypes` interface

After running `commet pull`, developers get automatic autocomplete for productId when creating subscriptions, matching the existing behavior for eventType and seatType.

