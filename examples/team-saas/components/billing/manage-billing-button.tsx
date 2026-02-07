"use client";

import { getPortalUrlAction } from "@/actions/portal";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ManageBillingButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      const result = await getPortalUrlAction();
      if (result.success && result.portalUrl) {
        window.location.href = result.portalUrl;
      } else {
        toast.error(result.error || "Failed to open billing portal");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      <ExternalLink className="w-4 h-4" />
      {isLoading ? "Opening..." : "Manage Billing"}
    </Button>
  );
}
