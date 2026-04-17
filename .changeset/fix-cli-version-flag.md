---
"commet": patch
---

Fix `commet -V` and `commet --help` incorrectly printing "Error: 1.5.0" after valid output. Commander throws typed exit exceptions for version/help flags; the handler now checks the error `code` instead of the message.
