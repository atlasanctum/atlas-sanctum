/**
 * DeFi Carbon Credit Trading Dashboard
 * Real-time carbon credit marketplace with tokenized bonds
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, Clock, Shield,
  Leaf, Globe, Landmark, CreditCard, BarChart3, Activity,
  Search, Coins
} from 'lucide-react';

// Types
interface CarbonCredit {
  id: string; symbol: string; name: string; price: number;
  change24h: number; volume24h: number; marketCap: number;
  vintage: string; projectType: string; registry: string;
  verified: boolean; reduction: number;
}

interface TokenizedBond {
  id: string; name: string; symbol: string; faceValue: number;
  currentPrice: number; yield: number; maturity: string;
  impactScore: number; issuer: string;
  status: 'available' | 'trading' | 'redeemed';
}

// Mock Data
const carbonCredits: CarbonCredit[] = [
  { id: 'NCT', symbol: 'NCT', name: 'Nature Carbon Token', price: 45.80, change24h: 5.2, volume24h: 1250000, marketCap: 45000000, vintage: '2023', projectType: 'Forest Conservation', registry: 'Verra', verified: true, reduction: 50000 },
  { id: 'BCT', symbol: 'BCT', name: 'Base Carbon Token', price: 52.30, change24h: -1.8, volume24h: 890000, marketCap: 38000000, vintage: '2024', projectType: 'Renewable Energy', registry: 'Gold Standard', verified: true, reduction: 35000 },
  { id: 'MCO2', symbol: 'MCO2', name: 'Moss Carbon Token', price: 38.90, change24h: 3.4, volume24h: 650000, marketCap: 28000000, vintage: '2023', projectType: 'Ocean Conservation', registry: 'Verra', verified: true, reduction: 28000 },
  { id: 'UBO', symbol: 'UBO', name: 'Universal Base Offset', price: 28.50, change24h: 2.1, volume24h: 420000, marketCap: 15000000, vintage: '2024', projectType: 'Household Devices', registry: 'CDM', verified: true, reduction: 15000 },
  { id: 'NBO', symbol: 'NBO', name: 'Nature Based Offset', price: 35.20, change24h: -0.5, volume24h: 380000, marketCap: 22000000, vintage: '2023', projectType: 'Agricultural', registry: 'ACR', verified: true, reduction: 22000 },
];

const bonds: TokenizedBond[] = [
  { id: 'IB-001', name: 'Amazon Rainforest Impact Bond', symbol: 'ARI', faceValue: 1000, currentPrice: 850, yield: 8.5, maturity: '2028-01-15', impactScore: 92, issuer: 'Amazon Conservation', status: 'trading' },
  { id: 'IB-002', name: 'Coral Reef Regeneration Bond', symbol: 'CRR', faceValue: 500, currentPrice: 420, yield: 12.3, maturity: '2027-06-30', impactScore: 88, issuer: 'Ocean Impact Foundation', status: 'trading' },
  { id: 'IB-003', name: 'Mangrove Protection Note', symbol: 'MPN', faceValue: 1000, currentPrice: 780, yield: 7.2, maturity: '2029-03-15', impactScore: 95, issuer: 'Coastal Regeneration Corp', status: 'available' },
  { id: 'IB-004', name: 'African Savanna Wildlife Bond', symbol: 'ASW', faceValue: 2000, currentPrice: 1650, yield: 9.8, maturity: '2026-12-31', impactScore: 85, issuer: 'Wildlife Conservation Trust', status: 'trading' },
];

const priceHistory = [
  { time: '00:00', NCT: 44.5, BCT: 51.8, MCO2: 37.5 },
  { time: '04:00', NCT: 45.0, BCT: 52.0, MCO2: 38.0 },
  { time: '08:00', NCT: 45.2, BCT: 52.5, MCO2: 38.2 },
  { time: '12:00', NCT: 45.5, BCT: 52.3, MCO2: 38.5 },
  { time: '16:00', NCT: 45.8, BCT: 52.5, MCO2: 38.8 },
  { time: '20:00', NCT: 45.8, BCT: 52.3, MCO2: 38.9 },
];

const marketDist = [
  { name: 'Forest', value: 35, color: '#10b981' },
  { name: 'Renewable', value: 28, color: '#3b82f6' },
  { name: 'Ocean', value: 18, color: '#06b6d4' },
  { name: 'Agriculture', value: 12, color: '#8b5cf6' },
];

// Components
const MetricCard: React.FC<{ title: string; value: string; change?: string; icon: React.ElementType; trend?: string }> = 
  ({ title, value, change, icon: Icon, trend }) => (
  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
    <div className="flex justify-between mb-2">
      <span className="text-sm text-slate-400">{title}</span>
      <Icon className="w-5 h-5 text-slate-400" />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {change && <div className={`text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{change}</div>}
  </div>
);

const CreditCardDisplay: React.FC<{ credit: CarbonCredit; onClick: () => void }> = ({ credit, onClick }) => (
  <motion.div whileHover={{ scale: 1.02 }} onClick={onClick}
    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 cursor-pointer">
    <div className="flex justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-white">{credit.symbol}</div>
          <div className="text-xs text-slate-400">{credit.name}</div>
        </div>
      </div>
      {credit.verified && <Shield className="w-5 h-5 text-emerald-400" />}
    </div>
    <div className="flex justify-between">
      <div>
        <div className="text-xl font-bold text-white">${credit.price.toFixed(2)}</div>
        <div className={`flex items-center gap-1 text-sm ${credit.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {credit.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {credit.change24h >= 0 ? '+' : ''}{credit.change24h}%
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-slate-400">Market Cap</div>
        <div className="text-sm font-medium text-white">${(credit.marketCap / 1000000).toFixed(1)}M</div>
      </div>
    </div>
  </motion.div>
);

const BondCard: React.FC<{ bond: TokenizedBond }> = ({ bond }) => (
  <motion.div whileHover={{ scale: 1.02 }}
    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50">
    <div className="flex justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Landmark className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-white">{bond.symbol}</div>
          <div className="text-xs text-slate-400">{bond.name}</div>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${bond.status === 'trading' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-blue-400/10 text-blue-400'}`}>
        {bond.status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="p-2 rounded bg-slate-700/30 text-center">
        <div className="text-xs text-slate-400">Yield</div>
        <div className="text-lg font-bold text-emerald-400">{bond.yield}%</div>
      </div>
      <div className="p-2 rounded bg-slate-700/30 text-center">
        <div className="text-xs text-slate-400">Impact</div>
        <div className="text-lg font-bold text-purple-400">{bond.impactScore}</div>
      </div>
    </div>
    <div className="flex justify-between text-xs text-slate-400">
      <span>Maturity: {bond.maturity}</span>
      <span>${bond.faceValue}</span>
    </div>
  </motion.div>
);

// Main Component
export default function CarbonCreditMarketplace() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selected, setSelected] = useState<CarbonCredit | null>(null);
  const [connected, setConnected] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => setConnected(true), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCredits = carbonCredits.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="w-8 h-8 text-emerald-400" />
              Carbon Credit Marketplace
            </h1>
            <p className="text-slate-400 mt-1">Real-time DeFi trading for tokenized carbon credits</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${connected ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className={`text-sm ${connected ? 'text-emerald-400' : 'text-red-400'}`}>Live</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
              <Wallet className="w-4 h-4" /> Connect Wallet
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <MetricCard title="Volume (24h)" value="$4.2M" change="+12.5%" trend="up" icon={Activity} />
          <MetricCard title="Market Cap" value="$148M" change="+8.3%" trend="up" icon={BarChart3} />
          <MetricCard title="Credits Traded" value="89.2K" change="+5.7%" trend="up" icon={Coins} />
          <MetricCard title="Avg Price" value="$47.15" change="-0.3%" trend="down" icon={TrendingUp} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'credits', 'bonds', 'trading'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Prices (24h)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={priceHistory}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="NCT" stroke="#10b981" fill="url(#g1)" strokeWidth={2} />
                      <Area type="monotone" dataKey="BCT" stroke="#3b82f6" fill="transparent" strokeWidth={2} />
                      <Line type="monotone" dataKey="MCO2" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-400" /> Market Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={marketDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {marketDist.map((_, i) => <Cell key={i} fill={marketDist[i].color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" /> Top Carbon Credits
                </h3>
                <div className="grid grid-cols-5 gap-4">
                  {carbonCredits.map(credit => <CreditCardDisplay key={credit.id} credit={credit} onClick={() => setSelected(credit)} />)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-purple-400" /> Tokenized Impact Bonds
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {bonds.map(bond => <BondCard key={bond.id} bond={bond} />)}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'credits' && (
            <motion.div key="credits" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Search credits..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:border-emerald-500" />
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
                  <option value="all">All Types</option>
                  <option value="forest">Forest</option>
                  <option value="ocean">Ocean</option>
                  <option value="renewable">Renewable</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {filteredCredits.map((credit, i) => (
                  <motion.div key={credit.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer" onClick={() => setSelected(credit)}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{credit.symbol}</div>
                        <div className="text-sm text-slate-400">{credit.name}</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">${credit.price.toFixed(2)}</div>
                    <div className={`flex items-center gap-1 ${credit.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {credit.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {credit.change24h >= 0 ? '+' : ''}{credit.change24h}% (24h)
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                      <div className="p-2 rounded bg-slate-700/30"><span className="text-slate-400">Volume:</span> <span className="text-white">${(credit.volume24h / 1000).toFixed(0)}K</span></div>
                      <div className="p-2 rounded bg-slate-700/30"><span className="text-slate-400">Cap:</span> <span className="text-white">${(credit.marketCap / 1000000).toFixed(1)}M</span></div>
                      <div className="p-2 rounded bg-slate-700/30"><span className="text-slate-400">Vintage:</span> <span className="text-white">{credit.vintage}</span></div>
                      <div className="p-2 rounded bg-slate-700/30"><span className="text-slate-400">Reduction:</span> <span className="text-white">{credit.reduction.toLocaleString()} tCO2</span></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'bonds' && (
            <motion.div key="bonds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {bonds.map((bond, i) => (
                  <motion.div key={bond.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Landmark className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">{bond.name}</div>
                          <div className="text-sm text-slate-400">{bond.issuer}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${bond.status === 'trading' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-blue-400/10 text-blue-400'}`}>
                        {bond.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-slate-800/50 text-center"><div className="text-xs text-slate-400">Price</div><div className="text-xl font-bold text-white">${bond.currentPrice}</div></div>
                      <div className="p-3 rounded-lg bg-slate-800/50 text-center"><div className="text-xs text-slate-400">Face</div><div className="text-xl font-bold text-white">${bond.faceValue}</div></div>
                      <div className="p-3 rounded-lg bg-slate-800/50 text-center"><div className="text-xs text-slate-400">Yield</div><div className="text-xl font-bold text-emerald-400">{bond.yield}%</div></div>
                      <div className="p-3 rounded-lg bg-slate-800/50 text-center"><div className="text-xs text-slate-400">Impact</div><div className="text-xl font-bold text-purple-400">{bond.impactScore}</div></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                      <Clock className="w-4 h-4" /> Maturity: {bond.maturity}
                    </div>
                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-500 hover:to-pink-500">
                      {bond.status === 'available' ? 'Subscribe Now' : 'Trade Bond'}
                    </button>
                  </motion.div>
                ))}
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Bond Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[{ name: 'ARI', v: 15.2, r: 8.5 }, { name: 'CRR', v: 18.5, r: 12.3 }, { name: 'MPN', v: 12.8, r: 7.2 }, { name: 'ASW', v: 22.1, r: 9.8 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="v" fill="#8b5cf6" name="Price ($)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="r" fill="#10b981" name="Yield (%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'trading' && (
            <motion.div key="trading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  {selected ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <Leaf className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-2xl font-bold text-white">{selected.symbol}</h2>
                              {selected.verified && <Shield className="w-5 h-5 text-emerald-400" />}
                            </div>
                            <div className="text-slate-400">{selected.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">${selected.price.toFixed(2)}</div>
                          <div className={`flex items-center justify-end gap-1 ${selected.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {selected.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {selected.change24h >= 0 ? '+' : ''}{selected.change24h}%
                          </div>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={priceHistory}>
                          <defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                          <Area type="monotone" dataKey={selected.symbol} stroke="#10b981" fill="url(#gs)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-slate-400">Select a carbon credit to trade</div>
                  )}
                </div>
                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Book</h3>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-2"><span>Price</span><span>Amount</span></div>
                    {[{ p: 45.85, a: 2000 }, { p: 45.90, a: 3500 }, { p: 45.95, a: 1200 }, { p: 46.00, a: 2800 }, { p: 46.05, a: 4000 }].map((o, i) => (
                      <div key={i} className="flex justify-between py-1 px-2 hover:bg-slate-700/30">
                        <span className="text-red-400">${o.p.toFixed(2)}</span>
                        <span className="text-white">{o.a.toLocaleString()}</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full"><div className="h-full bg-red-400" style={{ width: `${(o.a / 5000) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="py-3 mb-4 text-center border-y border-slate-700">
                    <div className="text-2xl font-bold text-white">${selected?.price.toFixed(2) || '45.80'}</div>
                  </div>
                  <div className="space-y-1">
                    {[{ p: 45.70, a: 1500 }, { p: 45.65, a: 2200 }, { p: 45.60, a: 3000 }, { p: 45.55, a: 1800 }, { p: 45.50, a: 4500 }].map((o, i) => (
                      <div key={i} className="flex justify-between py-1 px-2 hover:bg-slate-700/30">
                        <span className="text-emerald-400">${o.p.toFixed(2)}</span>
                        <span className="text-white">{o.a.toLocaleString()}</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full"><div className="h-full bg-emerald-400" style={{ width: `${(o.a / 5000) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
                <div className="space-y-2">
                  {[{ t: '14:32:15', p: 45.82, a: 500, ty: 'buy' }, { t: '14:31:58', p: 45.80, a: 1200, ty: 'sell' }, { t: '14:31:42', p: 45.78, a: 800, ty: 'buy' }, { t: '14:31:25', p: 45.75, a: 2000, ty: 'buy' }, { t: '14:31:08', p: 45.80, a: 1500, ty: 'sell' }].map((trade, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400">{trade.t}</span>
                        <span className={`text-sm font-medium ${trade.ty === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>{trade.ty.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="text-white">${trade.p.toFixed(2)}</span>
                        <span className="text-white">{trade.a.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
