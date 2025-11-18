"use client";

import { getPortalUrl } from "@/actions/get-portal-url-action";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ManageBillingButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      const result = await getPortalUrl();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        console.error("Failed to get portal URL:", result.error);
        alert(result.error || "Failed to open billing portal");
      }
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
      disabled={isLoading}
    >
      {isLoading ? "Opening..." : "Manage Billing"}
    </Button>
  );
}
