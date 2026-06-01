import { ListChecks } from "lucide-react";
import { getTaskQuotaStatusAction, getTasksAction } from "@/actions/tasks";
import { CreateTaskForm } from "@/components/billing/create-task-form";
import { NoActivePlanNotice } from "@/components/billing/no-active-plan-notice";
import { TaskList } from "@/components/billing/task-list";
import { TaskUsageBar } from "@/components/billing/task-usage-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TasksPage() {
  const [status, tasks] = await Promise.all([
    getTaskQuotaStatusAction(),
    getTasksAction(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Create tasks and track your quota.
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
              <CardTitle>Task quota</CardTitle>
              <CardDescription>
                Your durable task quota for this plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskUsageBar status={status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create a task</CardTitle>
              <CardDescription>
                Each task counts against your quota; deleting one frees it up.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateTaskForm />
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
