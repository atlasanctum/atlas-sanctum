import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Heart,
  Zap,
  GitBranch,
  FileText,
  Vote,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface RPGFProject {
  id: string;
  name: string;
  description: string;
  contributor: string;
  category: string;
  submittedDate: string;
  impactMetrics: {
    usersAffected: number;
    proposalsImproved: number;
    codeContributions: number;
    documentationPages: number;
  };
  attestations: number;
  fundingRequested: number;
  fundingAllocated?: number;
  status: "submitted" | "under_review" | "funded" | "rejected";
  impactScore: number;
}

interface FundingRound {
  id: string;
  name: string;
  budget: number;
  allocated: number;
  startDate: string;
  endDate: string;
  votingEnds: string;
  status: "active" | "voting" | "completed";
  projectsSubmitted: number;
  participatingVoters: number;
}

interface ImpactAttestation {
  id: string;
  projectId: string;
  attester: string;
  attestation: string;
  impactRating: number;
  date: string;
}

export function RetroactiveFunding() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [attestation, setAttestation] = useState("");
  const [impactRating, setImpactRating] = useState(4);

  // Mock data
  const currentRound: FundingRound = {
    id: "round-q1-2026",
    name: "Q1 2026 RPGF Round",
    budget: 500000,
    allocated: 342000,
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    votingEnds: "2026-02-07",
    status: "voting",
    projectsSubmitted: 42,
    participatingVoters: 237,
  };

  const projects: RPGFProject[] = [
    {
      id: "1",
      name: "AI Ethics Analysis Engine",
      description:
        "Built the core AI engine that analyzes proposals for ethical concerns. Used by 1000+ proposals.",
      contributor: "0x742d...bEb8",
      category: "Infrastructure",
      submittedDate: "2026-01-15",
      impactMetrics: {
        usersAffected: 1247,
        proposalsImproved: 89,
        codeContributions: 342,
        documentationPages: 28,
      },
      attestations: 34,
      fundingRequested: 45000,
      fundingAllocated: 42000,
      status: "under_review",
      impactScore: 94,
    },
    {
      id: "2",
      name: "Community Onboarding Program",
      description:
        "Created comprehensive tutorials and onboarding flows. Reduced new member drop-off by 67%.",
      contributor: "0x9f3c...a2b1",
      category: "Community",
      submittedDate: "2026-01-12",
      impactMetrics: {
        usersAffected: 2341,
        proposalsImproved: 0,
        codeContributions: 124,
        documentationPages: 87,
      },
      attestations: 56,
      fundingRequested: 32000,
      fundingAllocated: 35000,
      status: "under_review",
      impactScore: 91,
    },
    {
      id: "3",
      name: "Quadratic Voting Smart Contracts",
      description:
        "Implemented secure, gas-optimized smart contracts for quadratic voting mechanism.",
      contributor: "0x5a7e...c9d2",
      category: "Infrastructure",
      submittedDate: "2026-01-18",
      impactMetrics: {
        usersAffected: 3421,
        proposalsImproved: 156,
        codeContributions: 567,
        documentationPages: 42,
      },
      attestations: 47,
      fundingRequested: 55000,
      fundingAllocated: 58000,
      status: "under_review",
      impactScore: 96,
    },
    {
      id: "4",
      name: "Treasury Analytics Dashboard",
      description:
        "Built real-time treasury monitoring and analytics. Identified $120K in optimization opportunities.",
      contributor: "0x8b2f...d4e3",
      category: "Governance",
      submittedDate: "2026-01-10",
      impactMetrics: {
        usersAffected: 567,
        proposalsImproved: 23,
        codeContributions: 234,
        documentationPages: 19,
      },
      attestations: 28,
      fundingRequested: 28000,
      fundingAllocated: 30000,
      status: "under_review",
      impactScore: 88,
    },
    {
      id: "5",
      name: "Governance Research Repository",
      description:
        "Compiled academic research and best practices. Referenced in 45+ proposals.",
      contributor: "0x3c9a...f5b4",
      category: "Research",
      submittedDate: "2026-01-20",
      impactMetrics: {
        usersAffected: 892,
        proposalsImproved: 45,
        codeContributions: 0,
        documentationPages: 156,
      },
      attestations: 41,
      fundingRequested: 18000,
      fundingAllocated: 22000,
      status: "under_review",
      impactScore: 85,
    },
    {
      id: "6",
      name: "Cross-Chain Bridge Security Audit",
      description:
        "Conducted comprehensive security audit preventing potential $2M exploit.",
      contributor: "0x7d4b...a8c6",
      category: "Security",
      submittedDate: "2026-01-08",
      impactMetrics: {
        usersAffected: 5432,
        proposalsImproved: 1,
        codeContributions: 89,
        documentationPages: 67,
      },
      attestations: 62,
      fundingRequested: 65000,
      fundingAllocated: 75000,
      status: "under_review",
      impactScore: 98,
    },
  ];

  const attestations: ImpactAttestation[] = [
    {
      id: "1",
      projectId: "1",
      attester: "0x1a2b...c3d4",
      attestation: "This AI engine has been critical for our proposal review process. Saves hours of manual work.",
      impactRating: 5,
      date: "2026-01-22",
    },
    {
      id: "2",
      projectId: "1",
      attester: "0x5e6f...g7h8",
      attestation: "The ethics analysis caught issues we would have missed. Prevented two problematic proposals from passing.",
      impactRating: 5,
      date: "2026-01-21",
    },
    {
      id: "3",
      projectId: "2",
      attester: "0x9i0j...k1l2",
      attestation: "As a new member, the onboarding tutorials made everything clear. Without it, I would have been lost.",
      impactRating: 5,
      date: "2026-01-20",
    },
  ];

  const pastRounds = [
    {
      round: "Q4 2025",
      budget: 400000,
      projects: 38,
      avgFunding: 10526,
    },
    {
      round: "Q3 2025",
      budget: 350000,
      projects: 31,
      avgFunding: 11290,
    },
    {
      round: "Q2 2025",
      budget: 300000,
      projects: 27,
      avgFunding: 11111,
    },
  ];

  const handleSubmitAttestation = () => {
    if (!selectedProject || !attestation.trim()) {
      toast.error("Please select a project and provide attestation");
      return;
    }

    toast.success("Impact attestation submitted successfully!");
    setAttestation("");
    setSelectedProject(null);
    setImpactRating(4);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Infrastructure":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Community":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Governance":
        return "bg-green-100 text-green-700 border-green-300";
      case "Research":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Security":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "funded":
        return "bg-green-100 text-green-700 border-green-300";
      case "under_review":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const totalImpact = projects.reduce((sum, p) => sum + p.impactMetrics.usersAffected, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-green-600 to-teal-600 text-white p-2 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2>Retroactive Public Goods Funding (RPGF)</h2>
            <p className="text-sm text-gray-600">
              Reward impact that's already happened, not promises
            </p>
          </div>
        </div>
      </div>

      {/* Current Round Card */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentRound.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(currentRound.startDate).toLocaleDateString()} -{" "}
                {new Date(currentRound.endDate).toLocaleDateString()}
              </p>
              <Badge
                variant="outline"
                className={
                  currentRound.status === "voting"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300 mt-2"
                    : "bg-green-100 text-green-700 border-green-300 mt-2"
                }
              >
                {currentRound.status === "voting" ? "🗳️ Voting Active" : "✓ Completed"}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">
                ${(currentRound.budget / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-600">Total Budget</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">{currentRound.projectsSubmitted}</p>
              <p className="text-xs text-gray-600">Projects</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">{currentRound.participatingVoters}</p>
              <p className="text-xs text-gray-600">Voters</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">
                ${(currentRound.allocated / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-600">Allocated</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">
                {totalImpact.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Users Impacted</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Funding Allocation</span>
              <span className="font-medium text-gray-900">
                {((currentRound.allocated / currentRound.budget) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={(currentRound.allocated / currentRound.budget) * 100} className="h-2" />
          </div>

          {currentRound.status === "voting" && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Voting ends {new Date(currentRound.votingEnds).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="attest">Attest Impact</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How RPGF Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Build & Deploy</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Contributors create public goods without upfront funding
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Submit Impact</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Projects submit evidence of impact with metrics and testimonials
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Community Attests</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Members verify impact through attestations and ratings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Vote & Fund</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        DAO votes on funding allocation based on proven impact
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Distribute Rewards</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Contributors receive retroactive payment for impact
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why It's Revolutionary */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  Why It's Revolutionary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Rewards Results, Not Promises
                    </h4>
                    <p className="text-xs text-gray-600">
                      Traditional funding bets on what might work. RPGF rewards what already did work.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Removes Upfront Risk
                    </h4>
                    <p className="text-xs text-gray-600">
                      Contributors don't need to convince anyone before building. Just build and prove impact.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Objective Measurement
                    </h4>
                    <p className="text-xs text-gray-600">
                      Impact is measured through actual usage, not persuasive proposals.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Encourages Public Goods
                    </h4>
                    <p className="text-xs text-gray-600">
                      Contributors can focus on what benefits the DAO, knowing they'll be compensated.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration with Other Systems */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-600" />
                Integration with Other Mechanisms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Futarchy Markets</h4>
                  <p className="text-xs text-gray-600">
                    Prediction markets bet on which past work created most value
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Analysis</h4>
                  <p className="text-xs text-gray-600">
                    AI measures actual impact of contributions through usage data
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Reputation System</h4>
                  <p className="text-xs text-gray-600">
                    RPGF rewards increase contributor reputation scores
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Quadratic Voting</h4>
                  <p className="text-xs text-gray-600">
                    Funding allocation uses quadratic voting for fair distribution
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {projects.length} projects submitted for {currentRound.name}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Submit Your Project
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          <Badge variant="outline" className={getCategoryColor(project.category)}>
                            {project.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By {project.contributor}</span>
                          <span>•</span>
                          <span>{new Date(project.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-green-600">{project.impactScore}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  AI-calculated impact score based on metrics and attestations
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Badge variant="outline" className={getStatusColor(project.status)}>
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Users Affected</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {project.impactMetrics.usersAffected.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Proposals Improved</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {project.impactMetrics.proposalsImproved}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Code Contributions</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {project.impactMetrics.codeContributions}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">Documentation</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {project.impactMetrics.documentationPages} pages
                        </p>
                      </div>
                    </div>

                    {/* Funding & Attestations */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-gray-600">Requested</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ${project.fundingRequested.toLocaleString()}
                          </p>
                        </div>
                        {project.fundingAllocated && (
                          <div>
                            <p className="text-xs text-gray-600">Allocated</p>
                            <p className="text-sm font-semibold text-green-600">
                              ${project.fundingAllocated.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {project.attestations}
                          </span>
                          <span className="text-xs text-gray-600">attestations</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Attest Impact Tab */}
        <TabsContent value="attest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Submit Impact Attestation</CardTitle>
              <p className="text-sm text-gray-600">
                Help the community understand real-world impact by sharing your experience
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Select Project
                  </label>
                  <select
                    value={selectedProject || ""}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Impact Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setImpactRating(rating)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          impactRating >= rating
                            ? "bg-green-500 border-green-600 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {impactRating === 1 && "Minimal Impact"}
                      {impactRating === 2 && "Some Impact"}
                      {impactRating === 3 && "Moderate Impact"}
                      {impactRating === 4 && "Strong Impact"}
                      {impactRating === 5 && "Exceptional Impact"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Your Attestation
                  </label>
                  <Textarea
                    value={attestation}
                    onChange={(e) => setAttestation(e.target.value)}
                    placeholder="Describe how this project impacted you or the DAO. Be specific about outcomes, improvements, or value created..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your attestation will be publicly visible and recorded on-chain
                  </p>
                </div>

                <Button
                  onClick={handleSubmitAttestation}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!selectedProject || !attestation.trim()}
                >
                  Submit Attestation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attestations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Attestations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attestations.map((att, index) => {
                  const project = projects.find((p) => p.id === att.projectId);
                  return (
                    <motion.div
                      key={att.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{project?.name}</p>
                          <p className="text-xs text-gray-500">
                            by {att.attester} • {new Date(att.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(att.impactRating)].map((_, i) => (
                            <span key={i} className="text-yellow-500">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 italic">"{att.attestation}"</p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Past Funding Rounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastRounds.map((round, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{round.round}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {round.projects} projects funded
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(round.budget / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-gray-600">
                        ${(round.avgFunding / 1000).toFixed(1)}K avg
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Total Impact Since Launch
                </h4>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-2xl font-bold text-blue-900">$1.05M</p>
                    <p className="text-xs text-blue-700">Total Distributed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">96</p>
                    <p className="text-xs text-blue-700">Projects Funded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">14.2K</p>
                    <p className="text-xs text-blue-700">Users Impacted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
