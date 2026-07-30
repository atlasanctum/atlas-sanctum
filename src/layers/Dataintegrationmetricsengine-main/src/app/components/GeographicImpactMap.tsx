import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { GeographicData } from '../data/advancedMockData';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from './ui/utils';

interface GeographicImpactMapProps {
  data: GeographicData[];
  title?: string;
}

export const GeographicImpactMap: React.FC<GeographicImpactMapProps> = ({ 
  data,
  title = "Geographic Impact Distribution"
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  const getIntensity = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    if (normalized >= 0.8) return 'bg-green-600';
    if (normalized >= 0.6) return 'bg-green-500';
    if (normalized >= 0.4) return 'bg-green-400';
    if (normalized >= 0.2) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Regional performance metrics and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple visualization - in a real app, you'd use a proper map library */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.map((region, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getIntensity(region.value))} />
                    <h4 className="font-semibold text-sm">{region.region}</h4>
                  </div>
                  {region.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{region.value}</div>
                    <div className="text-xs text-muted-foreground">Impact Score</div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-lg font-semibold",
                      region.trend > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {region.trend > 0 ? '+' : ''}{region.trend}%
                    </div>
                    <div className="text-xs text-muted-foreground">vs last period</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Low Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-muted-foreground">Medium Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span className="text-muted-foreground">High Impact</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
