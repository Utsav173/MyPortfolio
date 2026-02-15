// src/components/blog/BlogSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function BlogSkeleton() {
  return (
    <div className="space-y-12 mb-20">
      {/* Search & Filter Skeleton */}
      <div className="flex flex-col md:flex-row gap-8 justify-between">
        <Skeleton className="h-10 w-full md:max-w-md rounded-none" />
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </div>

      {/* Tags Skeleton */}
      <div className="flex gap-6 flex-wrap">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-none" />
        ))}
      </div>

      {/* Posts Grid Skeleton - 2 Columns */}
      <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/2] w-full rounded-sm" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
