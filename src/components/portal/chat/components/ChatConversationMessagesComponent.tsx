import { Page } from "types/models";
import { useConversationQueries } from "../libs/useConversationQueries";
import { useConversationStore } from "../libs/useConversationStore";
import { CreateMessageDto, QueryMessageDto } from "../models";
import { cn } from "@lib/utils";
import { Button } from "@components/3rdparty/ui/button";
import { ArrowLeft, CheckCheck, ChevronDown, Heart, Loader2, Mic, MoreVertical, Paperclip, Phone, Send, Smile, ThumbsUp, Video } from "lucide-react";
import { Avatar, AvatarFallback } from "@components/3rdparty/ui/avatar";
import ChatMessageActionButton from "./ChatMessageActionButton";
import { useEffect, useMemo, useRef, useState } from "react";
import { Textarea } from "@components/3rdparty/ui/textarea";
import TypingIndicator from "./TypingIndicator";
import { Input } from "@components/3rdparty/ui/input";
import { useAuthStore } from "@components/website/auth/libs/useAuthStore";
import InfiniteScrollTriggerComponent from "@components/ui/InfiniteScrollTriggerComponent";
import { formatDate } from "@lib/time";


// Reaction button component
const ReactionButton = ({ 
  icon: Icon, 
  count, 
  active, 
  onClick,
  activeColor 
}: { 
  icon: React.ElementType; 
  count: number; 
  active: boolean; 
  onClick: () => void;
  activeColor: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200",
      "hover:scale-110 active:scale-95",
      active 
        ? `${activeColor} text-white` 
        : "bg-white/80 text-muted-foreground hover:bg-white shadow-sm"
    )}
  >
    <Icon className="h-3 w-3" />
    {count > 0 && <span>{count}</span>}
  </button>
);

export default function ChatConversationMessagesComponent(){
    const [messageInput, setMessageInput] = useState("");
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const [messageReactions, setMessageReactions] = useState<Record<string, { like: number; heart: number; smile: number; userReactions: string[] }>>({});
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const [conversationMessages, setConversationMessages] = useState<QueryMessageDto[]>([])
  
    const {activeAuditor} = useAuthStore()
    
        const {
                currentConversation,
                setCurrentConversation,
        } = useConversationStore();
    
        const { useSearchConversationMessageInfinite } = useConversationQueries();
        const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
        useSearchConversationMessageInfinite(currentConversation?.id ?? "");

      const { useCreateConversationMessage, useUpdateConversationMessage, useDeleteConversationMessage } = useConversationQueries();
      const createConversationMessage = useCreateConversationMessage(currentConversation?.id ?? "");
      const updateConversationMessage = useUpdateConversationMessage(currentConversation?.id ?? "");
      const deleteConversationMessage = useDeleteConversationMessage(currentConversation?.id ?? "");

    // Flattened data
    const allPageMessages = useMemo<QueryMessageDto[]>(() => {
      return data?.pages?.flatMap((page: Page<QueryMessageDto>) => page.items) ?? [];
    }, [data?.pages]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setConversationMessages(allPageMessages)

    }, [allPageMessages, isAgentTyping]);
  
    const toggleReaction = (messageId: string, reactionType: 'like' | 'heart' | 'smile') => {
      setMessageReactions(prev => {
        const current = prev[messageId] || { like: 0, heart: 0, smile: 0, userReactions: [] };
        const reactionKey = `${reactionType}`;
        const hasReacted = current.userReactions.includes(reactionKey);
        
        return {
          ...prev,
          [messageId]: {
            ...current,
            [reactionType]: hasReacted ? current[reactionType] - 1 : current[reactionType] + 1,
            userReactions: hasReacted 
              ? current.userReactions.filter(r => r !== reactionKey)
              : [...current.userReactions, reactionKey]
          }
        };
      });
    };


    // Handle scroll to detect if we're near bottom
  const handleScroll = () => {
    console.log("scrolling...")

    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset scroll button on chat switch
  useEffect(() => {
    handleScroll();
  }, [allPageMessages]);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [allPageMessages, isAgentTyping]);


  
    const handleEditMessage = (message: QueryMessageDto) => {
      setEditingMessageId(message.id!);
      setEditContent(message.content);
    };
  
    const handleSaveEditMessage = (messageId: string) => {
      const currentMessage = conversationMessages.find(msg =>
              msg.id === messageId
            )!
      currentMessage.content = editContent

      updateConversationMessage.mutate({message_id: messageId, new_message: currentMessage}, {
          onSuccess: (data) => {
            const latestConversationMessages = conversationMessages.map(msg => 
              msg.id === messageId ? data : msg
            )
            setConversationMessages(latestConversationMessages)

            setEditingMessageId(null);
            setEditContent("");
          },
        });
    };
  
    const handleDeleteMessage = (messageId: string) => {
        deleteConversationMessage.mutate({message_id: messageId}, {
          onSuccess: () => {
            const latestConversationMessages = conversationMessages.filter(msg => msg.id !== messageId)
            setConversationMessages(latestConversationMessages)
          },
        });
    }

    const handleSendMessage = () => {
      if (!messageInput.trim() || !currentConversation) return;

      const newMessage: CreateMessageDto = {
        conversation_id: currentConversation?.id ?? "",
        content: messageInput,
        timestamp: new Date().toLocaleString(),
      };


      createConversationMessage.mutate(newMessage, {
          onSuccess: (data) => {
            const latestConversationMessages = conversationMessages
            latestConversationMessages.push(data)
            setConversationMessages(latestConversationMessages)

            setMessageInput("");
          },
        });
  
      // TODO: handle agent typing, showing typing indicator
      // setIsAgentTyping(true);
      // setIsAgentTyping(false);
    };

    return (
        <div className={cn(
        "flex-1 flex flex-col relative",
        !currentConversation && "hidden md:flex"
      )}>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setCurrentConversation(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {currentConversation.agent.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{currentConversation.agent.name}</div>
                <div className="text-xs text-muted-foreground">
                  {isAgentTyping ? (
                    <span className="text-primary animate-pulse">typing...</span>
                  ) : (
                    currentConversation.agent.role
                  )}
                </div>
              </div>
              </div>

              <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Fetching chats...
                </div>
                ) : isError ? (
                <div className="text-center py-8 text-destructive">
                    Something went wrong. Please refresh this page.
                </div>
                ) : !conversationMessages || conversationMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No chats found
                </div>
                ) : conversationMessages.map((message) => {
                    const reactions = messageReactions[message.id ?? ""] || { like: 0, heart: 0, smile: 0, userReactions: [] };
                    const hasAnyReaction = reactions.like > 0 || reactions.heart > 0 || reactions.smile > 0;
                    
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2 group",
                          message.sender_id === "user" ? "justify-end" : "justify-start"
                        )}
                      >

                        {message.sender_id !== "user" && (
                          <Avatar className="h-8 w-8 shrink-0 mt-1">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {currentConversation.agent.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className="flex flex-col max-w-[70%]">
                          {/* Bubble row with ellipsis - vertically centered */}
                      <div className="flex items-center gap-1">
                        {/* Ellipsis for user messages (left of bubble) */}
                        {message.sender_id === "user" && (
                          <ChatMessageActionButton
                            dropDownAlignment={"start"}
                            editMessageHandler={() => handleEditMessage(message)}
                            deleteMessageHandler={() => handleDeleteMessage(message.id ?? "")}
                          ></ChatMessageActionButton>
                        )}
                        
                        {/* Message bubble */}
                          <div className={cn(
                            "rounded-2xl px-4 py-2 transition-all duration-200 cursor-default hover:-translate-y-0.5 hover:shadow-md relative",
                            message.sender_id === "user" 
                              ? "bg-primary text-primary-foreground rounded-br-none" 
                              : "bg-white text-foreground rounded-bl-none shadow-sm"
                          )}>
                            {editingMessageId === message.id ? (
                              <div className="flex items-center gap-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="flex-1 text-sm h-8 bg-background text-foreground"
                                  autoFocus
                                  onKeyDown={(e) => e.key === "Enter" && handleSaveEditMessage(message.id ?? "")}
                                />
                                <Button size="sm" className="h-7 px-2" onClick={() => handleSaveEditMessage(message.id ?? "")}>Save</Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                              </div>
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                          </div>
                        
                        {/* Ellipsis for agent messages (right of bubble) */}
                        {message.sender_id !== "user" && (
                          <ChatMessageActionButton
                            dropDownAlignment={"end"}
                            editMessageHandler={() => handleEditMessage(message)}
                            deleteMessageHandler={() => handleDeleteMessage(message.id ?? "")}
                          ></ChatMessageActionButton>
                        )}
                      </div>
                      
                      {/* Reactions row */}
                          <div className={cn(
                            "flex items-center gap-1 mt-1.5 transition-opacity duration-200",
                            message.sender_id === "user" ? "justify-end flex-row-reverse" : "justify-end",
                            !hasAnyReaction && "opacity-0 group-hover:opacity-100"
                          )}>
                            <div className="flex items-center gap-1">
                              <ReactionButton
                                icon={ThumbsUp}
                                count={reactions.like}
                                active={reactions.userReactions.includes('like')}
                                onClick={() => toggleReaction(message.id ?? "", 'like')}
                                activeColor="bg-blue-500"
                              />
                              <ReactionButton
                                icon={Heart}
                                count={reactions.heart}
                                active={reactions.userReactions.includes('heart')}
                                onClick={() => toggleReaction(message.id ?? "", 'heart')}
                                activeColor="bg-red-500"
                              />
                              <ReactionButton
                                icon={Smile}
                                count={reactions.smile}
                                active={reactions.userReactions.includes('smile')}
                                onClick={() => toggleReaction(message.id ?? "", 'smile')}
                                activeColor="bg-yellow-500"
                              />
                            </div>
                          </div>
                      
                          {/* Timestamp and read receipts */}
                          <div className={cn(
                                "flex items-center gap-1 mt-0.5 px-1 text-sm text-muted-foreground",
                                message.sender_id === "user" ? "justify-end" : "justify-start"
                              )}>
                                <span>{formatDate(message.timestamp)}</span>
                                {message.sender_id === "user" && message.is_read && (
                                  <CheckCheck className="h-4 w-4 text-primary" />
                                )}
                          </div>

                      </div>
                          
                        {message.sender_id === "user" && (
                          <Avatar className="h-8 w-8 shrink-0 mt-1">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {activeAuditor?.fullname.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        </div>
                    );
                  })
              }

              <InfiniteScrollTriggerComponent
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
              />
              
              {/* Typing indicator */}
              {isAgentTyping && (
                <TypingIndicator agentName={currentConversation.agent.name} />
              )}
              
              <div ref={messagesEndRef} />

              {/* Floating scroll-to-bottom button */}
              <button
                onClick={scrollToBottom}
                className={cn(
                  "absolute bottom-22 right-8 z-10 w-10 h-10 rounded-full bg-card shadow-elevated border border-border",
                  "flex items-center justify-center",
                  "transition-all duration-300 ease-in-out",
                  "hover:shadow-floating hover:scale-110 active:scale-95",
                  showScrollButton 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4 pointer-events-none"
                )}
                aria-label="Scroll to bottom"
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex items-center gap-2">
              <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
              <Input 
                placeholder="Type a message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}><Send className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation
          </div>
        )}
      </div>
    )
}