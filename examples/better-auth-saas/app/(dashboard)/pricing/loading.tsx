import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";

export default function PricingLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-secondary/30 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-8 rounded-[2rem] bg-card border border-border shadow-sm flex flex-col h-full"
          >
            <div className="mb-8">
              <Skeleton className="h-7 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="flex items-baseline mb-8">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-5 w-12 ml-2" />
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-start">
                  <Skeleton className="h-5 w-5 rounded-full mr-3" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>

            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ))}
      </div>

      <div className="mt-20 max-w-2xl mx-auto bg-muted rounded-2xl p-8 border border-border flex items-start gap-6">
        <div className="bg-card p-3 rounded-xl shadow-sm border border-border shrink-0">
          <Zap className="w-6 h-6 text-foreground" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </main>
  );
}
