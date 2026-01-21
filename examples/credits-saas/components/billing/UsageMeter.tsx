"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface UsageMeterProps {
  title: string;
  used: number;
  total: number;
  unit: string;
}

export function UsageMeter({ title, used, total, unit }: UsageMeterProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const isHigh = percentage > 80;
  const isCritical = percentage > 95;

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <Badge
          variant={
            isCritical ? "destructive" : isHigh ? "secondary" : "outline"
          }
          className="text-[10px] h-5"
        >
          {Math.round(percentage)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-baseline mb-2">
          <div className="text-2xl font-bold text-gray-900">
            {used.toLocaleString()}
            <span className="text-sm font-normal text-gray-400 ml-1">
              {unit}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            of {total.toLocaleString()}
          </div>
        </div>

        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
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

        <div className="mt-4 flex items-center text-xs text-gray-900 font-medium cursor-pointer hover:underline">
          View detailed breakdown
          <ArrowUpRight className="w-3 h-3 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}
