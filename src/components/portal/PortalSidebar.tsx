import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/3rdparty/ui/button";
import { useSidebar } from "@components/3rdparty/ui/sidebar";
import { Separator } from "@components/3rdparty/ui/separator";
import { Fragment } from "react";
import { useAuthQueries } from "@components/website/auth/libs/useAuthQueries";

const navItems = [
  { title: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard, has_separator_after: false },
  { title: "My Verifications", href: "/portal/verifications", icon: FileCheck, has_separator_after: false },
  { title: "Payments", href: "/portal/payments", icon: CreditCard, has_separator_after: false },
  { title: "Chats", href: "/portal/chats", icon: MessageSquare, has_separator_after: false },
  { title: "Disputes", href: "/portal/disputes", icon: AlertTriangle, has_separator_after: false },
  { title: "Tasks", href: "/portal/tasks", icon: ClipboardList, has_separator_after: true },
  { title: "Settings", href: "/portal/settings", icon: Settings, has_separator_after: false },
  { title: "Support & Help", href: "/portal/support", icon: HelpCircle, has_separator_after: false },
];

interface PortalSidebarProps {
  className?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

const PortalSidebar = ({ className, onClose, isMobile = false }: PortalSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const {useLogout} = useAuthQueries()
  const {mutate: logout, isPending} = useLogout()

  const handleLogout = () => {
    logout();
  };

  const isActive = (href: string) => {
    if (href === "/portal/dashboard") {
      return pathname === "/portal" || pathname === "/portal/dashboard";
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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">Veriprops</span>
          </Link>
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
