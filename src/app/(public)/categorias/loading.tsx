import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="px-4 mb-4">
        <Skeleton className="h-6 w-36 mb-1" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="px-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
    </>
  );
}
