"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Lock, Unlock } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface FeatureGateProps {
  featureCode: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

// Type for the canUse response (Better Auth plugin types)
interface CanUseResponse {
  canUse: boolean;
}

export function FeatureGate({
  featureCode: initialFeatureCode,
  title,
  description,
  children,
}: FeatureGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  // Ensure featureCode is always a string (handle SSR/hydration issues)
  const featureCode =
    typeof initialFeatureCode === "string" ? initialFeatureCode : "";

  useEffect(() => {
    // Don't make request if featureCode is missing
    if (!featureCode || featureCode.trim() === "") {
      setHasAccess(false);
      return;
    }

    startTransition(async () => {
      try {
        // Using authClient.features.canUse from the Commet plugin
        // @ts-expect-error - Plugin types are inferred at runtime
        const result = await authClient.features.canUse(featureCode);
        if (!result.error && result.data) {
          setHasAccess((result.data as CanUseResponse).canUse);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Failed to check feature access:", error);
        setHasAccess(false);
      }
    });
  }, [featureCode]);

  return (
    <Card className={!hasAccess ? "opacity-75" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {isPending ? (
            <Badge variant="secondary">Checking...</Badge>
          ) : hasAccess ? (
            <>
              <Badge variant="default">Enabled</Badge>
              <Unlock className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              <Badge variant="outline">Locked</Badge>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">{description}</p>

        {hasAccess && children ? (
          <div className="pt-2">{children}</div>
        ) : (
          <div className="pt-2 text-center text-sm text-muted-foreground">
            {isPending
              ? "Checking access..."
              : "Upgrade your plan to unlock this feature"}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Uses{" "}
          <code className="text-xs">
            authClient.features.canUse("{featureCode}")
          </code>
        </p>
      </CardContent>
    </Card>
  );
}
