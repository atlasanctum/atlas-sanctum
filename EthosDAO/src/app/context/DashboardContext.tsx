import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type ValueMetric = {
  label: string;
  value: number;
  color: string;
};

type Proposal = {
  id: number;
  title: string;
  description: string;
  category: string;
  supportFor: number; // percentage
  supportAgainst: number; // percentage
  endsIn: string;
  proposer: string;
  proposerImage: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  hasVoted?: boolean; // track if current user voted
};

type ForecastDataPoint = {
  month: string;
  actual?: number;
  forecast?: number;
};

type SectorDataPoint = {
  name: string;
  score: number;
  target: number;
};

type HealthDataPoint = {
  name: string;
  value: number;
};

type ImpactDataPoint = {
  name: string;
  carbon: number;
  water: number;
};

type Asset = {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
  price: number;
  priceFormatted: string;
  change: string;
  desc: string;
  available: number;
  verified: boolean;
};

type Transaction = {
  id: number;
  assetName: string;
  amount: number;
  price: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
};

type DashboardContextType = {
  // Wallet
  walletAddress: string | null;
  isWalletConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  
  // Values Engine
  values: ValueMetric[];
  updateValue: (label: string, newValue: number) => void;
  
  // Governance
  proposals: Proposal[];
  voteOnProposal: (id: number, vote: 'for' | 'against') => void;
  
  // Ecological Metrics
  forecastData: ForecastDataPoint[];
  sectorData: SectorDataPoint[];
  healthData: HealthDataPoint[];
  impactData: ImpactDataPoint[];
  
  // Regenerative Asset Marketplace
  assets: Asset[];
  transactions: Transaction[];
  purchaseAsset: (assetId: number, amount: number) => void;
  
  // Loading States
  isInitialLoading: boolean;
  isWalletConnecting: boolean;
  isTransactionPending: boolean;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // Loading States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  // Wallet State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  const connectWallet = () => {
    setIsWalletConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setWalletAddress('0x71C...9A23');
      setIsWalletConnecting(false);
      toast.success('Wallet connected successfully');
    }, 1500);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    toast.info('Wallet disconnected');
  };

  // Values Engine State
  const [values, setValues] = useState<ValueMetric[]>([
    { label: 'Ecological Regeneration', value: 85, color: 'bg-emerald-500' },
    { label: 'Social Equity', value: 70, color: 'bg-blue-500' },
    { label: 'Long-term Thinking', value: 90, color: 'bg-purple-500' },
    { label: 'Transparency', value: 65, color: 'bg-amber-500' },
    { label: 'Cultural Preservation', value: 75, color: 'bg-rose-500' },
  ]);

  const updateValue = (label: string, newValue: number) => {
    setValues(prev => prev.map(v => v.label === label ? { ...v, value: newValue } : v));
  };

  // Proposals State
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 101,
      title: 'Amazon Bio-Corridor Expansion',
      description: 'Allocate 50,000 ETH equivalent in stablecoins to fund the expansion of the bio-corridor project in partnership with local indigenous communities.',
      category: 'Ecosystem Restoration',
      supportFor: 82,
      supportAgainst: 18,
      endsIn: '2 days',
      proposer: 'crypto_botanist.eth',
      proposerImage: 'https://i.pravatar.cc/150?u=101',
      status: 'active'
    },
    {
      id: 102,
      title: 'Urban Vertical Farming Subsidy',
      description: 'Proposal to subsidize vertical farming initiatives in high-density urban areas to reduce food transport emissions.',
      category: 'Urban Sustainability',
      supportFor: 45,
      supportAgainst: 55,
      endsIn: '5 hours',
      proposer: 'urban_grower.eth',
      proposerImage: 'https://i.pravatar.cc/150?u=102',
      status: 'active'
    }
  ]);

  const voteOnProposal = (id: number, vote: 'for' | 'against') => {
    if (!walletAddress) {
      toast.error('Please connect your wallet to vote');
      return;
    }

    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        if (p.hasVoted) {
          toast.error('You have already voted on this proposal');
          return p;
        }
        
        toast.success(`Voted ${vote} on proposal #${id}`);
        
        // Simple mock calculation to adjust percentages
        // In a real app this would be more complex math
        let newFor = p.supportFor;
        let newAgainst = p.supportAgainst;
        
        if (vote === 'for') {
           newFor = Math.min(100, p.supportFor + 1);
           newAgainst = Math.max(0, p.supportAgainst - 1);
        } else {
           newFor = Math.max(0, p.supportFor - 1);
           newAgainst = Math.min(100, p.supportAgainst + 1);
        }

        return {
          ...p,
          supportFor: newFor,
          supportAgainst: newAgainst,
          hasVoted: true
        };
      }
      return p;
    }));
  };

  // Ecological Metrics State
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([
    { month: 'Jul', actual: 400, forecast: 410 },
    { month: 'Aug', actual: 450, forecast: 460 },
    { month: 'Sep', actual: 480, forecast: 490 },
    { month: 'Oct', actual: 510, forecast: 500 },
    { month: 'Nov', actual: 540, forecast: 550 },
    { month: 'Dec', actual: 590, forecast: 600 },
    { month: 'Jan', forecast: 640 },
    { month: 'Feb', forecast: 680 },
  ]);

  const [sectorData, setSectorData] = useState<SectorDataPoint[]>([
    { name: 'Agriculture', score: 85, target: 90 },
    { name: 'Oceanic', score: 65, target: 80 },
    { name: 'Healthcare', score: 92, target: 95 },
    { name: 'Circular', score: 78, target: 85 },
  ]);

  const [healthData, setHealthData] = useState<HealthDataPoint[]>([
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 72 },
    { name: 'Wed', value: 68 },
    { name: 'Thu', value: 75 },
    { name: 'Fri', value: 82 },
    { name: 'Sat', value: 86 },
    { name: 'Sun', value: 89 },
  ]);

  const [impactData, setImpactData] = useState<ImpactDataPoint[]>([
    { name: 'Jan', carbon: 400, water: 240 },
    { name: 'Feb', carbon: 300, water: 139 },
    { name: 'Mar', carbon: 200, water: 980 },
    { name: 'Apr', carbon: 278, water: 390 },
    { name: 'May', carbon: 189, water: 480 },
    { name: 'Jun', carbon: 239, water: 380 },
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    // Simulate initial data load
    const loadTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    const interval = setInterval(() => {
      // Update health data with slight variations
      setHealthData(prev => prev.map((item, idx) => ({
        ...item,
        value: Math.min(100, Math.max(50, item.value + (Math.random() - 0.5) * 3))
      })));

      // Update sector scores
      setSectorData(prev => prev.map(item => ({
        ...item,
        score: Math.min(item.target, Math.max(40, item.score + (Math.random() - 0.5) * 2))
      })));
    }, 5000); // Update every 5 seconds

    return () => {
      clearTimeout(loadTimer);
      clearInterval(interval);
    };
  }, []);

  // Regenerative Asset Marketplace State
  const [assets, setAssets] = useState<Asset[]>([
    { 
      id: 1,
      name: 'Amazon Rainforest Protection', 
      type: 'Forestry', 
      icon: 'Sprout', 
      color: 'emerald', 
      price: 24.50,
      priceFormatted: '$24.50', 
      change: '+2.4%', 
      desc: 'Preservation of 500 hectares of primary rainforest in Brazil.',
      available: 1250,
      verified: true
    },
    { 
      id: 2,
      name: 'Pacific Blue Carbon', 
      type: 'Oceanic', 
      icon: 'Droplets', 
      color: 'blue', 
      price: 18.20,
      priceFormatted: '$18.20', 
      change: '+5.1%', 
      desc: 'Mangrove restoration project in Indonesia ensuring coastal resilience.',
      available: 3400,
      verified: true
    },
    { 
      id: 3,
      name: 'Andean Soil Regeneration', 
      type: 'Land', 
      icon: 'Mountain', 
      color: 'amber', 
      price: 12.05,
      priceFormatted: '$12.05', 
      change: '-0.4%', 
      desc: 'Regenerative agriculture initiative supporting local farmers.',
      available: 2800,
      verified: true
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const purchaseAsset = (assetId: number, amount: number) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet to purchase assets');
      return;
    }

    const asset = assets.find(a => a.id === assetId);
    if (!asset) {
      toast.error('Asset not found');
      return;
    }

    if (amount > asset.available) {
      toast.error('Insufficient assets available');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    // Create transaction
    const transaction: Transaction = {
      id: Date.now(),
      assetName: asset.name,
      amount,
      price: asset.price * amount,
      timestamp: Date.now(),
      status: 'pending'
    };

    setTransactions(prev => [transaction, ...prev]);
    
    // Simulate blockchain transaction
    toast.loading('Processing transaction...', { id: 'tx-' + transaction.id });
    setIsTransactionPending(true);

    setTimeout(() => {
      // Update transaction status
      setTransactions(prev => prev.map(tx => 
        tx.id === transaction.id ? { ...tx, status: 'completed' } : tx
      ));

      // Update asset availability
      setAssets(prev => prev.map(a => 
        a.id === assetId ? { ...a, available: a.available - amount } : a
      ));

      toast.success(`Successfully purchased ${amount} ${asset.name} credits!`, { 
        id: 'tx-' + transaction.id 
      });
      setIsTransactionPending(false);
    }, 2500);
  };

  return (
    <DashboardContext.Provider value={{
      // Wallet
      walletAddress,
      isWalletConnected: !!walletAddress,
      connectWallet,
      disconnectWallet,
      
      // Values Engine
      values,
      updateValue,
      
      // Governance
      proposals,
      voteOnProposal,
      
      // Ecological Metrics
      forecastData,
      sectorData,
      healthData,
      impactData,
      
      // Regenerative Asset Marketplace
      assets,
      transactions,
      purchaseAsset,
      
      // Loading States
      isInitialLoading,
      isWalletConnecting,
      isTransactionPending,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}