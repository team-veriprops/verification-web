import { Avatar, AvatarFallback } from "@components/3rdparty/ui/avatar";

export default function TypingIndicator({ agentName }: { agentName: string }){
    return (
<div className="flex gap-2 justify-start">
    <Avatar className="h-8 w-8 shrink-0 mt-1">
      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
        {agentName.split(" ").map(n => n[0]).join("")}
      </AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <div className="bg-white text-foreground rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
      <span className="text-xs text-muted-foreground mt-1 px-1">typing...</span>
    </div>
  </div>
    )
}