import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Revalidate pricing data every hour
export const revalidate = 3600;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between mx-auto max-w-7xl px-4">
          <div className="text-2xl font-bold">UsageSaaS</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="py-20 mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            Powered by Commet
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl mb-6">
            Usage-Based SaaS Platform
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience seamless usage-based billing integration with Commet. This
            example demonstrates how easy it is to add metered billing to your
            SaaS application.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://docs.commet.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid gap-6 md:grid-cols-3 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Usage Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              Track every API call, email sent, or action taken. Real-time
              usage monitoring with automatic billing.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flexible Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              Set included units and overage rates. Customers pay for what they
              use beyond their plan limits.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>True-up Billing</CardTitle>
            </CardHeader>
            <CardContent>
              Usage is billed at the end of each period, ensuring accurate
              charges based on actual consumption.
            </CardContent>
          </Card>
        </div>

      </main>
      {/* Footer */}
      <footer className="border-t mt-32">
        <div className="py-8 text-center text-muted-foreground mx-auto max-w-7xl px-4">
          <p>
            Built with{" "}
            <a
              href="https://commet.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Commet
            </a>{" "}
            - The Modern Billing Platform
          </p>
        </div>
      </footer>
    </div>
  );
}


