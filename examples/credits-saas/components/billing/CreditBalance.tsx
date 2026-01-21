"use client";

import type { CreditsBalance } from "@/app/actions/credits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Coins, RefreshCw, Zap } from "lucide-react";

interface CreditBalanceProps {
  balance: CreditsBalance;
}

export function CreditBalance({ balance }: CreditBalanceProps) {
  const planUsage =
    balance.includedCredits > 0
      ? ((balance.includedCredits - balance.planCredits) /
          balance.includedCredits) *
        100
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Balance Card */}
      <Card className="overflow-hidden border-none shadow-md bg-gray-900 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
            <Coins className="w-4 h-4" />
            Total Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {balance.totalCredits.toLocaleString()}
          </div>
          <p className="text-xs opacity-70 mt-1">
            Available for use across all features
          </p>
        </CardContent>
      </Card>

      {/* Plan Credits Card */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-500">
            <RefreshCw className="w-4 h-4 text-gray-700" />
            Plan Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {balance.planCredits.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Resets every month</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-gray-400">
                {Math.round(100 - planUsage)}% remaining
              </span>
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-800 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, 100 - planUsage)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Purchased Credits Card */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-500">
            <Zap className="w-4 h-4 text-amber-500" />
            Purchased Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {balance.purchasedCredits.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Never expire, used after plan credits
          </p>
          <div className="mt-4 flex items-center gap-1 text-amber-600 text-xs font-medium">
            <Calendar className="w-3 h-3" />
            Used as backup
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
