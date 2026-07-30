import { useState } from "react";
import { TrendingUp, AlertCircle, Info, Zap, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

interface QuadraticVotingProps {
  proposalId: string;
  proposalTitle: string;
  availableCredits: number;
  onVote: (credits: number, stance: "for" | "against") => void;
  onClose: () => void;
}

export function QuadraticVoting({ proposalId, proposalTitle, availableCredits, onVote, onClose }: QuadraticVotingProps) {
  const [credits, setCredits] = useState(1);
  const [stance, setStance] = useState<"for" | "against">("for");

  // Quadratic formula: vote power = sqrt(credits)
  const votePower = Math.sqrt(credits);
  const costPerVote = credits;
  const marginalCost = Math.sqrt(credits + 1) - votePower;

  const examples = [
    { credits: 1, votes: 1 },
    { credits: 4, votes: 2 },
    { credits: 9, votes: 3 },
    { credits: 16, votes: 4 },
    { credits: 25, votes: 5 },
    { credits: 100, votes: 10 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              <h2>Quadratic Voting</h2>
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
          <p className="text-purple-100 text-sm">
            Express your conviction strength democratically
          </p>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Proposal Title */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Voting on:</p>
            <p className="font-medium">{proposalTitle}</p>
          </div>

          {/* What is Quadratic Voting */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm text-blue-900 mb-2">How Quadratic Voting Works</h4>
                <p className="text-sm text-blue-800 mb-2">
                  The cost of votes increases quadratically: your Nth vote costs N² credits. This allows you to express 
                  <strong> intensity of preference</strong> while preventing plutocracy.
                </p>
                <p className="text-xs text-blue-700">
                  Formula: Vote Power = √(Credits Spent)
                </p>
              </div>
            </div>
          </div>

          {/* Stance Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Your Stance</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStance("for")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  stance === "for"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">✅</div>
                <p className="font-medium">Support</p>
                <p className="text-xs text-gray-600">Vote FOR this proposal</p>
              </button>
              <button
                onClick={() => setStance("against")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  stance === "against"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">❌</div>
                <p className="font-medium">Oppose</p>
                <p className="text-xs text-gray-600">Vote AGAINST this proposal</p>
              </button>
            </div>
          </div>

          {/* Credits Allocation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Credits to Allocate</label>
              <span className="text-sm text-gray-600">
                Available: {availableCredits} credits
              </span>
            </div>

            <input
              type="range"
              min="1"
              max={Math.min(availableCredits, 100)}
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />

            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>1</span>
              <span className="text-lg font-medium text-purple-600">{credits}</span>
              <span>{Math.min(availableCredits, 100)}</span>
            </div>
          </div>

          {/* Vote Power Calculation */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Credits Spent</p>
              <p className="text-2xl text-purple-600">{credits}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Vote Power</p>
              <p className="text-2xl text-indigo-600">{votePower.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Next Vote Cost</p>
              <p className="text-2xl text-pink-600">+{marginalCost.toFixed(2)}</p>
            </div>
          </div>

          {/* Visual Cost Curve */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm">Cost-to-Vote Curve</h4>
            </div>
            <div className="space-y-2">
              {examples.map((example) => (
                <div key={example.credits} className="flex items-center gap-2">
                  <div className="w-16 text-sm text-gray-600">{example.votes} vote{example.votes > 1 ? 's' : ''}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        credits >= example.credits ? "bg-purple-600" : "bg-gray-300"
                      }`}
                      style={{ width: `${(example.credits / 100) * 100}%` }}
                    />
                  </div>
                  <div className="w-20 text-sm text-right text-gray-600">{example.credits} credits</div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800">
                  Quadratic voting prevents wealthy actors from dominating decisions. The more votes you want, 
                  the exponentially more expensive they become. This ensures equal voice for all members.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Your Vote Power</p>
              <p className="text-xl font-medium text-purple-600">
                {votePower.toFixed(2)} votes {stance === "for" ? "FOR" : "AGAINST"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Credits Remaining</p>
              <p className="text-xl font-medium">{availableCredits - credits}</p>
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
                onVote(credits, stance);
                onClose();
              }}
              disabled={credits > availableCredits}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cast {votePower.toFixed(2)} Votes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
