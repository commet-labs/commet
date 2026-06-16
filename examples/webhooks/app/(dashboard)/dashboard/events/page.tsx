import { AutoRefresh } from "@/components/auto-refresh";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRecentWebhookEvents } from "@/lib/db/queries";
import { cn } from "@/lib/utils";

function eventBadgeClasses(event: string): string {
  if (event.startsWith("payment.")) {
    return "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-500";
  }
  if (event.startsWith("invoice.")) {
    return "border-border bg-muted text-muted-foreground";
  }
  return "border-primary/30 bg-primary/10 text-primary";
}

function formatRelativeTime(receivedAt: Date): string {
  const elapsedSeconds = Math.round((Date.now() - receivedAt.getTime()) / 1000);
  if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`;
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`;
  if (elapsedSeconds < 86400)
    return `${Math.floor(elapsedSeconds / 3600)}h ago`;
  return receivedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function EventsPage() {
  const events = await getRecentWebhookEvents();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <AutoRefresh seconds={4} />
      <div>
        <h1 className="text-lg font-semibold">Events</h1>
        <p className="text-sm text-muted-foreground">
          Webhooks received from Commet for your account, newest first.
          Refreshes every few seconds.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook feed</CardTitle>
          <CardDescription>
            Last {events.length} events recorded by /api/webhooks/commet.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events yet. Run{" "}
              <code className="bg-muted px-1 py-0.5 font-mono text-xs">
                commet listen localhost:3008/api/webhooks/commet
              </code>{" "}
              and subscribe to a plan to see webhooks arrive here.
            </p>
          ) : (
            events.map((webhookEvent) => (
              <details
                key={webhookEvent.id}
                className="group border-b py-3 last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                  <span
                    className={cn(
                      "border px-2 py-0.5 font-mono text-xs",
                      eventBadgeClasses(webhookEvent.event),
                    )}
                  >
                    {webhookEvent.event}
                  </span>
                  <span className="flex-1 truncate text-sm text-muted-foreground">
                    {webhookEvent.commetCustomerId ?? "—"}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(webhookEvent.receivedAt)}
                  </span>
                </summary>
                <pre className="mt-3 overflow-x-auto bg-muted p-3 font-mono text-xs leading-relaxed">
                  {JSON.stringify(webhookEvent.payload, null, 2)}
                </pre>
              </details>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
