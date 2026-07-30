import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  ChevronRight, 
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  MapPin,
  Calendar,
  Layers,
  ZoomIn,
  Home
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DrillLevel {
  id: string;
  name: string;
  type: 'overview' | 'sector' | 'region' | 'metric';
  data: any;
}

interface DataPoint {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  children?: DataPoint[];
  chartData?: any[];
}

export const DataDrillDown: React.FC = () => {
  const [drillPath, setDrillPath] = useState<DrillLevel[]>([
    {
      id: 'overview',
      name: 'Global Overview',
      type: 'overview',
      data: null
    }
  ]);

  const [animationDirection, setAnimationDirection] = useState<'forward' | 'back'>('forward');

  // Mock hierarchical data
  const overviewData: DataPoint[] = [
    {
      id: 'agriculture',
      label: 'Agriculture Sector',
      value: 84,
      change: 12,
      trend: 'up',
      children: [
        { id: 'north-america', label: 'North America', value: 92, change: 8, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 85 + Math.random() * 15 }))
        },
        { id: 'europe', label: 'Europe', value: 88, change: 5, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 80 + Math.random() * 15 }))
        },
        { id: 'asia', label: 'Asia', value: 79, change: 15, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 70 + Math.random() * 15 }))
        },
        { id: 'africa', label: 'Africa', value: 71, change: 18, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 60 + Math.random() * 20 }))
        },
      ]
    },
    {
      id: 'oceanic',
      label: 'Oceanic Sector',
      value: 76,
      change: 8,
      trend: 'up',
      children: [
        { id: 'pacific', label: 'Pacific Ocean', value: 72, change: 8, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 65 + Math.random() * 15 }))
        },
        { id: 'atlantic', label: 'Atlantic Ocean', value: 68, change: 12, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 60 + Math.random() * 15 }))
        },
        { id: 'indian', label: 'Indian Ocean', value: 75, change: 6, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 68 + Math.random() * 15 }))
        },
      ]
    },
    {
      id: 'healthcare',
      label: 'Healthcare Sector',
      value: 91,
      change: 4,
      trend: 'up',
      children: [
        { id: 'urban', label: 'Urban Areas', value: 95, change: 3, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 90 + Math.random() * 8 }))
        },
        { id: 'rural', label: 'Rural Areas', value: 87, change: 7, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 80 + Math.random() * 12 }))
        },
        { id: 'remote', label: 'Remote Areas', value: 79, change: 12, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 70 + Math.random() * 15 }))
        },
      ]
    },
    {
      id: 'circular',
      label: 'Circular Economy',
      value: 68,
      change: 15,
      trend: 'up',
      children: [
        { id: 'manufacturing', label: 'Manufacturing', value: 74, change: 18, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 65 + Math.random() * 15 }))
        },
        { id: 'consumer', label: 'Consumer Goods', value: 62, change: 12, trend: 'up',
          chartData: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 55 + Math.random() * 15 }))
        },
      ]
    },
  ];

  const getCurrentData = (): DataPoint[] => {
    const currentLevel = drillPath[drillPath.length - 1];
    
    if (currentLevel.type === 'overview') {
      return overviewData;
    }
    
    if (currentLevel.type === 'sector') {
      const sector = overviewData.find(d => d.id === currentLevel.id);
      return sector?.children || [];
    }
    
    return [];
  };

  const drillDown = (item: DataPoint) => {
    if (!item.children || item.children.length === 0) return;
    
    setAnimationDirection('forward');
    setDrillPath(prev => [...prev, {
      id: item.id,
      name: item.label,
      type: drillPath[drillPath.length - 1].type === 'overview' ? 'sector' : 'region',
      data: item
    }]);
  };

  const drillUp = () => {
    if (drillPath.length <= 1) return;
    setAnimationDirection('back');
    setDrillPath(prev => prev.slice(0, -1));
  };

  const goToLevel = (index: number) => {
    if (index >= drillPath.length) return;
    setAnimationDirection(index < drillPath.length - 1 ? 'back' : 'forward');
    setDrillPath(prev => prev.slice(0, index + 1));
  };

  const currentData = getCurrentData();
  const currentLevel = drillPath[drillPath.length - 1];
  const canDrillUp = drillPath.length > 1;

  const variants = {
    enter: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              Hierarchical Data Explorer
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToLevel(0)}
              disabled={!canDrillUp}
            >
              <Home className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <CardDescription>
            Click on any item to drill down into detailed metrics
          </CardDescription>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 flex-wrap">
            {drillPath.map((level, index) => (
              <React.Fragment key={level.id}>
                <Button
                  variant={index === drillPath.length - 1 ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => goToLevel(index)}
                  className="h-7 text-xs"
                >
                  {level.name}
                </Button>
                {index < drillPath.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Navigation Controls */}
          {canDrillUp && (
            <Button
              variant="outline"
              size="sm"
              onClick={drillUp}
              className="w-full"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to {drillPath[drillPath.length - 2].name}
            </Button>
          )}

          {/* Data Grid */}
          <AnimatePresence mode="wait" custom={animationDirection}>
            <motion.div
              key={currentLevel.id}
              custom={animationDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {currentData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => drillDown(item)}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    item.children && item.children.length > 0
                      ? "cursor-pointer hover:border-primary hover:shadow-md"
                      : "cursor-default",
                    "bg-background"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{item.label}</h4>
                        {item.children && item.children.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.children.length} items
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          Impact Score
                        </span>
                        {currentLevel.type !== 'overview' && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last 12 months
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{item.value}</div>
                      <div className={cn(
                        "text-xs font-medium flex items-center gap-1 justify-end",
                        item.trend === 'up' ? "text-green-500" : 
                        item.trend === 'down' ? "text-red-500" : "text-gray-500"
                      )}>
                        {item.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
                         item.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart for Detail Levels */}
                  {item.chartData && (
                    <div className="h-20 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={item.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            hide 
                          />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ 
                              fontSize: '12px', 
                              borderRadius: '6px',
                              border: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {item.children && item.children.length > 0 && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        Click to explore details
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {currentData.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No data available at this level</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
