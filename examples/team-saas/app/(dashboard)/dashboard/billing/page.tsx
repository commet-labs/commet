import { checkSubscriptionStatusAction } from "@/actions/team";
import { ManageBillingButton } from "@/components/billing/manage-billing-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import Link from "next/link";

export default async function BillingPage() {
  const status = await checkSubscriptionStatusAction();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-bold text-foreground mb-6">
        Billing
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {status.isPaid ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {status.planName} Plan
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {status.status} &middot; {status.daysRemaining} days remaining
                    </p>
                  </div>
                  <ManageBillingButton />
                </div>
                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats used</span>
                    <span>{status.seatsUsed} of {status.seatsIncluded} included</span>
                  </div>
                  {status.seatOveragePrice && status.seatsUsed > status.seatsIncluded && (
                    <div className="flex justify-between text-yellow-500">
                      <span>Overage ({status.seatsUsed - status.seatsIncluded} extra seats)</span>
                      <span>+${(((status.seatsUsed - status.seatsIncluded) * status.seatOveragePrice) / 100).toFixed(0)}/mo</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">No active plan</p>
                    <p className="text-sm text-muted-foreground">Subscribe to a plan to get started</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Billing is handled securely by Commet
          </p>
        </div>
      </div>
    </section>
  );
}
