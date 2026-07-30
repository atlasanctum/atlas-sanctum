import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Leaf,
  Wallet,
  Activity,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for charts
const generateCarbonOffsetData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    offset: Math.floor(500 + Math.random() * 1500 + i * 100),
    target: 1200 + i * 50,
    baseline: 800,
  }));
};

const generatePortfolioData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let value = 10000;
  return months.map((month) => {
    value += Math.floor(Math.random() * 2000 - 500);
    return {
      month,
      value: Math.max(value, 8000),
      reforestation: Math.floor(value * 0.4),
      renewable: Math.floor(value * 0.35),
      ocean: Math.floor(value * 0.25),
    };
  });
};

const generateProjectTypeData = () => [
  { name: 'Reforestation', value: 45, color: 'hsl(168, 60%, 35%)' },
  { name: 'Renewable Energy', value: 25, color: 'hsl(195, 70%, 45%)' },
  { name: 'Ocean Restoration', value: 15, color: 'hsl(38, 85%, 55%)' },
  { name: 'Soil Carbon', value: 10, color: 'hsl(85, 40%, 35%)' },
  { name: 'Direct Air Capture', value: 5, color: 'hsl(280, 60%, 50%)' },
];

const generateImpactMetricsData = () => {
  const weeks = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
  return weeks.map((week) => ({
    week,
    biodiversity: Math.floor(60 + Math.random() * 40),
    waterQuality: Math.floor(50 + Math.random() * 50),
    carbonSequestration: Math.floor(70 + Math.random() * 30),
    soilHealth: Math.floor(55 + Math.random() * 45),
  }));
};

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
  color: string;
}

function StatCard({ title, value, change, icon: Icon, trend, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <Badge
              variant={trend === 'up' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(change)}%
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <div className="bg-popover/95 backdrop-blur-lg border border-border rounded-lg p-3 shadow-elevated">
      <p className="font-medium text-foreground mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {typeof entry.value === 'number'
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InteractiveChartsDashboard() {
  const [timeRange, setTimeRange] = useState('12m');
  
  const carbonData = useMemo(() => generateCarbonOffsetData(), []);
  const portfolioData = useMemo(() => generatePortfolioData(), []);
  const projectTypeData = useMemo(() => generateProjectTypeData(), []);
  const impactData = useMemo(() => generateImpactMetricsData(), []);

  const stats = [
    {
      title: 'Total CO₂ Offset',
      value: '12,450 tons',
      change: 23.5,
      icon: Leaf,
      trend: 'up' as const,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Portfolio Value',
      value: '$45,230',
      change: 12.3,
      icon: Wallet,
      trend: 'up' as const,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Active Projects',
      value: '24',
      change: 8.1,
      icon: Activity,
      trend: 'up' as const,
      color: 'bg-ocean/10 text-ocean',
    },
    {
      title: 'Global Reach',
      value: '15 Countries',
      change: 5.2,
      icon: Globe,
      trend: 'up' as const,
      color: 'bg-earth/10 text-earth',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Performance Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="1m">1 Month</SelectItem>
            <SelectItem value="3m">3 Months</SelectItem>
            <SelectItem value="12m">12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carbon Offset Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Carbon Offset Trends
              </CardTitle>
              <CardDescription>Monthly CO₂ offset vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={carbonData}>
                    <defs>
                      <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(168, 60%, 35%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(168, 60%, 35%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="offset"
                      stroke="hsl(168, 60%, 35%)"
                      fill="url(#colorOffset)"
                      strokeWidth={2}
                      name="Actual Offset"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="hsl(38, 85%, 55%)"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Target"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Portfolio Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-accent" />
                Portfolio Performance
              </CardTitle>
              <CardDescription>Investment value over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioData}>
                    <defs>
                      <linearGradient id="colorReforestation" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(168, 60%, 35%)" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="hsl(168, 60%, 35%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRenewable" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(195, 70%, 45%)" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="hsl(195, 70%, 45%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOcean" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(38, 85%, 55%)" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="hsl(38, 85%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="reforestation"
                      stackId="1"
                      stroke="hsl(168, 60%, 35%)"
                      fill="url(#colorReforestation)"
                      name="Reforestation"
                    />
                    <Area
                      type="monotone"
                      dataKey="renewable"
                      stackId="1"
                      stroke="hsl(195, 70%, 45%)"
                      fill="url(#colorRenewable)"
                      name="Renewable"
                    />
                    <Area
                      type="monotone"
                      dataKey="ocean"
                      stackId="1"
                      stroke="hsl(38, 85%, 55%)"
                      fill="url(#colorOcean)"
                      name="Ocean"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-ocean" />
                Project Distribution
              </CardTitle>
              <CardDescription>Portfolio allocation by project type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-earth" />
                Impact Metrics
              </CardTitle>
              <CardDescription>Environmental health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="week" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="biodiversity" fill="hsl(168, 60%, 35%)" name="Biodiversity" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="carbonSequestration" fill="hsl(195, 70%, 45%)" name="Carbon" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="waterQuality" fill="hsl(38, 85%, 55%)" name="Water" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
