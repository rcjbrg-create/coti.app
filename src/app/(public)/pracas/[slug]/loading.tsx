import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="px-4 mb-4">
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="px-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border border-border bg-surface"
          >
            <Skeleton className="aspect-[4/3] rounded-none w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
