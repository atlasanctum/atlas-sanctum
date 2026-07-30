import { useState } from "react";
import { Eye, Zap, TrendingUp, Clock, Award, Info } from "lucide-react";
import { motion } from "framer-motion";

interface AttentionMetrics {
  views: number;
  avgTimeSpent: number;
  engagementScore: number;
  uniqueViewers: number;
}

interface HolographicConsensusProps {
  proposalId: string;
  proposalTitle: string;
  attentionMetrics: AttentionMetrics;
  onClose: () => void;
}

export function HolographicConsensus({ proposalId, proposalTitle, attentionMetrics, onClose }: HolographicConsensusProps) {
  const [myAttention, setMyAttention] = useState(0);
  const [isWatching, setIsWatching] = useState(false);

  // Holographic consensus: proposals that attract genuine attention rise to the top
  // The longer and more people pay attention, the higher the "priority score"
  const calculatePriorityScore = (metrics: AttentionMetrics) => {
    const viewWeight = Math.log(metrics.views + 1) * 10;
    const timeWeight = Math.min(metrics.avgTimeSpent / 60, 10) * 15; // Cap at 10 minutes
    const engagementWeight = metrics.engagementScore * 20;
    const uniqueWeight = Math.log(metrics.uniqueViewers + 1) * 12;
    
    return Math.min(viewWeight + timeWeight + engagementWeight + uniqueWeight, 100);
  };

  const priorityScore = calculatePriorityScore(attentionMetrics);
  const attentionThreshold = 75; // Score needed to be prioritized
  const progressToThreshold = (priorityScore / attentionThreshold) * 100;

  // Simulate attention tracking
  const startWatching = () => {
    setIsWatching(true);
    const interval = setInterval(() => {
      setMyAttention((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsWatching(false);
          return 100;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const attentionBrackets = [
    { min: 0, max: 25, label: "Low Priority", color: "text-gray-600 bg-gray-100" },
    { min: 25, max: 50, label: "Normal", color: "text-blue-600 bg-blue-100" },
    { min: 50, max: 75, label: "Rising", color: "text-amber-600 bg-amber-100" },
    { min: 75, max: 100, label: "High Priority", color: "text-green-600 bg-green-100" },
  ];

  const currentBracket = attentionBrackets.find(
    (b) => priorityScore >= b.min && priorityScore < b.max
  ) || attentionBrackets[attentionBrackets.length - 1];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6" />
              <h2>Holographic Consensus</h2>
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
          <p className="text-amber-100 text-sm">
            Scarce attention determines priority - the DAO focuses on what matters most
          </p>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Proposal Context */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Analyzing attention for:</p>
            <p className="font-medium">{proposalTitle}</p>
          </div>

          {/* What is Holographic Consensus */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">How Holographic Consensus Works</h4>
                <p className="text-sm text-blue-800 mb-2">
                  In large DAOs, voters can't pay attention to every proposal. <strong>Holographic consensus</strong> uses 
                  collective attention as a signal: proposals that genuinely matter attract sustained focus and rise to priority.
                </p>
                <p className="text-xs text-blue-700">
                  Instead of voting on everything, the DAO allocates its scarce attention wisely. High-priority proposals 
                  get easier quorum requirements and faster resolution.
                </p>
              </div>
            </div>
          </div>

          {/* Current Priority Score */}
          <div className="mb-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Priority Score</p>
                <p className="text-4xl text-amber-600">{priorityScore.toFixed(0)}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentBracket.color}`}>
                  {currentBracket.label}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress to High Priority</span>
                <span className="font-medium">{progressToThreshold.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToThreshold, 100)}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-gray-600">
              {priorityScore >= attentionThreshold
                ? "✓ This proposal has high priority - easier quorum and faster voting"
                : `${(attentionThreshold - priorityScore).toFixed(0)} points needed for high priority status`}
            </p>
          </div>

          {/* Attention Metrics Breakdown */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Attention Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
                <p className="text-2xl font-medium">{attentionMetrics.views}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Impact: {(Math.log(attentionMetrics.views + 1) * 10).toFixed(1)} pts
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-gray-600">Avg Time Spent</p>
                </div>
                <p className="text-2xl font-medium">{attentionMetrics.avgTimeSpent}s</p>
                <p className="text-xs text-gray-500 mt-1">
                  Impact: {(Math.min(attentionMetrics.avgTimeSpent / 60, 10) * 15).toFixed(1)} pts
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-gray-600">Engagement Score</p>
                </div>
                <p className="text-2xl font-medium">{(attentionMetrics.engagementScore * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  Impact: {(attentionMetrics.engagementScore * 20).toFixed(1)} pts
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-gray-600">Unique Viewers</p>
                </div>
                <p className="text-2xl font-medium">{attentionMetrics.uniqueViewers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Impact: {(Math.log(attentionMetrics.uniqueViewers + 1) * 12).toFixed(1)} pts
                </p>
              </div>
            </div>
          </div>

          {/* Priority Benefits */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Benefits of High Priority Status</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Lower Quorum Required</p>
                  <p className="text-xs text-green-700">
                    High-attention proposals need only 50% quorum instead of 75%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Faster Resolution</p>
                  <p className="text-xs text-blue-700">
                    Can close voting early if clear consensus is reached
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Increased Visibility</p>
                  <p className="text-xs text-purple-700">
                    Featured in priority feed and notification alerts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contribute Your Attention */}
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
            <h4 className="text-sm font-medium mb-3">Contribute Your Attention</h4>
            
            {!isWatching && myAttention === 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  By giving this proposal your genuine attention, you help signal its importance to the DAO. 
                  Time spent reading and engaging increases its priority score.
                </p>
                <button
                  onClick={startWatching}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Start Giving Attention
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Your Attention Contribution</span>
                    <span className="text-sm font-medium">{myAttention}s</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${myAttention}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                
                {isWatching ? (
                  <div className="flex items-center justify-center gap-2 text-amber-600">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Eye className="w-5 h-5" />
                    </motion.div>
                    <span className="text-sm">Tracking your attention...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-medium">Thank you for your attention!</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Your {myAttention} seconds helped increase this proposal's priority score
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* How It Prevents Spam */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-1">Anti-Spam Mechanism</h4>
                <p className="text-sm text-green-800">
                  Low-quality proposals naturally receive little attention and remain low-priority with high quorum requirements. 
                  Attention is scarce and genuine - impossible to fake at scale. This creates a natural filter where 
                  only proposals that genuinely matter to the community rise to the top.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Priority Score: <strong className="text-amber-600">{priorityScore.toFixed(0)}/100</strong>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
