import { ListChecks } from "lucide-react";
import Link from "next/link";
import { getTaskQuotaStatusAction } from "@/actions/tasks";
import { NoActivePlanNotice } from "@/components/billing/no-active-plan-notice";
import { TaskUsageBar } from "@/components/billing/task-usage-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const status = await getTaskQuotaStatusAction();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your task quota overview.
        </p>
      </div>

      {!status.isPaid ? (
        <NoActivePlanNotice
          pendingPayment={status.status === "pending_payment"}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Task usage</CardTitle>
              <CardDescription>
                How much of your quota you are using.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <TaskUsageBar status={status} />
              <div className="flex flex-col gap-3 border-t pt-4">
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Manage your tasks and billing.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/dashboard/tasks" />}
                className="justify-start"
              >
                <ListChecks className="size-4" />
                Manage tasks
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                // biome-ignore lint/a11y/useAnchorContent: renders children via Button
                render={
                  <a
                    href="/api/commet/portal"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="justify-start"
              >
                Open Billing Portal
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
