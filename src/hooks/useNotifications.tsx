/**
 * useNotifications Hook
 * React hook for managing notifications in the application
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import notificationService from '../services/notificationService';
import {
  Notification,
  NotificationPreferences,
  NotificationFilter,
  NotificationPage,
  ToastNotification,
  NotificationContextType,
} from '../types/notifications';

interface UseNotificationsReturn extends Omit<NotificationContextType, 'preferences'> {
  preferences: NotificationPreferences | null;
}

/**
 * Custom hook for managing notifications
 */
export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toastCallbacksRef = useRef<((toast: ToastNotification) => void)[]>([]);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await notificationService.getPreferences();
        setPreferences(prefs);
      } catch (err) {
        console.error('Failed to load notification preferences:', err);
      }
    };
    loadPreferences();
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async (filter?: NotificationFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationService.getNotifications(filter);
      setNotifications(result.notifications);
      setUnreadCount(result.notifications.filter((n) => !n.readAt).length);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Register toast callback
  useEffect(() => {
    const unsubscribe = notificationService.onToast((toast) => {
      toastCallbacksRef.current.forEach((callback) => callback(toast));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Send notification
  const sendNotification = useCallback(
    async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
      setIsLoading(true);
      try {
        const result = await notificationService.sendNotification(notification);
        if (result.success) {
          await loadNotifications();
        }
        return result;
      } catch (err) {
        setError('Failed to send notification');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadNotifications]
  );

  // Send batch notifications
  const sendBatch = useCallback(
    async (notifications: Omit<Notification, 'id' | 'createdAt'>[]) => {
      setIsLoading(true);
      try {
        const result = await notificationService.sendBatch({ notifications });
        if (result.success) {
          await loadNotifications();
        }
        return result;
      } catch (err) {
        setError('Failed to send batch notifications');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadNotifications]
  );

  // Mark as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    },
    []
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => {
        const notification = notifications.find((n) => n.id === notificationId);
        return notification && !notification.readAt ? prev - 1 : prev;
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, [notifications]);

  // Clear all
  const clearAll = useCallback(async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!preferences) return;
    try {
      await notificationService.updatePreferences(newPreferences);
      setPreferences({ ...preferences, ...newPreferences });
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  }, [preferences]);

  // Subscribe to push
  const subscribeToPush = useCallback(async (deviceToken: string, platform: 'ios' | 'android' | 'web') => {
    try {
      await notificationService.subscribeToPush(deviceToken, platform);
    } catch (err) {
      console.error('Failed to subscribe to push:', err);
    }
  }, []);

  // Unsubscribe from push
  const unsubscribeFromPush = useCallback(async (deviceToken: string) => {
    try {
      await notificationService.unsubscribeFromPush(deviceToken);
    } catch (err) {
      console.error('Failed to unsubscribe from push:', err);
    }
  }, []);

  // Show toast
  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    notificationService.showToast(toast);
  }, []);

  // Dismiss toast
  const dismissToast = useCallback((id: string) => {
    notificationService.dismissInAppNotification(id);
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    error,
    sendNotification,
    sendBatch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getPreferences: () => notificationService.getPreferences(),
    updatePreferences,
    subscribeToPush,
    unsubscribeFromPush,
    showToast,
    dismissToast,
    refresh: () => loadNotifications(),
  };
}

/**
 * Hook for managing in-app toast notifications
 */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.onToast((toast) => {
      setToasts((prev) => [...prev, toast]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    notificationService.dismissInAppNotification(id);
  }, []);

  return {
    toasts,
    dismissToast,
    showToast: (toast: Omit<ToastNotification, 'id'>) => notificationService.showToast(toast),
    clearAll: () => setToasts([]),
  };
}

/**
 * Hook for notification preferences
 */
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const prefs = await notificationService.getPreferences();
        setPreferences(prefs);
      } catch (err) {
        console.error('Failed to load preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const update = useCallback(async (updates: Partial<NotificationPreferences>) => {
    if (!preferences) return;
    try {
      await notificationService.updatePreferences(updates);
      setPreferences({ ...preferences, ...updates });
    } catch (err) {
      console.error('Failed to update preferences:', err);
      throw err;
    }
  }, [preferences]);

  return {
    preferences,
    isLoading,
    update,
    isQuietHours: () => notificationService.isQuietHours(preferences || undefined),
  };
}

export default useNotifications;
