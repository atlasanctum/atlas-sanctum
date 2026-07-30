import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllTransactions } from "@/hooks/useAdmin";
import { PROJECT_TYPE_ICONS } from "@/types/marketplace";

const TransactionsTable = () => {
   const { data: transactions, isLoading } = useAllTransactions();
   const tableRef = useRef<HTMLTableElement>(null);

   useEffect(() => {
     const table = tableRef.current;
     if (!table) return;

     const handleKeyDown = (event: KeyboardEvent) => {
       const target = event.target as HTMLElement;
       if (!table.contains(target)) return;

       const cells = Array.from(table.querySelectorAll('td, th'));
       const currentIndex = cells.indexOf(target.closest('td, th') as HTMLElement);

       if (currentIndex === -1) return;

       let newIndex = currentIndex;

       switch (event.key) {
         case 'ArrowRight':
           newIndex = Math.min(currentIndex + 1, cells.length - 1);
           break;
         case 'ArrowLeft':
           newIndex = Math.max(currentIndex - 1, 0);
           break;
         case 'ArrowDown':
           // Assuming 7 columns
           newIndex = Math.min(currentIndex + 7, cells.length - 1);
           break;
         case 'ArrowUp':
           newIndex = Math.max(currentIndex - 7, 0);
           break;
         default:
           return;
       }

       event.preventDefault();
       (cells[newIndex] as HTMLElement).focus();
     };

     table.addEventListener('keydown', handleKeyDown);
     return () => table.removeEventListener('keydown', handleKeyDown);
   }, [transactions]);

  const statusColors: Record<string, string> = {
    completed: "bg-primary/10 text-primary border-primary/20",
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
    refunded: "bg-muted text-muted-foreground border-muted",
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-full" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-semibold text-foreground">Recent Transactions</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table ref={tableRef} tabIndex={0} aria-label="Recent transactions table">
          <TableHeader>
            <TableRow>
              <TableHead tabIndex={0}>Transaction ID</TableHead>
              <TableHead tabIndex={0}>Project</TableHead>
              <TableHead tabIndex={0}>Quantity</TableHead>
              <TableHead tabIndex={0}>Amount</TableHead>
              <TableHead tabIndex={0}>Status</TableHead>
              <TableHead tabIndex={0}>Payment</TableHead>
              <TableHead tabIndex={0}>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No transactions yet
                </TableCell>
              </TableRow>
            ) : (
              transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell tabIndex={0}>
                    <span className="font-mono text-sm text-muted-foreground">
                      {transaction.id.slice(0, 8)}...
                    </span>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {PROJECT_TYPE_ICONS[transaction.carbon_projects?.project_type] || '🌍'}
                      </span>
                      <span className="text-sm font-medium text-foreground truncate max-w-[150px]">
                        {transaction.carbon_projects?.title || 'Unknown Project'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <span className="font-medium">{transaction.quantity}</span>
                    <span className="text-muted-foreground text-sm ml-1">credits</span>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <span className="font-semibold text-foreground">
                      ${Number(transaction.total_amount).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <Badge variant="outline" className={statusColors[transaction.status]}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <span className="text-sm text-muted-foreground capitalize">
                      {transaction.payment_method || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell tabIndex={0}>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default TransactionsTable;
