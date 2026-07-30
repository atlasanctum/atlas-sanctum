import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Crown, Calendar, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import type { Subscription} from '@/hooks/useSubscription';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionStatusProps {
  subscription: Subscription;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const { cancelSubscription } = useSubscription();
  const { toast } = useToast();

  const handleCancel = async () => {
    try {
      await cancelSubscription.mutateAsync(subscription.id);
      toast({
        title: 'Subscription canceled',
        description: 'Your subscription has been canceled. You will retain access until the end of your billing period.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isActive = subscription.status === 'active';
  const periodEnd = new Date(subscription.current_period_end);
  const daysLeft = Math.max(0, Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <Card className={`border-2 ${isActive ? 'border-primary/30 bg-primary/5' : 'border-border/50'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${isActive ? 'bg-primary' : 'bg-muted'} flex items-center justify-center`}>
              <Crown className={`w-6 h-6 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{subscription.plan_name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{subscription.billing_period} plan</p>
            </div>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {subscription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CreditCard className="w-4 h-4" />
              Amount
            </div>
            <p className="font-semibold text-foreground">
              ${subscription.amount}/{subscription.billing_period === 'monthly' ? 'mo' : 'yr'}
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              {isActive ? 'Renews' : 'Expires'}
            </div>
            <p className="font-semibold text-foreground">
              {format(periodEnd, 'MMM dd, yyyy')}
            </p>
            {isActive && (
              <p className="text-xs text-muted-foreground">{daysLeft} days left</p>
            )}
          </div>
        </div>

        {subscription.canceled_at && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Canceled</p>
              <p className="text-muted-foreground">
                Canceled on {format(new Date(subscription.canceled_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {isActive && !subscription.canceled_at && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={cancelSubscription.isPending}
            className="text-destructive hover:text-destructive"
          >
            {cancelSubscription.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Cancel Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
