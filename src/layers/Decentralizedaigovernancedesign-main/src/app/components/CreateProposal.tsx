import { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { Proposal } from "./ProposalCard";

interface CreateProposalProps {
  onClose: () => void;
  onSubmit: (proposal: Omit<Proposal, "id" | "votesFor" | "votesAgainst" | "totalVoters" | "aiRecommendation" | "ethicsScore">) => void;
}

export function CreateProposal({ onClose, onSubmit }: CreateProposalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"ethics" | "governance" | "technical" | "funding">("governance");
  const [quorumRequired, setQuorumRequired] = useState(100);
  const [duration, setDuration] = useState(7);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState<{ score: number; reasoning: string } | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const mockReasons = [
        "Aligns with transparency and fairness principles",
        "Promotes community participation and decentralization",
        "Addresses key governance challenges effectively",
        "Demonstrates strong ethical alignment with human dignity",
        "Supports sustainable development and global welfare",
      ];
      
      setAiPreview({
        score: mockScore,
        reasoning: mockReasons[Math.floor(Math.random() * mockReasons.length)],
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);
    
    onSubmit({
      title,
      description,
      category,
      status: "active",
      quorumRequired,
      endDate,
    });
    
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2>Create New Proposal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm mb-2">
              Proposal Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, descriptive title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your proposal"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="ethics">Ethics</option>
              <option value="governance">Governance</option>
              <option value="technical">Technical</option>
              <option value="funding">Funding</option>
            </select>
          </div>

          {/* Quorum & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quorum" className="block text-sm mb-2">
                Quorum Required
              </label>
              <input
                id="quorum"
                type="number"
                value={quorumRequired}
                onChange={(e) => setQuorumRequired(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm mb-2">
                Duration (days)
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={30}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* AI Analysis Button */}
          <div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!title || !description || isAnalyzing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? "Analyzing..." : "Get AI Ethics Analysis"}
            </button>
          </div>

          {/* AI Preview */}
          {aiPreview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-indigo-900">AI Ethics Preview</span>
                </div>
                <span className="text-sm px-2 py-1 bg-indigo-600 text-white rounded">
                  {aiPreview.score}% Confidence
                </span>
              </div>
              <p className="text-sm text-indigo-700">{aiPreview.reasoning}</p>
            </motion.div>
          )}

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">
                Your proposal will be automatically evaluated against our Universal Ethics Framework.
                All members will be able to vote, and the AI will provide transparency reports on
                potential impacts and ethical considerations.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
