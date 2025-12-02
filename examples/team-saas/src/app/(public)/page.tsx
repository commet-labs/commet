import { PricingSection } from "@/components/pricing-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Zap, Shield } from "lucide-react";
import Link from "next/link";

// Revalidate pricing data every hour
export const revalidate = 3600;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between mx-auto max-w-7xl px-4">
          <div className="text-2xl font-bold">TeamPro</div>
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
            Seat-Based Billing with Commet
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl mb-6">
            Team Collaboration Made Simple
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Invite team members, manage seats, and only pay for what you use.
            This example demonstrates Commet's seat-based billing model.
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
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Seat-Based Billing</CardTitle>
            </CardHeader>
            <CardContent>
              Only pay for active team members. Add and remove seats as your
              team grows or shrinks.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Instant Sync</CardTitle>
            </CardHeader>
            <CardContent>
              Changes to your team are instantly reflected in billing. No
              complex manual calculations.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Fair Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              Included seats in your plan, extra seats charged only for overage.
              Prorated charges for mid-cycle changes.
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <PricingSection />
      </main>

      {/* Footer */}
      <footer className="border-t mt-32">
        <div className="py-8 text-center text-muted-foreground mx-auto max-w-7xl">
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

