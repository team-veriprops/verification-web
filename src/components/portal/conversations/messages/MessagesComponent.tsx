"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@components/3rdparty/ui/avatar";
import { Button } from "@components/3rdparty/ui/button";
import { Card, CardHeader, CardTitle } from "@components/3rdparty/ui/card";
import { Textarea } from "@components/3rdparty/ui/textarea";
import {
  Clock,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Video,
} from "lucide-react";
import { useMessageQueries } from "./libs/useMessageQueries";
import { useConversationStore } from "../libs/useConversationStore";
import { useState } from "react";
import { CreateMessageDto, QueryMessageDto } from "./models";
import { Page } from "types/models";
import { toast } from "@components/3rdparty/ui/use-toast";
import InfiniteScrollTriggerComponent from "@components/ui/InfiniteScrollTriggerComponent";

export default function MessagesComponent() {
  const [messageInput, setMessageInput] = useState<string>();

  const { currentConversation } = useConversationStore();

  const { useSearchMessageInfinite, useCreateMessage } = useMessageQueries();
  const createMessage = useCreateMessage(currentConversation?.id!);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMessageInfinite(currentConversation?.id!);

  // Flattened data
  const allMessages =
    data?.pages.flatMap((page: Page<QueryMessageDto>) => page.items) ?? [];

  const handleSendMessage = () => {
    if (!messageInput?.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    const newMessage: CreateMessageDto = {
      content: messageInput,
      conversation_id: currentConversation?.id!,
    };

    createMessage.mutate(newMessage, {
      onSuccess: () => {
        setMessageInput("");
        toast({
          title: "Message Sent",
          description: "Your message has been delivered.",
        });
      },
    });
  };

  const formatDate = (timestamp: string) => {
    return timestamp.split(" ")[0] || timestamp;
  };

  const formatTime = (timestamp: string) => {
    return timestamp.split(" ")[1] || timestamp;
  };

  return (
    <div className="lg:col-span-2">
      <Card className="h-full flex flex-col">
        {/* Chat Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {currentConversation?.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentConversation?.participants.join(", ")}
              </p>
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
        </CardHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === "ADMIN" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`flex space-x-2 max-w-[70%] ${
                  message.sender_type === "ADMIN"
                    ? ""
                    : "flex-row-reverse space-x-reverse"
                }`}
              >
                {message.sender_type === "SELLER" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback className="text-xs">
                      {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div>
                  {message.sender_type === "BUYER" && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {message.sender}
                    </p>
                  )}

                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender_type === "BUYER"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-xs"
                          >
                            <Paperclip className="h-3 w-3" />
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.date_created!)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {allMessages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          <InfiniteScrollTriggerComponent
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Textarea
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="min-h-0 py-2"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
