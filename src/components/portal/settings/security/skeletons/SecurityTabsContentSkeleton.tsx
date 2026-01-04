"use client";

import { Skeleton } from "@3rdparty/ui/skeleton";

export default function SecurityTabsContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
