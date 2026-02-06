"use client";

import { SubscriptionCard } from "@/components/billing/subscription-card";
import { BillingPortalButton } from "@/components/billing/billing-portal-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <section className="flex-1 p-4 lg:p-8 bg-secondary/50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing through the Better Auth plugin
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Subscription Card - uses authClient.subscription.get() */}
          <SubscriptionCard />

          {/* Billing Portal - uses authClient.customer.portal() */}
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-foreground" />
                Billing Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access the Commet customer portal to manage your payment methods,
                view invoices, and update your subscription.
              </p>
              <BillingPortalButton />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Billing is handled securely via Commet
          </p>
        </div>
      </div>
    </section>
  );
}
