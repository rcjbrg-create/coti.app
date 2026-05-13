import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="pb-4">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="px-4 mb-1">
        <Skeleton className="h-5 w-28 mb-1" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="px-4 grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border border-border bg-surface"
          >
            <Skeleton className="aspect-[4/3] rounded-none w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mb-1">
        <Skeleton className="h-5 w-24 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="px-4 grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>

      <div className="mt-2 px-4">
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  );
}
