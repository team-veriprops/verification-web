"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Paperclip, Mic, ArrowLeft, Heart, ThumbsUp, Smile, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import { Input } from "@components/3rdparty/ui/input";
import { Button } from "@components/3rdparty/ui/button";
import { Avatar, AvatarFallback } from "@components/3rdparty/ui/avatar";
import { Badge } from "@components/3rdparty/ui/badge";
import { cn } from "@lib/utils";
import { mockConversations, mockUser, Message } from "@data/portalMockData";
import { Textarea } from "@components/3rdparty/ui/textarea";
import ChatMessageActionButton from "./components/ChatMessageActionButton";
import TypingIndicator from "./components/TypingIndicator";


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

// Extended Message type with reactions
interface MessageWithReactions extends Message {
  reactions?: {
    like: number;
    heart: number;
    smile: number;
    userReactions: string[];
  };
}

export default function ChatComponentPage(){
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedChat, setSelectedChat] = useState<string | null>(conversations[0]?.id || null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, { like: number; heart: number; smile: number; userReactions: string[] }>>({});
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
    const {
      filters,
      updateFilters,
      setCurrentVerification,
      setViewVerificationDetail,
    } = useVerificationStore();
  
    const { useSearchVerificationPage } = useVerificationQueries();
    const { data, isLoading, isError, error } = useSearchVerificationPage();

  const selectedConversation = conversations.find(c => c.id === selectedChat);
  
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages, isAgentTyping]);

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

  const handleViewDetails = (verification: QueryVerificationDto) => {
      setCurrentVerification(verification);
      setViewVerificationDetail(true);
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const handleSaveEdit = (messageId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat) {
        return {
          ...conv,
          messages: conv.messages.map(msg => 
            msg.id === messageId ? { ...msg, content: editContent } : msg
          )
        };
      }
      return conv;
    }));
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleDeleteMessage = (messageId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat) {
        return {
          ...conv,
          messages: conv.messages.filter(msg => msg.id !== messageId)
        };
      }
      return conv;
    }));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "user",
      content: messageInput,
      timestamp: new Date().toLocaleString(),
      read: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: "Just now"
        };
      }
      return conv;
    }));
    
    setMessageInput("");

    // Show typing indicator
    setIsAgentTyping(true);

    // Mock agent reply after typing
    setTimeout(() => {
      setIsAgentTyping(false);
      
      const agentReply: Message = {
        id: `m${Date.now() + 1}`,
        senderId: "agent",
        content: "Thank you for your message. I'll look into this and get back to you shortly.",
        timestamp: new Date().toLocaleString(),
        read: false
      };
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedChat) {
          return {
            ...conv,
            messages: [...conv.messages, agentReply],
            lastMessage: agentReply.content,
            lastMessageTime: "Just now"
          };
        }
        return conv;
      }));
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-card border border-border rounded-xl overflow-hidden">
      {/* Chat List */}
      <div className={cn(
        "w-full md:w-80 border-r border-border flex flex-col",
        selectedChat && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={cn(
                "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border text-left",
                selectedChat === conv.id && "bg-muted"
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
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                <p className="text-xs text-muted-foreground mt-1">{conv.lastMessageTime}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedChat && "hidden md:flex"
      )}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedConversation.agent.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedConversation.agent.name}</div>
                <div className="text-xs text-muted-foreground">
                  {isAgentTyping ? (
                    <span className="text-primary animate-pulse">typing...</span>
                  ) : (
                    selectedConversation.agent.role
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
              {selectedConversation.messages.map((message) => {
                const reactions = messageReactions[message.id] || { like: 0, heart: 0, smile: 0, userReactions: [] };
                const hasAnyReaction = reactions.like > 0 || reactions.heart > 0 || reactions.smile > 0;
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 group",
                      message.senderId === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {/* Ellipsis for user messages (left side) */}
                    {message.senderId === "user" && (
                      <ChatMessageActionButton
                        dropDownAlignment={"start"}
                        editMessageHandler={() => handleEditMessage(message)}
                        deleteMessageHandler={() => handleDeleteMessage(message.id)}
                      ></ChatMessageActionButton>
                    )}


                    {message.senderId !== "user" && (
                      <Avatar className="h-8 w-8 shrink-0 mt-1">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {selectedConversation.agent.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col max-w-[70%]">
                      <div className={cn(
                        "rounded-2xl px-4 py-2 transition-all duration-200 cursor-default hover:-translate-y-0.5 hover:shadow-md relative",
                        message.senderId === "user" 
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
                              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(message.id)}
                            />
                            <Button size="sm" className="h-7 px-2" onClick={() => handleSaveEdit(message.id)}>Save</Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>

                      {/* Reactions row */}
                      <div className={cn(
                        "flex items-center gap-1 mt-1.5 transition-opacity duration-200",
                        message.senderId === "user" ? "justify-end flex-row-reverse" : "justify-end",
                        !hasAnyReaction && "opacity-0 group-hover:opacity-100"
                      )}>
                        <div className="flex items-center gap-1">
                          <ReactionButton
                            icon={ThumbsUp}
                            count={reactions.like}
                            active={reactions.userReactions.includes('like')}
                            onClick={() => toggleReaction(message.id, 'like')}
                            activeColor="bg-blue-500"
                          />
                          <ReactionButton
                            icon={Heart}
                            count={reactions.heart}
                            active={reactions.userReactions.includes('heart')}
                            onClick={() => toggleReaction(message.id, 'heart')}
                            activeColor="bg-red-500"
                          />
                          <ReactionButton
                            icon={Smile}
                            count={reactions.smile}
                            active={reactions.userReactions.includes('smile')}
                            onClick={() => toggleReaction(message.id, 'smile')}
                            activeColor="bg-yellow-500"
                          />
                        </div>
                      </div>
                      
                      {/* Timestamp and read receipts */}
                      <div className={cn(
                        "flex items-center gap-1 mt-0.5 px-1 text-sm text-muted-foreground",
                        message.senderId === "user" ? "justify-end" : "justify-start"
                      )}>
                        <span>{message.timestamp.split(" ")[1]}</span>
                        {message.senderId === "user" && (
                          <CheckCheck className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                    {message.senderId === "user" && (
                      <Avatar className="h-8 w-8 shrink-0 mt-1">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {mockUser.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* Ellipsis for agent messages (right side) */}
                    {message.senderId !== "user" && (
                      <ChatMessageActionButton
                        dropDownAlignment={"end"}
                        editMessageHandler={() => handleEditMessage(message)}
                        deleteMessageHandler={() => handleDeleteMessage(message.id)}
                      ></ChatMessageActionButton>
                    )}
                  </div>
                );
              })}
              
              {/* Typing indicator */}
              {isAgentTyping && (
                <TypingIndicator agentName={selectedConversation.agent.name} />
              )}
              
              <div ref={messagesEndRef} />
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
    </div>
  );
};