"use client";

import { useState } from "react";
import { Button } from "@3rdparty/ui/button";
import { Input } from "@3rdparty/ui/input";
import { Badge } from "@3rdparty/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@3rdparty/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@3rdparty/ui/avatar";
import {
  Bell,
  Search,
  Building2,
  ChevronDown,
  Plus,
  Menu,
  LogOut,
  HelpCircle,
  Settings as SettingsIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@3rdparty/ui/sheet";
import Link from "next/link";
import TopNav from "./TopNav";
import CompanySwitcher from "../company/CompanySwitcher";

export default function MobileTopNav() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between p-4">
        <CompanySwitcher compact />

        {/* <div className="flex-1 mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 transition-all duration-300 ease-out focus:scale-[1.02] focus:shadow-md"
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => setIsSearchExpanded(false)}
            />
          </div>
        </div> */}

        <div className="flex items-center space-x-2">
          <TopNav />
        </div>
      </div>
    </header>
  );
}
