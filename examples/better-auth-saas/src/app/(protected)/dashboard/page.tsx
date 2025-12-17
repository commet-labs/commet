import { FeatureGate } from "@/components/feature-gate";
import { NavHeader } from "@/components/nav-header";
import { UsageCard } from "@/components/usage-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Activity, Sparkles, Users, Zap } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <div className="min-h-screen">
      <NavHeader />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground mt-2">
              This dashboard showcases the{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                @commet/better-auth
              </code>{" "}
              plugin capabilities.
            </p>
          </div>

          {/* Plugin Features Overview */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Commet Better Auth Plugin</CardTitle>
              </div>
              <CardDescription>
                All billing operations are handled through authClient methods -
                no direct SDK calls needed on the frontend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-background">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Seats</p>
                  <p className="text-xs text-muted-foreground">
                    Team management
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Usage</p>
                  <p className="text-xs text-muted-foreground">
                    Metered billing
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Features</p>
                  <p className="text-xs text-muted-foreground">Feature flags</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Portal</p>
                  <p className="text-xs text-muted-foreground">Self-service</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Tracking Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Usage Tracking</h2>
                <p className="text-sm text-muted-foreground">
                  Track metered usage with{" "}
                  <code className="text-xs">authClient.usage.track()</code>
                </p>
              </div>
              <Badge variant="outline">Metered Billing</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <UsageCard
                eventType="api_call"
                title="API Calls"
                description="Track API requests for usage-based billing"
                currentUsage={127}
                limit={1000}
              />
            </div>
          </div>

          {/* Feature Flags Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Feature Flags</h2>
                <p className="text-sm text-muted-foreground">
                  Gate features with{" "}
                  <code className="text-xs">authClient.features.canUse()</code>
                </p>
              </div>
              <Badge variant="outline">Boolean Features</Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <FeatureGate
                featureCode="custom_branding"
                title="Custom Branding"
                description="Add your own logo and colors"
              >
                <Button size="sm" className="w-full">
                  Configure Branding
                </Button>
              </FeatureGate>

              <FeatureGate
                featureCode="advanced_analytics"
                title="Advanced Analytics"
                description="Detailed reports and insights"
              >
                <Button size="sm" className="w-full">
                  View Analytics
                </Button>
              </FeatureGate>

              <FeatureGate
                featureCode="api_access"
                title="API Access"
                description="Full REST API with webhooks"
              >
                <Button size="sm" className="w-full">
                  Get API Keys
                </Button>
              </FeatureGate>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Manage Team</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add or remove team members using seat management.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/team">Go to Team</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Billing Settings</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      View subscription and access the billing portal.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/settings">Go to Settings</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
