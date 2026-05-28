import { Skeleton } from "@/components/ui/skeleton";

export const ListingSkeleton = () => (
  <div className="rounded-lg border border-border p-3">
    <Skeleton className="aspect-[4/3] w-full" />
    <Skeleton className="mt-4 h-5 w-3/4" />
    <Skeleton className="mt-3 h-7 w-1/2" />
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
    </div>
  </div>
);
