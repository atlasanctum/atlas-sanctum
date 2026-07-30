import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Network,
  TrendingUp,
  Wallet,
  Zap,
  Shield,
  Plus,
  FileText,
  Activity,
  Database,
  Lock,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard, DashboardChart, DashboardTable, type TableColumn } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface TokenAsset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  change24h: number;
  type: 'carbon' | 'nature' | 'biodiversity' | 'social';
}

interface SmartContract {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  transactions: number;
  lastActivity: string;
}

const DeFiDashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const navigate = useNavigate();
  
  // Use enhanced auth for demo mode, fallback to regular auth
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;
  const [tokenAssets, setTokenAssets] = useState<TokenAsset[]>([]);
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [gasPrice, setGasPrice] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }

    // Mock data for demo
    const mockTokenAssets: TokenAsset[] = [
      {
        id: '1',
        name: 'Carbon Credit Token',
        symbol: 'CCT',
        balance: 50000,
        value: 15.50,
        change24h: 5.2,
        type: 'carbon',
      },
      {
        id: '2',
        name: 'Nature Token',
        symbol: 'NAT',
        balance: 25000,
        value: 8.75,
        change24h: -2.1,
        type: 'nature',
      },
      {
        id: '3',
        name: 'Biodiversity Token',
        symbol: 'BIO',
        balance: 15000,
        value: 12.25,
        change24h: 8.3,
        type: 'biodiversity',
      },
      {
        id: '4',
        name: 'Social Impact Token',
        symbol: 'SOC',
        balance: 10000,
        value: 6.50,
        change24h: 3.7,
        type: 'social',
      },
    ];

    const mockSmartContracts: SmartContract[] = [
      {
        id: '1',
        name: 'Carbon Credit Pool',
        status: 'active',
        transactions: 1247,
        lastActivity: '2025-01-31 10:30',
      },
      {
        id: '2',
        name: 'Liquidity Protocol',
        status: 'active',
        transactions: 892,
        lastActivity: '2025-01-31 09:15',
      },
      {
        id: '3',
        name: 'Governance DAO',
        status: 'paused',
        transactions: 456,
        lastActivity: '2025-01-30 16:45',
      },
      {
        id: '4',
        name: 'Impact Oracle',
        status: 'active',
        transactions: 2341,
        lastActivity: '2025-01-31 14:20',
      },
    ];

    setTokenAssets(mockTokenAssets);
    setSmartContracts(mockSmartContracts);
    setTotalValue(100000);
    setWalletConnected(true);
    setGasPrice(25);
  }, [user, loading, navigate]);

  const assetColumns: TableColumn<TokenAsset>[] = [
    {
      key: 'name',
      title: 'Asset Name',
    },
    {
      key: 'symbol',
      title: 'Symbol',
      render: (value) => (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500">
          {value}
        </Badge>
      ),
    },
    {
      key: 'balance',
      title: 'Balance',
      render: (value) => `${Number(value).toLocaleString()} tokens`,
    },
    {
      key: 'value',
      title: 'Value',
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      key: 'change24h',
      title: '24h Change',
      render: (value) => {
        const numValue = Number(value);
        return (
          <span className={numValue > 0 ? 'text-emerald-500' : 'text-red-500'}>
            {numValue > 0 ? '+' : ''}{numValue}%
          </span>
        );
      },
    },
  ];

  const contractColumns: TableColumn<SmartContract>[] = [
    {
      key: 'name',
      title: 'Contract Name',
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => {
        const statusConfig = {
          active: { color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
          paused: { color: 'bg-amber-500/10 text-amber-500', icon: Lock },
          completed: { color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle },
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        const Icon = config.icon;
        return (
          <Badge className={config.color}>
            <Icon className="w-3 h-3 mr-1" />
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'transactions',
      title: 'Transactions',
      render: (value) => `${value.toLocaleString()}`,
    },
    {
      key: 'lastActivity',
      title: 'Last Activity',
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceLayout
      title="DeFi Dashboard"
      subtitle="Tokenized assets and smart contract management"
      userType="defi"
    >
      <div className="space-y-8">
        {/* Wallet Connection */}
          <div className="mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                  Wallet Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${walletConnected ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                    <div>
                      <p className="text-lg font-semibold">
                        {walletConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {walletConnected ? '0x1234...5678' : 'Connect your wallet to get started'}
                      </p>
                    </div>
                  </div>
                  {!walletConnected && (
                    <Button onClick={() => setWalletConnected(true)} className="gap-2">
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </Button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Gas Price: <span className="font-semibold">${gasPrice.toFixed(2)} Gwei</span></p>
                  <p>Network: Ethereum Mainnet</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardMetricCard
              title="Total Portfolio Value"
              value={`$${totalValue.toLocaleString()}`}
              change={12.5}
              icon={TrendingUp}
              iconColor="text-emerald-500"
              trend="up"
              description="Value of all tokenized assets"
            />
            <DashboardMetricCard
              title="Active Contracts"
              value={3}
              change={0}
              icon={Zap}
              iconColor="text-blue-500"
              trend="neutral"
              description="Smart contracts currently active"
            />
            <DashboardMetricCard
              title="Total Transactions"
              value={4936}
              change={25.3}
              icon={Activity}
              iconColor="text-purple-500"
              trend="up"
              description="Transactions in last 24 hours"
            />
            <DashboardMetricCard
              title="Gas Savings"
              value="$1,245"
              change={-5.2}
              icon={Shield}
              iconColor="text-amber-500"
              trend="down"
              description="Optimized gas costs this month"
            />
          </div>

          {/* Token Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DashboardTable
              title="Token Assets"
              icon={Network}
              iconColor="text-emerald-500"
              columns={assetColumns}
              data={tokenAssets}
              onRowClick={(asset) => console.log('View asset:', asset.id)}
              emptyMessage="No token assets found."
            />

            <DashboardTable
              title="Smart Contracts"
              icon={Database}
              iconColor="text-blue-500"
              columns={contractColumns}
              data={smartContracts}
              onRowClick={(contract) => console.log('View contract:', contract.id)}
              emptyMessage="No smart contracts found."
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                asChild
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  <span>Deploy Contract</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span>View Documentation</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <RefreshCw className="w-6 h-6" />
                  <span>Refresh Prices</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <span>Settings</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardChart
                title="Portfolio Performance"
                icon={BarChart3}
                iconColor="text-emerald-500"
                description="Your portfolio value over the last 6 months"
              >
                <div className="space-y-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month}</span>
                        <span className="text-sm text-muted-foreground">
                          ${(80000 + Math.floor(Math.random() * 20000)).toLocaleString()}
                        </span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30 + 60)} className="h-2" />
                    </div>
                  ))}
                </div>
              </DashboardChart>

              <DashboardChart
                title="Transaction Volume"
                icon={Activity}
                iconColor="text-blue-500"
                description="Smart contract interactions over time"
              >
                <div className="space-y-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 500 + 200)} txns
                        </span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 40 + 50)} className="h-2" />
                    </div>
                  ))}
                </div>
              </DashboardChart>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    );
  };

  export default DeFiDashboard;
