import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/3rdparty/ui/button";
import { useSidebar } from "@components/3rdparty/ui/sidebar";
import { Separator } from "@components/3rdparty/ui/separator";
import { ElementType, Fragment } from "react";
import { useUserQueries } from "@components/admin/user/libs/useUserQueries";
import BrandLogo from "@components/ui/BrandLogo";


export interface NavItem{
    title: string
    href: string
    icon: ElementType
    has_separator_after: boolean
}

interface PortalSidebarProps {
  className?: string;
  onClose?: () => void;
  isMobile?: boolean;
  navItems: NavItem[]
}

const PortalSidebar = ({ navItems, className, onClose, isMobile = false }: PortalSidebarProps) => {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const {useLogout} = useUserQueries()
  const {mutate: logout, isPending} = useLogout()

  const handleLogout = () => {
    logout();
  };

  const isActive = (href: string) => {
    if (href.endsWith("/dashboard")) {
      const base = href.replace("/dashboard", "");
      return pathname === base || pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r border-border h-full transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-border px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <BrandLogo />
        )}

        {isCollapsed && (
          <Link
            href="/"
            className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center"
          >
            <Shield className="w-4 h-4 text-primary-foreground" />
          </Link>
        )}

        {!isMobile && !isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-16 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Fragment key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                {!isCollapsed && <span className="text-sm">{item.title}</span>}
              </Link>

              {item.has_separator_after && <Separator className="mb-6" />}
            </Fragment>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default PortalSidebar;
