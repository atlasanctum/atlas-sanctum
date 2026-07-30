import { useState } from "react";
import { MessageCircle, ThumbsUp, Reply, MoreVertical, Flag, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface Comment {
  id: string;
  author: string;
  authorAddress: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
  votingPower: number;
  stance?: "for" | "against" | "neutral";
}

interface ProposalDiscussionProps {
  proposalId: string;
  proposalTitle: string;
}

export function ProposalDiscussion({ proposalId, proposalTitle }: ProposalDiscussionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Alex Thompson",
      authorAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
      content: "This proposal aligns perfectly with our ethical framework. The privacy-preserving technology will significantly enhance voter confidence while maintaining full auditability. I'm voting FOR.",
      timestamp: new Date(Date.now() - 3600000 * 5),
      likes: 34,
      replies: [
        {
          id: "1-1",
          author: "Maria Garcia",
          authorAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          content: "Agreed! Have we considered the implementation timeline and resource requirements?",
          timestamp: new Date(Date.now() - 3600000 * 4),
          likes: 12,
          replies: [],
          votingPower: 2500,
          stance: "for",
        },
      ],
      votingPower: 5000,
      stance: "for",
    },
    {
      id: "2",
      author: "David Chen",
      authorAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      content: "I have concerns about the technical feasibility. Zero-knowledge proofs are complex and expensive to implement. We need more details on the cost-benefit analysis before committing.",
      timestamp: new Date(Date.now() - 3600000 * 3),
      likes: 28,
      replies: [],
      votingPower: 4200,
      stance: "against",
    },
    {
      id: "3",
      author: "Sarah Williams",
      authorAddress: "0x7f5c764cBc14f9669B88837ca1490cCa17c31607",
      content: "Has anyone run simulations on how this would affect gas costs? We should ensure accessibility for all members, not just those who can afford high transaction fees.",
      timestamp: new Date(Date.now() - 3600000 * 2),
      likes: 45,
      replies: [],
      votingPower: 3800,
      stance: "neutral",
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const getStanceColor = (stance?: "for" | "against" | "neutral") => {
    switch (stance) {
      case "for":
        return "text-green-600 bg-green-50";
      case "against":
        return "text-red-600 bg-red-50";
      case "neutral":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStanceLabel = (stance?: "for" | "against" | "neutral") => {
    switch (stance) {
      case "for":
        return "Supports";
      case "against":
        return "Opposes";
      case "neutral":
        return "Neutral";
      default:
        return "";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      })
    );
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? "ml-12" : ""}`}
    >
      <div className="flex gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
          {comment.author.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm truncate">{comment.author}</span>
                <span className="text-xs text-gray-500 font-mono truncate">
                  {comment.authorAddress.slice(0, 6)}...{comment.authorAddress.slice(-4)}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                {comment.stance && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStanceColor(comment.stance)}`}>
                      {getStanceLabel(comment.stance)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">{comment.votingPower.toLocaleString()} voting power</p>
            </div>
            
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-700 mb-3">{comment.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>

            <button
              onClick={() => setReplyingTo(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>

            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                Reply
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-2">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-5 h-5 text-indigo-600" />
          <h3>Discussion</h3>
        </div>
        <p className="text-sm text-gray-600">Share your thoughts and concerns about this proposal</p>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            All comments are publicly visible and permanent. Please be respectful and constructive. Violations of community guidelines may result in moderation.
          </p>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
            Y
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this proposal..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="neutral">Neutral</option>
                  <option value="for">Support</option>
                  <option value="against">Oppose</option>
                </select>
              </div>
              <button
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
