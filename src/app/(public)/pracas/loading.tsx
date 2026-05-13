import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="px-4 mb-4">
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="px-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    </>
  );
}
