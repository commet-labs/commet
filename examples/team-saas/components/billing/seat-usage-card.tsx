import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface SeatUsageCardProps {
  used: number;
  included: number;
  overagePrice?: number;
}

export function SeatUsageCard({
  used,
  included,
  overagePrice,
}: SeatUsageCardProps) {
  const overage = Math.max(0, used - included);
  const percentUsed = Math.min(100, (used / Math.max(included, 1)) * 100);
  const isOverLimit = used > included;
  const hasOveragePrice = overagePrice !== undefined && overagePrice > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Seats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {used} of {included} seats used
              </span>
              {isOverLimit && (
                <span className="text-yellow-500 font-medium">
                  +{overage} extra
                </span>
              )}
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isOverLimit
                    ? "bg-yellow-500"
                    : percentUsed > 80
                      ? "bg-yellow-500"
                      : "bg-primary"
                }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Included seats</span>
              <span>{included}</span>
            </div>
            {overage > 0 && hasOveragePrice && (
              <div className="flex justify-between text-yellow-500">
                <span>Extra seats ({overage})</span>
                <span>+${((overage * overagePrice) / 100).toFixed(0)}/mo</span>
              </div>
            )}
            {hasOveragePrice && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Price per extra seat
                </span>
                <span>${(overagePrice / 100).toFixed(0)}/mo</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
