import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";

const FEATURE_CODES = ["api_calls", "storage", "email_sends"] as const;

export default async function DashboardPage() {
  const user = await getUser();

  const results = await Promise.all(
    FEATURE_CODES.map((code) =>
      commet.featureAccess.get({ customerId: user!.id, code }),
    ),
  );

  const features = FEATURE_CODES.map((code, i) => {
    const feature = results[i];
    const consumption =
      feature?.type === "usage" && feature.consumption.model === "metered"
        ? feature.consumption
        : undefined;
    return {
      code,
      allowed: feature?.allowed ?? false,
      currentUsage: consumption?.unitsUsed,
      includedAmount: consumption?.includedUnits,
    };
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your usage overview and metered features.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Current usage for your metered features.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {features.map((feature) => (
            <div
              key={feature.code}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">
                {formatFeatureName(feature.code)}
              </span>
              <div className="flex items-center gap-2">
                {feature.currentUsage !== undefined &&
                feature.includedAmount !== undefined ? (
                  <span className="text-sm font-medium">
                    {feature.currentUsage.toLocaleString()} /{" "}
                    {feature.includedAmount.toLocaleString()}
                  </span>
                ) : feature.allowed ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <X className="size-4 text-muted-foreground/50" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function formatFeatureName(code: string): string {
  return code
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
