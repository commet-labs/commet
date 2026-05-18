---
"@commet/node": minor
---

Add `featureCode` as the recommended param for seats operations (`add`, `remove`, `set`, `getBalance`). The `seatType` param is now deprecated but continues to work. Response objects now include both `featureCode` and `seatType` fields.
