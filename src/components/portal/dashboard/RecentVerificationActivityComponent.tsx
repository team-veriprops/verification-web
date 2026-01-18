"use client";

import {
  Loader2,
} from "lucide-react";
import { Badge } from "@3rdparty/ui/badge";
import { useDashboardQueries} from "./libs/useDashboardQueries";
import { QueryVerificationDto } from "../verifications/models";
import { Page } from "types/models";
import { useMemo } from "react";
import InfiniteScrollTriggerComponent from "@components/ui/InfiniteScrollTriggerComponent";
import { Button } from "@components/3rdparty/ui/button";
import Link from "next/link";
import { cn } from "@lib/utils";
import { getVerificationStatusColor } from "../verifications/VerificationsTable";

export default function RecentVerificationActivityComponent() {
    const { useGetRecentVerificationActivitiesInfinite } = useDashboardQueries();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useGetRecentVerificationActivitiesInfinite();

    // Flattened data
    const allPageVerifications = useMemo<QueryVerificationDto[]>(() => {
      return data?.pages?.flatMap((page: Page<QueryVerificationDto>) => page.items) ?? [];
    }, [data?.pages]);

  return (
    <div className="divide-y divide-border">

      {isLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Fetching chats...
                </div>
                ) : isError ? (
                <div className="text-center py-8 text-destructive">
                    Something went wrong. Please refresh this page.
                </div>
                ) : !allPageVerifications || allPageVerifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No chats found
                </div>
                ) : allPageVerifications.map((v) => {
                    const Icon = getVerificationStatusColor(v.status);
                    
                    return (
                      <div
                        key={v.id}
                        className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-foreground">{v.property_title}</span>
                            <Badge className={cn("capitalize text-xs", Icon)}>
                              {v.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{v.location.address}</p>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                        </div>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/portal/verifications/${v.id}`}>
                            View Report
                          </Link>
                        </Button>
                      </div>
                    );
                  })
              }

              <InfiniteScrollTriggerComponent
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
              />
        </div>
  );
}
