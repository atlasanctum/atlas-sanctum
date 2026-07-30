import { useState } from "react";
import { Search, UserCheck, UserX, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

interface Delegate {
  id: string;
  address: string;
  name: string;
  votingPower: number;
  delegators: number;
  participationRate: number;
  expertiseAreas: string[];
  reputationScore: number;
}

interface DelegationManagerProps {
  onClose: () => void;
  currentDelegation?: string;
  onDelegate: (delegateId: string) => void;
}

export function DelegationManager({ onClose, currentDelegation, onDelegate }: DelegationManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(currentDelegation || null);

  const delegates: Delegate[] = [
    {
      id: "1",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
      name: "Sarah Chen",
      votingPower: 45000,
      delegators: 234,
      participationRate: 98,
      expertiseAreas: ["Technical", "Ethics", "Privacy"],
      reputationScore: 97,
    },
    {
      id: "2",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      name: "Marcus Williams",
      votingPower: 38000,
      delegators: 189,
      participationRate: 95,
      expertiseAreas: ["Governance", "Economics", "Strategy"],
      reputationScore: 94,
    },
    {
      id: "3",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      name: "Elena Rodriguez",
      votingPower: 52000,
      delegators: 312,
      participationRate: 99,
      expertiseAreas: ["Legal", "Compliance", "Ethics"],
      reputationScore: 98,
    },
    {
      id: "4",
      address: "0x7f5c764cBc14f9669B88837ca1490cCa17c31607",
      name: "David Kim",
      votingPower: 29000,
      delegators: 145,
      participationRate: 92,
      expertiseAreas: ["Technical", "Security", "Development"],
      reputationScore: 91,
    },
  ];

  const filteredDelegates = delegates.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.expertiseAreas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelegate = () => {
    if (selectedDelegate) {
      onDelegate(selectedDelegate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2>Delegate Your Voting Power</h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose a trusted delegate to vote on your behalf
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, address, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Delegates List */}
        <div className="overflow-y-auto max-h-[500px] p-6">
          {currentDelegation && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800">
                    You have already delegated your voting power. Selecting a new delegate will override your current delegation.
                  </p>
                  <button
                    onClick={() => setSelectedDelegate(null)}
                    className="mt-2 text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <UserX className="w-4 h-4" />
                    Remove current delegation
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredDelegates.map((delegate) => (
              <motion.div
                key={delegate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedDelegate === delegate.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedDelegate(delegate.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {delegate.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg">{delegate.name}</h4>
                        <p className="text-xs text-gray-500 font-mono">
                          {delegate.address.slice(0, 10)}...{delegate.address.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Voting Power</p>
                        <p className="text-sm">{delegate.votingPower.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Delegators</p>
                        <p className="text-sm">{delegate.delegators}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Participation</p>
                        <p className="text-sm text-green-600">{delegate.participationRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reputation</p>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-500" />
                          <p className="text-sm">{delegate.reputationScore}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {delegate.expertiseAreas.map((area) => (
                        <span
                          key={area}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedDelegate === delegate.id && (
                    <div className="ml-4">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Delegation can be changed anytime</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelegate}
                disabled={!selectedDelegate}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Delegation
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
