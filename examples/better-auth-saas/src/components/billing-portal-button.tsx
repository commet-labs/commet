"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ExternalLink } from "lucide-react";
import { useState, useTransition } from "react";

export function BillingPortalButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleOpenPortal() {
    setError("");
    startTransition(async () => {
      try {
        // Using authClient.customer.portal from the Commet plugin
        // This returns a redirect URL and automatically redirects
        await authClient.customer.portal();
      } catch (err) {
        setError("Failed to open billing portal");
        console.error(err);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleOpenPortal} disabled={isPending} className="w-full">
        <ExternalLink className="h-4 w-4 mr-2" />
        {isPending ? "Opening Portal..." : "Manage Billing"}
      </Button>

      {error && (
        <p className="text-xs text-destructive text-center">{error}</p>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Uses <code className="text-xs">authClient.customer.portal()</code>
      </p>
    </div>
  );
}

