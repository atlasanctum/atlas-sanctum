import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle2,
  CreditCard,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { NotificationType } from "@/hooks/useNotifications";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case "alert":
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    case "transaction":
      return <CreditCard className="w-4 h-4 text-primary" />;
    case "price_alert":
      return <TrendingUp className="w-4 h-4 text-accent" />;
    case "system":
      return <Settings className="w-4 h-4 text-muted-foreground" />;
    default:
      return <Info className="w-4 h-4 text-muted-foreground" />;
  }
};

const getNotificationBg = (type: NotificationType, read: boolean) => {
  if (read) return "bg-transparent hover:bg-muted/30";
  switch (type) {
    case "success":
      return "bg-green-500/5 hover:bg-green-500/10";
    case "warning":
      return "bg-amber-500/5 hover:bg-amber-500/10";
    case "alert":
      return "bg-destructive/5 hover:bg-destructive/10";
    case "transaction":
      return "bg-primary/5 hover:bg-primary/10";
    case "price_alert":
      return "bg-accent/5 hover:bg-accent/10";
    default:
      return "bg-muted/30 hover:bg-muted/50";
  }
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "transactions") return n.type === "transaction";
    if (activeTab === "alerts") return n.type === "price_alert" || n.type === "alert" || n.type === "warning";
    if (activeTab === "system") return n.type === "system" || n.type === "info" || n.type === "success";
    return true;
  });

  const transactionCount = notifications.filter(n => n.type === "transaction" && !n.read).length;
  const alertCount = notifications.filter(n => ["price_alert", "alert", "warning"].includes(n.type) && !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="relative p-2 rounded-lg hover:bg-accent/50 transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[420px] p-0 bg-card border-border shadow-elevated z-50"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="all" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 px-4 text-sm"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 px-4 text-sm gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Transactions
              {transactionCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                  {transactionCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 px-4 text-sm gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Alerts
              {alertCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-accent/10 text-accent rounded-full">
                  {alertCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 px-4 text-sm"
            >
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[320px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No {activeTab === "all" ? "" : activeTab} notifications
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 transition-colors cursor-pointer ${getNotificationBg(
                          notification.type,
                          notification.read
                        )}`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm font-medium ${
                                  notification.read
                                    ? "text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="p-1 rounded hover:bg-muted/50 transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1 rounded hover:bg-destructive/10 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-[10px] text-muted-foreground/60">
                                {formatDistanceToNow(new Date(notification.created_at), {
                                  addSuffix: true,
                                })}
                              </p>
                              {notification.actionUrl && (
                                <Link 
                                  to={notification.actionUrl}
                                  onClick={() => setOpen(false)}
                                  className="text-[10px] text-primary hover:underline"
                                >
                                  {notification.actionLabel || "View"}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-3 border-t border-border bg-muted/20 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link to="/transactions">View all transactions</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link to="/profile">Settings</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
