import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Leaf, FileText, 
  CheckCircle, XCircle, Clock, RefreshCw,
  Wallet, TrendingUp, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserTransactions, useUserHoldings, usePortfolioStats } from "@/hooks/useTransactions";
import { PROJECT_TYPE_LABELS } from "@/types/marketplace";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Pending" },
  completed: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", label: "Completed" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Failed" },
  refunded: { icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-500/10", label: "Refunded" },
};

const Transactions = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: transactions, isLoading: txLoading } = useUserTransactions();
  const { data: holdings, isLoading: holdingsLoading } = useUserHoldings();
  const stats = usePortfolioStats();
  const [generatingCert, setGeneratingCert] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleDownloadCertificate = async (holdingId: string) => {
    setGeneratingCert(holdingId);
    try {
      const { data, error } = await supabase.functions.invoke("generate-certificate", {
        body: { holdingId },
      });

      if (error) throw error;

      // Open certificate in new tab
      const blob = new Blob([data], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      
      toast.success("Certificate generated successfully!");
    } catch (err) {
      console.error("Certificate error:", err);
      toast.error("Failed to generate certificate");
    } finally {
      setGeneratingCert(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-ocean flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              My Portfolio
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Credits", value: stats.totalCredits.toLocaleString(), icon: Leaf, color: "text-primary" },
            { label: "Portfolio Value", value: `$${stats.totalValue.toFixed(2)}`, icon: Wallet, color: "text-accent" },
            { label: "CO₂ Offset", value: `${stats.totalCO2.toLocaleString()} t`, icon: Globe, color: "text-ocean" },
            { label: "Active Holdings", value: stats.activeHoldings, icon: TrendingUp, color: "text-earth" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-card/50 border border-border/50 rounded-xl p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="holdings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="holdings">Credit Holdings</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>

          {/* Holdings Tab */}
          <TabsContent value="holdings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {holdingsLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : holdings?.length === 0 ? (
                <div className="text-center py-16">
                  <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No carbon credits yet</p>
                  <Button onClick={() => navigate("/marketplace")} className="mt-4">
                    Browse Marketplace
                  </Button>
                </div>
              ) : (
                holdings?.map((holding) => (
                  <motion.div
                    key={holding.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{holding.project?.title}</h3>
                          {holding.retired && (
                            <Badge variant="secondary">Retired</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {holding.project?.location}, {holding.project?.country}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">{holding.quantity}</strong> credits
                          </span>
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">${holding.purchase_price}</strong>/credit
                          </span>
                          <span className="text-muted-foreground">
                            <strong className="text-primary">{(holding.quantity * (holding.project?.co2_offset_per_credit || 1)).toLocaleString()} t</strong> CO₂
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {PROJECT_TYPE_LABELS[holding.project?.project_type as keyof typeof PROJECT_TYPE_LABELS]}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadCertificate(holding.id)}
                          disabled={generatingCert === holding.id}
                        >
                          {generatingCert === holding.id ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4 mr-2" />
                          )}
                          Certificate
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {txLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : transactions?.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                transactions?.map((tx) => {
                  const status = statusConfig[tx.status];
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-xl p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{tx.project?.title}</h3>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.bg}`}>
                              <StatusIcon className={`w-3 h-3 ${status.color}`} />
                              <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tx.project?.location}, {tx.project?.country}
                          </p>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <span className="text-muted-foreground">
                              <strong className="text-foreground">{tx.quantity}</strong> credits
                            </span>
                            <span className="text-muted-foreground">
                              @ <strong className="text-foreground">${tx.price_per_credit}</strong>/credit
                            </span>
                            {tx.payment_method && (
                              <span className="text-muted-foreground capitalize">
                                via {tx.payment_method}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">${tx.total_amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Transactions;
