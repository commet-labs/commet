# Commet CLI

Command-line interface for the Commet billing platform.

## Installation

### Global Installation (CLI + SDK)

```bash
npm install -g commet
```

This installs both the SDK and the CLI globally.

### Local Installation (SDK only)

```bash
npm install commet
```

Use the SDK programmatically in your Node.js application.

## Quick Start

### 1. Authenticate

```bash
commet login
```

This will:
- Open your browser to authorize the CLI
- Display a code for manual entry if needed
- Save authentication credentials locally

### 2. Link Your Project

```bash
commet link
```

This will:
- Show your organizations
- Let you select one
- Choose environment (sandbox/production)
- Create a `.commet` config file in your project

### 3. Generate Types

```bash
commet pull
```

This generates a `.commet.d.ts` file with TypeScript types for:
- Your event types (for usage tracking)
- Your seat types (for seat licensing)

## Commands

### Authentication

#### `commet login`

Authenticate with Commet using OAuth Device Flow.

```bash
commet login
```

Opens your browser and saves credentials to `~/.commet/auth.json`.

#### `commet logout`

Log out and clear authentication credentials.

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

Creates a `.commet` file with organization and environment settings.

#### `commet unlink`

Unlink the current directory from Commet.

```bash
commet unlink
```

Removes the `.commet` configuration file.

#### `commet switch`

Switch to a different organization or environment.

```bash
commet switch
```

Updates the `.commet` configuration file.

#### `commet info`

Display information about the current project.

```bash
commet info
```

### Type Generation

#### `commet pull`

Pull type definitions from Commet and generate TypeScript types.

```bash
commet pull
```

Options:
- `-o, --output <file>`: Output file path (default: `.commet.d.ts`)

Example:
```bash
commet pull --output src/types/commet.d.ts
```

#### `commet list <type>`

List event types or seat types for your organization.

```bash
# List event types
commet list events

# List seat types
commet list seats
```

## Usage with SDK

Once you've generated types with `commet pull`, use them with the SDK:

```typescript
import { Commet } from 'commet';
import type { CommetEventType, CommetSeatType } from './.commet';

const commet = new Commet({ apiKey: process.env.COMMET_API_KEY });

// Type-safe event tracking
await commet.usage.sendEvent<CommetEventType>({
  customerId: 'cust_123',
  eventType: 'api_call', // Autocomplete works!
  timestamp: new Date(),
  properties: {
    endpoint: '/v1/users',
    method: 'GET',
  },
});

// Type-safe seat management
await commet.seats.updateSeats<CommetSeatType>({
  customerId: 'cust_123',
  seatType: 'admin_seat', // Autocomplete works!
  totalSeats: 5,
  timestamp: new Date(),
});
```

## Configuration Files

### `~/.commet/auth.json`

Stores authentication credentials globally (per user).

```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresAt": 1234567890
}
```

### `.commet`

Stores project-specific configuration (per project directory).

```json
{
  "orgId": "org_abc123",
  "orgName": "My Company",
  "environment": "sandbox"
}
```

### `.commet.d.ts`

Generated TypeScript type definitions.

```typescript
export type CommetEventType = "api_call" | "email_sent" | "payment_processed";
export type CommetSeatType = "admin_seat" | "editor_seat" | "viewer_seat";
```

## Examples

### Workflow: New Project

```bash
# 1. Install globally
npm install -g commet

# 2. Authenticate
commet login

# 3. Create project directory
mkdir my-billing-integration
cd my-billing-integration

# 4. Link to organization
commet link
# Select: "My Company (Sandbox)"

# 5. Generate types
commet pull

# 6. Use in your code
cat > index.ts << 'EOF'
import { Commet } from 'commet';
import type { CommetEventType } from './.commet';

const commet = new Commet({ apiKey: process.env.COMMET_API_KEY });

await commet.usage.sendEvent<CommetEventType>({
  customerId: 'cust_123',
  eventType: 'api_call',
  timestamp: new Date(),
});
EOF
```

### Workflow: Switch to Production

```bash
# Switch environment
commet switch
# Select: "My Company (Production)"

# Pull production types
commet pull
```

### Workflow: Multiple Organizations

```bash
# Project A
cd ~/projects/project-a
commet link  # Link to Org A
commet pull

# Project B
cd ~/projects/project-b
commet link  # Link to Org B
commet pull
```

## Troubleshooting

### "Not authenticated" error

Run `commet login` to authenticate.

### "Project not linked" error

Run `commet link` to connect to an organization.

### Browser doesn't open automatically

Copy the URL from the terminal and paste it into your browser manually.

### Types not updating

Run `commet pull` again to regenerate types from the API.

### Check current status

```bash
commet whoami  # Auth and project status
commet info    # Detailed project info
```

## Support

- Documentation: https://docs.commet.co
- Issues: https://github.com/commet-labs/commet-node/issues
- Email: support@commet.co

