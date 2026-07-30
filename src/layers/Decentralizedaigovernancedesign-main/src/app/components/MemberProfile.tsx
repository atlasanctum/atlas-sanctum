import { User, Award, Vote, FileText, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface MemberStats {
  votingPower: number;
  proposalsCreated: number;
  proposalsVoted: number;
  participationRate: number;
  memberSince: Date;
  reputation: number;
}

interface MemberProfileProps {
  address: string;
  stats: MemberStats;
  onClose: () => void;
}

export function MemberProfile({ address, stats, onClose }: MemberProfileProps) {
  const badges = [
    { id: "early", name: "Early Adopter", icon: "🌟", description: "Joined in first 100 members" },
    { id: "active", name: "Active Voter", icon: "✅", description: "90%+ participation rate" },
    { id: "creator", name: "Proposal Creator", icon: "📝", description: "Created 5+ proposals" },
    { id: "delegate", name: "Trusted Delegate", icon: "🤝", description: "Has 50+ delegators" },
  ];

  const recentActivity = [
    { type: "vote", action: "Voted FOR", proposal: "Implement Privacy-Preserving Voting", time: "2 hours ago" },
    { type: "proposal", action: "Created proposal", proposal: "AI Ethics Oversight Committee", time: "1 day ago" },
    { type: "vote", action: "Voted FOR", proposal: "Universal Basic Income for Contributors", time: "2 days ago" },
    { type: "delegate", action: "Delegated to", proposal: "Sarah Chen", time: "5 days ago" },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-2xl">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-white mb-2">Member Profile</h2>
              <div className="flex items-center gap-2 text-white/90">
                <span className="font-mono text-sm">{address.slice(0, 10)}...{address.slice(-8)}</span>
                <button className="hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Member since {formatDate(stats.memberSince)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
          <div className="text-center">
            <p className="text-2xl text-indigo-600 mb-1">{stats.votingPower.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Voting Power</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-green-600 mb-1">{stats.participationRate}%</p>
            <p className="text-xs text-gray-600">Participation</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-purple-600 mb-1">{stats.proposalsCreated}</p>
            <p className="text-xs text-gray-600">Proposals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-amber-600 mb-1">{stats.reputation}</p>
            <p className="text-xs text-gray-600">Reputation</p>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[500px]">
          {/* Badges */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3>Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm mb-1">{badge.name}</p>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voting Stats */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Vote className="w-5 h-5 text-indigo-600" />
              <h3>Voting Activity</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Proposals Voted</span>
                  <span className="text-sm">{stats.proposalsVoted} / 125</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(stats.proposalsVoted / 125) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-lg text-green-600">68</p>
                  <p className="text-xs text-gray-600">Votes For</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-lg text-red-600">24</p>
                  <p className="text-xs text-gray-600">Votes Against</p>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <p className="text-lg text-gray-600">3</p>
                  <p className="text-xs text-gray-600">Abstained</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3>Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.type === "vote" ? "bg-green-100" :
                    activity.type === "proposal" ? "bg-indigo-100" :
                    "bg-purple-100"
                  }`}>
                    {activity.type === "vote" && <Vote className="w-4 h-4 text-green-600" />}
                    {activity.type === "proposal" && <FileText className="w-4 h-4 text-indigo-600" />}
                    {activity.type === "delegate" && <User className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-sm text-indigo-600">{activity.proposal}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Follow Member
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              View History
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
