"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { authClient } from "@/lib/auth-client";
import { Activity } from "lucide-react";
import { useState, useTransition } from "react";

interface UsageCardProps {
  feature: string;
  title: string;
  description: string;
  currentUsage?: number;
  limit?: number;
}

export function UsageCard({
  feature,
  title,
  description,
  currentUsage = 0,
  limit,
}: UsageCardProps) {
  const [isPending, startTransition] = useTransition();
  const [usage, setUsage] = useState(currentUsage);
  const [success, setSuccess] = useState(false);

  const percentage = limit ? Math.min((usage / limit) * 100, 100) : 0;

  async function handleTrackUsage() {
    setSuccess(false);
    startTransition(async () => {
      try {
        // Using authClient.usage.track from the Commet plugin
        const result = await authClient.usage.track({
          feature,
          value: 1,
        });

        if (!result.error) {
          setUsage((prev) => prev + 1);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        }
      } catch (error) {
        console.error("Failed to track usage:", error);
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">{description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {usage.toLocaleString()}
              {limit ? ` / ${limit.toLocaleString()}` : ""} events
            </span>
            {limit && <span>{percentage.toFixed(0)}%</span>}
          </div>
          {limit && <Progress value={percentage} />}
        </div>

        <Button
          onClick={handleTrackUsage}
          disabled={isPending}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {isPending ? "Tracking..." : success ? "Tracked!" : "Simulate Usage"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Uses <code className="text-xs">authClient.usage.track()</code>
        </p>
      </CardContent>
    </Card>
  );
}

