import { useState } from "react";
import { Droplet, Users, ArrowRight, TrendingUp, Info, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Delegate {
  id: string;
  name: string;
  address: string;
  expertise: string[];
  delegatedPower: number;
  votingRecord: number;
}

interface DelegationChain {
  depth: number;
  delegates: Array<{ name: string; power: number }>;
}

interface LiquidDemocracyProps {
  proposalId: string;
  proposalTitle: string;
  proposalCategory: string;
  onDelegate: (delegateId: string, mode: "full" | "conditional") => void;
  onClose: () => void;
}

export function LiquidDemocracy({ proposalId, proposalTitle, proposalCategory, onDelegate, onClose }: LiquidDemocracyProps) {
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null);
  const [delegationMode, setDelegationMode] = useState<"full" | "conditional">("conditional");
  const [conditions, setConditions] = useState({
    categoryMatch: true,
    ethicsThreshold: 85,
    autoRevoke: true,
  });

  const delegates: Delegate[] = [
    {
      id: "1",
      name: "Sarah Chen",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
      expertise: ["Technical", "Privacy", "Security"],
      delegatedPower: 5000,
      votingRecord: 98,
    },
    {
      id: "2",
      name: "Marcus Williams",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      expertise: ["Governance", "Economics"],
      delegatedPower: 3800,
      votingRecord: 95,
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      expertise: ["Legal", "Ethics", "Compliance"],
      delegatedPower: 5200,
      votingRecord: 99,
    },
  ];

  const delegationChain: DelegationChain = {
    depth: 3,
    delegates: [
      { name: "You", power: 100 },
      { name: "Sarah Chen", power: 250 },
      { name: "Vitalik B.", power: 1500 },
      { name: "Final Vote", power: 1850 },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplet className="w-6 h-6" />
              <h2>Liquid Democracy</h2>
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
            Vote directly or delegate fluidly - the best of direct and representative democracy
          </p>
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Proposal Context */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Delegating for:</p>
            <p className="font-medium mb-1">{proposalTitle}</p>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
              {proposalCategory}
            </span>
          </div>

          {/* What is Liquid Democracy */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">How Liquid Democracy Works</h4>
                <p className="text-sm text-blue-800 mb-2">
                  You can <strong>vote directly</strong> on any issue, or <strong>delegate</strong> your vote to an expert. 
                  Delegates can further delegate, creating chains of trust. You can override or revoke delegation anytime.
                </p>
                <p className="text-xs text-blue-700">
                  Example: You delegate to Sarah → Sarah delegates to Vitalik → Your vote counts with Vitalik's wisdom, 
                  but you can take it back instantly if you disagree.
                </p>
              </div>
            </div>
          </div>

          {/* Delegation Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Delegation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDelegationMode("conditional")}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  delegationMode === "conditional"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-cyan-600" />
                  <h4 className="font-medium">Conditional</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Delegate with rules. Auto-revokes if conditions aren't met.
                </p>
              </button>
              <button
                onClick={() => setDelegationMode("full")}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  delegationMode === "full"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-cyan-600" />
                  <h4 className="font-medium">Full Trust</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Delegate completely. Trust their judgment on all matters.
                </p>
              </button>
            </div>
          </div>

          {/* Conditional Settings */}
          {delegationMode === "conditional" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 border border-cyan-200 rounded-lg bg-cyan-50"
            >
              <h4 className="text-sm font-medium mb-3">Delegation Conditions</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Category Match</p>
                    <p className="text-xs text-gray-600">Only delegate for {proposalCategory} proposals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={conditions.categoryMatch}
                    onChange={(e) => setConditions({ ...conditions, categoryMatch: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                </label>

                <div className="p-3 bg-white rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">Ethics Threshold</p>
                      <p className="text-xs text-gray-600">Only if proposal scores above threshold</p>
                    </div>
                    <span className="text-sm font-medium text-cyan-600">{conditions.ethicsThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={conditions.ethicsThreshold}
                    onChange={(e) => setConditions({ ...conditions, ethicsThreshold: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Auto-Revoke</p>
                    <p className="text-xs text-gray-600">Take back vote if delegate disagrees with your values</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={conditions.autoRevoke}
                    onChange={(e) => setConditions({ ...conditions, autoRevoke: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Select Delegate */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select Your Delegate</label>
            <div className="space-y-3">
              {delegates.map((delegate) => {
                const expertiseMatch = delegate.expertise.some((e) => 
                  e.toLowerCase().includes(proposalCategory.toLowerCase())
                );
                
                return (
                  <button
                    key={delegate.id}
                    onClick={() => setSelectedDelegate(delegate.id)}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      selectedDelegate === delegate.id
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium mb-1">{delegate.name}</h4>
                        <p className="text-xs text-gray-500 font-mono">
                          {delegate.address.slice(0, 10)}...{delegate.address.slice(-8)}
                        </p>
                      </div>
                      {expertiseMatch && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          ✓ Expertise Match
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {delegate.expertise.map((exp) => (
                        <span
                          key={exp}
                          className={`px-2 py-1 rounded text-xs ${
                            exp.toLowerCase().includes(proposalCategory.toLowerCase())
                              ? "bg-cyan-100 text-cyan-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {exp}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-600">Voting Record:</span>
                        <span className="ml-2 font-medium text-green-600">{delegate.votingRecord}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Delegated Power:</span>
                        <span className="ml-2 font-medium">{delegate.delegatedPower.toLocaleString()}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delegation Chain Visualization */}
          <div className="mb-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
            <h4 className="text-sm font-medium mb-4">How Your Vote Flows</h4>
            <div className="flex items-center justify-between">
              {delegationChain.delegates.map((delegate, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white mb-2 shadow-lg">
                      <span className="text-xs">{delegate.power}</span>
                    </div>
                    <p className="text-xs font-medium">{delegate.name}</p>
                  </div>
                  {index < delegationChain.delegates.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-cyan-600 mx-2" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4 text-center">
              Your vote amplifies through the delegation chain, combining with others who trust the same path
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm font-medium mb-1">Instant Override</p>
              <p className="text-xs text-gray-600">Vote directly anytime to override delegation</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🔗</div>
              <p className="text-sm font-medium mb-1">Transitive Trust</p>
              <p className="text-xs text-gray-600">Your delegate can delegate to their expert</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm font-medium mb-1">Topic-Specific</p>
              <p className="text-xs text-gray-600">Different delegates for different topics</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-sm font-medium mb-1">Always Revocable</p>
              <p className="text-xs text-gray-600">Take back your vote at any moment</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Your voting power: <strong>100 votes</strong></span>
            </div>
            {selectedDelegate && (
              <div className="text-sm text-cyan-600">
                Will flow through {delegationChain.depth} delegation levels
              </div>
            )}
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
                if (selectedDelegate) {
                  onDelegate(selectedDelegate, delegationMode);
                  onClose();
                }
              }}
              disabled={!selectedDelegate}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {delegationMode === "conditional" ? "Set Conditional Delegation" : "Delegate Fully"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
