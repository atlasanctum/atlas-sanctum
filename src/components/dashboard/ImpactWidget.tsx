import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { TrendingUp, Leaf, Globe, Award, Target } from 'lucide-react';
import { useUserHoldings, useUserTransactions } from '@/hooks/useMarketplace';
import { format, subMonths, startOfMonth, eachMonthOfInterval } from 'date-fns';

interface ImpactData {
  month: string;
  offset: number;
  cumulative: number;
}

const GLOBAL_AVERAGE_PER_PERSON = 4.7; // Global average CO2 emissions per person per year in tonnes

export function ImpactWidget() {
  const { data: holdings = [] } = useUserHoldings();
  const { data: transactions = [] } = useUserTransactions();

  const { monthlyData, totalOffset, comparisonPercentage, yearlyProgress } = useMemo(() => {
    // Calculate monthly offset data
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: startOfMonth(sixMonthsAgo), end: startOfMonth(now) });

    let cumulative = 0;
    const data: ImpactData[] = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.created_at);
        return txDate >= monthStart && txDate < subMonths(monthStart, -1) && tx.status === 'completed';
      });

      const monthOffset = monthTransactions.reduce((sum, tx) => {
        const project = tx.carbon_projects;
        return sum + (tx.quantity * (project?.co2_offset_per_credit || 1));
      }, 0);

      cumulative += monthOffset;

      return {
        month: format(month, 'MMM'),
        offset: Math.round(monthOffset * 10) / 10,
        cumulative: Math.round(cumulative * 10) / 10,
      };
    });

    // Calculate total offset from holdings
    const total = holdings.reduce((sum, h) => {
      return sum + (h.quantity * (h.carbon_projects?.co2_offset_per_credit || 1));
    }, 0);

    // Calculate comparison to global average
    const comparison = total > 0 ? ((total / GLOBAL_AVERAGE_PER_PERSON) * 100) : 0;

    // Calculate yearly progress (assuming a goal of 10 tonnes per year)
    const yearlyGoal = 10;
    const progress = Math.min((total / yearlyGoal) * 100, 100);

    return {
      monthlyData: data,
      totalOffset: total,
      comparisonPercentage: comparison,
      yearlyProgress: progress,
    };
  }, [holdings, transactions]);

  const retiredCredits = holdings.filter(h => h.retired).reduce((sum, h) => sum + h.quantity, 0);
  const activeCredits = holdings.filter(h => !h.retired).reduce((sum, h) => sum + h.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card-gradient border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Globe className="w-5 h-5 text-primary" />
                Your Carbon Impact
              </CardTitle>
              <CardDescription>
                Track your contribution to planetary regeneration
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary">
              <TrendingUp className="w-3 h-3 mr-1" />
              Growing
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-primary/10 border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Offset</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {totalOffset.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">tonnes CO₂</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-xl bg-accent/10 border border-accent/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">vs Global Avg</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {comparisonPercentage.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">of yearly avg</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Retired</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{retiredCredits}</p>
              <p className="text-xs text-muted-foreground">credits</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="p-4 rounded-xl bg-ocean/10 border border-ocean/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-ocean" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{activeCredits}</p>
              <p className="text-xs text-muted-foreground">credits</p>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="h-48"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}t`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`${value} tonnes`, 'Cumulative Offset']}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorOffset)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Yearly Goal Progress */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Yearly Goal Progress</span>
              <span className="font-medium text-foreground">{totalOffset.toFixed(1)} / 10 tonnes</span>
            </div>
            <Progress value={yearlyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {yearlyProgress >= 100 
                ? "🎉 Congratulations! You've exceeded your yearly goal!"
                : `${(10 - totalOffset).toFixed(1)} tonnes to reach your yearly target`
              }
            </p>
          </motion.div>

          {/* Comparison Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-xl bg-muted/30 border border-border/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Global Context</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The global average carbon footprint is ~4.7 tonnes CO₂ per person annually. 
                  Your {totalOffset.toFixed(1)} tonnes offset represents {comparisonPercentage.toFixed(0)}% of this average.
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
