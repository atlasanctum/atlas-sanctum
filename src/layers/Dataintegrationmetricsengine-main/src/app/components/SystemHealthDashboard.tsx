import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Server, Activity, Database, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from './ui/utils';
import { Progress } from './ui/progress';

interface SystemHealthDashboardProps {
  health: {
    overallStatus: 'healthy' | 'degraded' | 'critical';
    uptime: string;
    activeDataStreams: number;
    totalDataStreams: number;
    dataProcessed24h: string;
    avgLatency: number;
    errorRate: number;
  };
}

export const SystemHealthDashboard: React.FC<SystemHealthDashboardProps> = ({ health }) => {
  const getStatusConfig = (status: 'healthy' | 'degraded' | 'critical') => {
    switch (status) {
      case 'healthy':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          label: 'All Systems Operational',
          badgeVariant: 'default' as const,
        };
      case 'degraded':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          label: 'Performance Degraded',
          badgeVariant: 'outline' as const,
        };
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          label: 'Critical Issues Detected',
          badgeVariant: 'destructive' as const,
        };
    }
  };

  const statusConfig = getStatusConfig(health.overallStatus);
  const StatusIcon = statusConfig.icon;
  const streamHealthPercentage = (health.activeDataStreams / health.totalDataStreams) * 100;

  return (
    <Card className="border-2">
      <CardHeader className={cn("border-b", statusConfig.bg)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
          <Badge variant={statusConfig.badgeVariant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Uptime */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium">Uptime</span>
            </div>
            <div className="text-2xl font-bold">{health.uptime}</div>
            <Progress value={99.97} className="h-1.5" />
          </div>

          {/* Data Streams */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Database className="h-4 w-4" />
              <span className="text-xs font-medium">Data Streams</span>
            </div>
            <div className="text-2xl font-bold">
              {health.activeDataStreams}
              <span className="text-sm text-muted-foreground">/{health.totalDataStreams}</span>
            </div>
            <Progress 
              value={streamHealthPercentage} 
              className={cn(
                "h-1.5",
                streamHealthPercentage < 90 && "[&>div]:bg-yellow-500",
                streamHealthPercentage < 75 && "[&>div]:bg-red-500"
              )} 
            />
          </div>

          {/* Data Processed */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium">Data Processed (24h)</span>
            </div>
            <div className="text-2xl font-bold">{health.dataProcessed24h}</div>
            <div className="text-xs text-muted-foreground">+12% vs yesterday</div>
          </div>

          {/* Performance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium">Avg Latency</span>
            </div>
            <div className="text-2xl font-bold">
              {health.avgLatency}
              <span className="text-sm text-muted-foreground">ms</span>
            </div>
            <div className={cn(
              "text-xs",
              health.errorRate < 0.01 ? "text-green-500" :
              health.errorRate < 0.05 ? "text-yellow-500" : "text-red-500"
            )}>
              {(health.errorRate * 100).toFixed(2)}% error rate
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
