"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { CreditCard, RefreshCw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface Subscription {
  id: string;
  status: string;
  planName?: string;
  currentPeriodEnd?: string;
}

export function SubscriptionCard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function fetchSubscription() {
    startTransition(async () => {
      try {
        // Using authClient.subscription.get from the Commet plugin
        const result = await authClient.subscription.get();
        if (!result.error && result.data) {
          setSubscription(result.data as Subscription);
        }
      } catch (err) {
        setError("Failed to load subscription");
        console.error(err);
      }
    });
  }

  useEffect(() => {
    fetchSubscription();
  }, []);

  const statusColors: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    active: "default",
    trialing: "secondary",
    canceled: "destructive",
    past_due: "destructive",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={fetchSubscription}
            disabled={isPending}
          >
            <RefreshCw
              className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <CardDescription>
          View subscription status using{" "}
          <code className="text-xs">authClient.subscription.get()</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPending && !subscription ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading subscription...
          </div>
        ) : error ? (
          <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        ) : subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">
                  {subscription.planName || "Current Plan"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ID: {subscription.id.slice(0, 8)}...
                </p>
              </div>
              <Badge variant={statusColors[subscription.status] || "outline"}>
                {subscription.status}
              </Badge>
            </div>

            {subscription.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Current period ends:{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-2">No active subscription</p>
            <Button variant="outline" size="sm">
              Choose a Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
