import { Users } from "lucide-react";
import Link from "next/link";
import { checkSubscriptionStatusAction } from "@/actions/team";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const status = await checkSubscriptionStatusAction();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your team and seat usage overview.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seat Usage</CardTitle>
          <CardDescription>How many seats your team is using.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Seats used</span>
            <span className="text-sm font-medium">
              {status.seatsUsed} of {status.seatsIncluded} included
            </span>
          </div>
          {status.seatsUsed > status.seatsIncluded && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Extra seats</span>
              <span className="text-sm font-medium text-yellow-600">
                +{status.seatsUsed - status.seatsIncluded}
              </span>
            </div>
          )}
          {status.seatOveragePrice !== undefined &&
            status.seatOveragePrice > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Price per extra seat
                </span>
                <span className="text-sm font-medium">
                  ${(status.seatOveragePrice / 100).toFixed(0)}/mo
                </span>
              </div>
            )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan</span>
            <span className="text-sm font-medium">
              {status.planName || "N/A"}
            </span>
          </div>
          {status.daysRemaining !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Days remaining
              </span>
              <span className="text-sm font-medium">
                {status.daysRemaining}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your team and billing.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/team" />}
            className="justify-start"
          >
            <Users className="size-4" />
            Manage Team Members
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            // biome-ignore lint/a11y/useAnchorContent: renders children via Button
            render={<a href="/api/commet/portal" />}
            className="justify-start"
          >
            Open Billing Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
