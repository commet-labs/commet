"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type ManageBillingButtonProps = {
  portalUrl?: string;
};

export function ManageBillingButton({ portalUrl }: ManageBillingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (!portalUrl) {
      alert("Portal URL not available. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading || !portalUrl}
    >
      {isLoading ? "Opening..." : "Manage Billing"}
    </Button>
  );
}
