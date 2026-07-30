import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, MessageSquare, Zap, Brain, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EthicalChallenge {
  id: string;
  dimension: string;
  severity: "low" | "medium" | "high" | "critical";
  issue: string;
  explanation: string;
  recommendation: string;
  resolved: boolean;
}

interface AIEthicsArbitratorProps {
  proposalId: string;
  proposalTitle: string;
  proposalDescription: string;
  onClose: () => void;
}

export function AIEthicsArbitrator({ proposalId, proposalTitle, proposalDescription, onClose }: AIEthicsArbitratorProps) {
  const [activeTab, setActiveTab] = useState<"analysis" | "dialogue" | "resolution">("analysis");
  const [userResponse, setUserResponse] = useState("");
  const [dialogueHistory, setDialogueHistory] = useState<Array<{ role: "ai" | "user"; message: string }>>([
    {
      role: "ai",
      message: "I am the AI Ethics Arbitrator. I've identified several ethical concerns with this proposal. Let's discuss them together to ensure this decision aligns with our universal values."
    }
  ]);

  const challenges: EthicalChallenge[] = [
    {
      id: "1",
      dimension: "Human Dignity",
      severity: "medium",
      issue: "Potential for exclusion",
      explanation: "The proposal's implementation may inadvertently exclude members with limited technical expertise or resources, creating a two-tier system that undermines equal participation.",
      recommendation: "Add accessibility provisions and education programs to ensure all members can participate equally, regardless of technical background.",
      resolved: false,
    },
    {
      id: "2",
      dimension: "Fairness & Equity",
      severity: "high",
      issue: "Resource distribution bias",
      explanation: "The allocation mechanism favors early adopters and high-stake holders, potentially concentrating power and resources among existing elite members rather than promoting equitable distribution.",
      recommendation: "Implement progressive allocation curves or time-weighted mechanisms to balance rewards between new and existing members.",
      resolved: false,
    },
    {
      id: "3",
      dimension: "Transparency",
      severity: "low",
      issue: "Algorithm opacity",
      explanation: "While the proposal mentions AI-driven allocation, the specific algorithms and decision criteria are not fully disclosed, making it difficult for members to understand how decisions are made.",
      recommendation: "Publish detailed algorithmic documentation, including decision trees, weighting factors, and example scenarios.",
      resolved: true,
    },
    {
      id: "4",
      dimension: "Privacy Protection",
      severity: "medium",
      issue: "Data collection scope",
      explanation: "The proposal requires collection of member activity data that may be broader than necessary for the stated purpose, potentially infringing on privacy rights.",
      recommendation: "Implement data minimization principles - collect only essential data with explicit consent and clear retention policies.",
      resolved: false,
    },
    {
      id: "5",
      dimension: "Global Welfare",
      severity: "critical",
      issue: "Environmental impact",
      explanation: "The proposed system's computational requirements would significantly increase energy consumption without addressing carbon offset or sustainable computing practices.",
      recommendation: "Integrate carbon offset mechanisms, optimize for energy efficiency, or migrate to proof-of-stake or other low-energy alternatives.",
      resolved: false,
    },
  ];

  const unresolvedChallenges = challenges.filter((c) => !c.resolved);
  const criticalIssues = unresolvedChallenges.filter((c) => c.severity === "critical").length;
  const highIssues = unresolvedChallenges.filter((c) => c.severity === "high").length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleSendMessage = () => {
    if (!userResponse.trim()) return;

    setDialogueHistory((prev) => [
      ...prev,
      { role: "user", message: userResponse },
      {
        role: "ai",
        message: "Thank you for addressing that concern. Your proposed solution of implementing progressive allocation with a 2-year vesting period would significantly reduce the fairness concern. However, we should also consider how this affects early contributors who have already invested significant effort. Would you be open to a hybrid approach that grandfathers existing contributions while applying new rules to future allocations?"
      }
    ]);
    setUserResponse("");
  };

  const overallScore = ((challenges.filter((c) => c.resolved).length / challenges.length) * 100);
  const canProceed = criticalIssues === 0 && highIssues <= 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              <h2>AI Ethics Arbitrator</h2>
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
          <p className="text-purple-100 text-sm mb-4">
            Adversarial AI challenger - ensuring proposals meet ethical standards
          </p>

          {/* Status Bar */}
          <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{criticalIssues} Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-300" />
                <span className="text-sm">{highIssues} High</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-sm">{challenges.filter((c) => c.resolved).length} Resolved</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-purple-100">Ethics Score</p>
              <p className="text-xl">{overallScore.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: "analysis", label: "Ethical Analysis", icon: Shield },
              { id: "dialogue", label: "Dialogue", icon: MessageSquare },
              { id: "resolution", label: "Resolution Path", icon: Scale },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600 bg-purple-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-300px)] overflow-y-auto">
          {/* Proposal Context */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Analyzing:</p>
            <p className="font-medium">{proposalTitle}</p>
          </div>

          {activeTab === "analysis" && (
            <AnimatePresence>
              <div className="space-y-4">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-lg ${
                      challenge.resolved ? "border-green-300 bg-green-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        challenge.resolved ? "bg-green-100" : getSeverityColor(challenge.severity).split(" ")[0]
                      }`}>
                        {challenge.resolved ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className={`w-5 h-5 ${
                            challenge.severity === "critical" ? "text-red-600" :
                            challenge.severity === "high" ? "text-orange-600" :
                            challenge.severity === "medium" ? "text-amber-600" :
                            "text-blue-600"
                          }`} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium mb-1">{challenge.dimension}</h4>
                            <p className="text-sm text-gray-600">{challenge.issue}</p>
                          </div>
                          <span className={`px-2 py-1 border rounded text-xs ${getSeverityColor(challenge.severity)}`}>
                            {challenge.severity.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">📋 Explanation:</p>
                            <p className="text-gray-700">{challenge.explanation}</p>
                          </div>

                          <div>
                            <p className="text-gray-600 mb-1">💡 Recommendation:</p>
                            <p className="text-indigo-700">{challenge.recommendation}</p>
                          </div>
                        </div>

                        {!challenge.resolved && (
                          <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                            Address This Issue
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {activeTab === "dialogue" && (
            <div className="space-y-4">
              {/* Chat History */}
              <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                {dialogueHistory.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {entry.role === "ai" && (
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      entry.role === "ai" ? "bg-white border border-purple-200" : "bg-purple-600 text-white"
                    }`}>
                      <p className="text-sm">{entry.message}</p>
                    </div>
                    {entry.role === "user" && (
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">You</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Respond to AI's concerns..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userResponse.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 The AI Arbitrator uses Socratic dialogue to help you identify and resolve ethical issues. 
                  It will challenge your assumptions and push for stronger ethical safeguards.
                </p>
              </div>
            </div>
          )}

          {activeTab === "resolution" && (
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Resolution Progress</h4>
                  <span className="text-2xl text-purple-600">{overallScore.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${overallScore}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {challenges.filter((c) => c.resolved).length} of {challenges.length} issues resolved
                </p>
              </div>

              {/* Resolution Steps */}
              <div>
                <h4 className="font-medium mb-3">Required Actions</h4>
                <div className="space-y-3">
                  {unresolvedChallenges.map((challenge, index) => (
                    <div key={challenge.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{challenge.dimension}</p>
                        <p className="text-sm text-gray-600">{challenge.recommendation}</p>
                      </div>
                      <span className={`px-2 py-1 border rounded text-xs ${getSeverityColor(challenge.severity)}`}>
                        {challenge.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision */}
              <div className={`p-4 border-2 rounded-lg ${
                canProceed ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
              }`}>
                <div className="flex items-start gap-2">
                  {canProceed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium mb-1 ${canProceed ? "text-green-900" : "text-red-900"}`}>
                      {canProceed ? "Ready to Proceed" : "Cannot Proceed"}
                    </h4>
                    <p className={`text-sm ${canProceed ? "text-green-800" : "text-red-800"}`}>
                      {canProceed
                        ? "This proposal has addressed critical ethical concerns and can proceed to voting. Minor issues should still be monitored during implementation."
                        : `This proposal has ${criticalIssues} critical and ${highIssues} high-severity ethical issues that must be resolved before proceeding to a vote.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4" />
              <span>AI Arbitrator actively prevents ethical failures before they happen</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {canProceed && (
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
                  Approve for Voting
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
