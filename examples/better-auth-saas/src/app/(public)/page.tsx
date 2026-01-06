import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Activity, ArrowRight, Code, Sparkles, Users, Zap } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">BetterAuth SaaS</div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <Badge variant="outline" className="mb-4">
            @commet/better-auth Plugin Showcase
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight">
            Better Auth + Commet
            <br />
            <span className="text-primary">Billing Integration</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            This example demonstrates the{" "}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
              @commet/better-auth
            </code>{" "}
            plugin - seamless billing integration with seats, usage tracking,
            and feature flags.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Try the Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/commet-dev/commet-node"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="mr-2 h-4 w-4" /> View Source
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Plugin Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All billing operations through{" "}
              <code className="text-sm">authClient</code> - no direct SDK calls
              on the frontend.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Seat Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add and remove team members with automatic seat billing.
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  authClient.seats.add()
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Usage Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track metered usage for consumption-based billing.
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  authClient.usage.track()
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Feature Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Gate features based on plan with boolean checks.
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  authClient.features.canUse()
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Customer Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Self-service billing portal for customers.
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  authClient.customer.portal()
                </code>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Configure the Server Plugin
                    </h3>
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      {`import { commet, portal, seats, usage, features } from "@commet/better-auth";

const auth = betterAuth({
  plugins: [
    commet({
      client: commetClient,
      createCustomerOnSignUp: true,
      use: [portal(), subscriptions(), features(), usage(), seats()]
    })
  ]
});`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Add the Client Plugin</h3>
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      {`import { commetClient } from "@commet/better-auth/client";

const authClient = createAuthClient({
  plugins: [commetClient()]
});`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Use authClient for Billing
                    </h3>
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      {`// Track usage
await authClient.usage.track({ feature: "api_call", value: 1 });

// Check features
const { data } = await authClient.features.canUse("advanced_analytics");

// Manage seats
await authClient.seats.add({ seatType: "member", count: 1 });

// Open billing portal
await authClient.customer.portal();`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Try?</h2>
          <p className="text-muted-foreground">
            Sign up to explore the dashboard and see all plugin features in
            action.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>
            Built with{" "}
            <a
              href="https://better-auth.com"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Better Auth
            </a>{" "}
            +{" "}
            <a
              href="https://commet.co"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Commet
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

