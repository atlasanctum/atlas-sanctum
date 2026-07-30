import { motion } from "framer-motion";
import TransactionsTable from "@/components/admin/TransactionsTable";
import SalesOverview from "@/components/admin/SalesOverview";

const AdminTransactions = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Transactions
        </h1>
        <p className="text-muted-foreground">
          View and monitor all platform transactions
        </p>
      </motion.div>

      <div className="space-y-8">
        <SalesOverview />
        <TransactionsTable />
      </div>
    </div>
  );
};

export default AdminTransactions;
