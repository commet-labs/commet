---
"commet": minor
---

Three new resource command groups complete the CLI's coverage of the @commet/node SDK surface:

- `commet payouts` — `request --amount <n>`, `add-bank-account --account-number <number> --account-holder-name <name>`, `complete-verification --email <email> --business-type <type> --business-url <url> --document-url <url> --bank <json>`
- `commet test-clock` — `get`, `advance --advance-days <n> | --frozen-time <ts>`, `process-billing` (sandbox only)
- `commet quota` — `add`, `set`, `remove`, `get`, `get-all` for customer quota allowances by feature code
