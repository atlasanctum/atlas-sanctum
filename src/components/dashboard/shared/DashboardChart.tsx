import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardChartProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  icon: Icon,
  iconColor = 'text-emerald-500',
  description,
  children,
  className,
  actions,
}) => {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn('h-5 w-5', iconColor)} aria-hidden="true" />}
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-4" role="note">
            {description}
          </p>
        )}
        <div className="min-h-[300px]" role="img" aria-label={`${title} chart`}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
