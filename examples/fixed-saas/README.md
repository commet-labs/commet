# Fixed SaaS Example - Commet Billing Integration

A complete example demonstrating how to integrate [Commet](https://commet.co) billing into a simple SaaS application with a fixed monthly subscription model.

## 🎯 What This Example Shows

This example demonstrates the **complete billing flow** for a SaaS application:

1. **User Signup** → Creates account with Better Auth
2. **Customer Creation** → Automatically creates Commet customer
3. **Checkout Flow** → Creates subscription and handles payment
4. **Protected Content** → Dashboard access based on subscription status
5. **Webhook Handling** → Receives payment confirmations (when implemented)

## 🏗️ Architecture

### Tech Stack

- **Next.js 15** - App Router with Server Components
- **Better Auth** - Authentication with email/password
- **SQLite** - Local database for user data
- **Commet SDK** - Billing and subscription management
- **Tailwind CSS** - Styling

### Key Features

- ✅ User authentication (signup/login)
- ✅ Automatic Commet customer creation
- ✅ Subscription management
- ✅ Protected routes
- ✅ Webhook endpoint (placeholder)
- ✅ Payment simulation (for demo)

## 🚀 Getting Started

### Prerequisites

1. **Node.js** 18+ and pnpm installed
2. **Commet Account** - Sign up at [commet.co](https://commet.co)
3. **Commet Product** - Create a fixed price product ($50/month) in your Commet dashboard

### Installation

1. **Clone the repository** (or use the template):

```bash
git clone https://github.com/commet-labs/commet-node.git
cd commet-node/examples/fixed-saas
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Set up environment variables**:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Better Auth
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Commet
COMMET_API_KEY=ck_sandbox_your_api_key_here
COMMET_ENVIRONMENT=sandbox
COMMET_PRICE_ID=your_price_id_here
```

### Getting Your Commet Credentials

1. **Sign up** at [commet.co](https://commet.co)
2. **Create an organization** in the dashboard
3. **Create a product** with a fixed price:
   - Name: "Pro Plan"
   - Price: $50/month
   - Type: Fixed
4. **Get your API key**:
   - Go to Settings → API Keys
   - Copy your **sandbox API key** (starts with `ck_sandbox_`)
5. **Get your price ID**:
   - Go to Products → Select your product
   - Copy the **Price ID** (UUID format)

### Run the Application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Flow

### 1. Landing Page

Visit the homepage and click **"Get Started"** or **"Start Free Trial"**.

### 2. Sign Up

Create an account with:
- Full name
- Email
- Password (min 8 characters)

**What happens behind the scenes:**
- User account created in Better Auth
- Commet customer created automatically
- User redirected to checkout

### 3. Checkout

The checkout page shows:
- Product details (Pro Plan - $50/month)
- Subscription creation
- **Missing Feature Alert**: `checkoutUrl` not available (see [GAPS.md](./GAPS.md))

For demo purposes, click **"Simulate Payment"** to proceed.

### 4. Dashboard

After simulated payment, you'll see:
- Welcome message
- Subscription status
- Feature cards
- Integration information

## 🔍 Key Files

### Authentication
- `src/lib/auth.ts` - Better Auth configuration
- `src/lib/auth-client.ts` - Client-side auth utilities
- `src/app/(auth)/signup/page.tsx` - Signup form
- `src/app/(auth)/login/page.tsx` - Login form

### Commet Integration
- `src/lib/commet.ts` - Commet SDK instance
- `src/app/actions/signup-action.ts` - Creates Commet customer
- `src/app/checkout/page.tsx` - Subscription creation & checkout
- `src/app/api/webhooks/commet/route.ts` - Webhook handler

### Protected Content
- `src/middleware.ts` - Route protection
- `src/app/(protected)/layout.tsx` - Auth check
- `src/app/(protected)/dashboard/page.tsx` - Main dashboard

## 🐛 Debugging

### Check Commet API Calls

Server logs will show:
```
Created Commet customer: cus_xxx
```

### Verify Subscription

In your Commet dashboard:
1. Go to **Subscriptions**
2. Find the subscription by customer email
3. Check status (should be "draft" until paid)

### Database Issues

Delete and recreate the SQLite database:
```bash
rm -rf data/
pnpm dev
```

## 🚧 Missing Features (See GAPS.md)

This example exposes missing features in the Commet SDK/API:

1. **No `checkoutUrl` in subscription response** - Can't redirect users to payment
2. **No webhook support** - Can't receive payment confirmations
3. **Manual subscription status checking** - Workaround until webhooks exist

See [GAPS.md](./GAPS.md) for detailed analysis and proposed solutions.

## 📚 Learn More

- [Commet Documentation](https://docs.commet.co)
- [Commet SDK Reference](https://docs.commet.co/docs/library/quickstart)
- [Better Auth Documentation](https://www.better-auth.com)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Found an issue or want to improve this example? Open an issue or PR in the main repository.

## 📄 License

MIT - See the main repository for details.
