import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[1, 2].map((i) => (
          <div key={i} className="p-8 bg-card border border-border shadow-sm">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-8" />
            <Skeleton className="h-12 w-24 mb-8" />
            <div className="space-y-4 mb-10">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-14 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
