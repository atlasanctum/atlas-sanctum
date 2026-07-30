import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, TrendingUp, Award, Clock, ArrowRight, 
  CheckCircle2, FileText, BarChart3 
} from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserHoldings, useUserTransactions } from '@/hooks/useMarketplace';
import type { CreditHolding } from '@/types/marketplace';
import { PROJECT_TYPE_ICONS } from '@/types/marketplace';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import PortfolioAnalyticsDashboard from '@/components/PortfolioAnalyticsDashboard';
import ExportMenu from '@/components/portfolio/ExportMenu';
import { RetirementModal } from '@/components/portfolio/RetirementModal';

const Portfolio = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { data: holdings, isLoading: holdingsLoading } = useUserHoldings();
  const { data: transactions, isLoading: transactionsLoading } = useUserTransactions();
  const [retirementModalOpen, setRetirementModalOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<CreditHolding | null>(null);

  const handleRetireClick = (holding: CreditHolding) => {
    setSelectedHolding(holding);
    setRetirementModalOpen(true);
  };

  const stats = useMemo(() => {
    if (!holdings) return { totalCredits: 0, totalOffset: 0, totalValue: 0, retiredCredits: 0 };
    
    return holdings.reduce((acc, h) => ({
      totalCredits: acc.totalCredits + h.quantity,
      totalOffset: acc.totalOffset + (h.quantity * (h.carbon_projects?.co2_offset_per_credit || 1)),
      totalValue: acc.totalValue + (h.quantity * h.purchase_price),
      retiredCredits: acc.retiredCredits + (h.retired ? h.quantity : 0),
    }), { totalCredits: 0, totalOffset: 0, totalValue: 0, retiredCredits: 0 });
  }, [holdings]);

  if (authLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = holdingsLoading || transactionsLoading;

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Your Carbon Portfolio
          </h1>
          <p className="text-muted-foreground">
            Track your carbon credit investments and environmental impact.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Leaf, label: 'Total Credits', value: stats.totalCredits.toLocaleString(), color: 'text-primary' },
            { icon: TrendingUp, label: 'CO₂ Offset', value: `${stats.totalOffset.toFixed(1)} tonnes`, color: 'text-accent' },
            { icon: Award, label: 'Portfolio Value', value: `$${stats.totalValue.toFixed(2)}`, color: 'text-primary' },
            { icon: CheckCircle2, label: 'Retired Credits', value: stats.retiredCredits.toLocaleString(), color: 'text-green-500' },
          ].map((stat, i) => (
            <Card key={stat.label} className="bg-card-gradient border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="holdings" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Holdings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="holdings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card-gradient border-border/50">
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                  <CardTitle className="text-foreground">Your Holdings</CardTitle>
                  <div className="flex items-center gap-2">
                    <ExportMenu 
                      holdings={holdings || []} 
                      transactions={transactions || []} 
                      stats={stats}
                      userName={user?.email?.split('@')[0]}
                    />
                    <Button asChild variant="outline" size="sm" className="border-border/50">
                      <Link to="/marketplace">
                        Browse Projects <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : holdings?.length === 0 ? (
                    <div className="text-center py-12">
                      <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">You don't have any carbon credits yet.</p>
                      <Button asChild>
                        <Link to="/marketplace">Explore Marketplace</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50">
                            <TableHead>Project</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">CO₂ Offset</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {holdings?.map((holding) => (
                            <TableRow key={holding.id} className="border-border/30">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">
                                    {PROJECT_TYPE_ICONS[holding.carbon_projects?.project_type || 'reforestation']}
                                  </span>
                                  <div>
                                    <Link 
                                      to={`/marketplace/${holding.project_id}`}
                                      className="font-medium text-foreground hover:text-primary transition-colors"
                                    >
                                      {holding.carbon_projects?.title || 'Unknown Project'}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">
                                      Purchased {format(new Date(holding.purchased_at), 'MMM d, yyyy')}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {holding.quantity.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                ${holding.purchase_price.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right text-primary">
                                {(holding.quantity * (holding.carbon_projects?.co2_offset_per_credit || 1)).toFixed(1)} t
                              </TableCell>
                              <TableCell>
                                {holding.retired ? (
                                  <Badge variant="outline" className="border-green-500/50 text-green-500">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Retired
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-primary/50 text-primary">
                                    Active
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {holding.retired ? (
                                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <FileText className="w-4 h-4 mr-1" />
                                    {holding.certificate_id?.slice(0, 12)}...
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRetireClick(holding)}
                                    className="border-primary/50 text-primary hover:bg-primary/10"
                                  >
                                    Retire Credits
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics">
            <PortfolioAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="transactions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card-gradient border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                  ) : transactions?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50">
                            <TableHead>Date</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions?.map((tx) => (
                            <TableRow key={tx.id} className="border-border/30">
                              <TableCell className="text-muted-foreground">
                                {format(new Date(tx.created_at), 'MMM d, yyyy HH:mm')}
                              </TableCell>
                              <TableCell>
                                <Link 
                                  to={`/marketplace/${tx.project_id}`}
                                  className="text-foreground hover:text-primary transition-colors"
                                >
                                  {tx.carbon_projects?.title || 'Unknown'}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-border/50 capitalize">
                                  {tx.transaction_type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {tx.quantity.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-bold text-gradient-gold">
                                ${tx.total_amount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    tx.status === 'completed' 
                                      ? 'border-green-500/50 text-green-500' 
                                      : tx.status === 'failed' 
                                      ? 'border-destructive/50 text-destructive'
                                      : 'border-accent/50 text-accent'
                                  }
                                >
                                  {tx.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Retirement Modal */}
        <RetirementModal
          isOpen={retirementModalOpen}
          onClose={() => {
            setRetirementModalOpen(false);
            setSelectedHolding(null);
          }}
          holding={selectedHolding}
        />
      </div>
    </PageLayout>
  );
};

export default Portfolio;
