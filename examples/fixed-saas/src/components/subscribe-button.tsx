"use client";

import { createSubscriptionAction } from "@/actions/create-subscription-action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BillingInterval = "monthly" | "quarterly" | "yearly";

interface PlanPrice {
  billingInterval: BillingInterval;
  price: number;
  isDefault: boolean;
}

interface SubscribeButtonProps {
  prices: PlanPrice[];
}

function formatInterval(interval: BillingInterval): string {
  switch (interval) {
    case "yearly":
      return "year";
    case "quarterly":
      return "quarter";
    default:
      return "month";
  }
}

export function SubscribeButton({ prices }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>(
    () => prices.find((p) => p.isDefault)?.billingInterval ?? prices[0]?.billingInterval ?? "monthly",
  );
  const router = useRouter();

  const selectedPrice = prices.find((p) => p.billingInterval === selectedInterval);

  async function handleSubscribe() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createSubscriptionAction(selectedInterval);

      if (!result.success) {
        setError(result.error || "Failed to create subscription");
        return;
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      router.push(`/checkout/pending?subscriptionId=${result.subscriptionId}`);
    } catch (err) {
      console.error("Subscribe error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {prices.length > 1 && (
        <div className="flex gap-2">
          {prices.map((price) => (
            <button
              key={price.billingInterval}
              type="button"
              onClick={() => setSelectedInterval(price.billingInterval)}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                selectedInterval === price.billingInterval
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted-foreground/20 hover:border-muted-foreground/40"
              }`}
            >
              <div className="font-semibold">
                ${(price.price / 100).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">
                /{formatInterval(price.billingInterval)}
              </div>
            </button>
          ))}
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={handleSubscribe}
        disabled={isLoading}
      >
        {isLoading
          ? "Creating subscription..."
          : selectedPrice
            ? `Subscribe for $${(selectedPrice.price / 100).toFixed(0)}/${formatInterval(selectedInterval)}`
            : "Subscribe Now"}
      </Button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}
