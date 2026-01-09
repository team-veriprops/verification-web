"use client";

import { Skeleton } from "@3rdparty/ui/skeleton";

export default function NotificationsTabsContentSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-40" />
    </div>
  );
}
