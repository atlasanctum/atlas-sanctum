import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bell, TrendingUp, TrendingDown, Plus, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CarbonProject } from '@/types/marketplace';

const priceAlertSchema = z.object({
  projectId: z.string().uuid('Please select a project'),
  targetPrice: z.number().positive('Price must be positive').max(1000, 'Price cannot exceed $1000'),
  direction: z.enum(['above', 'below']),
});

type PriceAlertFormData = z.infer<typeof priceAlertSchema>;

interface PriceAlert {
  id: string;
  project_id: string;
  target_price: number;
  direction: string;
  active: boolean;
  triggered: boolean;
  triggered_at: string | null;
  created_at: string;
  carbon_projects?: {
    title: string;
    price_per_credit: number;
  };
}

export function PriceAlertForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PriceAlertFormData>({
    resolver: zodResolver(priceAlertSchema),
    defaultValues: {
      direction: 'below',
    },
  });

  const direction = watch('direction');

  // Fetch available projects
  const { data: projects } = useQuery({
    queryKey: ['carbon-projects-for-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carbon_projects')
        .select('id, title, price_per_credit')
        .eq('status', 'active')
        .order('title');

      if (error) throw error;
      return data as CarbonProject[];
    },
  });

  // Fetch user's price alerts
  const { data: userAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['user-price-alerts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          id,
          project_id,
          target_price,
          direction,
          active,
          triggered,
          triggered_at,
          created_at,
          carbon_projects (
            title,
            price_per_credit
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PriceAlert[];
    },
  });

  // Create alert mutation
  const createAlertMutation = useMutation({
    mutationFn: async (data: PriceAlertFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('price_alerts').insert({
        user_id: user.id,
        project_id: data.projectId,
        target_price: data.targetPrice,
        direction: data.direction,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-price-alerts'] });
      toast({
        title: 'Price Alert Created',
        description: "You'll be notified when the price reaches your target.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-price-alerts'] });
      toast({
        title: 'Alert Deleted',
        description: 'Price alert has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PriceAlertFormData) => {
    createAlertMutation.mutate(data);
  };

  const activeAlerts = userAlerts?.filter((a) => a.active) || [];
  const triggeredAlerts = userAlerts?.filter((a) => a.triggered) || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="w-4 h-4" />
          Price Alerts
          {activeAlerts.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeAlerts.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Price Alerts
          </DialogTitle>
          <DialogDescription>
            Get notified when carbon credit prices reach your target
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Create New Alert Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Create New Alert
            </h3>

            <div className="space-y-2">
              <Label>Project</Label>
              <Select onValueChange={(value) => setValue('projectId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{project.title}</span>
                        <span className="text-muted-foreground ml-2">
                          ${project.price_per_credit.toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-destructive">{errors.projectId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alert Direction</Label>
                <Select
                  value={direction}
                  onValueChange={(value: 'above' | 'below') => setValue('direction', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-green-500" />
                        Price drops below
                      </div>
                    </SelectItem>
                    <SelectItem value="above">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        Price rises above
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000"
                  placeholder="0.00"
                  {...register('targetPrice', { valueAsNumber: true })}
                />
                {errors.targetPrice && (
                  <p className="text-sm text-destructive">{errors.targetPrice.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isSubmitting || createAlertMutation.isPending}
            >
              {createAlertMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Create Alert
            </Button>
          </form>

          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Active Alerts ({activeAlerts.length})
              </h3>
              <AnimatePresence>
                {activeAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {alert.direction === 'below' ? (
                        <TrendingDown className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">
                          {alert.carbon_projects?.title || 'Unknown Project'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.direction === 'below' ? 'Below' : 'Above'} $
                          {alert.target_price.toFixed(2)}
                          <span className="ml-2">
                            (Current: ${alert.carbon_projects?.price_per_credit?.toFixed(2) || 'N/A'})
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlertMutation.mutate(alert.id)}
                      disabled={deleteAlertMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Triggered Alerts History */}
          {triggeredAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Triggered ({triggeredAlerts.length})
              </h3>
              {triggeredAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        {alert.carbon_projects?.title || 'Unknown Project'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Target ${alert.target_price.toFixed(2)} hit on{' '}
                        {alert.triggered_at
                          ? new Date(alert.triggered_at).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Triggered</Badge>
                </div>
              ))}
            </div>
          )}

          {alertsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!alertsLoading && userAlerts?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No price alerts yet</p>
              <p className="text-sm">Create your first alert above</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
