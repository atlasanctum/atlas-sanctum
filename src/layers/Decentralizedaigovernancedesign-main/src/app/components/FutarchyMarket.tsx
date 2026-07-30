import { useState } from "react";
import { TrendingUp, DollarSign, BarChart3, Info, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FutarchyMarketProps {
  proposalId: string;
  proposalTitle: string;
  onClose: () => void;
}

interface Market {
  id: string;
  condition: "pass" | "fail";
  currentPrice: number;
  volume: number;
  liquidity: number;
}

export function FutarchyMarket({ proposalId, proposalTitle, onClose }: FutarchyMarketProps) {
  const [selectedMarket, setSelectedMarket] = useState<"pass" | "fail">("pass");
  const [betAmount, setBetAmount] = useState(100);
  const [betDirection, setBetDirection] = useState<"up" | "down">("up");

  // Vote on values, bet on beliefs
  const markets: Market[] = [
    {
      id: "pass",
      condition: "pass",
      currentPrice: 0.67, // Price represents probability
      volume: 450000,
      liquidity: 1200000,
    },
    {
      id: "fail",
      condition: "fail",
      currentPrice: 0.33,
      volume: 280000,
      liquidity: 800000,
    },
  ];

  // Historical price data
  const priceHistory = [
    { time: "7d ago", pass: 0.45, fail: 0.55 },
    { time: "6d ago", pass: 0.48, fail: 0.52 },
    { time: "5d ago", pass: 0.52, fail: 0.48 },
    { time: "4d ago", pass: 0.55, fail: 0.45 },
    { time: "3d ago", pass: 0.58, fail: 0.42 },
    { time: "2d ago", pass: 0.62, fail: 0.38 },
    { time: "1d ago", pass: 0.65, fail: 0.35 },
    { time: "Now", pass: 0.67, fail: 0.33 },
  ];

  const currentMarket = markets.find((m) => m.condition === selectedMarket)!;
  const impliedProbability = currentMarket.currentPrice * 100;
  const potentialReturn = betDirection === "up" 
    ? (betAmount / currentMarket.currentPrice) - betAmount
    : betAmount * currentMarket.currentPrice;

  // KPI prediction for if proposal passes
  const kpiMetrics = [
    { name: "DAO Revenue", current: 125000, predicted: 187000, change: 49.6 },
    { name: "User Growth", current: 5432, predicted: 8234, change: 51.6 },
    { name: "Governance Score", current: 7.2, predicted: 8.9, change: 23.6 },
    { name: "Treasury Health", current: 94, predicted: 97, change: 3.2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <h2>Futarchy Prediction Market</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-emerald-100 text-sm">
            Vote on values, bet on beliefs - let markets determine truth
          </p>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Proposal Context */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Prediction Market for:</p>
            <p className="font-medium">{proposalTitle}</p>
          </div>

          {/* What is Futarchy */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">How Futarchy Works</h4>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Vote on values, bet on beliefs.</strong> The DAO votes on what metrics to optimize (values), 
                  then prediction markets determine which proposals will best achieve those goals (beliefs).
                </p>
                <p className="text-xs text-blue-700">
                  If markets predict this proposal increases DAO revenue by 50%, and we value revenue, 
                  the proposal should pass—regardless of politics.
                </p>
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {markets.map((market) => (
              <button
                key={market.id}
                onClick={() => setSelectedMarket(market.condition)}
                className={`p-6 border-2 rounded-xl transition-all text-left ${
                  selectedMarket === market.condition
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">If Proposal {market.condition === "pass" ? "Passes" : "Fails"}</p>
                    <p className="text-3xl font-medium">${market.currentPrice.toFixed(2)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-sm ${
                    market.condition === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {(market.currentPrice * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume</span>
                    <span>${(market.volume / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liquidity</span>
                    <span>${(market.liquidity / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Price Chart */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium mb-4">Market Price History</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Tooltip
                  formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Probability"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Line
                  type="monotone"
                  dataKey="pass"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 3 }}
                  name="Pass"
                />
                <Line
                  type="monotone"
                  dataKey="fail"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: "#EF4444", r: 3 }}
                  name="Fail"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Pass Market</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Fail Market</span>
              </div>
            </div>
          </div>

          {/* Predicted KPIs if Proposal Passes */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-4">Market-Predicted Impact (If Passes)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kpiMetrics.map((metric) => (
                <div key={metric.name} className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl">{metric.current.toLocaleString()}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-xl text-emerald-600">{metric.predicted.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(metric.change, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-emerald-600">+{metric.change.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Place Bet Interface */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
            <h4 className="text-sm font-medium mb-4">Place Your Bet</h4>
            
            {/* Bet Direction */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Bet Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBetDirection("up")}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    betDirection === "up"
                      ? "bg-green-500 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-sm">Buy (Price goes up)</p>
                </button>
                <button
                  onClick={() => setBetDirection("down")}
                  className={`px-4 py-3 rounded-lg transition-all ${
                    betDirection === "down"
                      ? "bg-red-500 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 rotate-180" />
                  <p className="text-sm">Sell (Price goes down)</p>
                </button>
              </div>
            </div>

            {/* Bet Amount */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Amount (USDC)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="1"
                max="10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Min: $1</span>
                <span>Max: $10,000</span>
              </div>
            </div>

            {/* Bet Summary */}
            <div className="p-4 bg-white rounded-lg space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Market</span>
                <span>Proposal {selectedMarket === "pass" ? "Passes" : "Fails"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Price</span>
                <span>${currentMarket.currentPrice.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Implied Probability</span>
                <span>{impliedProbability.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Bet</span>
                <span className="font-medium">${betAmount}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between font-medium">
                  <span>Potential Return</span>
                  <span className="text-emerald-600">+${potentialReturn.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" />
              Place Bet: ${betAmount}
            </button>
          </div>

          {/* Market Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600">Traders</p>
              </div>
              <p className="text-2xl">342</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600">Total Volume</p>
              </div>
              <p className="text-2xl">$730K</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600">Closes In</p>
              </div>
              <p className="text-2xl">4d 12h</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Prediction markets aggregate distributed knowledge. Markets resolve based on actual DAO metrics 
            measured 30 days after proposal implementation. All bets are final and non-refundable.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
