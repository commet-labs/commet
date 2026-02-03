"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageMeterProps {
  title: string;
  used: number;
  total: number;
  unit: string;
}

export function UsageMeter({
  title,
  used,
  total,
  unit,
}: UsageMeterProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const isHigh = percentage > 80;
  const isCritical = percentage > 95;

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {total > 0 ? (
          <Badge
            variant={
              isCritical ? "destructive" : isHigh ? "secondary" : "outline"
            }
            className="text-[10px] h-5"
          >
            {Math.round(percentage)}%
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-baseline mb-2">
          <div className="text-2xl font-bold text-foreground">
            {used.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </div>
          {total > 0 ? (
            <div className="text-sm text-muted-foreground">
              of {total.toLocaleString()}
            </div>
          ) : null}
        </div>

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical
                ? "bg-red-500"
                : isHigh
                  ? "bg-amber-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

      </CardContent>
    </Card>
  );
}
