import { motion } from "framer-motion";
import { Calendar, Users, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: "ethics" | "governance" | "technical" | "funding";
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVoters: number;
  quorumRequired: number;
  endDate: Date;
  aiRecommendation: {
    score: number;
    reasoning: string;
  };
  ethicsScore: number;
}

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: string, vote: "for" | "against") => void;
  hasVoted?: boolean;
}

export function ProposalCard({ proposal, onVote, hasVoted }: ProposalCardProps) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  const quorumPercentage = (proposal.totalVoters / proposal.quorumRequired) * 100;
  
  const isActive = proposal.status === "active";
  const timeLeft = Math.ceil((proposal.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const categoryColors = {
    ethics: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    governance: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    technical: "bg-green-500/10 text-green-600 border-green-500/20",
    funding: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };

  const statusColors = {
    active: "bg-green-500/10 text-green-600",
    passed: "bg-blue-500/10 text-blue-600",
    rejected: "bg-red-500/10 text-red-600",
    pending: "bg-gray-500/10 text-gray-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs border ${categoryColors[proposal.category]}`}>
              {proposal.category.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[proposal.status]}`}>
              {proposal.status.toUpperCase()}
            </span>
          </div>
          <h3 className="mb-2">{proposal.title}</h3>
          <p className="text-gray-600 text-sm">{proposal.description}</p>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-indigo-900">AI Recommendation</span>
          </div>
          <span className="text-sm px-2 py-1 bg-indigo-600 text-white rounded">
            {proposal.aiRecommendation.score}% Confidence
          </span>
        </div>
        <p className="text-sm text-indigo-700">{proposal.aiRecommendation.reasoning}</p>
      </div>

      {/* Ethics Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Universal Ethics Alignment</span>
          <span className="text-sm">{proposal.ethicsScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
            style={{ width: `${proposal.ethicsScore}%` }}
          />
        </div>
      </div>

      {/* Voting Results */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-700">For</span>
            <span className="text-sm">{proposal.votesFor} votes ({forPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-700">Against</span>
            <span className="text-sm">{proposal.votesAgainst} votes ({againstPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${againstPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-700">Quorum Progress</span>
            <span className="text-sm">{proposal.totalVoters} / {proposal.quorumRequired} ({quorumPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min(quorumPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{isActive ? `${timeLeft} days left` : "Ended"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{totalVotes} total votes</span>
        </div>
      </div>

      {/* Voting Buttons */}
      {isActive && (
        <div className="flex gap-3">
          <button
            onClick={() => onVote(proposal.id, "for")}
            disabled={hasVoted}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Vote For
          </button>
          <button
            onClick={() => onVote(proposal.id, "against")}
            disabled={hasVoted}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Vote Against
          </button>
        </div>
      )}

      {hasVoted && isActive && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-lg p-3">
          <CheckCircle className="w-4 h-4 text-green-600" />
          You have already voted on this proposal
        </div>
      )}
    </motion.div>
  );
}
