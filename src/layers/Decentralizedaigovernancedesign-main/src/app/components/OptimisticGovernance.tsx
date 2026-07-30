import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  AlertTriangle,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Info,
  FileText,
  Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface OptimisticProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  submittedAt: string;
  executionTime: string;
  status: "pending" | "challenged" | "executed" | "cancelled";
  timelockRemaining: number; // hours
  bondRequired: number;
  bondStaked: number;
  challengesCount: number;
  riskScore: number;
}

interface Challenge {
  id: string;
  proposalId: string;
  challenger: string;
  reason: string;
  evidence: string;
  bondStaked: number;
  status: "pending" | "validated" | "rejected";
  submittedAt: string;
  votes: {
    valid: number;
    invalid: number;
  };
}

interface FraudProof {
  id: string;
  proposalId: string;
  fraudType: string;
  description: string;
  evidence: string[];
  verified: boolean;
}

export function OptimisticGovernance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [challengeReason, setChallengeReason] = useState("");
  const [challengeEvidence, setChallengeEvidence] = useState("");
  const [bondAmount, setBondAmount] = useState("1000");

  // Mock data
  const optimisticProposals: OptimisticProposal[] = [
    {
      id: "1",
      title: "Update Documentation Website",
      description: "Refresh docs with latest API changes and add new tutorials",
      proposer: "0x742d...bEb8",
      submittedAt: "2026-01-22T10:00:00Z",
      executionTime: "2026-01-24T10:00:00Z",
      status: "pending",
      timelockRemaining: 38,
      bondRequired: 500,
      bondStaked: 500,
      challengesCount: 0,
      riskScore: 12,
    },
    {
      id: "2",
      title: "Adjust Gas Fee Parameters",
      description: "Lower gas fees for voting transactions by 20%",
      proposer: "0x9f3c...a2b1",
      submittedAt: "2026-01-21T14:30:00Z",
      executionTime: "2026-01-28T14:30:00Z",
      status: "challenged",
      timelockRemaining: 150,
      bondRequired: 5000,
      bondStaked: 5000,
      challengesCount: 2,
      riskScore: 67,
    },
    {
      id: "3",
      title: "Add New Treasury Wallet",
      description: "Create additional multi-sig wallet for operational expenses",
      proposer: "0x5a7e...c9d2",
      submittedAt: "2026-01-20T08:00:00Z",
      executionTime: "2026-01-27T08:00:00Z",
      status: "pending",
      timelockRemaining: 118,
      bondRequired: 10000,
      bondStaked: 10000,
      challengesCount: 0,
      riskScore: 45,
    },
    {
      id: "4",
      title: "Update Community Guidelines",
      description: "Clarify content policy and moderation procedures",
      proposer: "0x8b2f...d4e3",
      submittedAt: "2026-01-23T12:00:00Z",
      executionTime: "2026-01-25T12:00:00Z",
      status: "executed",
      timelockRemaining: 0,
      bondRequired: 200,
      bondStaked: 200,
      challengesCount: 0,
      riskScore: 8,
    },
    {
      id: "5",
      title: "Emergency Treasury Withdrawal",
      description: "Withdraw 500K for immediate market maker liquidity",
      proposer: "0x3c9a...f5b4",
      submittedAt: "2026-01-19T16:00:00Z",
      executionTime: "2026-01-26T16:00:00Z",
      status: "cancelled",
      timelockRemaining: 0,
      bondRequired: 50000,
      bondStaked: 50000,
      challengesCount: 8,
      riskScore: 94,
    },
  ];

  const challenges: Challenge[] = [
    {
      id: "1",
      proposalId: "2",
      challenger: "0x1a2b...c3d4",
      reason: "Parameter change impacts system stability",
      evidence:
        "Gas fee reduction could lead to spam attacks. Historical data shows 15% reduction led to 300% increase in low-value transactions.",
      bondStaked: 5000,
      status: "pending",
      submittedAt: "2026-01-22T09:00:00Z",
      votes: {
        valid: 234,
        invalid: 89,
      },
    },
    {
      id: "2",
      proposalId: "2",
      challenger: "0x5e6f...g7h8",
      reason: "Economic model not properly analyzed",
      evidence:
        "No economic impact assessment provided. Fee changes require DAO economist review per governance guidelines section 4.2.",
      bondStaked: 5000,
      status: "validated",
      submittedAt: "2026-01-22T11:30:00Z",
      votes: {
        valid: 412,
        invalid: 67,
      },
    },
  ];

  const fraudProofs: FraudProof[] = [
    {
      id: "1",
      proposalId: "5",
      fraudType: "Insufficient Authorization",
      description: "Proposal attempts treasury withdrawal without proper multi-sig approval",
      evidence: [
        "Transaction requires 5/7 multi-sig approval",
        "Only 2 signatures provided in proposal",
        "Violates governance framework section 8.3",
      ],
      verified: true,
    },
    {
      id: "2",
      proposalId: "5",
      fraudType: "Conflicting State",
      description: "Proposal claims emergency status but doesn't meet emergency criteria",
      evidence: [
        "No emergency declaration by security council",
        "Market conditions do not meet threshold",
        "Alternative solutions not explored",
      ],
      verified: true,
    },
  ];

  const handleSubmitChallenge = (proposalId: string) => {
    if (!challengeReason.trim() || !challengeEvidence.trim()) {
      toast.error("Please provide challenge reason and evidence");
      return;
    }

    toast.success(`Challenge submitted! ${bondAmount} tokens staked.`);
    setChallengeReason("");
    setChallengeEvidence("");
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return "text-red-600";
    if (score >= 50) return "text-orange-600";
    if (score >= 25) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "executed":
        return "bg-green-100 text-green-700 border-green-300";
      case "challenged":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const stats = {
    totalProposals: optimisticProposals.length,
    pendingProposals: optimisticProposals.filter((p) => p.status === "pending").length,
    executed: optimisticProposals.filter((p) => p.status === "executed").length,
    challenged: optimisticProposals.filter((p) => p.status === "challenged").length,
    cancelled: optimisticProposals.filter((p) => p.status === "cancelled").length,
    avgExecutionTime: 48, // hours
    bondPool: 71200,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-2 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2>Optimistic Governance</h2>
            <p className="text-sm text-gray-600">
              Fast execution with fraud proofs - innocent until proven guilty
            </p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">{stats.totalProposals}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{stats.pendingProposals}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{stats.executed}</p>
              <p className="text-xs text-gray-600">Executed</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-yellow-600">{stats.challenged}</p>
              <p className="text-xs text-gray-600">Challenged</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              <p className="text-xs text-gray-600">Cancelled</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">{stats.avgExecutionTime}h</p>
              <p className="text-xs text-gray-600">Avg Time</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">${(stats.bondPool / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-600">Bond Pool</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Why Optimistic Governance?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h4 className="text-sm font-semibold text-green-900 mb-1">
                      ⚡ 100x Faster Decisions
                    </h4>
                    <p className="text-xs text-green-700">
                      No waiting for votes on every small decision. Execute immediately unless challenged.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      🛡️ Economic Security
                    </h4>
                    <p className="text-xs text-blue-700">
                      Challengers must stake tokens. False challenges lose their stake, making attacks expensive.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h4 className="text-sm font-semibold text-purple-900 mb-1">
                      🎯 Focus on What Matters
                    </h4>
                    <p className="text-xs text-purple-700">
                      DAO only votes on challenged proposals. Eliminates governance fatigue.
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <h4 className="text-sm font-semibold text-orange-900 mb-1">
                      ⚖️ Innocent Until Proven Guilty
                    </h4>
                    <p className="text-xs text-orange-700">
                      Proposals pass by default. Burden of proof on those claiming fraud.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How Bonds Work */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Economic Security Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Proposer Bond</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Proposers stake tokens based on proposal risk. Higher risk = higher bond.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Low Risk (0-25):</span>
                        <span className="font-medium text-green-600">$100-500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medium Risk (25-50):</span>
                        <span className="font-medium text-yellow-600">$500-5K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">High Risk (50-75):</span>
                        <span className="font-medium text-orange-600">$5K-25K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Critical Risk (75+):</span>
                        <span className="font-medium text-red-600">$25K-100K</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Challenger Bond</h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Challengers stake equal amount to proposer's bond.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Valid challenge → Recover stake + proposer's bond</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-700">
                        <XCircle className="w-3 h-3" />
                        <span>Invalid challenge → Lose entire stake</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                AI Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Every proposal is automatically analyzed for risk factors:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Treasury Impact</h4>
                  <p className="text-xs text-gray-600">
                    Value at risk, withdrawal patterns, multi-sig requirements
                  </p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Code Changes</h4>
                  <p className="text-xs text-gray-600">
                    Smart contract modifications, permission changes, attack surface
                  </p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Historical Patterns</h4>
                  <p className="text-xs text-gray-600">
                    Similarity to past exploits, proposer reputation, timing analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                Integration with Other Mechanisms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Holographic Consensus
                  </h4>
                  <p className="text-xs text-gray-600">
                    High-attention proposals get shorter timelock periods
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Reputation System</h4>
                  <p className="text-xs text-gray-600">
                    High-reputation proposers require lower bonds
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Ethics</h4>
                  <p className="text-xs text-gray-600">
                    Automatic fraud detection triggers challenges
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Risk Dashboard</h4>
                  <p className="text-xs text-gray-600">
                    Real-time monitoring of all pending proposals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{optimisticProposals.length} optimistic proposals</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Submit Optimistic Proposal</Button>
          </div>

          <div className="space-y-4">
            {optimisticProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{proposal.title}</h3>
                          <Badge variant="outline" className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{proposal.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By {proposal.proposer}</span>
                          <span>•</span>
                          <span>{new Date(proposal.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-2xl font-bold ${getRiskColor(proposal.riskScore)}`}>
                            {proposal.riskScore}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">AI-calculated risk score</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-xs text-gray-600">Risk Score</p>
                      </div>
                    </div>

                    {/* Timelock & Bond Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Timelock Remaining</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {proposal.timelockRemaining}h
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Bond Staked</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${proposal.bondStaked.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Challenges</p>
                        <p className="text-lg font-semibold text-gray-900">{proposal.challengesCount}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Execution</p>
                        <p className="text-xs font-medium text-gray-900">
                          {new Date(proposal.executionTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {proposal.status === "pending" && proposal.timelockRemaining > 0 && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">
                              Timelock Period ({proposal.timelockRemaining}h remaining)
                            </span>
                          </div>
                          <Progress
                            value={((48 - proposal.timelockRemaining) / 48) * 100}
                            className="h-2"
                          />
                        </div>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Challenge
                        </Button>
                      </div>
                    )}

                    {proposal.status === "challenged" && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Under Review - {proposal.challengesCount} active challenge(s)
                          </span>
                        </div>
                      </div>
                    )}

                    {proposal.status === "cancelled" && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 text-red-800">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Cancelled - Fraud proof validated
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Challenges</CardTitle>
              <p className="text-sm text-gray-600">
                Community members challenging potentially fraudulent proposals
              </p>
            </CardHeader>
            <CardContent>
              {challenges.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No active challenges</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map((challenge, index) => {
                    const proposal = optimisticProposals.find((p) => p.id === challenge.proposalId);
                    return (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              Challenge: {proposal?.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              by {challenge.challenger} •{" "}
                              {new Date(challenge.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              challenge.status === "validated"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : challenge.status === "rejected"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : "bg-yellow-100 text-yellow-700 border-yellow-300"
                            }
                          >
                            {challenge.status}
                          </Badge>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">Reason</p>
                          <p className="text-sm text-gray-700 mb-3">{challenge.reason}</p>
                          <p className="text-sm font-medium text-gray-900 mb-2">Evidence</p>
                          <p className="text-sm text-gray-700">{challenge.evidence}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 mb-2">Community Votes</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  {challenge.votes.valid}
                                </span>
                                <span className="text-xs text-gray-600">valid</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  {challenge.votes.invalid}
                                </span>
                                <span className="text-xs text-gray-600">invalid</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Bond Staked</p>
                            <p className="text-lg font-semibold text-gray-900">
                              ${challenge.bondStaked.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fraud Proofs */}
          {fraudProofs.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Verified Fraud Proofs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fraudProofs.map((proof, index) => {
                    const proposal = optimisticProposals.find((p) => p.id === proof.proposalId);
                    return (
                      <motion.div
                        key={proof.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {proof.fraudType}
                            </h4>
                            <p className="text-xs text-gray-600">{proposal?.title}</p>
                          </div>
                          {proof.verified && (
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{proof.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-900">Evidence:</p>
                          {proof.evidence.map((item, i) => (
                            <p key={i} className="text-xs text-gray-600 pl-3">
                              • {item}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* How It Works Tab */}
        <TabsContent value="how-it-works" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Optimistic Execution Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Submit Proposal</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Proposer submits proposal with required bond (based on risk score)
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                      AI analyzes proposal and calculates risk score + required bond
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Timelock Period</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Proposal enters timelock (24-168 hours based on risk)
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                      Anyone can review and challenge during this period
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Challenge Window (Optional)
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      If challenged, community votes on fraud proof validity
                    </p>
                    <div className="bg-yellow-50 rounded-lg p-3 text-xs text-yellow-800">
                      Valid challenge → Proposal cancelled, challenger gets proposer's bond
                      <br />
                      Invalid challenge → Challenger loses their bond
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Automatic Execution
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      If no valid challenges, proposal executes automatically
                    </p>
                    <div className="bg-green-50 rounded-lg p-3 text-xs text-green-800">
                      Proposer gets bond back + reputation boost
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-base">Academic Foundation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Optimistic Rollups</p>
                  <p className="text-xs text-gray-600">
                    Ethereum scaling solution - assumes transactions valid unless proven fraudulent
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    Optimism Governance Model
                  </p>
                  <p className="text-xs text-gray-600">
                    Real-world implementation of optimistic governance at scale
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Game Theory</p>
                  <p className="text-xs text-gray-600">
                    Economic bonds create Nash equilibrium where honesty is optimal strategy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
