import type { TaskQuotaStatus } from "@/actions/tasks";

function formatCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? "task" : "tasks"}`;
}

export function TaskUsageBar({ status }: { status: TaskQuotaStatus }) {
  const { used, included, unlimited, overageEnabled, overagePricePerTask } =
    status;

  const isOverage = !unlimited && used > included;
  const overage = isOverage ? used - included : 0;
  const remaining = unlimited ? null : Math.max(0, included - used);
  const usedPct = included > 0 ? (used / included) * 100 : 0;

  const barColor = isOverage
    ? "bg-destructive"
    : usedPct >= 80
      ? "bg-amber-500"
      : "bg-primary";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-semibold tabular-nums">
            {formatCount(used)}
          </span>
          {!unlimited && (
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              of {formatCount(included)} used
            </span>
          )}
        </div>
        {unlimited ? (
          <span className="text-sm font-medium text-foreground">Unlimited</span>
        ) : isOverage ? (
          <span className="text-sm font-medium text-destructive">
            {formatCount(overage)} over your plan
          </span>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            {formatCount(remaining ?? 0)} available
          </span>
        )}
      </div>

      {!unlimited && (
        <div className="h-2 w-full overflow-hidden rounded-none bg-muted">
          <div
            className={`h-full rounded-none transition-all duration-500 ease-out ${barColor}`}
            style={{ width: `${Math.min(usedPct, 100)}%` }}
          />
        </div>
      )}

      {isOverage && overageEnabled && overagePricePerTask ? (
        <p className="text-xs font-medium text-destructive">
          {`Extra tasks billed at $${overagePricePerTask.toFixed(2)}/task · +$${(overage * overagePricePerTask).toFixed(2)}/mo`}
        </p>
      ) : overageEnabled && overagePricePerTask ? (
        <p className="text-xs text-muted-foreground">
          Over your plan, extra tasks are ${overagePricePerTask.toFixed(2)}
          /task.
        </p>
      ) : null}
    </div>
  );
}
