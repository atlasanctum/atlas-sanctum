
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface SectorChartProps {
  data: any[];
  title: string;
  color: string;
}

export const SectorChart: React.FC<SectorChartProps> = ({ data, title, color }) => {
  // Extract tailwind color class to hex if possible, or just use a standard hex for now
  // Since passing tailwind classes to Recharts doesn't work directly for stroke/fill colors usually
  const chartColor = color.includes('green') ? '#22c55e' : 
                     color.includes('blue') ? '#3b82f6' : 
                     color.includes('red') ? '#ef4444' : 
                     color.includes('amber') ? '#f59e0b' : '#8884d8';

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{title} - AI Forecasting</CardTitle>
        <CardDescription>
          Historical data vs AI-predicted trends for the upcoming quarter.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`colorPred`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `${value}`} 
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke={chartColor} 
              fillOpacity={1} 
              fill={`url(#color${title})`} 
              name="Actual Data"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#82ca9d" 
              strokeDasharray="5 5" 
              fillOpacity={1} 
              fill={`url(#colorPred)`} 
              name="AI Forecast"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
