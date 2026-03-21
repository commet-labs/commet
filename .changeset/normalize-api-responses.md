---
"@commet/node": patch
---

Update SDK to handle normalized API response shapes. Error responses now use `code` instead of `error` field. Validation errors use `details` array instead of `errors` object. Success responses no longer include `message` field.
