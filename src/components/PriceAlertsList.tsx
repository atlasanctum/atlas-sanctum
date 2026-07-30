import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Trash2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { Skeleton } from '@/components/ui/skeleton';

export function PriceAlertsList() {
  const { alerts, isLoading, deleteAlert, toggleAlert } = usePriceAlerts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Price Alerts
        </CardTitle>
        <CardDescription>
          Get notified when carbon credit prices hit your target
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No active price alerts</p>
              <p className="text-sm text-muted-foreground mt-1">
                Set alerts from project detail pages
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {alert.direction === 'below' ? (
                          <TrendingDown className="w-4 h-4 text-primary" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-ocean" />
                        )}
                        <h4 className="font-medium text-foreground truncate">
                          {alert.carbon_projects?.title || 'Unknown Project'}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Alert when price goes{' '}
                        <span className={alert.direction === 'below' ? 'text-primary' : 'text-ocean'}>
                          {alert.direction}
                        </span>{' '}
                        <span className="font-semibold text-foreground">
                          ${Number(alert.target_price).toFixed(2)}
                        </span>
                      </p>
                      {alert.carbon_projects && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Current: ${alert.carbon_projects.price_per_credit.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.triggered && (
                        <Badge variant="secondary" className="gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Triggered
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAlert.mutate(alert.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
