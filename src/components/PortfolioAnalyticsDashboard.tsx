import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  DollarSign,
  Target,
  Activity,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePortfolioAnalytics } from '@/hooks/usePortfolioAnalytics';
import { format } from 'date-fns';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

const PROJECT_TYPE_LABELS: Record<string, string> = {
  reforestation: 'Reforestation',
  renewable_energy: 'Renewable Energy',
  methane_capture: 'Methane Capture',
  ocean_restoration: 'Ocean Restoration',
  soil_carbon: 'Soil Carbon',
  direct_air_capture: 'Direct Air Capture',
};

export function PortfolioAnalyticsDashboard() {
  const { performanceData, projectAllocations, typeAllocations, metrics, isLoading } = usePortfolioAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const hasData = performanceData.length > 0 || projectAllocations.length > 0;

  if (!hasData) {
    return (
      <Card className="bg-card-gradient border-border/50">
        <CardContent className="py-16 text-center">
          <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Portfolio Data Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start investing in carbon credits to see your portfolio analytics and performance metrics here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          icon={DollarSign}
          label="Portfolio Value"
          value={`$${metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend={metrics.portfolioGrowth}
          trendLabel="market value"
        />
        <MetricCard
          icon={Leaf}
          label="Total Credits"
          value={metrics.totalCredits.toLocaleString()}
          subValue={`${metrics.projectCount} projects`}
        />
        <MetricCard
          icon={Target}
          label="CO₂ Offset"
          value={`${metrics.totalCO2Offset.toFixed(1)}t`}
          subValue="tonnes CO₂"
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg. Price/Credit"
          value={`$${metrics.avgPricePerCredit.toFixed(2)}`}
          subValue="per credit"
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card-gradient border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Portfolio Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="performance" className="space-y-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="allocation">Allocation</TabsTrigger>
                <TabsTrigger value="impact">Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), 'MMM d')}
                        className="text-muted-foreground text-xs"
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value}`}
                        className="text-muted-foreground text-xs"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="url(#valueGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="allocation" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">By Project Type</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={typeAllocations}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {typeAllocations.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {typeAllocations.map((item, index) => (
                        <Badge
                          key={item.type}
                          variant="outline"
                          className="border-border/50"
                          style={{ borderColor: COLORS[index % COLORS.length] }}
                        >
                          <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          {PROJECT_TYPE_LABELS[item.type] || item.name}: {item.percentage.toFixed(1)}%
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">By Project</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectAllocations} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                          <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={120}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                          />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), 'MMM d')}
                      />
                      <YAxis yAxisId="left" tickFormatter={(v) => `${v}t`} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="co2Offset"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="CO₂ Offset (tonnes)"
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="credits"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        name="Total Credits"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <Card className="bg-card-gradient border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" />
              Monthly Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ${metrics.monthlyGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Invested in the last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Yearly Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              ${metrics.yearlyGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Invested in the last 12 months
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  subValue?: string;
}

function MetricCard({ icon: Icon, label, value, trend, trendLabel, subValue }: MetricCardProps) {
  return (
    <Card className="bg-card-gradient border-border/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-lg bg-muted">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend !== undefined && (
            <Badge
              variant="outline"
              className={
                trend >= 0
                  ? 'border-green-500/50 text-green-500'
                  : 'border-destructive/50 text-destructive'
              }
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {subValue || trendLabel || label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PortfolioAnalyticsDashboard;