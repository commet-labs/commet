import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { resolveAccessForBillingState } from "@/lib/billing/entitlements";
import { getBillingStateForUser } from "@/lib/db/queries";

function formatStatus(status: string): string {
  if (status === "none") return "No subscription";
  if (status === "past_due") return "Past due";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function BillingPage() {
  const user = await getUser();
  const billing = await getBillingStateForUser(user!.id);
  const access = resolveAccessForBillingState(billing);
  const hasSubscription = access.status !== "none";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Your subscription and payment details — synced from webhooks, no
          Commet API call.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan and status.</CardDescription>
          </div>
          {hasSubscription && (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <a
                  href="/api/commet/portal"
                  aria-label="Manage billing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manage billing
                  <ExternalLink className="size-3" />
                </a>
              }
            />
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {hasSubscription ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-sm font-medium">{access.planLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium">
                  {formatStatus(access.status)}
                </span>
              </div>
              {billing?.billingInterval && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Billing interval
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {billing.billingInterval}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active subscription.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
