import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SectorData } from '../data/advancedMockData';
import { BarChart3, Activity } from 'lucide-react';

interface SectorComparisonChartProps {
  sectors: SectorData[];
}

export const SectorComparisonChart: React.FC<SectorComparisonChartProps> = ({ sectors }) => {
  const barData = sectors.map(sector => ({
    name: sector.name,
    impactScore: sector.impactScore,
    dataQuality: sector.dataQuality === 'excellent' ? 100 : 
                  sector.dataQuality === 'good' ? 80 :
                  sector.dataQuality === 'fair' ? 60 : 40,
    streams: sector.activeDataStreams,
    color: sector.color.includes('green') ? '#22c55e' : 
           sector.color.includes('blue') ? '#3b82f6' : 
           sector.color.includes('red') ? '#ef4444' : 
           sector.color.includes('amber') ? '#f59e0b' : '#8884d8',
  }));

  // Create a sorted copy for ranking calculation
  const sortedSectors = [...sectors].sort((a, b) => b.impactScore - a.impactScore);

  const radarData = [
    {
      metric: 'Impact Score',
      ...Object.fromEntries(sectors.map(s => [s.name, s.impactScore])),
    },
    {
      metric: 'Data Quality',
      ...Object.fromEntries(sectors.map(s => [
        s.name, 
        s.dataQuality === 'excellent' ? 100 : 
        s.dataQuality === 'good' ? 80 :
        s.dataQuality === 'fair' ? 60 : 40
      ])),
    },
    {
      metric: 'Data Streams',
      ...Object.fromEntries(sectors.map(s => [s.name, (s.activeDataStreams / 40) * 100])),
    },
    {
      metric: 'Metrics Count',
      ...Object.fromEntries(sectors.map(s => [s.name, (s.metrics.length / 10) * 100])),
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">{entry.name}:</span>
              <span className="text-xs font-medium" style={{ color: entry.color }}>
                {entry.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Cross-Sector Analysis
        </CardTitle>
        <CardDescription>
          Comparative performance metrics across all sectors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="radar">Radar Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
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
                <Bar 
                  dataKey="impactScore" 
                  name="Impact Score" 
                  radius={[8, 8, 0, 0]}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="radar" className="space-y-4">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fill: '#888888', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#888888', fontSize: 10 }}
                />
                {sectors.map((sector, index) => (
                  <Radar
                    key={sector.id}
                    name={sector.name}
                    dataKey={sector.name}
                    stroke={barData[index].color}
                    fill={barData[index].color}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectors.map((sector) => {
              const sectorData = barData.find(d => d.name === sector.name);
              return (
                <div key={sector.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: sectorData?.color }}
                    />
                    <span className="text-sm font-medium">{sector.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rank: #{sortedSectors.findIndex(s => s.id === sector.id) + 1} of {sectors.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};