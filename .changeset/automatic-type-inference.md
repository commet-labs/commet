---
"@commet/node": minor
"commet": patch
---

Implement automatic type inference via module augmentation. Types are now automatically applied after running `commet pull` without needing to pass generic type parameters.

**Breaking change for @commet/node users**: If you were using explicit generic types like `commet.usage.events.create<CommetEventType>()`, you can now simply use `commet.usage.events.create()` and TypeScript will automatically infer the correct types.

**CLI improvement**: The generated `.commet.d.ts` file is now simpler and only contains the module augmentation declaration, removing the exported `CommetEventType` and `CommetSeatType` types that are no longer needed.

