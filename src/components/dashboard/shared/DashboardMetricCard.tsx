import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  iconColor = 'text-emerald-500',
  trend = 'neutral',
  description,
  className,
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-slate-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4', iconColor)} aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" role="status" aria-live="polite">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-xs mt-1">
            <span className={cn('font-medium', getTrendColor())}>
              {getTrendIcon()} {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground ml-1">{changeLabel}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2" role="note">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
