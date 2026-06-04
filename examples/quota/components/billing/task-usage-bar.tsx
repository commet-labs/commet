import type { TaskQuotaStatus } from "@/actions/tasks";

function formatCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? "task" : "tasks"}`;
}

export function TaskUsageBar({ status }: { status: TaskQuotaStatus }) {
  const {
    used,
    included,
    billed,
    unlimited,
    overageEnabled,
    overagePricePerTask,
  } = status;

  const isOverPlan = !unlimited && billed > included;
  const isCurrentlyOver = !unlimited && used > included;
  const extra = isOverPlan ? billed - included : 0;
  const remaining = unlimited ? null : Math.max(0, included - used);
  const usedPct = billed > 0 ? (used / billed) * 100 : 0;
  const includedPct = !unlimited && used <= included && included > 0
    ? (used / included) * 100
    : usedPct;

  const barColor = isCurrentlyOver
    ? "bg-destructive"
    : includedPct >= 90
      ? "bg-amber-500"
      : "bg-primary";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-lg font-semibold tabular-nums">
            {formatCount(used)}
          </span>
          {!unlimited && (
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              of {formatCount(billed)}
              {isOverPlan
                ? ` (${included.toLocaleString()} included + ${extra.toLocaleString()} extra)`
                : ""}
            </span>
          )}
        </div>
        {unlimited ? (
          <span className="text-sm font-medium text-foreground">Unlimited</span>
        ) : isOverPlan ? (
          <span className="text-sm font-medium text-destructive">
            {formatCount(extra)} over your plan
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

      {isOverPlan && overageEnabled && overagePricePerTask ? (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-destructive">
            {`Extra tasks are billed at $${overagePricePerTask.toFixed(2)}/task, prorated from when you went over.`}
          </p>
          <p className="text-xs text-muted-foreground">
            You're billed for the rest of this period — removing tasks now won't
            refund it.
          </p>
        </div>
      ) : overageEnabled && overagePricePerTask ? (
        <p className="text-xs text-muted-foreground">
          {`Over your plan, extra tasks are $${overagePricePerTask.toFixed(2)}/task — billed from when you exceed, with no refund if you remove them.`}
        </p>
      ) : null}
    </div>
  );
}
