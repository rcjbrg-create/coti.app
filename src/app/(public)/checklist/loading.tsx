import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="px-4 mb-4">
        <Skeleton className="h-6 w-36 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="px-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface p-4 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2 mt-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-8 w-24 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
