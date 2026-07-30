import { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { CarbonProject } from '@/types/marketplace';

interface ComparisonChartProps {
  projects: CarbonProject[];
  chartType: 'radar' | 'bar';
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

export function ComparisonChart({ projects, chartType }: ComparisonChartProps) {
  const radarData = useMemo(() => {
    const metrics = [
      { key: 'price_score', label: 'Price Value', max: 100 },
      { key: 'impact_score', label: 'Impact Score', max: 100 },
      { key: 'availability', label: 'Availability', max: 100 },
      { key: 'verification', label: 'Verification', max: 100 },
      { key: 'co2_efficiency', label: 'CO₂ Efficiency', max: 100 },
    ];

    return metrics.map((metric) => {
      const dataPoint: Record<string, string | number> = { metric: metric.label };
      
      projects.forEach((project, index) => {
        let value = 0;
        
        switch (metric.key) {
          case 'price_score':
            // Lower price = higher score (inverse, max $50)
            value = Math.max(0, 100 - (project.price_per_credit / 50) * 100);
            break;
          case 'impact_score':
            value = project.impact_score || 75;
            break;
          case 'availability':
            // Normalize based on 10000 credits max
            value = Math.min(100, (project.available_credits / 10000) * 100);
            break;
          case 'verification':
            value = project.verified_by_system_at ? 100 : 50;
            break;
          case 'co2_efficiency':
            // Higher CO2 offset = better, max 10 tons
            value = Math.min(100, (project.co2_offset_per_credit / 10) * 100);
            break;
        }
        
        dataPoint[`project${index}`] = Math.round(value);
      });
      
      return dataPoint;
    });
  }, [projects]);

  const barData = useMemo(() => {
    return projects.map((project, index) => ({
      name: project.title.length > 15 ? project.title.slice(0, 15) + '...' : project.title,
      fullName: project.title,
      price: project.price_per_credit,
      co2: project.co2_offset_per_credit,
      credits: project.available_credits / 100, // Scale down for visibility
      impact: project.impact_score || 75,
      fill: CHART_COLORS[index],
    }));
  }, [projects]);

  if (chartType === 'radar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          {projects.map((project, index) => (
            <Radar
              key={project.id}
              name={project.title.length > 20 ? project.title.slice(0, 20) + '...' : project.title}
              dataKey={`project${index}`}
              stroke={CHART_COLORS[index]}
              fill={CHART_COLORS[index]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Bar dataKey="price" name="Price ($)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="co2" name="CO₂ (tons)" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="impact" name="Impact Score" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
}
