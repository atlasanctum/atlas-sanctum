import { motion } from "framer-motion";
import { DollarSign, Leaf, Receipt, TrendingUp } from "lucide-react";
import { useSalesStats } from "@/hooks/useAdmin";

const SalesOverview = () => {
  const { data: stats, isLoading } = useSalesStats();
  
  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0",
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Monthly Revenue",
      value: stats ? `$${stats.monthlyRevenue.toLocaleString()}` : "$0",
      icon: TrendingUp,
      color: "text-ocean",
      bgColor: "bg-ocean/10",
    },
    {
      label: "Credits Sold",
      value: stats ? stats.totalCredits.toLocaleString() : "0",
      icon: Leaf,
      color: "text-earth",
      bgColor: "bg-earth/10",
    },
    {
      label: "Transactions",
      value: stats ? stats.completedTransactions.toLocaleString() : "0",
      icon: Receipt,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
            <div className="h-12 w-12 bg-muted rounded-xl mb-4" />
            <div className="h-8 w-24 bg-muted rounded mb-2" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
        >
          <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default SalesOverview;
