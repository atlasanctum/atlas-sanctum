import { useState } from "react";
import { Bell, Check, CheckCheck, X, Filter, Vote, FileText, Users, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: "vote" | "proposal" | "delegation" | "treasury" | "mention";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "vote",
      title: "Voting ends soon",
      message: "Privacy-Preserving Voting Mechanism proposal closes in 2 hours",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "2",
      type: "proposal",
      title: "New proposal",
      message: "Universal Basic Income for Contributors has been created",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: "3",
      type: "delegation",
      title: "Delegation update",
      message: "Your delegate Sarah Chen voted on 2 new proposals",
      timestamp: new Date(Date.now() - 10800000),
      read: true,
    },
    {
      id: "4",
      type: "treasury",
      title: "Treasury update",
      message: "Monthly revenue increased by 8.5% to $475K",
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
    {
      id: "5",
      type: "mention",
      title: "You were mentioned",
      message: "Alex Thompson mentioned you in a proposal discussion",
      timestamp: new Date(Date.now() - 172800000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  
  const filteredNotifications = filter === "unread" 
    ? notifications.filter((n) => !n.read)
    : notifications;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "vote":
        return <Vote className="w-5 h-5 text-green-600" />;
      case "proposal":
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case "delegation":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "treasury":
        return <DollarSign className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3>Notifications</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filter === "all"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filter === "unread"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? "bg-indigo-50/50" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            notification.type === "vote" ? "bg-green-100" :
                            notification.type === "proposal" ? "bg-indigo-100" :
                            notification.type === "delegation" ? "bg-purple-100" :
                            notification.type === "treasury" ? "bg-amber-100" :
                            "bg-gray-100"
                          }`}>
                            {getIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    Mark read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-gray-500 hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button className="w-full text-sm text-center text-indigo-600 hover:text-indigo-700 py-2">
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
