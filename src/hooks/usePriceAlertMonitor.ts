import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

interface PriceAlert {
  id: string;
  user_id: string;
  project_id: string;
  target_price: number;
  direction: 'above' | 'below';
  triggered: boolean;
  active: boolean;
  carbon_projects?: {
    title: string;
    price_per_credit: number;
  };
}

export function usePriceAlertMonitor() {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCheckedRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!user) return;

    const checkAlerts = async () => {
      try {
        // Fetch active alerts with project data
        const { data: alerts, error } = await supabase
          .from('price_alerts')
          .select(`
            *,
            carbon_projects (
              title,
              price_per_credit
            )
          `)
          .eq('user_id', user.id)
          .eq('active', true)
          .eq('triggered', false);

        if (error) {
          console.error('Error fetching price alerts:', error);
          return;
        }

        if (!alerts || alerts.length === 0) return;

        for (const alert of alerts as PriceAlert[]) {
          if (!alert.carbon_projects) continue;

          const currentPrice = alert.carbon_projects.price_per_credit;
          const targetPrice = alert.target_price;
          
          // Check if condition is met
          const shouldTrigger = 
            (alert.direction === 'above' && currentPrice >= targetPrice) ||
            (alert.direction === 'below' && currentPrice <= targetPrice);

          if (shouldTrigger) {
            // Avoid duplicate notifications
            const lastNotified = lastCheckedRef.current.get(alert.id);
            if (lastNotified && Date.now() - lastNotified < 60000) continue;
            
            lastCheckedRef.current.set(alert.id, Date.now());

            // Mark alert as triggered
            const { error: updateError } = await supabase
              .from('price_alerts')
              .update({ 
                triggered: true, 
                triggered_at: new Date().toISOString() 
              })
              .eq('id', alert.id);

            if (updateError) {
              console.error('Error updating alert:', updateError);
              continue;
            }

            // Show in-app notification
            const direction = alert.direction === 'above' ? 'risen above' : 'dropped below';
            const emoji = alert.direction === 'above' ? '📈' : '📉';
            
            toast.success(
              `${emoji} Price Alert: ${alert.carbon_projects.title}`,
              {
                description: `The price has ${direction} your target of $${targetPrice.toFixed(2)}. Current: $${currentPrice.toFixed(2)}`,
                duration: 10000,
                action: {
                  label: 'View Project',
                  onClick: () => {
                    window.location.href = `/marketplace/${alert.project_id}`;
                  },
                },
              }
            );

            // Send email notification
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('user_id', user.id)
                .maybeSingle();

              await supabase.functions.invoke('send-email', {
                body: {
                  type: 'price_alert',
                  to: user.email,
                  data: {
                    userName: profile?.full_name || 'Investor',
                    projectTitle: alert.carbon_projects.title,
                    currentPrice,
                    targetPrice,
                    alertDirection: alert.direction,
                  },
                },
              });
            } catch (emailError) {
              console.error('Failed to send price alert email:', emailError);
            }

            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
          }
        }
      } catch (error) {
        console.error('Error in price alert monitor:', error);
      }
    };

    // Initial check
    checkAlerts();

    // Set up periodic checks every 30 seconds
    checkIntervalRef.current = setInterval(checkAlerts, 30000);

    // Set up real-time subscription for project price updates
    const channel = supabase
      .channel('price-monitor')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'carbon_projects',
        },
        () => {
          // Re-check alerts when any project is updated
          checkAlerts();
        }
      )
      .subscribe();

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}
