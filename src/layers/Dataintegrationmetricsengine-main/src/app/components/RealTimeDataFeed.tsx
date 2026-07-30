import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Activity, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { cn } from './ui/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DataPoint {
  id: string;
  timestamp: Date;
  metric: string;
  value: number;
  change: number;
  sector: string;
}

export const RealTimeDataFeed: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const metrics = [
        'Soil Carbon', 'Water pH', 'Coral Coverage', 'Patient Access',
        'Recycling Rate', 'Carbon Offset', 'Biodiversity', 'Air Quality'
      ];
      
      const sectors = ['Agriculture', 'Oceanic', 'Healthcare', 'Circular Economy'];
      
      const newPoint: DataPoint = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        metric: metrics[Math.floor(Math.random() * metrics.length)],
        value: Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        sector: sectors[Math.floor(Math.random() * sectors.length)],
      };

      setDataPoints(prev => [newPoint, ...prev].slice(0, 20));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Data Feed
            </CardTitle>
            <CardDescription>Real-time metric updates across all sectors</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              isLive ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                isLive && "animate-pulse bg-green-500"
              )} />
              {isLive ? 'Live' : 'Paused'}
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence mode="popLayout">
            {dataPoints.length === 0 ? (
              <div className="flex items-center justify-center h-[360px] text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Waiting for data...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {dataPoints.map((point, index) => (
                  <motion.div
                    key={point.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    layout
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all",
                      index === 0 && "bg-primary/5 border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "p-2 rounded-full",
                        point.change > 0 ? "bg-green-500/10" :
                        point.change < 0 ? "bg-red-500/10" : "bg-gray-500/10"
                      )}>
                        {point.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : point.change < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <Zap className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{point.metric}</p>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {point.sector}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {point.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold">
                        {point.value.toFixed(1)}
                      </div>
                      <div className={cn(
                        "text-xs font-medium",
                        point.change > 0 ? "text-green-500" :
                        point.change < 0 ? "text-red-500" : "text-gray-500"
                      )}>
                        {point.change > 0 ? '+' : ''}{point.change.toFixed(1)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
