# Commet Monorepo

This monorepo contains the Commet SDK and CLI tools for billing platform integration.

## Packages

- **[@commet/node](./packages/node)** - TypeScript SDK for Node.js
- **[commet](./packages/cli)** - CLI tool for development and type generation

## Features

- 📦 **Modular Architecture**: SDK and CLI are separate, independently versioned packages
- 🔐 **OAuth Authentication**: Secure device flow for CLI
- 📝 **Type Generation**: Auto-generate TypeScript types from your Commet setup
- 🚀 **Usage Tracking**: Send events for consumption-based billing
- 💺 **Seat Management**: Manage per-seat licensing
- 👥 **Customer Management**: Create and manage customers programmatically

## Quick Start

### SDK Usage

```bash
npm install @commet/node
```

```typescript
import { Commet } from '@commet/node';

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
  environment: 'production', // or 'sandbox'
});

// Track usage
await commet.usage.events.create({
  eventType: 'api_call',
  customerId: 'cus_123',
});

// Manage seats
await commet.seats.add('cus_123', 'admin', 5);

// Create customer
const customer = await commet.customers.create({
  legalName: 'Acme Corporation',
  currency: 'USD',
});
```

### CLI Usage

```bash
npm install -g commet
```

```bash
# Authenticate
commet login

# Link project to organization
commet link

# Generate TypeScript types
commet pull

# List available types
commet list events
commet list seats
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Watch mode (rebuilds on change)
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format code
pnpm format
```

## Publishing

This monorepo uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### Creating a Changeset

When you make changes that should trigger a version bump:

```bash
pnpm changeset
```

Select the packages affected, choose the version bump type (major/minor/patch), and write a summary of changes.

### Release Process

1. Make changes and create changesets
2. Commit and push to `main`
3. CI automatically creates a "Version Packages" PR
4. Review and merge the PR
5. CI automatically publishes to npm with provenance

## Documentation

- [SDK Documentation](./packages/node/README.md)
- [CLI Documentation](./packages/cli/README.md)
- [Online Docs](https://docs.commet.co)
- [API Reference](https://docs.commet.co/api)

## License

MIT - see LICENSE file for details
