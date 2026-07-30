import { motion } from "framer-motion";
import { Activity, CheckCircle, XCircle, Clock, FileText, Shield } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  type: "vote" | "proposal" | "analysis" | "execution";
  action: string;
  details: string;
  hash: string;
  user?: string;
}

export function TransparencyLog() {
  const mockLogs: LogEntry[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "vote",
      action: "Vote Cast",
      details: "User 0x7a3f...c2d1 voted FOR proposal #42",
      hash: "0x8f4a2c9b7d3e1f0a5c8b2d9e4f7a1c3b5d8e2f9a",
      user: "0x7a3f...c2d1",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "analysis",
      action: "AI Analysis Completed",
      details: "Ethics score calculated: 87% for proposal #42",
      hash: "0x3c7b8e9a2d5f1c4b7e0a8d3f6c9b2e5a8d1f4c7b",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "proposal",
      action: "New Proposal Created",
      details: "Proposal #42: Implement privacy-preserving voting mechanism",
      hash: "0x9e2f5a8c1d4b7e0a3c6f9b2d5e8a1c4f7b0d3e6a",
      user: "0x3b9c...8e4f",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: "execution",
      action: "Proposal Executed",
      details: "Proposal #41 passed and executed successfully",
      hash: "0x2d5a8c3f6b9e1d4a7c0f3b6e9a2d5c8f1b4e7a0d",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      type: "vote",
      action: "Vote Cast",
      details: "User 0x9f2e...5a7c voted AGAINST proposal #41",
      hash: "0x7b0e3a6c9f2d5b8e1a4c7f0d3b6e9a2c5f8d1b4e",
      user: "0x9f2e...5a7c",
    },
    {
      id: "6",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: "analysis",
      action: "Transparency Report Generated",
      details: "Impact assessment completed for proposal #41",
      hash: "0x4e7a1c3f6b9d2e5a8c1f4b7e0a3d6c9f2b5e8a1d",
    },
  ];

  const typeIcons: Record<string, any> = {
    vote: CheckCircle,
    proposal: FileText,
    analysis: Activity,
    execution: Shield,
  };

  const typeColors: Record<string, string> = {
    vote: "bg-green-100 text-green-600",
    proposal: "bg-blue-100 text-blue-600",
    analysis: "bg-purple-100 text-purple-600",
    execution: "bg-orange-100 text-orange-600",
  };

  const formatTimestamp = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="mb-2">Transparency Log</h2>
        <p className="text-gray-600">
          All governance actions are recorded on-chain for complete transparency and auditability.
          Every decision, vote, and analysis is immutably logged.
        </p>
      </div>

      <div className="space-y-4">
        {mockLogs.map((log, index) => {
          const Icon = typeIcons[log.type];
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${typeColors[log.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm">{log.action}</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{log.details}</p>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Hash:</span>
                      <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {log.hash.slice(0, 10)}...{log.hash.slice(-8)}
                      </code>
                    </div>
                    {log.user && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">User:</span>
                        <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">
                          {log.user}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm text-indigo-900 mb-1">Blockchain Verification</h4>
            <p className="text-xs text-indigo-700">
              All entries are cryptographically signed and stored on the blockchain.
              You can verify any transaction using the provided hash on the block explorer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
