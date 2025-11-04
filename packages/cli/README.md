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

# 2. Navigate to your project directory
cd apps/dashboard  # Recommended: use TypeScript project with tsconfig.json

# 3. Link your project to an organization
commet link

# 4. Generate TypeScript types (automatically updates tsconfig.json and .gitignore if found)
commet pull
```

## Commands

### Authentication

#### `commet login`

Authenticate with Commet using OAuth device flow.

```bash
commet login
```

Prompts you to select an environment (Sandbox or Production), then opens your browser to authenticate. Creates `~/.commet/auth.json` with your credentials.

**Important:** Sandbox and Production are completely isolated platforms with separate accounts:
- **Sandbox**: `sandbox.commet.co` - Development and testing
- **Production**: `commet.co` - Live billing operations

Make sure to login to the correct environment for your needs.

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
cd apps/dashboard
commet link
```

**What it does:**
- Creates `.commet/config.json` with organization configuration
- Works anywhere, but for best experience use a TypeScript project directory

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
cd apps/dashboard  # Recommended: TypeScript project directory
commet pull
```

**What it does:**
1. Generates `.commet/types.d.ts` with your event and seat types
2. Automatically updates `tsconfig.json` to include the types file (if found)
3. Automatically updates `.gitignore` to exclude `.commet/` directory

**Note:** Works anywhere, but if no `tsconfig.json` is found, you'll need to manually configure TypeScript to include the generated types.

**Generated types:**

```typescript
// .commet/types.d.ts
declare module '@commet/node' {
  interface CommetGeneratedTypes {
    eventType: "api_call" | "email_sent" | "payment_processed";
    seatType: "admin" | "editor" | "viewer";
  }
}

export {};
```

**Usage with the SDK:**

```typescript
import { Commet } from '@commet/node';

const commet = new Commet({ apiKey: '...' });

// Type-safe event tracking - autocomplete works automatically!
await commet.usage.events.create({
  customerId: 'cus_123',
  eventType: 'api_call', // Autocomplete works!
  timestamp: new Date().toISOString(),
});

// Type-safe seat management
await commet.seats.add('cus_123', 'admin', 5);
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
  "expiresAt": 1234567890,
  "environment": "sandbox"
}
```

The `environment` field determines which platform your authentication is for (sandbox or production).

### Project Config (`.commet/config.json`)

Stores project-specific configuration. Created by `commet link`.

```json
{
  "orgId": "org_123",
  "orgName": "My Organization",
  "environment": "sandbox"
}
```

**Note:** The `.commet/` directory is automatically added to `.gitignore` by `commet pull`. This directory contains:
- `config.json` - Project configuration
- `types.d.ts` - Generated TypeScript type definitions

Add `.commet/` to `.gitignore` if different developers use different organizations.

## Environments

Commet supports two completely isolated environments:

- **Sandbox** (`sandbox.commet.co`): Development and testing with separate data
- **Production** (`commet.co`): Live billing operations with real customers

**Important:** Each environment requires separate authentication because they are independent platforms. To work with both:

1. Login to sandbox: `commet login` → Select "Sandbox"
2. Do your work in sandbox
3. When ready for production: `commet logout` → `commet login` → Select "Production"

Organizations and data do NOT transfer between environments.

## Workflow

Typical development workflow:

```bash
# 1. One-time setup (Sandbox)
commet login           # Select "Sandbox"
cd apps/dashboard      # Navigate to your TypeScript project (must have tsconfig.json)
commet link            # Choose your organization
commet pull            # Generate types (auto-updates tsconfig.json and .gitignore)

# 2. Develop with type-safe autocomplete
# Your IDE now has full autocomplete for event and seat types!

# 3. When you add/change event or seat types in dashboard
commet pull            # Regenerate types

# 4. When ready for production
commet logout
commet login           # Select "Production"
cd apps/dashboard      # Same TypeScript project directory
commet link            # Link to production organization
commet pull            # Generate production types
```

## Troubleshooting

### "Not authenticated"

Run `commet login` to authenticate.

### "No tsconfig.json found" (Warning)

This is just a warning - the CLI will still work, but won't automatically update your `tsconfig.json`.

For the best experience, run commands from a TypeScript project directory:

```bash
cd apps/dashboard  # Directory with tsconfig.json
commet link
commet pull
```

The CLI will automatically add `.commet/types.d.ts` to your TypeScript configuration.

### "Project not linked"

Run `commet link` to connect your project to an organization.

### "No types found"

Create event types and seat types in your Commet dashboard first, then run `commet pull`.

### "Could not update tsconfig.json"

The CLI will show a warning but continue. Manually add `.commet/types.d.ts` to your `tsconfig.json`:

```json
{
  "include": [".commet/types.d.ts", "src/**/*"]
}
```

### Authentication expired

Run `commet login` again. Tokens expire after a certain period.

## Links

- [Documentation](https://docs.commet.co)
- [API Reference](https://docs.commet.co/api)
- [GitHub](https://github.com/commet-labs/commet-node)
- [Issues](https://github.com/commet-labs/commet-node/issues)

## License

MIT

