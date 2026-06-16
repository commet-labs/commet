import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PastDueBanner() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-destructive/30 bg-destructive/10 px-6 py-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 shrink-0 text-destructive" />
        <p className="text-sm">
          <span className="font-medium">Your last payment failed.</span>{" "}
          <span className="text-muted-foreground">
            Premium features are paused until payment succeeds.
          </span>
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        // biome-ignore lint/a11y/useAnchorContent: renders children via Button
        render={<a href="/api/commet/portal" />}
      >
        Update payment method
      </Button>
    </div>
  );
}
