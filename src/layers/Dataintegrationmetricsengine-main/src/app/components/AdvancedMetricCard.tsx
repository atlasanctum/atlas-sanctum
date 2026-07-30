import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Clock, Database as DatabaseIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from './ui/utils';
import { Metric } from '../data/advancedMockData';
import { DataQualityIndicator } from './DataQualityIndicator';
import { formatDistanceToNow } from 'date-fns';

interface AdvancedMetricCardProps {
  metric: Metric;
  className?: string;
  showDetails?: boolean;
}

export const AdvancedMetricCard: React.FC<AdvancedMetricCardProps> = ({ 
  metric, 
  className,
  showDetails = true 
}) => {
  const isPositive = metric.change > 0;
  const isNeutral = metric.change === 0;

  const sourceIcons: Record<string, any> = {
    IoT: '📡',
    Manual: '✍️',
    API: '🔌',
    ML_Model: '🤖',
    Satellite: '🛰️',
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200 border-l-4", 
      metric.trend === 'up' ? 'border-l-green-500' : 
      metric.trend === 'down' ? 'border-l-red-500' : 
      'border-l-gray-400',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </CardTitle>
          {metric.dataQuality && showDetails && (
            <DataQualityIndicator quality={metric.dataQuality} />
          )}
        </div>
        {metric.trend === 'up' ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : metric.trend === 'down' ? (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        ) : (
          <Minus className="h-4 w-4 text-gray-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metric.value} 
          <span className="text-xs font-normal text-muted-foreground ml-1">
            {metric.unit}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className={cn(
            "font-medium",
            isPositive ? "text-green-500" : isNeutral ? "text-gray-500" : "text-red-500"
          )}>
            {isPositive ? '+' : ''}{metric.change}%
          </span>
          {' '}from last month
        </p>
        {showDetails && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {metric.lastUpdated && formatDistanceToNow(metric.lastUpdated, { addSuffix: true })}
            </div>
            {metric.source && (
              <div className="text-xs text-muted-foreground" title={metric.source}>
                {sourceIcons[metric.source]}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
