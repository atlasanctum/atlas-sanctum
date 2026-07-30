import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export type NotificationType = 'alert' | 'warning' | 'info' | 'success' | 'transaction' | 'price_alert' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  email_on_purchase: boolean;
  email_on_retirement: boolean;
  email_on_market_opportunities: boolean;
  email_on_price_alerts: boolean;
  sms_alerts: boolean;
  in_app_notifications: boolean;
  daily_digest: boolean;
}

// Generate initial mock notifications
const generateMockNotifications = (userId: string): Notification[] => [
  {
    id: '1',
    user_id: userId,
    type: 'success',
    title: 'Welcome to Atlas Sanctum',
    message: 'Start exploring carbon credit opportunities',
    read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useNotifications() {
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_on_purchase: true,
    email_on_retirement: true,
    email_on_market_opportunities: true,
    email_on_price_alerts: false,
    sms_alerts: false,
    in_app_notifications: true,
    daily_digest: false,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications from transactions and price alerts
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const loadNotifications = async () => {
      setIsLoading(true);
      const allNotifications: Notification[] = [...generateMockNotifications(user.id)];

      try {
        // Fetch recent transactions as notifications
        const { data: transactions } = await supabase
          .from('transactions')
          .select('id, created_at, quantity, total_amount, status, transaction_type, carbon_projects(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactions) {
          transactions.forEach((tx: any) => {
            allNotifications.push({
              id: `tx-${tx.id}`,
              user_id: user.id,
              type: 'transaction',
              title: tx.status === 'completed' ? 'Purchase Completed' : `Transaction ${tx.status}`,
              message: `${tx.quantity} credits from ${tx.carbon_projects?.title || 'Unknown Project'} - $${tx.total_amount.toFixed(2)}`,
              actionUrl: '/transactions',
              actionLabel: 'View Details',
              read: false,
              created_at: tx.created_at,
              updated_at: tx.created_at,
              metadata: { transactionId: tx.id, amount: tx.total_amount },
            });
          });
        }

        // Fetch triggered price alerts
        const { data: alerts } = await supabase
          .from('price_alerts')
          .select('id, created_at, target_price, direction, triggered, triggered_at, carbon_projects(title, price_per_credit)')
          .eq('user_id', user.id)
          .eq('triggered', true)
          .order('triggered_at', { ascending: false })
          .limit(5);

        if (alerts) {
          alerts.forEach((alert: any) => {
            allNotifications.push({
              id: `alert-${alert.id}`,
              user_id: user.id,
              type: 'price_alert',
              title: 'Price Alert Triggered',
              message: `${alert.carbon_projects?.title || 'Project'} is now $${alert.carbon_projects?.price_per_credit?.toFixed(2)} (${alert.direction === 'below' ? 'below' : 'above'} $${alert.target_price})`,
              actionUrl: '/marketplace',
              actionLabel: 'View Project',
              read: false,
              created_at: alert.triggered_at || alert.created_at,
              updated_at: alert.triggered_at || alert.created_at,
            });
          });
        }

        // Sort by date
        allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setNotifications(allNotifications);
        setUnreadCount(allNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();

    // Subscribe to real-time transaction updates
    const transactionChannel = supabase
      .channel('transaction-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const tx = payload.new as any;
          const newNotification: Notification = {
            id: `tx-${tx.id}`,
            user_id: user.id,
            type: 'transaction',
            title: 'New Transaction',
            message: `${tx.quantity} credits purchased - $${tx.total_amount.toFixed(2)}`,
            actionUrl: '/transactions',
            actionLabel: 'View Details',
            read: false,
            created_at: tx.created_at,
            updated_at: tx.created_at,
          };
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.success('Transaction completed!', { description: newNotification.message });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionChannel);
    };
  }, [user?.id]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const createNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Show toast for new notifications
      if (notification.type === 'success') {
        toast.success(notification.title, { description: notification.message });
      } else if (notification.type === 'alert' || notification.type === 'warning') {
        toast.warning(notification.title, { description: notification.message });
      } else {
        toast(notification.title, { description: notification.message });
      }
    },
    []
  );

  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    toast.success('Notification preferences updated');
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    updatePreferences,
  };
}

export function usePriceAlerts() {
  const { user } = useSupabaseAuth();
  
  const setPriceAlert = useCallback(async (projectId: string, targetPrice: number, direction: 'above' | 'below' = 'below') => {
    if (!user?.id) {
      toast.error('Please sign in to set price alerts');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          project_id: projectId,
          target_price: targetPrice,
          direction,
        });

      if (error) throw error;
      toast.success(`Price alert set for $${targetPrice}`);
    } catch (error: any) {
      toast.error(`Failed to set alert: ${error.message}`);
    }
  }, [user?.id]);

  return { setPriceAlert };
}

export function usePortfolioAlerts() {
  const setMilestoneAlert = useCallback(
    (type: 'impact_reached' | 'value_threshold' | 'carbon_offset', threshold: number) => {
      toast.success('Milestone alert set');
    },
    []
  );

  return { setMilestoneAlert };
}
