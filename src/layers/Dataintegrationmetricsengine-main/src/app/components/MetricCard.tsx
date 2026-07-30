
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from './ui/utils';
import { Metric } from '../data/mockData';

interface MetricCardProps {
  metric: Metric;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, className }) => {
  const isPositive = metric.change > 0;
  const isNeutral = metric.change === 0;

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        {metric.trend === 'up' ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : metric.trend === 'down' ? (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        ) : (
          <Minus className="h-4 w-4 text-gray-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value} <span className="text-xs font-normal text-muted-foreground">{metric.unit}</span></div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className={cn(
            "font-medium",
             isPositive ? "text-green-500" : isNeutral ? "text-gray-500" : "text-red-500"
          )}>
            {isPositive ? '+' : ''}{metric.change}%
          </span>
          {' '}from last month
        </p>
      </CardContent>
    </Card>
  );
};
