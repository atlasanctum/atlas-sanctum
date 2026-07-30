import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ForecastDataPoint } from '../data/advancedMockData';
import { TrendingUp, Activity } from 'lucide-react';

interface AdvancedSectorChartProps {
  data: ForecastDataPoint[];
  title: string;
  color: string;
  showConfidence?: boolean;
}

export const AdvancedSectorChart: React.FC<AdvancedSectorChartProps> = ({ 
  data, 
  title, 
  color,
  showConfidence = true 
}) => {
  const chartColor = color.includes('green') ? '#22c55e' : 
                     color.includes('blue') ? '#3b82f6' : 
                     color.includes('red') ? '#ef4444' : 
                     color.includes('amber') ? '#f59e0b' : '#8884d8';

  const avgConfidence = showConfidence && data.some(d => d.confidence) 
    ? (data.reduce((sum, d) => sum + (d.confidence || 0), 0) / data.length * 100).toFixed(1)
    : null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-2">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Actual:</span>
              <span className="text-xs font-medium">{payload[0].value}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Predicted:</span>
              <span className="text-xs font-medium">{payload[1]?.value || 'N/A'}</span>
            </div>
            {showConfidence && payload[0].payload.confidence && (
              <div className="flex items-center justify-between gap-4 pt-1 border-t">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <span className="text-xs font-medium">{(payload[0].payload.confidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              Historical data vs AI-predicted trends with confidence intervals
            </CardDescription>
          </div>
          {avgConfidence && (
            <div className="text-right">
              <div className="text-2xl font-bold">{avgConfidence}%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Avg Confidence
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`colorActual${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id={`colorPred${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id={`colorBounds${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {showConfidence && data.some(d => d.upperBound) && (
              <>
                <Area 
                  type="monotone" 
                  dataKey="upperBound" 
                  stroke="none" 
                  fillOpacity={1} 
                  fill={`url(#colorBounds${title})`} 
                  name="Upper Bound"
                  strokeWidth={0}
                />
                <Area 
                  type="monotone" 
                  dataKey="lowerBound" 
                  stroke="none" 
                  fillOpacity={1} 
                  fill={`url(#colorBounds${title})`} 
                  name="Lower Bound"
                  strokeWidth={0}
                />
              </>
            )}
            
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke={chartColor} 
              fillOpacity={1} 
              fill={`url(#colorActual${title})`} 
              name="Actual Data"
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#82ca9d" 
              strokeDasharray="5 5" 
              fillOpacity={1} 
              fill={`url(#colorPred${title})`} 
              name="AI Forecast"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
