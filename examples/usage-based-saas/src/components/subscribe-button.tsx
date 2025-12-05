"use client";

import { createSubscriptionAction } from "@/actions/create-subscription-action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubscribe() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createSubscriptionAction();

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
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full"
        onClick={handleSubscribe}
        disabled={isLoading}
      >
        {isLoading ? "Creando suscripción..." : `Ir al checkout del plan ${process.env.NEXT_PUBLIC_COMMET_PLAN_CODE}`}
      </Button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}


