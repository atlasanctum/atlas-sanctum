import { motion } from "framer-motion";
import SalesOverview from "@/components/admin/SalesOverview";
import TransactionsTable from "@/components/admin/TransactionsTable";
import SalesChart from "@/components/admin/SalesChart";

const AdminOverview = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor sales, manage projects, and track platform performance
        </p>
      </motion.div>

      <div className="space-y-8">
        <SalesOverview />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SalesChart />
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
