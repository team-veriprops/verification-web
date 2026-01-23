"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronRight, Shield } from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";
import { Avatar, AvatarFallback } from "@components/3rdparty/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/3rdparty/ui/dropdown-menu";
import { useSidebar } from "@components/3rdparty/ui/sidebar";
import NotificationDropdown from "./NotificationDropdown";
import { mockUser } from "@data/portalMockData";
import { useAuthQueries } from "@components/website/auth/libs/useAuthQueries";

interface PortalHeaderProps {
  onMenuClick: () => void;
}

const routeTitles: Record<string, string> = {
  "/portal": "Dashboard",
  "/portal/dashboard": "Dashboard",
  "/portal/verifications": "My Verifications",
  "/portal/tasks": "Tasks",
  "/portal/disputes": "Disputes",
  "/portal/chats": "Chats",
  "/portal/payments": "Payments",
  "/portal/settings": "Settings",
  "/portal/support": "Support & Help",
};

const PortalHeader = ({ onMenuClick }: PortalHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const {useLogout} = useAuthQueries()
  const {mutate: logout, isPending} = useLogout()

  const getPageTitle = () => {
    const path = pathname;

    if (path.startsWith("/portal/verifications/") && path !== "/portal/verifications") {
      return "Verification Detail";
    }
    if (path.startsWith("/portal/tasks/") && path !== "/portal/tasks") {
      return "Task Detail";
    }
    if (path.startsWith("/portal/disputes/") && path !== "/portal/disputes") {
      return "Dispute Detail";
    }

    return routeTitles[path] || "Portal";
  };

  const getBreadcrumbs = () => {
    const path = pathname;
    const crumbs = [{ label: "Portal", href: "/portal/dashboard" }];

    if (path.startsWith("/portal/verifications")) {
      crumbs.push({ label: "Verifications", href: "/portal/verifications" });
      if (path !== "/portal/verifications") {
        const id = path.split("/").pop();
        crumbs.push({ label: id || "Detail", href: path });
      }
    } else if (path.startsWith("/portal/tasks")) {
      crumbs.push({ label: "Tasks", href: "/portal/tasks" });
      if (path !== "/portal/tasks") {
        const id = path.split("/").pop();
        crumbs.push({ label: id || "Detail", href: path });
      }
    } else if (path.startsWith("/portal/disputes")) {
      crumbs.push({ label: "Disputes", href: "/portal/disputes" });
      if (path !== "/portal/disputes") {
        const id = path.split("/").pop();
        crumbs.push({ label: id || "Detail", href: path });
      }
    } else {
      const title = getPageTitle();
      if (title !== "Dashboard") {
        crumbs.push({ label: title, href: path });
      }
    }

    return crumbs;
  };

  const handleLogout = () => {
    logout();
  };

  const breadcrumbs = getBreadcrumbs();
  const initials = mockUser.name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {state === "collapsed" && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground">{mockUser.email}</p>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/portal/settings")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/portal/settings")}>
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isPending} onClick={handleLogout} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default PortalHeader;
