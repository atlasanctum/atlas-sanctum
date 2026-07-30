import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

export interface PriceAlert {
  id: string;
  user_id: string;
  project_id: string;
  target_price: number;
  direction: 'above' | 'below';
  triggered: boolean;
  triggered_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  carbon_projects?: {
    title: string;
    price_per_credit: number;
    project_type: string;
  };
}

export function usePriceAlerts() {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['price-alerts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          *,
          carbon_projects (
            title,
            price_per_credit,
            project_type
          )
        `)
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!user,
  });

  const createAlert = useMutation({
    mutationFn: async ({ projectId, targetPrice, direction }: { 
      projectId: string; 
      targetPrice: number; 
      direction: 'above' | 'below';
    }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          project_id: projectId,
          target_price: targetPrice,
          direction,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      toast.success('Price alert created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create alert: ${error.message}`);
    },
  });

  // Check and trigger price alerts
  const checkPriceAlerts = async () => {
    if (!user || alerts.length === 0) return;

    for (const alert of alerts) {
      if (!alert.carbon_projects || alert.triggered) continue;

      const currentPrice = alert.carbon_projects.price_per_credit;
      const targetPrice = alert.target_price;
      const shouldTrigger = 
        (alert.direction === 'above' && currentPrice >= targetPrice) ||
        (alert.direction === 'below' && currentPrice <= targetPrice);

      if (shouldTrigger) {
        // Mark alert as triggered
        await supabase
          .from('price_alerts')
          .update({ triggered: true, triggered_at: new Date().toISOString() })
          .eq('id', alert.id);

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

          toast.success(`Price alert triggered for ${alert.carbon_projects.title}!`);
        } catch (error) {
          console.error('Failed to send price alert email:', error);
        }

        queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      }
    }
  };

  const deleteAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      toast.success('Price alert removed');
    },
    onError: (error) => {
      toast.error(`Failed to delete alert: ${error.message}`);
    },
  });

  const toggleAlert = useMutation({
    mutationFn: async ({ alertId, active }: { alertId: string; active: boolean }) => {
      const { error } = await supabase
        .from('price_alerts')
        .update({ active })
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
    },
  });

  return {
    alerts,
    isLoading,
    error,
    createAlert,
    deleteAlert,
    toggleAlert,
    checkPriceAlerts,
  };
}
