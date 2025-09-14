// src/components/blog/BlogSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function BlogSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search Skeleton */}
      <Skeleton className="h-12 w-full" />

      {/* Tags Skeleton */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>

      {/* Posts Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
