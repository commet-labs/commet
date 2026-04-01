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

const FEATURE_CODES = [
  "api_access",
  "white_label",
  "advanced_analytics",
  "priority_support",
  "custom_domain",
] as const;

export default async function DashboardPage() {
  const user = await getUser();

  const results = await Promise.all(
    FEATURE_CODES.map((code) =>
      commet.features.check({ externalId: user!.id, code }),
    ),
  );

  const features = FEATURE_CODES.map((code, i) => ({
    code,
    allowed: results[i]?.data?.allowed ?? false,
  }));

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your plan features and access.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            What's included in your current plan.
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
              {feature.allowed ? (
                <Check className="size-4 text-emerald-600" />
              ) : (
                <X className="size-4 text-muted-foreground/50" />
              )}
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
