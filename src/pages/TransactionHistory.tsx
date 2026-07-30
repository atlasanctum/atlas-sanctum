import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserTransactions, useUserHoldings } from "@/hooks/useTransactions";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  Download,
  FileText,
  Award,
  Loader2,
  History,
  Leaf,
  Receipt,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const TransactionHistory = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { data: transactions, isLoading: transactionsLoading } = useUserTransactions();
  const { data: holdings, isLoading: holdingsLoading } = useUserHoldings();
  const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);

  // Get retired holdings (for certificates)
  const retiredHoldings = holdings?.filter((h) => h.retired) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      completed: "default",
      failed: "destructive",
      pending: "secondary",
      refunded: "outline",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const downloadReceipt = async (transaction: any) => {
    setDownloadingReceipt(transaction.id);
    try {
      const receiptContent = `
========================================
       CARBON CREDIT PURCHASE RECEIPT
========================================

Transaction ID: ${transaction.id}
Date: ${format(new Date(transaction.created_at), "MMMM d, yyyy 'at' h:mm a")}
Status: ${transaction.status.toUpperCase()}

----------------------------------------
PROJECT DETAILS
----------------------------------------
Project: ${transaction.project?.title || "N/A"}
Type: ${transaction.project?.project_type?.replace("_", " ") || "N/A"}
Location: ${transaction.project?.location}, ${transaction.project?.country}

----------------------------------------
PURCHASE DETAILS
----------------------------------------
Quantity: ${transaction.quantity} credits
Price per Credit: $${transaction.price_per_credit.toFixed(2)}
Total Amount: $${transaction.total_amount.toFixed(2)}
Payment Method: ${transaction.payment_method || "N/A"}

----------------------------------------

Thank you for investing in our planet's future!

Atlas Sanctum - Regenerative Value Exchange
`;

      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${transaction.id.slice(0, 8)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Receipt downloaded successfully");
    } catch (error) {
      toast.error("Failed to download receipt");
    } finally {
      setDownloadingReceipt(null);
    }
  };

  const downloadCertificate = async (holding: any) => {
    try {
      const certificateContent = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    CARBON OFFSET CERTIFICATE                     ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  This certifies that the holder has retired:                     ║
║                                                                  ║
║           ${holding.quantity} CARBON CREDITS                     ║
║                                                                  ║
║  Equivalent to ${(holding.quantity * (holding.project?.co2_offset_per_credit || 1)).toFixed(2)} tonnes of CO₂               ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Project: ${holding.project?.title?.padEnd(50) || "N/A"}         ║
║  Type: ${holding.project?.project_type?.replace("_", " ").padEnd(53) || "N/A"}         ║
║  Location: ${(holding.project?.location + ", " + holding.project?.country).padEnd(48) || "N/A"}         ║
║                                                                  ║
║  Certificate ID: ${holding.certificate_id || holding.id}         ║
║  Issue Date: ${format(new Date(holding.retired_at || holding.purchased_at), "MMMM d, yyyy")}         ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  This certificate represents a verified contribution to          ║
║  global climate action through the Atlas Sanctum platform.       ║
║                                                                  ║
║                    Verified by Atlas Sanctum                     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

      const blob = new Blob([certificateContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${holding.id.slice(0, 8)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Certificate downloaded successfully");
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your transaction history.</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = transactionsLoading || holdingsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
            <p className="text-muted-foreground">
              View your purchases, retirement certificates, and download receipts
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactions?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Purchased</p>
                    <p className="text-2xl font-bold">
                      {transactions
                        ?.filter((t) => t.status === "completed")
                        .reduce((sum, t) => sum + t.quantity, 0) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Retired</p>
                    <p className="text-2xl font-bold">
                      {retiredHoldings.reduce((sum, h) => sum + h.quantity, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                    <p className="text-2xl font-bold">
                      $
                      {transactions
                        ?.filter((t) => t.status === "completed")
                        .reduce((sum, t) => sum + t.total_amount, 0)
                        .toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="transactions">
            <TabsList className="mb-6">
              <TabsTrigger value="transactions" className="gap-2">
                <Receipt className="w-4 h-4" />
                All Transactions
              </TabsTrigger>
              <TabsTrigger value="certificates" className="gap-2">
                <Award className="w-4 h-4" />
                Retirement Certificates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>
                    All your carbon credit purchases and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions && transactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {format(new Date(transaction.created_at), "MMM d, yyyy")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {transaction.project?.title || "Unknown Project"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {transaction.project?.project_type?.replace("_", " ")}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{transaction.quantity} credits</TableCell>
                            <TableCell>${transaction.price_per_credit.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">
                              ${transaction.total_amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(transaction.status)}
                                {getStatusBadge(transaction.status)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.status === "completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => downloadReceipt(transaction)}
                                  disabled={downloadingReceipt === transaction.id}
                                >
                                  {downloadingReceipt === transaction.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start your climate journey by purchasing carbon credits
                      </p>
                      <Button onClick={() => navigate("/marketplace")}>
                        Browse Projects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Certificates</CardTitle>
                  <CardDescription>
                    Download certificates for your retired carbon credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {retiredHoldings.length > 0 ? (
                    <div className="grid gap-4">
                      {retiredHoldings.map((holding) => (
                        <div
                          key={holding.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {holding.project?.title || "Carbon Credits"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {holding.quantity} credits •{" "}
                                {(
                                  holding.quantity *
                                  (holding.project?.co2_offset_per_credit || 1)
                                ).toFixed(2)}{" "}
                                tCO₂ offset
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Retired on{" "}
                                {format(
                                  new Date(holding.retired_at || holding.purchased_at),
                                  "MMMM d, yyyy"
                                )}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => downloadCertificate(holding)}>
                            <FileText className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Retire your carbon credits to receive certificates
                      </p>
                      <Button onClick={() => navigate("/portfolio")}>Go to Portfolio</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default TransactionHistory;
