"use client";

import {
  Bell,
  User,
  HelpCircle,
  Settings,
  LogOut,
  GitCompareArrows,
  Heart,
  Dot,
  Trash2,
} from "lucide-react";
import { Button } from "@3rdparty/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@3rdparty/ui/dropdown-menu";
import { onLogoutRedirect } from "@lib/utils";
import { redirect } from "next/navigation";
import { Badge } from "@components/3rdparty/ui/badge";
import { Separator } from "@components/3rdparty/ui/separator";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/3rdparty/ui/tooltip";
import ToolTipComponent from "@components/ui/ToolTipComponent";
import NotificationComponent from "@components/ui/NotificationComponent";

export default function TopNav() {
  // const [isSearchOpen, setIsSearchOpen] = useState(false);

  const notifications = [
    { id: "1", title: "Design phase completed", time: "2h ago", type: "success" },
    { id: "2", title: "Invoice #1001 is due", time: "1d ago", type: "warning" },
    { id: "3", title: "New message from team", time: "3h ago", type: "info" },
  ];



  // TODO: Replace with real auth logic (or put in middleware)
  const user = { email: "kingsley.ezenwere@gmail.com", name: "Kingsley" };

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {/* Search Button */}
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSearchOpen(true)}
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Button> */}

      {/* Notifications */}
      <NotificationComponent notifications={notifications} />

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Profile">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => ""}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => redirect("/portal/settings/profile")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogoutRedirect}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Sheet (Mobile-friendly overlay) */}
      {/* <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="top" className="sm:max-w-lg mx-auto">
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search projects, tasks, messages..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        </SheetContent>
      </Sheet> */}
    </div>
  );
}
