import { useState, useEffect } from "react";
import { Heart, TrendingUp, Clock, Zap, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConvictionVotingProps {
  proposalId: string;
  proposalTitle: string;
  currentConviction: number;
  thresholdRequired: number;
  onCommit: (conviction: number) => void;
  onClose: () => void;
}

export function ConvictionVoting({ proposalId, proposalTitle, currentConviction, thresholdRequired, onCommit, onClose }: ConvictionVotingProps) {
  const [commitmentLevel, setCommitmentLevel] = useState(50);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Conviction grows over time based on commitment
  const calculateConviction = (commitment: number, days: number) => {
    // Conviction = commitment * (1 - e^(-days/halflife))
    // This creates an exponential growth curve that asymptotically approaches the commitment level
    const halflife = 7; // days
    return commitment * (1 - Math.exp(-days / halflife));
  };

  const currentAccrual = calculateConviction(commitmentLevel, timeElapsed);
  const projectedConviction = currentConviction + currentAccrual;
  const progressToThreshold = (projectedConviction / thresholdRequired) * 100;

  // Simulate time passing
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= 30) {
            setIsSimulating(false);
            return 30;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const startSimulation = () => {
    setTimeElapsed(0);
    setIsSimulating(true);
  };

  const resetSimulation = () => {
    setTimeElapsed(0);
    setIsSimulating(false);
  };

  // Generate projection data
  const projectionData = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    conviction: calculateConviction(commitmentLevel, i),
  }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              <h2>Conviction Voting</h2>
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
          <p className="text-rose-100 text-sm">
            Your conviction grows over time - stake your tokens, not just your vote
          </p>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Proposal Context */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Committing to:</p>
            <p className="font-medium">{proposalTitle}</p>
          </div>

          {/* What is Conviction Voting */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">How Conviction Voting Works</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Instead of one-time votes, you <strong>continuously stake</strong> tokens on proposals you support. 
                  Your conviction grows exponentially over time, rewarding long-term commitment over short-term manipulation.
                </p>
                <p className="text-xs text-blue-700">
                  When total conviction reaches the threshold, the proposal passes automatically—no waiting for vote deadlines.
                </p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-6 p-4 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Total Conviction</p>
                <p className="text-3xl text-rose-600">{currentConviction.toFixed(0)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Threshold Required</p>
                <p className="text-3xl text-gray-700">{thresholdRequired.toFixed(0)}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentConviction / thresholdRequired) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {((currentConviction / thresholdRequired) * 100).toFixed(1)}% of threshold reached
            </p>
          </div>

          {/* Commitment Level Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Your Commitment Level</label>
              <span className="text-sm text-gray-600">
                {commitmentLevel} tokens
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="1000"
              value={commitmentLevel}
              onChange={(e) => {
                setCommitmentLevel(Number(e.target.value));
                resetSimulation();
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />

            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>Low</span>
              <span className="text-lg font-medium text-rose-600">{commitmentLevel}</span>
              <span>High</span>
            </div>
          </div>

          {/* Time Simulation */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">Conviction Accrual Over Time</h4>
              {!isSimulating ? (
                <button
                  onClick={startSimulation}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm flex items-center gap-1"
                >
                  <Zap className="w-4 h-4" />
                  Simulate
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Conviction Growth Visualization */}
            <div className="mb-4 relative h-32 bg-gradient-to-b from-rose-50 to-transparent rounded-lg p-4">
              <svg className="w-full h-full">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={`${100 - y}%`}
                    x2="100%"
                    y2={`${100 - y}%`}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Conviction curve */}
                <motion.path
                  d={
                    projectionData
                      .map((point, i) => {
                        const x = (i / 30) * 100;
                        const y = 100 - (point.conviction / commitmentLevel) * 100;
                        return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                      })
                      .join(' ')
                  }
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isSimulating ? timeElapsed / 30 : 1 }}
                  transition={{ duration: 0.1 }}
                />
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Days</p>
                </div>
                <p className="text-xl">{timeElapsed}</p>
              </div>
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Conviction</p>
                <p className="text-xl text-rose-600">{currentAccrual.toFixed(1)}</p>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">% of Max</p>
                <p className="text-xl text-pink-600">
                  {((currentAccrual / commitmentLevel) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Projected Impact */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-2">Your Projected Impact</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>After 7 days:</span>
                    <span className="font-medium">+{calculateConviction(commitmentLevel, 7).toFixed(1)} conviction</span>
                  </div>
                  <div className="flex justify-between">
                    <span>After 14 days:</span>
                    <span className="font-medium">+{calculateConviction(commitmentLevel, 14).toFixed(1)} conviction</span>
                  </div>
                  <div className="flex justify-between">
                    <span>After 30 days:</span>
                    <span className="font-medium">+{calculateConviction(commitmentLevel, 30).toFixed(1)} conviction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-sm font-medium mb-1">Sybil Resistant</p>
              <p className="text-xs text-gray-600">Time requirement prevents fake accounts</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="text-sm font-medium mb-1">No Deadlines</p>
              <p className="text-xs text-gray-600">Passes when threshold reached</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-sm font-medium mb-1">Change Anytime</p>
              <p className="text-xs text-gray-600">Move conviction between proposals</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">💎</div>
              <p className="text-sm font-medium mb-1">Long-term Focus</p>
              <p className="text-xs text-gray-600">Rewards patient commitment</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Your Commitment</p>
              <p className="text-xl font-medium text-rose-600">{commitmentLevel} tokens</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Max Conviction</p>
              <p className="text-xl font-medium">{commitmentLevel.toFixed(0)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onCommit(commitmentLevel);
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all"
            >
              Commit {commitmentLevel} Tokens
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
