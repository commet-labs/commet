# Migration to Monorepo Structure

This document describes the migration from a single-package repository to a monorepo with separate SDK and CLI packages.

## What Changed

### Package Structure

**Before:**
```
commet-node/
├── src/
│   ├── client.ts         (SDK)
│   ├── resources/        (SDK)
│   ├── types/            (SDK)
│   ├── utils/            (SDK)
│   └── cli/              (CLI)
├── bin/commet            (CLI)
└── package.json          (Combined)
```

**After:**
```
commet-node/
├── packages/
│   ├── node/             (@commet/node - SDK)
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsup.config.ts
│   └── cli/              (commet - CLI)
│       ├── src/
│       ├── bin/commet
│       ├── package.json
│       └── tsup.config.ts
└── package.json          (Monorepo root)
```

### Package Names

- **SDK**: `commet` → `@commet/node`
- **CLI**: Stays as `commet`

### Breaking Changes for Users

#### SDK Users

**Before:**
```typescript
import { Commet } from 'commet';
```

**After:**
```typescript
import { Commet } from '@commet/node';
```

**Migration:**
1. Update package.json: `"commet"` → `"@commet/node"`
2. Update all imports: `from 'commet'` → `from '@commet/node'`
3. Run `npm install` (or `pnpm install`)

#### CLI Users

No changes needed! The CLI package name remains `commet`.

```bash
npm install -g commet  # Still works
commet login           # All commands unchanged
```

### New Features

1. **Independent Versioning**: SDK and CLI can have different versions
2. **Smaller SDK**: No CLI dependencies in the SDK package
3. **Better Build Process**: Turbo for parallel builds and caching
4. **Changesets**: Automated versioning and publishing

## For Contributors

### Development Workflow

**Install dependencies:**
```bash
pnpm install
```

**Build all packages:**
```bash
pnpm build
```

**Watch mode:**
```bash
pnpm dev
```

**Type checking:**
```bash
pnpm typecheck
```

**Linting:**
```bash
pnpm lint
pnpm lint:fix
```

### Making Changes

When you make changes that should trigger a version bump:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select affected packages (@commet/node, commet, or both)
2. Choose version bump type (major/minor/patch)
3. Write a summary of changes

Commit the generated `.changeset/*.md` file along with your changes.

### Publishing

Publishing is automated via GitHub Actions:

1. Push changes to `main` branch
2. CI creates a "Version Packages" PR
3. Review and merge the PR
4. CI automatically publishes to npm

## Technical Details

### Workspace Configuration

- **Package Manager**: pnpm with workspaces
- **Build System**: Turbo for parallel builds
- **Versioning**: Changesets for independent versioning
- **Linter**: Biome for formatting and linting
- **Bundler**: tsup for both packages

### CI/CD

- **CI Workflow**: Type check, lint, and build on PRs
- **Release Workflow**: Automated publishing with Changesets
- **npm Publishing**: OIDC with provenance for security

### Migration Commit

This migration was completed in a single commit that:
1. Created pnpm workspace structure
2. Split code into packages/node and packages/cli
3. Configured Changesets for versioning
4. Updated GitHub Actions workflows
5. Updated documentation

## Rollback Plan

If issues arise, you can temporarily install the last pre-monorepo version:

```bash
npm install commet@0.2.x  # Last version before monorepo
```

## Questions?

- Open an issue: https://github.com/commet-labs/commet-node/issues
- Read docs: https://docs.commet.co

