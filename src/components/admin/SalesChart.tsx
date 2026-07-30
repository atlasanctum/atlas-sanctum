import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAllTransactions } from "@/hooks/useAdmin";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

const SalesChart = () => {
  const { data: transactions, isLoading } = useAllTransactions();

  // Generate last 30 days data
  const chartData = (() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return last30Days.map(day => {
      const dayStart = startOfDay(day);
      const dayTransactions = transactions?.filter(t => {
        const transactionDate = startOfDay(new Date(t.created_at));
        return transactionDate.getTime() === dayStart.getTime() && t.status === 'completed';
      }) || [];

      const revenue = dayTransactions.reduce((sum, t) => sum + Number(t.total_amount), 0);
      const credits = dayTransactions.reduce((sum, t) => sum + t.quantity, 0);

      return {
        date: format(day, 'MMM d'),
        revenue,
        credits,
      };
    });
  })();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-6" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <h2 className="font-display text-xl font-semibold text-foreground mb-6">Revenue (Last 30 Days)</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" aria-label="Revenue bar chart for last 30 days" aria-describedby="sales-chart-desc">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div id="sales-chart-desc" className="sr-only">
          Bar chart showing daily revenue in USD for the last 30 days. Total revenue ranges from ${Math.min(...chartData.map(d => d.revenue))} to ${Math.max(...chartData.map(d => d.revenue))}, with an average of ${(chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length).toFixed(2)}.
        </div>
      </div>
    </motion.div>
  );
};

export default SalesChart;
