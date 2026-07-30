import { useState } from "react";
import { TrendingUp, Users, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

interface VotingPowerProps {
  totalPower: number;
  delegatedPower: number;
  lockedTokens: number;
  availableTokens: number;
}

export function VotingPower({ totalPower, delegatedPower, lockedTokens, availableTokens }: VotingPowerProps) {
  const [showDetails, setShowDetails] = useState(false);

  const votingPowerPercentage = ((totalPower / 10000) * 100).toFixed(2);
  const delegationPercentage = ((delegatedPower / totalPower) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3>Your Voting Power</h3>
            <p className="text-sm text-gray-600">Total influence in governance</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          {showDetails ? "Hide" : "Show"} Details
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
          <p className="text-2xl text-indigo-600 mb-1">{totalPower.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Power</p>
          <p className="text-xs text-gray-500 mt-1">{votingPowerPercentage}% of DAO</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
          <p className="text-2xl text-green-600 mb-1">{availableTokens.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-xs text-gray-500 mt-1">Ready to vote</p>
        </div>
      </div>

      {/* Power Breakdown */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm mb-3">Power Breakdown</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Available Tokens</span>
                </div>
                <span className="text-sm">{availableTokens.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Locked in Proposals</span>
                </div>
                <span className="text-sm">{lockedTokens.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm">Delegated Power</span>
                </div>
                <div className="text-right">
                  <p className="text-sm">{delegatedPower.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{delegationPercentage}% delegated</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
              Delegate Power
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Stake More
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
