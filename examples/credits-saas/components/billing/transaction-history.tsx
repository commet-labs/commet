"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Download, RefreshCw, Zap } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  type: "Subscription" | "Credit Pack" | "Usage";
  description: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <Card className="shadow-sm border-border overflow-hidden">
        <CardHeader className="bg-secondary/50 border-b border-border">
          <CardTitle className="text-lg font-semibold text-foreground">
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12">
          <div className="text-center text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm">No billing history available</p>
            <p className="text-xs text-muted-foreground mt-2">
              Your invoices will appear here once you make a payment
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border overflow-hidden">
      <CardHeader className="bg-secondary/50 border-b border-border">
        <CardTitle className="text-lg font-semibold text-foreground">
          Billing History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-accent transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {t.description}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {t.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {t.type === "Subscription" ? (
                        <RefreshCw className="w-3 h-3 text-foreground" />
                      ) : t.type === "Credit Pack" ? (
                        <Zap className="w-3 h-3 text-amber-500" />
                      ) : (
                        <CreditCard className="w-3 h-3 text-muted-foreground" />
                      )}
                      {t.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {t.amount}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "Paid"
            ? "bg-green-500"
            : status === "Pending"
              ? "bg-amber-500"
              : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}
