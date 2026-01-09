import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/3rdparty/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ChatMessageActionButtonProps {
  dropDownAlignment: "start" | "end";
  editMessageHandler: () => void;
  deleteMessageHandler: () => void;
}

export default function ChatMessageActionButton({editMessageHandler, deleteMessageHandler, dropDownAlignment}: ChatMessageActionButtonProps){


    return (
        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 rounded-full hover:bg-muted/80 transition-all duration-200 self-center opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={dropDownAlignment} className="bg-popover">
                          <DropdownMenuItem onClick={() => editMessageHandler()}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteMessageHandler()}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
    )
}
