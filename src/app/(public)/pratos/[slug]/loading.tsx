import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-6">
      <Skeleton className="w-full h-48 rounded-none" />

      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-surface rounded-2xl shadow-sm border border-border p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-3 mt-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6">
        <div>
          <Skeleton className="h-5 w-48 mb-3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full mb-2 rounded-xl" />
          ))}
        </div>

        <div>
          <Skeleton className="h-5 w-40 mb-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 mb-4">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>

        <div>
          <Skeleton className="h-5 w-36 mb-3" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
