import { useState } from "react";
import { Play, RotateCcw, AlertTriangle, TrendingUp, TrendingDown, Users, DollarSign, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface SimulationResult {
  metric: string;
  current: number;
  projected: number;
  change: number;
  impact: "positive" | "negative" | "neutral";
}

interface ProposalSimulatorProps {
  proposalId: string;
  proposalTitle: string;
  proposalCategory: string;
  onClose: () => void;
}

export function ProposalSimulator({ proposalId, proposalTitle, proposalCategory, onClose }: ProposalSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState<"1month" | "3months" | "6months" | "1year">("3months");

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 2000);
  };

  const resetSimulation = () => {
    setSimulationComplete(false);
  };

  // Simulated data based on proposal category
  const getSimulationResults = (): SimulationResult[] => {
    if (proposalCategory === "technical") {
      return [
        { metric: "User Adoption", current: 5432, projected: 7891, change: 45.3, impact: "positive" },
        { metric: "Transaction Cost", current: 12.5, projected: 3.8, change: -69.6, impact: "positive" },
        { metric: "Security Score", current: 87, projected: 96, change: 10.3, impact: "positive" },
        { metric: "Development Time", current: 0, projected: 120, change: 100, impact: "negative" },
      ];
    } else if (proposalCategory === "funding") {
      return [
        { metric: "Treasury Balance", current: 12500000, projected: 11875000, change: -5.0, impact: "negative" },
        { metric: "Active Contributors", current: 234, projected: 412, change: 76.1, impact: "positive" },
        { metric: "Retention Rate", current: 68, projected: 89, change: 30.9, impact: "positive" },
        { metric: "Proposal Quality", current: 7.2, projected: 8.9, change: 23.6, impact: "positive" },
      ];
    } else {
      return [
        { metric: "Participation Rate", current: 68, projected: 82, change: 20.6, impact: "positive" },
        { metric: "Proposal Throughput", current: 23, projected: 34, change: 47.8, impact: "positive" },
        { metric: "Voter Satisfaction", current: 7.5, projected: 8.7, change: 16.0, impact: "positive" },
        { metric: "Implementation Cost", current: 0, projected: 75000, change: 100, impact: "negative" },
      ];
    }
  };

  const results = getSimulationResults();

  // Timeline projection data
  const timelineData = [
    { month: "Now", value: 100, projected: 100 },
    { month: "+1M", value: 100, projected: 108 },
    { month: "+2M", value: 100, projected: 121 },
    { month: "+3M", value: 100, projected: 136 },
    { month: "+4M", value: 100, projected: 142 },
    { month: "+5M", value: 100, projected: 148 },
    { month: "+6M", value: 100, projected: 153 },
  ];

  const networkEffectsData = [
    { users: 100, value: 100 },
    { users: 500, value: 180 },
    { users: 1000, value: 280 },
    { users: 2000, value: 420 },
    { users: 5000, value: 720 },
    { users: 10000, value: 1200 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              <h2>Impact Simulation Engine</h2>
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
          <p className="text-cyan-100 text-sm">
            AI-powered Monte Carlo simulation of proposal outcomes
          </p>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Proposal Context */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Simulating:</p>
            <p className="font-medium mb-2">{proposalTitle}</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                {proposalCategory}
              </span>
              <span className="text-xs text-gray-500">10,000 scenario iterations</span>
            </div>
          </div>

          {/* Time Horizon Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Simulation Time Horizon</label>
            <div className="grid grid-cols-4 gap-2">
              {(["1month", "3months", "6months", "1year"] as const).map((horizon) => (
                <button
                  key={horizon}
                  onClick={() => setTimeHorizon(horizon)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    timeHorizon === horizon
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {horizon === "1month" && "1 Month"}
                  {horizon === "3months" && "3 Months"}
                  {horizon === "6months" && "6 Months"}
                  {horizon === "1year" && "1 Year"}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Control */}
          {!simulationComplete ? (
            <div className="mb-6">
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Impact Simulation
                  </>
                )}
              </button>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">How Simulation Works</h4>
                    <p className="text-sm text-blue-800">
                      Our AI runs 10,000+ Monte Carlo simulations across multiple scenarios, considering:
                      network effects, user behavior patterns, economic variables, and historical DAO data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Reset Button */}
                <button
                  onClick={resetSimulation}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Run New Simulation
                </button>

                {/* Overall Impact Score */}
                <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Predicted Overall Impact</p>
                      <p className="text-4xl text-cyan-600">+28.5%</p>
                    </div>
                    <div className="p-4 bg-white rounded-full">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Positive net impact expected across all key metrics with 89% confidence
                  </p>
                </div>

                {/* Key Metrics Impact */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Projected Impact on Key Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.metric}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">{result.metric}</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl">{result.current.toLocaleString()}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-xl text-cyan-600">{result.projected.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                            result.impact === "positive" ? "bg-green-100 text-green-700" :
                            result.impact === "negative" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {result.impact === "positive" && <TrendingUp className="w-3 h-3" />}
                            {result.impact === "negative" && <TrendingDown className="w-3 h-3" />}
                            <span className="text-xs font-medium">
                              {result.change > 0 ? "+" : ""}{result.change.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              result.impact === "positive" ? "bg-green-500" :
                              result.impact === "negative" ? "bg-red-500" :
                              "bg-gray-500"
                            }`}
                            style={{ width: `${Math.abs(result.change)}%` }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Timeline Projection */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium mb-4">Impact Over Time</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Performance"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#E5E7EB"
                        strokeWidth={2}
                        fill="#E5E7EB"
                        name="Current"
                      />
                      <Area
                        type="monotone"
                        dataKey="projected"
                        stroke="#0891B2"
                        strokeWidth={2}
                        fill="url(#colorProjected)"
                        name="With Proposal"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Network Effects */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-cyan-600" />
                    <h4 className="text-sm font-medium">Network Effects Analysis</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={networkEffectsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="users"
                        stroke="#9CA3AF"
                        tickFormatter={(value) => `${value / 1000}K`}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Value"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0891B2"
                        strokeWidth={3}
                        dot={{ fill: "#0891B2", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-600 mt-2">
                    Value increases exponentially with user adoption (Metcalfe's Law)
                  </p>
                </div>

                {/* Risk Assessment */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-900 mb-2">Risk Factors</h4>
                      <ul className="space-y-1 text-sm text-amber-800">
                        <li>• Implementation complexity may cause 2-4 week delays</li>
                        <li>• Requires 15% increase in operational budget</li>
                        <li>• User adoption dependent on successful marketing campaign</li>
                        <li>• Potential for unexpected technical challenges (18% probability)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Confidence Intervals */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Best Case</p>
                    <p className="text-2xl text-green-600">+42%</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Expected</p>
                    <p className="text-2xl text-blue-600">+28.5%</p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Worst Case</p>
                    <p className="text-2xl text-orange-600">+12%</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Simulation results are probabilistic projections based on historical data and AI modeling. 
            Actual outcomes may vary. Use as one input in your decision-making process.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
