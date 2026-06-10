<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">Commet CLI</h3>
    </a>
  </p>
  <p>CLI for Commet billing platform</p>

  <a href="https://www.npmjs.com/package/commet"><img alt="NPM version" src="https://img.shields.io/npm/v/commet.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://commet.co/docs"><img alt="Documentation" src="https://img.shields.io/badge/docs-CLI-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

Manage your [Commet](https://commet.co) project from the terminal. Link to your organization, generate TypeScript types for autocomplete on plan codes and feature codes, and inspect your billing setup.

## Installation

```bash
npm install -g commet
```

## Quick Start

```bash
# Authenticate
commet login

# Link to organization
commet link

# Generate types
commet pull
```

## Type Generation

The CLI generates TypeScript types from your organization for type-safe autocomplete:

```typescript
// After running 'commet pull'
import { Commet } from '@commet/node';

const commet = new Commet({ apiKey: '...' });

await commet.usage.track({
  feature: 'api_calls', // Autocomplete works!
  customerId: 'cus_123'
});

await commet.subscriptions.create({
  planCode: 'pro', // Autocomplete with your plans!
  customerId: 'cus_123'
});
```

## Commands

```bash
commet login           # Authenticate with Commet
commet logout          # Remove credentials
commet link            # Link project to organization
commet orgs            # List your organizations
commet pull            # Fetch billing config and generate commet.config.ts
commet push            # Push commet.config.ts to Commet
commet listen <url>    # Forward webhook events to your local server
commet features list   # List the feature catalog
commet plans list      # List plans
commet customers list  # List customers
```

## Documentation

Visit [commet.co/docs](https://commet.co/docs) for:

- Complete command reference
- Configuration guide
- Workflow examples
- Troubleshooting

## Resources

- [CLI Documentation](https://commet.co/docs)
- [SDK Reference](https://commet.co/docs)
- [GitHub](https://github.com/commet-labs/commet)
- [Issues](https://github.com/commet-labs/commet/issues)

## License

MIT
