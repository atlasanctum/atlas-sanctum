import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { cn } from './ui/utils';

interface CorrelationMatrixProps {
  correlations: { metric: string; correlation: number }[];
  title?: string;
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ 
  correlations,
  title = "Correlation Analysis"
}) => {
  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return value > 0 ? 'bg-green-600' : 'bg-red-600';
    if (absValue >= 0.6) return value > 0 ? 'bg-green-500' : 'bg-red-500';
    if (absValue >= 0.4) return value > 0 ? 'bg-green-400' : 'bg-red-400';
    if (absValue >= 0.2) return value > 0 ? 'bg-green-300' : 'bg-red-300';
    return 'bg-gray-300';
  };

  const getCorrelationLabel = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return 'Very Strong';
    if (absValue >= 0.6) return 'Strong';
    if (absValue >= 0.4) return 'Moderate';
    if (absValue >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Statistical relationships with environmental factors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {correlations.map((corr, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{corr.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {getCorrelationLabel(corr.correlation)}
                  </span>
                  <span className={cn(
                    "font-bold",
                    corr.correlation > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute top-0 h-full rounded-full transition-all",
                    getCorrelationColor(corr.correlation)
                  )}
                  style={{
                    left: corr.correlation < 0 ? `${50 + (corr.correlation * 50)}%` : '50%',
                    right: corr.correlation > 0 ? `${50 - (corr.correlation * 50)}%` : '50%',
                  }}
                />
                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-400" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Negative Correlation</span>
            <span className="text-gray-600">0</span>
            <span>Positive Correlation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
