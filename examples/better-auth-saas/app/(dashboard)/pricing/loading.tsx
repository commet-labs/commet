import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <main className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-20 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Skeleton className="h-10 w-80 mx-auto mb-4" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-8 border border-border flex flex-col h-full"
          >
            <div className="mb-8">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="flex items-baseline mb-8">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-12 ml-2" />
            </div>

            <div className="space-y-3 mb-10 flex-grow">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-start">
                  <Skeleton className="h-4 w-4 mr-3" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>

            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
