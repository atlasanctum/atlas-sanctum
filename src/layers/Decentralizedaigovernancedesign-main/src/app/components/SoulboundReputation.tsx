import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Award,
  Brain,
  CheckCircle2,
  AlertCircle,
  Users,
  Target,
  Zap,
  Lock,
  ExternalLink,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ReputationMetrics {
  overall: number;
  votingAccuracy: number;
  expertiseScore: number;
  participationConsistency: number;
  ethicalAlignment: number;
  contributionValue: number;
}

interface DomainExpertise {
  domain: string;
  score: number;
  rank: number;
  totalExperts: number;
  verifications: number;
  recentActivity: string;
}

interface ReputationHistory {
  date: string;
  action: string;
  change: number;
  category: string;
}

interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedDate?: string;
}

interface SoulboundTokenData {
  tokenId: string;
  holder: string;
  mintDate: string;
  transferable: false;
  reputation: ReputationMetrics;
  achievements: ReputationBadge[];
}

export function SoulboundReputation() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in production, this would come from blockchain + AI analysis
  const soulboundToken: SoulboundTokenData = {
    tokenId: "SBT-0x7f3a...b92c",
    holder: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8",
    mintDate: "2024-03-15",
    transferable: false,
    reputation: {
      overall: 847,
      votingAccuracy: 92,
      expertiseScore: 88,
      participationConsistency: 94,
      ethicalAlignment: 96,
      contributionValue: 85,
    },
    achievements: [],
  };

  const metrics: ReputationMetrics = soulboundToken.reputation;

  const domainExpertise: DomainExpertise[] = [
    {
      domain: "AI Ethics",
      score: 94,
      rank: 12,
      totalExperts: 342,
      verifications: 28,
      recentActivity: "2 days ago",
    },
    {
      domain: "Treasury Management",
      score: 88,
      rank: 45,
      totalExperts: 567,
      verifications: 19,
      recentActivity: "5 days ago",
    },
    {
      domain: "Technical Governance",
      score: 91,
      rank: 23,
      totalExperts: 421,
      verifications: 31,
      recentActivity: "1 day ago",
    },
    {
      domain: "Privacy & Security",
      score: 85,
      rank: 67,
      totalExperts: 389,
      verifications: 15,
      recentActivity: "3 days ago",
    },
  ];

  const reputationHistory: ReputationHistory[] = [
    {
      date: "2026-01-20",
      action: "Accurate vote on Privacy Proposal #47",
      change: 15,
      category: "accuracy",
    },
    {
      date: "2026-01-18",
      action: "Domain expertise verified in AI Ethics",
      change: 25,
      category: "expertise",
    },
    {
      date: "2026-01-15",
      action: "30-day voting streak maintained",
      change: 20,
      category: "consistency",
    },
    {
      date: "2026-01-12",
      action: "Ethics-aligned vote on UBI Proposal",
      change: 12,
      category: "ethics",
    },
    {
      date: "2026-01-10",
      action: "High-value contribution to treasury discussion",
      change: 18,
      category: "contribution",
    },
    {
      date: "2026-01-08",
      action: "Delegation received from 5 members",
      change: 10,
      category: "trust",
    },
    {
      date: "2026-01-05",
      action: "Prediction accuracy bonus (Futarchy)",
      change: 22,
      category: "accuracy",
    },
  ];

  const badges: ReputationBadge[] = [
    {
      id: "1",
      name: "Ethics Guardian",
      description: "Maintained 95%+ ethical alignment for 6 months",
      earned: true,
      rarity: "legendary",
      earnedDate: "2025-12-01",
    },
    {
      id: "2",
      name: "Accurate Oracle",
      description: "90%+ voting accuracy over 100 proposals",
      earned: true,
      rarity: "epic",
      earnedDate: "2025-11-15",
    },
    {
      id: "3",
      name: "Consistent Contributor",
      description: "Voted on every proposal for 3 months",
      earned: true,
      rarity: "rare",
      earnedDate: "2025-10-20",
    },
    {
      id: "4",
      name: "Domain Expert",
      description: "Top 50 in at least 2 domains",
      earned: true,
      rarity: "epic",
      earnedDate: "2025-09-08",
    },
    {
      id: "5",
      name: "Trusted Delegate",
      description: "Received delegation from 10+ members",
      earned: false,
      rarity: "rare",
    },
    {
      id: "6",
      name: "Treasury Steward",
      description: "Manage 100K+ in treasury proposals",
      earned: false,
      rarity: "epic",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "accuracy":
        return Target;
      case "expertise":
        return Brain;
      case "consistency":
        return Zap;
      case "ethics":
        return Shield;
      case "contribution":
        return Award;
      case "trust":
        return Users;
      default:
        return CheckCircle2;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "rare":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const getMetricColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const calculateLevel = (reputation: number) => {
    return Math.floor(reputation / 100) + 1;
  };

  const level = calculateLevel(metrics.overall);
  const nextLevelProgress = (metrics.overall % 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-2 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2>Soulbound Reputation</h2>
            <p className="text-sm text-gray-600">
              Non-transferable identity & expertise verification
            </p>
          </div>
        </div>
      </div>

      {/* SBT Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  Soulbound Token (Non-Transferable)
                </span>
              </div>
              <p className="text-xs text-gray-600 font-mono">{soulboundToken.tokenId}</p>
              <p className="text-xs text-gray-500 mt-1">
                Holder: {soulboundToken.holder.slice(0, 10)}...{soulboundToken.holder.slice(-8)}
              </p>
              <p className="text-xs text-gray-500">
                Minted: {new Date(soulboundToken.mintDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {metrics.overall}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Overall reputation score based on voting accuracy, expertise,
                        participation, ethics, and contributions
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-gray-600">Level {level}</p>
              <div className="mt-2">
                <Progress value={nextLevelProgress} className="h-1 w-24" />
                <p className="text-xs text-gray-500 mt-1">
                  {nextLevelProgress}% to Level {level + 1}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mt-4">
            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              This token cannot be transferred or sold. It represents your personal reputation.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Voting Power</p>
                <p className="text-lg font-semibold text-gray-900">{metrics.overall}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Delegations</p>
                <p className="text-lg font-semibold text-gray-900">8</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Rank</p>
                <p className="text-lg font-semibold text-gray-900">#142</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Voting Accuracy */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  Voting Accuracy
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Percentage of votes that aligned with successful outcomes
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${getMetricColor(metrics.votingAccuracy)}`}>
                    {metrics.votingAccuracy}%
                  </span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <Progress value={metrics.votingAccuracy} className="mt-3" />
                <p className="text-xs text-gray-600 mt-2">
                  Last 100 votes analyzed
                </p>
              </CardContent>
            </Card>

            {/* Expertise Score */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  Expertise Score
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          AI-verified domain knowledge based on contributions and voting patterns
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${getMetricColor(metrics.expertiseScore)}`}>
                    {metrics.expertiseScore}%
                  </span>
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <Progress value={metrics.expertiseScore} className="mt-3" />
                <p className="text-xs text-gray-600 mt-2">
                  4 domains verified
                </p>
              </CardContent>
            </Card>

            {/* Participation Consistency */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Consistency
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Regular participation prevents vote buying and Sybil attacks
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${getMetricColor(metrics.participationConsistency)}`}>
                    {metrics.participationConsistency}%
                  </span>
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <Progress value={metrics.participationConsistency} className="mt-3" />
                <p className="text-xs text-gray-600 mt-2">
                  30-day voting streak
                </p>
              </CardContent>
            </Card>

            {/* Ethical Alignment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Ethical Alignment
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Consistency with universal ethics framework values
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${getMetricColor(metrics.ethicalAlignment)}`}>
                    {metrics.ethicalAlignment}%
                  </span>
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <Progress value={metrics.ethicalAlignment} className="mt-3" />
                <p className="text-xs text-gray-600 mt-2">
                  All-time average
                </p>
              </CardContent>
            </Card>

            {/* Contribution Value */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-600" />
                  Contribution Value
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Quality and impact of proposals, comments, and discussions
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${getMetricColor(metrics.contributionValue)}`}>
                    {metrics.contributionValue}%
                  </span>
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <Progress value={metrics.contributionValue} className="mt-3" />
                <p className="text-xs text-gray-600 mt-2">
                  12 quality contributions
                </p>
              </CardContent>
            </Card>

            {/* Trust Score */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-600" />
                  Trust Score
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Based on delegations received and community trust
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${getMetricColor(89)}`}>
                    89%
                  </span>
                  <Users className="w-5 h-5 text-cyan-600" />
                </div>
                <Progress value={89} className="mt-3" />
                <p className="text-xs text-gray-600 mt-2">
                  8 active delegations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Anti-Sybil Protection */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Sybil Resistance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Long-term participation</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Consistent voting patterns</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Community trust signals</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Unique behavioral fingerprint</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-green-200">
                  ✓ Your reputation cannot be transferred, bought, or faked. It's built through
                  consistent, valuable participation over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expertise Tab */}
        <TabsContent value="expertise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Domain Expertise</CardTitle>
              <p className="text-sm text-gray-600">
                AI-verified expertise based on voting patterns, contributions, and community verification
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainExpertise.map((domain, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{domain.domain}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Rank #{domain.rank} of {domain.totalExperts} experts
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${getMetricColor(domain.score)}`}>
                          {domain.score}
                        </span>
                        <p className="text-xs text-gray-500">score</p>
                      </div>
                    </div>
                    <Progress value={domain.score} className="mb-3" />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{domain.verifications} verifications</span>
                      <span>Last active: {domain.recentActivity}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">How Expertise is Calculated</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• AI analyzes your voting patterns in specific domains</li>
                  <li>• Quality of contributions to domain-specific discussions</li>
                  <li>• Community verifications from other domain experts</li>
                  <li>• Accuracy of predictions in domain-related proposals</li>
                  <li>• Consistency of participation in domain topics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reputation History</CardTitle>
              <p className="text-sm text-gray-600">
                Track how your reputation has evolved over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reputationHistory.map((entry, index) => {
                  const Icon = getCategoryIcon(entry.category);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{entry.action}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(entry.date).toLocaleDateString()} • {entry.category}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge
                          variant="outline"
                          className={entry.change > 0 ? "bg-green-50 text-green-700 border-green-300" : "bg-red-50 text-red-700 border-red-300"}
                        >
                          {entry.change > 0 ? "+" : ""}{entry.change}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reputation Badges</CardTitle>
              <p className="text-sm text-gray-600">
                Earn badges by achieving governance milestones
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative border-2 rounded-lg p-4 ${
                      badge.earned
                        ? "bg-white border-purple-200"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          badge.earned ? getRarityColor(badge.rarity) : "bg-gray-300"
                        }`}
                      >
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              badge.rarity === "legendary"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                : badge.rarity === "epic"
                                ? "bg-purple-100 text-purple-700 border-purple-300"
                                : badge.rarity === "rare"
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                          >
                            {badge.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        {badge.earned && badge.earnedDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        )}
                        {!badge.earned && (
                          <p className="text-xs text-gray-500 mt-2">Not yet earned</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Benefits */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            How Reputation Integrates with Other Mechanisms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Liquid Democracy</h4>
              <p className="text-xs text-gray-600">
                Members can see your domain expertise and reputation before delegating to you
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Holographic Consensus</h4>
              <p className="text-xs text-gray-600">
                High reputation members' attention carries more weight in priority scoring
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">AI Ethics Arbitrator</h4>
              <p className="text-xs text-gray-600">
                High ethics scores allow you to challenge proposals with more authority
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Quadratic Voting</h4>
              <p className="text-xs text-gray-600">
                Reputation adds a multiplier to prevent Sybil attacks on quadratic voting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
