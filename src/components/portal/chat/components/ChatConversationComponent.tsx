import { Avatar, AvatarFallback } from "@components/3rdparty/ui/avatar";
import { Input } from "@components/3rdparty/ui/input";
import { cn } from "@lib/utils";
import { Loader2, Search } from "lucide-react";
import { useConversationStore } from "../libs/useConversationStore";
import { useConversationQueries } from "../libs/useConversationQueries";
import { QueryConversationDto } from "../models";
import { formatDate } from "@lib/time";
import { Badge } from "@components/3rdparty/ui/badge";
import { Page } from "types/models";
import InfiniteScrollTriggerComponent from "@components/ui/InfiniteScrollTriggerComponent";

export default function ChatConversationComponent(){
    const {
            conversationFilters,
            updateConversationFilters,
            currentConversation,
            setCurrentConversation,
            setViewConversationMessages,
    } = useConversationStore();

    const { useSearchConversationInfinite } = useConversationQueries();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useSearchConversationInfinite();

    const handleViewConversationMessages = (conversation: QueryConversationDto) => {
          setCurrentConversation(conversation);
          setViewConversationMessages(true);
      };

    // Flattened data
    const allConversations =
    data?.pages.flatMap((page: Page<QueryConversationDto>) => page.items) ?? [];

    return (
        <div className={cn(
        "w-full md:w-80 border-r border-border flex flex-col",
        currentConversation && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9"
              value={conversationFilters.query}
              onChange={(e) => updateConversationFilters({"query": e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Fetching conversations...
            </div>
            ) : isError ? (
            <div className="text-center py-8 text-destructive">
                Something went wrong. Please refresh this page.
            </div>
            ) : !allConversations || allConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                No conversation found
            </div>
            ) : allConversations.map((conv) => (
            <button
                key={conv.id}
                onClick={() => handleViewConversationMessages(conv)}
                className={cn(
                "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border text-left",
                currentConversation?.id === conv.id && "bg-muted"
                )}
            >
                <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {conv.agent.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{conv.title}</span>

                    {conv.unread_count > 0 && (
                    <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {conv.unread_count}
                    </Badge>
                    )}
                </div>

                <p className="text-xs text-muted-foreground truncate">{conv.last_message}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(conv.last_message_time)}</p>
                </div>
            </button>
            ))}

          <InfiniteScrollTriggerComponent
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />

        </div>
      </div>
    )
}
