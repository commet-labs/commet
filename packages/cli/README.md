<div align="center">
  <p align="center">
    <a href="https://commet.co">
      <img src="https://commet.co/logo-bg-dark.png" height="96">
      <h3 align="center">Commet CLI</h3>
    </a>
  </p>
  <p>CLI for Commet billing platform</p>

  <a href="https://www.npmjs.com/package/commet"><img alt="NPM version" src="https://img.shields.io/npm/v/commet.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="https://commet.co/docs/library/cli/overview"><img alt="Documentation" src="https://img.shields.io/badge/docs-CLI-blue.svg?style=for-the-badge&labelColor=000000"></a>
</div>

<br/>

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

await commet.usage.create({
  eventType: 'api_call', // Autocomplete works!
  customerId: 'cus_123'
});

await commet.subscriptions.create({
  productId: 'prod_xxx', // Autocomplete with your products!
  customerId: 'cus_123'
});
```

## Commands

```bash
commet login           # Authenticate with Commet
commet logout          # Remove credentials
commet link            # Link project to organization
commet pull            # Generate TypeScript types
commet info            # Show project status
commet list events     # List event types
commet list seats      # List seat types
```

## Documentation

Visit [commet.co/docs/library/cli/overview](https://commet.co/docs/library/cli/overview) for:

- Complete command reference
- Configuration guide
- Workflow examples
- Troubleshooting

## Resources

- [CLI Documentation](https://commet.co/docs/library/cli/overview)
- [SDK Reference](https://commet.co/docs/library/quickstart)
- [GitHub](https://github.com/commet-labs/commet)
- [Issues](https://github.com/commet-labs/commet/issues)

## License

MIT
