"use client";

import { Badge } from "@components/3rdparty/ui/badge";
import { Card, CardContent, CardHeader } from "@components/3rdparty/ui/card";
import { Input } from "@components/3rdparty/ui/input";
import { Search } from "lucide-react";
import { useConversationQueries } from "./libs/useConversationQueries";
import { useEffect, useMemo} from "react";
import { QueryConversationDto } from "./models";
import { Page, PropertyType } from "types/models";
import { useConversationStore } from "./libs/useConversationStore";
import InfiniteScrollTriggerComponent from "@components/ui/InfiniteScrollTriggerComponent";

export default function ConversationsComponent() {
  const {
    filters,
    updateFilters,
    currentConversation,
    setCurrentConversation,
  } = useConversationStore();

  const { useSearchConversationInfinite } = useConversationQueries();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchConversationInfinite();

  // Flattened data
const allConversations = useMemo(() => {
  return data?.pages.flatMap((page: Page<QueryConversationDto>) => page.items) ?? [];
}, [data]);

  useEffect(() => {
    if (allConversations.length > 0 && !currentConversation) {
      setCurrentConversation(allConversations[0]);
    }
  }, [allConversations, currentConversation, setCurrentConversation]);

  const getConversationTypeColor = (type: PropertyType) => {
    switch (type) {
      case PropertyType.HOUSE:
        return "bg-blue-100 text-blue-800";
      case PropertyType.LAND:
        return "bg-orange-100 text-orange-800";
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="lg:col-span-1">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="space-y-1 overflow-y-auto">
            {allConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setCurrentConversation(conversation)}
                className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                  currentConversation?.id === conversation.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{conversation.title}</h4>
                  {conversation.unread_count > 0 && (
                    <Badge className="bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {conversation.last_message}
                </p>

                <div className="flex items-center justify-between">
                  <Badge
                    className={getConversationTypeColor(conversation.type)}
                  >
                    {conversation.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(conversation.last_message_time)}
                  </span>
                </div>
              </div>
            ))}

            <InfiniteScrollTriggerComponent
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
