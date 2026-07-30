import { motion } from "framer-motion";
import SalesOverview from "@/components/admin/SalesOverview";
import SalesChart from "@/components/admin/SalesChart";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import { useAllProjects, useAllTransactions } from "@/hooks/useAdmin";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PROJECT_TYPE_LABELS } from "@/types/marketplace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminAnalytics = () => {
  const { data: projects } = useAllProjects();
  const { data: transactions } = useAllTransactions();

  // Project type distribution
  const projectTypeData = (() => {
    if (!projects) return [];
    
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.project_type] = (counts[p.project_type] || 0) + 1;
    });
    
    return Object.entries(counts).map(([type, count]) => ({
      name: PROJECT_TYPE_LABELS[type as keyof typeof PROJECT_TYPE_LABELS],
      value: count,
    }));
  })();

  // Transaction status distribution
  const statusData = (() => {
    if (!transactions) return [];
    
    const counts: Record<string, number> = {};
    transactions.forEach(t => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    
    return Object.entries(counts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  })();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--ocean))', 'hsl(var(--earth))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Comprehensive platform analytics and performance monitoring
        </p>
      </motion.div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">Business Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-8">
          <SalesOverview />
          <SalesChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Projects by Type
              </h2>
              <div className="h-64">
                {projectTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {projectTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No project data available
                  </div>
                )}
              </div>
            </motion.div>

            {/* Transaction Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Transaction Status
              </h2>
              <div className="h-64">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No transaction data available
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
