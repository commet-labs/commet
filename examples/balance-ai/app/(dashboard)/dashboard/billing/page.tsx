import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and usage.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan and status.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your Commet account to view subscription details.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>AI token consumption this period.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Usage data will appear here once you start using the AI chat.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Portal</CardTitle>
          <CardDescription>
            Update payment methods, view invoices, and manage your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Open portal</Button>
        </CardContent>
      </Card>
    </div>
  );
}
