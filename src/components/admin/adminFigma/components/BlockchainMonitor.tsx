import React from 'react';
import { Database, TrendingUp, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const transactionData = [
  { time: '00:00', volume: 125000, count: 234 },
  { time: '04:00', volume: 98000, count: 178 },
  { time: '08:00', volume: 215000, count: 389 },
  { time: '12:00', volume: 287000, count: 512 },
  { time: '16:00', volume: 245000, count: 445 },
  { time: '20:00', volume: 178000, count: 321 },
];

const assetDistribution = [
  { name: 'Carbon Credits', value: 4200, color: '#10b981' },
  { name: 'Biodiversity Tokens', value: 2800, color: '#3b82f6' },
  { name: 'Ocean Restoration', value: 1900, color: '#06b6d4' },
  { name: 'Cultural Heritage', value: 1200, color: '#8b5cf6' },
  { name: 'Health Impact', value: 1500, color: '#f59e0b' },
];

const recentTransactions = [
  {
    hash: '0x7f9a...3c2d',
    type: 'Carbon Credit Transfer',
    from: 'Amazon Basin DAO',
    to: 'ReFi Pool Alpha',
    amount: '$45,230',
    tokens: '120 tCO2',
    status: 'confirmed',
    time: '2 min ago',
  },
  {
    hash: '0x4e2b...8f1a',
    type: 'Biodiversity Token Mint',
    from: 'Ocean Guardian Network',
    to: 'Marine Protection Fund',
    amount: '$32,100',
    tokens: '85 BIO',
    status: 'confirmed',
    time: '5 min ago',
  },
  {
    hash: '0x9c3d...5a7e',
    type: 'Impact Dividend',
    from: 'ReFi Treasury',
    to: 'Community Health DAO',
    amount: '$18,750',
    tokens: '250 HEALTH',
    status: 'confirmed',
    time: '8 min ago',
  },
  {
    hash: '0x2a8f...6d4b',
    type: 'Cultural Credit Swap',
    from: 'Heritage Preservation',
    to: 'Knowledge Repository',
    amount: '$12,400',
    tokens: '40 CULTURE',
    status: 'pending',
    time: '12 min ago',
  },
];

const smartContracts = [
  {
    name: 'Regenerative Asset Pool',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    tvl: '$8.4M',
    transactions: '12,453',
    status: 'active',
  },
  {
    name: 'Carbon Offset Validator',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    tvl: '$5.2M',
    transactions: '8,921',
    status: 'active',
  },
  {
    name: 'Impact Dividend Distributor',
    address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
    tvl: '$3.7M',
    transactions: '6,234',
    status: 'active',
  },
];

export function BlockchainMonitor() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          Blockchain & Asset Monitor
        </h1>
        <p className="text-gray-600">
          Track tokenized regenerative assets and blockchain validation in real-time
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">24h Volume</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl text-blue-900">$1.15M</p>
          <p className="text-xs text-blue-600 mt-1">+18.2% from yesterday</p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-700">Total Assets</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl text-emerald-900">11,600</p>
          <p className="text-xs text-emerald-600 mt-1">Tokenized impact units</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700">Transactions</span>
            <ArrowUpRight className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl text-purple-900">2,079</p>
          <p className="text-xs text-purple-600 mt-1">Last 24 hours</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-700">Smart Contracts</span>
            <CheckCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl text-amber-900">28</p>
          <p className="text-xs text-amber-600 mt-1">All verified & active</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Transaction Volume (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={transactionData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#volumeGradient)"
                name="Volume (USD)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Tokenized Asset Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assetDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Hash</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">From</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">To</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Amount</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Tokens</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-blue-600">{tx.hash}</td>
                  <td className="py-3 px-4 text-sm">{tx.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{tx.from}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{tx.to}</td>
                  <td className="py-3 px-4 text-sm text-right">{tx.amount}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{tx.tokens}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        tx.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {tx.status === 'confirmed' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-500">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Contracts */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Active Smart Contracts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {smartContracts.map((contract, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm mb-2">{contract.name}</h4>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {contract.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 break-all">{contract.address}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">TVL</p>
                  <p>{contract.tvl}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transactions</p>
                  <p>{contract.transactions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
