"use client";

import { useState } from "react";
import { Bell, X, FileText, MessageSquare, Receipt, ClipboardList, AlertTriangle } from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";
import { Badge } from "@components/3rdparty/ui/badge";
import { cn } from "@lib/utils";
import { mockNotifications, NotificationType } from "@data/portalMockData";
import { useRouter } from "next/navigation";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const router = useRouter();

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const filteredNotifications =
    activeTab === "all" ? mockNotifications : mockNotifications.filter(n => !n.read);

  const getTypeIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, typeof Bell> = {
      report: FileText,
      message: MessageSquare,
      invoice: Receipt,
      task: ClipboardList,
      dispute: AlertTriangle,
    };
    return icons[type] || Bell;
  };

  const getTypeLabel = (type: NotificationType) => {
    const labels: Record<NotificationType, string> = {
      report: "report",
      message: "message",
      invoice: "invoice",
      task: "task",
      dispute: "dispute",
    };
    return labels[type];
  };

  const handleNotificationClick = (link: string) => {
    setIsOpen(false);
    router.push(link);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-floating z-50 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">
                Notifications
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 py-2 border-b border-border">
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                All
              </button>

              <button
                onClick={() => setActiveTab("unread")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2",
                  activeTab === "unread"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getTypeIcon(notification.type);

                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.link)}
                      className={cn(
                        "w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-0",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      {/* Icon Bubble */}
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                          !notification.read
                            ? "bg-primary/10"
                            : "bg-muted"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            !notification.read
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={cn(
                              "text-sm font-medium truncate",
                              !notification.read
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {notification.title}
                          </span>

                          {/* Type Badge */}
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 text-[10px] px-1.5 py-0 h-5 shrink-0"
                          >
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>

                      {/* Unread Dot */}
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
