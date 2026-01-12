"use client";

import ChatConversationComponent from "./components/ChatConversationComponent";
import ChatConversationMessagesComponent from "./components/ChatConversationMessagesComponent";




// Extended Message type with reactions
// interface MessageWithReactions extends Message {
//   reactions?: {
//     like: number;
//     heart: number;
//     smile: number;
//     userReactions: string[];
//   };
// }

export default function ChatComponentPage(){

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-card border border-border rounded-xl overflow-hidden">
      <ChatConversationComponent></ChatConversationComponent>

      <ChatConversationMessagesComponent></ChatConversationMessagesComponent>
    </div>
  );
};
