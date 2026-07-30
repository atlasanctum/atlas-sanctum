import { TrendingUp, Vote, FileText, Users, MessageCircle, Award, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "vote" | "proposal" | "delegation" | "comment" | "achievement" | "treasury";
  user: string;
  userAddress: string;
  action: string;
  target: string;
  timestamp: Date;
  metadata?: {
    votingPower?: number;
    amount?: number;
    badge?: string;
  };
}

export function ActivityFeed() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "vote",
      user: "Sarah Chen",
      userAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
      action: "voted FOR",
      target: "Privacy-Preserving Voting Mechanism",
      timestamp: new Date(Date.now() - 300000),
      metadata: { votingPower: 5000 },
    },
    {
      id: "2",
      type: "proposal",
      user: "Marcus Williams",
      userAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      action: "created",
      target: "Quarterly Treasury Report",
      timestamp: new Date(Date.now() - 1200000),
    },
    {
      id: "3",
      type: "delegation",
      user: "Elena Rodriguez",
      userAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      action: "delegated voting power to",
      target: "David Kim",
      timestamp: new Date(Date.now() - 3600000),
      metadata: { votingPower: 3200 },
    },
    {
      id: "4",
      type: "comment",
      user: "Alex Thompson",
      userAddress: "0x7f5c764cBc14f9669B88837ca1490cCa17c31607",
      action: "commented on",
      target: "AI Ethics Oversight Committee",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "5",
      type: "achievement",
      user: "Maria Garcia",
      userAddress: "0x9f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      action: "earned",
      target: "Active Voter Badge",
      timestamp: new Date(Date.now() - 10800000),
      metadata: { badge: "🏆" },
    },
    {
      id: "6",
      type: "treasury",
      user: "DAO Treasury",
      userAddress: "0x0000000000000000000000000000000000000000",
      action: "received",
      target: "Protocol Revenue",
      timestamp: new Date(Date.now() - 14400000),
      metadata: { amount: 125000 },
    },
    {
      id: "7",
      type: "vote",
      user: "David Kim",
      userAddress: "0x4f5c764cBc14f9669B88837ca1490cCa17c31607",
      action: "voted AGAINST",
      target: "Increase Proposal Quorum",
      timestamp: new Date(Date.now() - 18000000),
      metadata: { votingPower: 2800 },
    },
    {
      id: "8",
      type: "proposal",
      user: "Sophia Lee",
      userAddress: "0x5f5c764cBc14f9669B88837ca1490cCa17c31607",
      action: "created",
      target: "Sustainability Initiative 2024",
      timestamp: new Date(Date.now() - 21600000),
    },
  ];

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "vote":
        return <Vote className="w-5 h-5 text-green-600" />;
      case "proposal":
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case "delegation":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case "achievement":
        return <Award className="w-5 h-5 text-amber-600" />;
      case "treasury":
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "vote":
        return "bg-green-100";
      case "proposal":
        return "bg-indigo-100";
      case "delegation":
        return "bg-purple-100";
      case "comment":
        return "bg-blue-100";
      case "achievement":
        return "bg-amber-100";
      case "treasury":
        return "bg-emerald-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Activity Feed</h2>
        <p className="text-gray-600">Real-time updates from the DAO community</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3>Recent Activity</h3>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg ${getBgColor(activity.type)} flex-shrink-0`}>
                  {getIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {" "}
                        <span className="text-gray-600">{activity.action}</span>
                        {" "}
                        <span className="text-indigo-600">{activity.target}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 font-mono">
                          {activity.userAddress.slice(0, 6)}...{activity.userAddress.slice(-4)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    {activity.metadata && (
                      <div className="flex flex-col items-end gap-1">
                        {activity.metadata.votingPower && (
                          <span className="text-xs text-gray-600">
                            {activity.metadata.votingPower.toLocaleString()} VP
                          </span>
                        )}
                        {activity.metadata.amount && (
                          <span className="text-xs text-green-600">
                            +${(activity.metadata.amount / 1000).toFixed(0)}K
                          </span>
                        )}
                        {activity.metadata.badge && (
                          <span className="text-xl">{activity.metadata.badge}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-sm text-center text-indigo-600 hover:text-indigo-700 py-2">
            Load more activity
          </button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-2xl text-green-600 mb-1">156</p>
          <p className="text-sm text-gray-600">Votes Today</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-2xl text-indigo-600 mb-1">12</p>
          <p className="text-sm text-gray-600">New Proposals</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-2xl text-purple-600 mb-1">43</p>
          <p className="text-sm text-gray-600">Delegations</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-2xl text-amber-600 mb-1">28</p>
          <p className="text-sm text-gray-600">Comments</p>
        </div>
      </div>
    </div>
  );
}
