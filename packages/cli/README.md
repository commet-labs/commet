# commet

CLI tool for Commet billing platform - authentication, project linking, and type generation.

## Installation

```bash
npm install -g commet
# or
pnpm add -g commet
# or
yarn global add commet
```

## Quick Start

```bash
# 1. Authenticate with Commet
commet login

# 2. Link your project to an organization
commet link

# 3. Generate TypeScript types
commet pull
```

## Commands

### Authentication

#### `commet login`

Authenticate with Commet using OAuth device flow.

```bash
commet login
```

Opens your browser to authenticate. Creates `~/.commet/auth.json` with your credentials.

#### `commet logout`

Log out and remove stored credentials.

```bash
commet logout
```

#### `commet whoami`

Display current authentication and project status.

```bash
commet whoami
```

### Project Management

#### `commet link`

Link the current directory to a Commet organization.

```bash
commet link
```

Creates `.commet` file in the current directory with organization configuration.

#### `commet unlink`

Unlink the current directory from Commet.

```bash
commet unlink
```

#### `commet switch`

Switch to a different organization or environment.

```bash
commet switch
```

#### `commet info`

Display detailed information about the current project.

```bash
commet info
```

### Type Generation

#### `commet pull`

Generate TypeScript type definitions from your Commet configuration.

```bash
commet pull
# or specify output file
commet pull -o types/commet.d.ts
```

Creates `.commet.d.ts` with your event and seat types:

```typescript
// .commet.d.ts
export type CommetEventType = "api_call" | "email_sent" | "payment_processed";
export type CommetSeatType = "admin" | "editor" | "viewer";
```

Use with the SDK:

```typescript
import { Commet } from '@commet/node';
import type { CommetEventType, CommetSeatType } from './.commet';

const commet = new Commet({ apiKey: '...' });

// Type-safe event tracking
await commet.usage.events.create<CommetEventType>({
  customerId: 'cus_123',
  eventType: 'api_call', // Autocomplete works!
  timestamp: new Date().toISOString(),
});

// Type-safe seat management
await commet.seats.add<CommetSeatType>('cus_123', 'admin', 5);
```

### Type Inspection

#### `commet list events`

List all event types in your organization.

```bash
commet list events
```

#### `commet list seats`

List all seat types in your organization.

```bash
commet list seats
```

## Configuration Files

### Global Config (`~/.commet/auth.json`)

Stores authentication credentials. Created by `commet login`.

```json
{
  "token": "...",
  "refreshToken": "...",
  "expiresAt": 1234567890
}
```

### Project Config (`.commet`)

Stores project-specific configuration. Created by `commet link`.

```json
{
  "orgId": "org_123",
  "orgName": "My Organization",
  "environment": "sandbox"
}
```

**Note:** Add `.commet` to `.gitignore` if different developers use different organizations.

## Environments

Commet supports two environments:

- **Sandbox**: Development and testing (default)
- **Production**: Live billing operations

Select environment during `commet link` or `commet switch`.

## Workflow

Typical development workflow:

```bash
# 1. One-time setup
commet login
commet link

# 2. Generate types when you add/change event or seat types
commet pull

# 3. Use types in your code with autocomplete
# (see TypeScript examples above)

# 4. Switch environments when needed
commet switch  # Select production
```

## Troubleshooting

### "Not authenticated"

Run `commet login` to authenticate.

### "Project not linked"

Run `commet link` to connect your project to an organization.

### "No types found"

Create event types and seat types in your Commet dashboard first, then run `commet pull`.

### Authentication expired

Run `commet login` again. Tokens expire after a certain period.

## Links

- [Documentation](https://docs.commet.co)
- [API Reference](https://docs.commet.co/api)
- [GitHub](https://github.com/commet-labs/commet-node)
- [Issues](https://github.com/commet-labs/commet-node/issues)

## License

MIT

