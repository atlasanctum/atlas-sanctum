import { DollarSign, TrendingUp, TrendingDown, Wallet, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

export function TreasuryDashboard() {
  const treasuryData = {
    totalValue: 12500000,
    monthlyChange: 8.5,
    assets: [
      { name: "ETH", value: 5000000, percentage: 40, color: "#627EEA" },
      { name: "USDC", value: 3750000, percentage: 30, color: "#2775CA" },
      { name: "DAI", value: 2500000, percentage: 20, color: "#F5AC37" },
      { name: "Other", value: 1250000, percentage: 10, color: "#8B5CF6" },
    ],
    recentTransactions: [
      { id: "1", type: "incoming", description: "Protocol Revenue", amount: 125000, token: "USDC", date: "2 hours ago" },
      { id: "2", type: "outgoing", description: "Grant Payout - DeFi Research", amount: 50000, token: "DAI", date: "5 hours ago" },
      { id: "3", type: "incoming", description: "Staking Rewards", amount: 75000, token: "ETH", date: "1 day ago" },
      { id: "4", type: "outgoing", description: "Infrastructure Costs", amount: 25000, token: "USDC", date: "2 days ago" },
      { id: "5", type: "incoming", description: "Partnership Revenue", amount: 200000, token: "USDC", date: "3 days ago" },
    ],
  };

  const historicalData = [
    { month: "Jan", value: 10500000 },
    { month: "Feb", value: 10800000 },
    { month: "Mar", value: 11200000 },
    { month: "Apr", value: 11000000 },
    { month: "May", value: 11800000 },
    { month: "Jun", value: 12500000 },
  ];

  const allocationData = [
    { name: "Operations", value: 3000000, color: "#6366F1" },
    { name: "Grants", value: 2500000, color: "#8B5CF6" },
    { name: "Development", value: 2000000, color: "#EC4899" },
    { name: "Marketing", value: 1500000, color: "#F59E0B" },
    { name: "Reserve", value: 3500000, color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2">DAO Treasury</h2>
        <p className="text-gray-600">Transparent management of community funds and resources</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <span className={`text-sm flex items-center gap-1 ${treasuryData.monthlyChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {treasuryData.monthlyChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(treasuryData.monthlyChange)}%
            </span>
          </div>
          <p className="text-2xl mb-1">${(treasuryData.totalValue / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-gray-600">Total Treasury Value</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-green-600">+24%</span>
          </div>
          <p className="text-2xl mb-1">$475K</p>
          <p className="text-sm text-gray-600">Monthly Income</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm text-red-600">-12%</span>
          </div>
          <p className="text-2xl mb-1">$325K</p>
          <p className="text-sm text-gray-600">Monthly Expenses</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">4 assets</span>
          </div>
          <p className="text-2xl mb-1">{treasuryData.assets.length}</p>
          <p className="text-sm text-gray-600">Asset Types</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treasury Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Treasury Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, "Value"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4">Asset Allocation</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={treasuryData.assets}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {treasuryData.assets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {treasuryData.assets.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-sm">{asset.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm">${(asset.value / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500">{asset.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Budget Allocation</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-700">View Details</button>
        </div>
        <div className="space-y-3">
          {allocationData.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm">${(item.value / 1000000).toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${(item.value / treasuryData.totalValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Transactions</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        <div className="space-y-3">
          {treasuryData.recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tx.type === "incoming" ? "bg-green-100" : "bg-red-100"}`}>
                  {tx.type === "incoming" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm ${tx.type === "incoming" ? "text-green-600" : "text-red-600"}`}>
                  {tx.type === "incoming" ? "+" : "-"}${(tx.amount / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-500">{tx.token}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
