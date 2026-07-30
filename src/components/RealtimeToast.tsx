import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShoppingCart, 
  RefreshCw,
  X 
} from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export type ToastType = 'success' | 'error' | 'info' | 'transaction' | 'update';

interface RealtimeToastData {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: Date;
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  transaction: ShoppingCart,
  update: RefreshCw,
};

const colorMap = {
  success: 'text-primary bg-primary/10 border-primary/20',
  error: 'text-destructive bg-destructive/10 border-destructive/20',
  info: 'text-ocean bg-ocean/10 border-ocean/20',
  transaction: 'text-accent bg-accent/10 border-accent/20',
  update: 'text-aurora bg-aurora/10 border-aurora/20',
};

export const showRealtimeToast = (type: ToastType, title: string, message: string) => {
  const Icon = iconMap[type];
  
  sonnerToast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-lg shadow-elevated ${colorMap[type]}`}
    >
      <div className={`p-2 rounded-lg ${colorMap[type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{message}</p>
      </div>
      <button 
        onClick={() => sonnerToast.dismiss(t)}
        className="p-1 rounded-full hover:bg-muted/50 transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </motion.div>
  ), {
    duration: 5000,
    position: 'bottom-right',
  });
};

export function useRealtimeTransactionToasts() {
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to transactions updates
    const transactionChannel = supabase
      .channel('realtime-transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const transaction = payload.new;
          showRealtimeToast(
            'transaction',
            'New Transaction',
            `You purchased ${transaction.quantity} carbon credits for $${transaction.total_amount.toLocaleString()}`
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const transaction = payload.new;
          if (transaction.status === 'completed') {
            showRealtimeToast(
              'success',
              'Transaction Completed',
              `Your purchase of ${transaction.quantity} credits has been confirmed!`
            );
          } else if (transaction.status === 'failed') {
            showRealtimeToast(
              'error',
              'Transaction Failed',
              'Your transaction could not be processed. Please try again.'
            );
          }
        }
      )
      .subscribe();

    // Subscribe to credit holdings updates
    const holdingsChannel = supabase
      .channel('realtime-holdings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credit_holdings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            showRealtimeToast(
              'success',
              'Credits Added to Portfolio',
              'New carbon credits have been added to your portfolio!'
            );
          } else if (payload.eventType === 'UPDATE') {
            showRealtimeToast(
              'update',
              'Portfolio Updated',
              'Your portfolio has been updated with the latest changes.'
            );
          }
        }
      )
      .subscribe();

    // Subscribe to project updates
    const projectsChannel = supabase
      .channel('realtime-projects')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'carbon_projects',
        },
        (payload) => {
          const project = payload.new;
          showRealtimeToast(
            'info',
            'Project Update',
            `"${project.title}" has been updated with new information.`
          );
        }
      )
      .subscribe();

    // Subscribe to price alerts
    const alertsChannel = supabase
      .channel('realtime-alerts')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'price_alerts',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const alert = payload.new;
          if (alert.triggered) {
            showRealtimeToast(
              'transaction',
              'Price Alert Triggered!',
              `A project has reached your target price of $${alert.target_price}`
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionChannel);
      supabase.removeChannel(holdingsChannel);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [user]);
}

export function RealtimeToastProvider({ children }: { children: React.ReactNode }) {
  useRealtimeTransactionToasts();
  return <>{children}</>;
}
