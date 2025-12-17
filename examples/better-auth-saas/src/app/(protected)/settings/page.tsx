import { BillingPortalButton } from "@/components/billing-portal-button";
import { NavHeader } from "@/components/nav-header";
import { SubscriptionCard } from "@/components/subscription-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { CreditCard, ExternalLink, Settings, Sparkles } from "lucide-react";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <div className="min-h-screen">
      <NavHeader />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and billing using the{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                authClient.customer
              </code>{" "}
              and{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                authClient.subscription
              </code>{" "}
              APIs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Account & Subscription */}
            <div className="space-y-6">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <CardTitle>Account</CardTitle>
                  </div>
                  <CardDescription>
                    Your account information from Better Auth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="font-medium">{user?.email}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">User ID</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {user?.id.slice(0, 12)}...
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription */}
              <SubscriptionCard />
            </div>

            {/* Right Column - Billing Portal & API */}
            <div className="space-y-6">
              {/* Billing Portal */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <CardTitle>Customer Portal</CardTitle>
                  </div>
                  <CardDescription>
                    Open the Commet-hosted billing portal for self-service
                    management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-background space-y-3">
                    <p className="text-sm">In the portal, customers can:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• View and download invoices</li>
                      <li>• Update payment methods</li>
                      <li>• Change or cancel subscription</li>
                      <li>• View billing history</li>
                    </ul>
                  </div>

                  <BillingPortalButton />
                </CardContent>
              </Card>

              {/* API Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing API Reference</CardTitle>
                  <CardDescription>
                    Available methods for billing management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge>GET</Badge>
                        <code className="text-sm">customer.portal()</code>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Redirects to the billing portal
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge>GET</Badge>
                        <code className="text-sm">subscription.get()</code>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Get current subscription details
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">POST</Badge>
                        <code className="text-sm">
                          subscription.changePlan(&#123; planId &#125;)
                        </code>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Change to a different plan
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">POST</Badge>
                        <code className="text-sm">subscription.cancel()</code>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cancel the subscription
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Plugin Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>@commet/better-auth Plugin Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Customer Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Automatic customer creation on signup via database hooks
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Auth Integration</p>
                  <p className="text-sm text-muted-foreground">
                    Session-aware endpoints that identify customers
                    automatically
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Type Safety</p>
                  <p className="text-sm text-muted-foreground">
                    Full TypeScript support with inferred types from server
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">No SDK Needed</p>
                  <p className="text-sm text-muted-foreground">
                    Frontend uses authClient - no direct Commet SDK calls
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

