import { ListChecks } from "lucide-react";
import { getTaskQuotaStatusAction, getTasksAction } from "@/actions/tasks";
import { AddTaskButton } from "@/components/billing/add-task-button";
import { NoActivePlanNotice } from "@/components/billing/no-active-plan-notice";
import { TaskList } from "@/components/billing/task-list";
import { TaskUsageBar } from "@/components/billing/task-usage-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const [status, tasks] = await Promise.all([
    getTaskQuotaStatusAction(),
    getTasksAction(),
  ]);

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
              <CardAction>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={
                    // biome-ignore lint/a11y/useAnchorContent: renders children via Button
                    <a
                      href="/api/commet/portal"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  Manage subscription
                </Button>
              </CardAction>
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
              <CardTitle>Add a task</CardTitle>
              <CardDescription>
                Each task counts against your quota; deleting one frees it up.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddTaskButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="size-4" />
                Tasks ({tasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList tasks={tasks} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
