import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert } from '../data/advancedMockData';
import { AlertCircle, AlertTriangle, Info, Check, X } from 'lucide-react';
import { cn } from './ui/utils';
import { formatDistanceToNow } from 'date-fns';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  alerts, 
  onAcknowledge,
  onDismiss 
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);
  
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const getSeverityConfig = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          badge: 'destructive' as const,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          badge: 'outline' as const,
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          badge: 'secondary' as const,
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>
              {unacknowledgedCount} unacknowledged alert{unacknowledgedCount !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'critical' ? 'destructive' : 'outline'} 
              size="sm"
              onClick={() => setFilter('critical')}
            >
              Critical
            </Button>
            <Button 
              variant={filter === 'warning' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('warning')}
            >
              Warning
            </Button>
            <Button 
              variant={filter === 'info' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setFilter('info')}
            >
              Info
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Check className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No alerts to display</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const config = getSeverityConfig(alert.severity);
              const Icon = config.icon;
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "relative p-4 rounded-lg border transition-all",
                    config.bg,
                    config.border,
                    alert.acknowledged ? 'opacity-60' : 'opacity-100'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-full mt-0.5", config.bg)}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={config.badge} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.sector && (
                          <Badge variant="outline" className="text-xs">
                            {alert.sector}
                          </Badge>
                        )}
                        {alert.acknowledged && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!alert.acknowledged && onAcknowledge && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAcknowledge(alert.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {onDismiss && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismiss(alert.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
