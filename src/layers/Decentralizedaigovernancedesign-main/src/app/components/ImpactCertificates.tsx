import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  BarChart3,
  Clock,
  Info,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";

interface ImpactCertificate {
  id: string;
  proposalTitle: string;
  proposalId: string;
  certificateType: "hypercert" | "impact_nft" | "outcome_token";
  predictedImpact: {
    metric: string;
    value: number;
    confidence: number;
  };
  currentPrice: number;
  priceChange24h: number;
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  createdAt: string;
  maturityDate: string;
  status: "active" | "mature" | "settled";
}

interface ImpactMarket {
  certificateId: string;
  buyOrders: MarketOrder[];
  sellOrders: MarketOrder[];
  lastTrade: number;
  priceHistory: PricePoint[];
}

interface MarketOrder {
  id: string;
  user: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  total: number;
}

interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

interface ImpactFunding {
  certificateId: string;
  fundsRaised: number;
  fundingGoal: number;
  backers: number;
  workInProgress: string;
  estimatedCompletion: string;
}

export function ImpactCertificates() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  // Mock data
  const certificates: ImpactCertificate[] = [
    {
      id: "1",
      proposalTitle: "AI-Powered Proposal Analysis Engine",
      proposalId: "P-234",
      certificateType: "hypercert",
      predictedImpact: {
        metric: "Proposals Analyzed",
        value: 10000,
        confidence: 87,
      },
      currentPrice: 12.5,
      priceChange24h: 8.3,
      totalSupply: 100000,
      circulatingSupply: 45000,
      marketCap: 562500,
      volume24h: 18750,
      holders: 234,
      createdAt: "2026-01-10",
      maturityDate: "2026-07-10",
      status: "active",
    },
    {
      id: "2",
      proposalTitle: "Community Onboarding Improvement",
      proposalId: "P-187",
      certificateType: "impact_nft",
      predictedImpact: {
        metric: "New Members Onboarded",
        value: 5000,
        confidence: 92,
      },
      currentPrice: 8.2,
      priceChange24h: -2.1,
      totalSupply: 50000,
      circulatingSupply: 38000,
      marketCap: 311600,
      volume24h: 12400,
      holders: 167,
      createdAt: "2026-01-05",
      maturityDate: "2026-06-05",
      status: "active",
    },
    {
      id: "3",
      proposalTitle: "Treasury Optimization Strategy",
      proposalId: "P-298",
      certificateType: "outcome_token",
      predictedImpact: {
        metric: "Treasury Growth ($)",
        value: 250000,
        confidence: 78,
      },
      currentPrice: 15.8,
      priceChange24h: 12.4,
      totalSupply: 75000,
      circulatingSupply: 62000,
      marketCap: 979600,
      volume24h: 45200,
      holders: 312,
      createdAt: "2025-12-20",
      maturityDate: "2026-06-20",
      status: "active",
    },
    {
      id: "4",
      proposalTitle: "Governance Participation Incentives",
      proposalId: "P-156",
      certificateType: "hypercert",
      predictedImpact: {
        metric: "Participation Rate Increase (%)",
        value: 25,
        confidence: 85,
      },
      currentPrice: 22.4,
      priceChange24h: 0.8,
      totalSupply: 80000,
      circulatingSupply: 80000,
      marketCap: 1792000,
      volume24h: 8900,
      holders: 421,
      createdAt: "2025-11-15",
      maturityDate: "2026-05-15",
      status: "mature",
    },
  ];

  const fundingProjects: ImpactFunding[] = [
    {
      certificateId: "1",
      fundsRaised: 342000,
      fundingGoal: 500000,
      backers: 234,
      workInProgress: "Phase 2: ML model training with 10K+ historical proposals",
      estimatedCompletion: "2026-04-15",
    },
    {
      certificateId: "2",
      fundsRaised: 289000,
      fundingGoal: 350000,
      backers: 167,
      workInProgress: "Phase 3: Interactive tutorials and video content production",
      estimatedCompletion: "2026-03-20",
    },
    {
      certificateId: "3",
      fundsRaised: 625000,
      fundingGoal: 600000,
      backers: 312,
      workInProgress: "Fully funded - Strategy implementation in progress",
      estimatedCompletion: "2026-05-10",
    },
  ];

  const handleBuyCertificate = (certId: string, amount: number) => {
    toast.success(`Purchased ${amount} impact certificates!`);
  };

  const handleSellCertificate = (certId: string, amount: number) => {
    toast.success(`Sold ${amount} impact certificates!`);
  };

  const getCertificateTypeColor = (type: string) => {
    switch (type) {
      case "hypercert":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "impact_nft":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "outcome_token":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "mature":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "settled":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const totalMarketCap = certificates.reduce((sum, cert) => sum + cert.marketCap, 0);
  const total24hVolume = certificates.reduce((sum, cert) => sum + cert.volume24h, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-2 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2>Impact Certificates & Hypercerts</h2>
            <p className="text-sm text-gray-600">
              Trade future governance outcomes - speculate on impact before it happens
            </p>
          </div>
        </div>
      </div>

      {/* Market Stats Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Market Cap</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalMarketCap / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">24h Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(total24hVolume / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Active Markets</p>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.filter((c) => c.status === "active").length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Traders</p>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.reduce((sum, c) => sum + c.holders, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What Are Impact Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  What Are Impact Certificates?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h4 className="text-sm font-semibold text-purple-900 mb-1">Hypercerts</h4>
                    <p className="text-xs text-purple-700">
                      Tokenize the future impact of governance proposals. Buy certificates that pay out
                      based on actual measured outcomes.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Impact NFTs</h4>
                    <p className="text-xs text-blue-700">
                      Unique certificates representing specific impact milestones. Collectors support
                      governance work and earn returns.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h4 className="text-sm font-semibold text-green-900 mb-1">Outcome Tokens</h4>
                    <p className="text-xs text-green-700">
                      Fungible tokens that settle based on measurable KPIs. Trade on predicted outcomes
                      before proposals execute.
                    </p>
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
                      💰 Fund Work Before It's Done
                    </h4>
                    <p className="text-xs text-gray-600">
                      Sell future impact to raise capital now. Contributors get funded upfront by
                      speculators.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      📊 Price Discovery for Impact
                    </h4>
                    <p className="text-xs text-gray-600">
                      Market prices reveal collective prediction of proposal success. Better than
                      voting.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      🎯 Accountability Through Markets
                    </h4>
                    <p className="text-xs text-gray-600">
                      Contributors have skin in the game. Certificate holders monitor delivery.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      🔄 Liquidity for Public Goods
                    </h4>
                    <p className="text-xs text-gray-600">
                      Turn non-liquid impact into tradeable assets. Exit before project completes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How Value Flows */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                How Value Flows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    1
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Proposal Submitted</h4>
                  <p className="text-xs text-gray-600">
                    Contributor creates impact certificates for predicted outcomes
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    2
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Market Opens</h4>
                  <p className="text-xs text-gray-600">
                    Speculators buy certificates at discount, funding the work
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    3
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Work Delivered</h4>
                  <p className="text-xs text-gray-600">
                    Contributor executes proposal with raised funds
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    4
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Impact Measured</h4>
                  <p className="text-xs text-gray-600">
                    Certificates settle based on actual outcomes achieved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-600" />
                Integration with Other Mechanisms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Futarchy Markets</h4>
                  <p className="text-xs text-gray-600">
                    Impact certificates extend futarchy by making outcomes tradeable
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">RPGF</h4>
                  <p className="text-xs text-gray-600">
                    Combines retroactive funding with predictive markets
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Prediction</h4>
                  <p className="text-xs text-gray-600">
                    AI forecasts seed initial certificate pricing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{certificates.length} active markets</p>
            <Button className="bg-purple-600 hover:bg-purple-700">Create Certificate</Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {cert.proposalTitle}
                          </h3>
                          <Badge variant="outline" className={getCertificateTypeColor(cert.certificateType)}>
                            {cert.certificateType.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(cert.status)}>
                            {cert.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>ID: {cert.id}</span>
                          <span>•</span>
                          <span>Proposal: {cert.proposalId}</span>
                          <span>•</span>
                          <span>Matures: {new Date(cert.maturityDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Market Data */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Current Price</p>
                        <div className="flex items-end gap-2">
                          <p className="text-lg font-semibold text-gray-900">${cert.currentPrice}</p>
                          <span
                            className={`text-xs ${
                              cert.priceChange24h > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {cert.priceChange24h > 0 ? "+" : ""}
                            {cert.priceChange24h.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Market Cap</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${(cert.marketCap / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">24h Volume</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${(cert.volume24h / 1000).toFixed(1)}K
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Holders</p>
                        <p className="text-lg font-semibold text-gray-900">{cert.holders}</p>
                      </div>
                    </div>

                    {/* Predicted Impact */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-blue-900">Predicted Impact</h4>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                          {cert.predictedImpact.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold text-blue-900">
                          {cert.predictedImpact.value.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700 mb-1">{cert.predictedImpact.metric}</p>
                      </div>
                    </div>

                    {/* Trading Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Circulating Supply</p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(cert.circulatingSupply / cert.totalSupply) * 100}
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-gray-600">
                            {((cert.circulatingSupply / cert.totalSupply) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleBuyCertificate(cert.id, 100)}
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSellCertificate(cert.id, 100)}
                      >
                        Sell
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Funding Tab */}
        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Impact Funding</CardTitle>
              <p className="text-sm text-gray-600">
                Contributors raising funds by selling future impact certificates
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fundingProjects.map((project, index) => {
                  const cert = certificates.find((c) => c.id === project.certificateId);
                  if (!cert) return null;

                  return (
                    <motion.div
                      key={project.certificateId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {cert.proposalTitle}
                          </h3>
                          <p className="text-sm text-gray-600">{project.workInProgress}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Funds Raised</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${(project.fundsRaised / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Goal</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${(project.fundingGoal / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Backers</p>
                          <p className="text-xl font-bold text-gray-900">{project.backers}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Funding Progress</span>
                          <span className="font-medium text-gray-900">
                            {((project.fundsRaised / project.fundingGoal) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={(project.fundsRaised / project.fundingGoal) * 100}
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            Est. Completion: {new Date(project.estimatedCompletion).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleBuyCertificate(cert.id, 500)}
                        >
                          Back This Project
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* How It Works Tab */}
        <TabsContent value="how-it-works" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Complete Flow: From Idea to Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Create Certificate</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Contributor submits proposal with measurable impact metrics (e.g., "Will onboard 5000
                      new members")
                    </p>
                    <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-800">
                      AI analyzes feasibility and suggests certificate parameters
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Market Opens</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Certificates are minted and listed on market. Speculators can buy at discount.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                      Initial price based on AI prediction, then market-driven
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Contributor Funded</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      As certificates sell, contributor receives funds to execute the work.
                    </p>
                    <div className="bg-green-50 rounded-lg p-3 text-xs text-green-800">
                      Can sell partial supply, keeping some for upside if over-deliver
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Work Delivered & Measured
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      After maturity date, actual impact is measured against predictions.
                    </p>
                    <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800">
                      AI + community verification ensures accurate measurement
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Settlement</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Certificates redeem for value based on actual vs predicted impact.
                    </p>
                    <div className="bg-red-50 rounded-lg p-3 text-xs text-red-800">
                      Over-delivery → Certificate holders profit
                      <br />
                      Under-delivery → Reduced payout
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Scenarios */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base">Example Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    🎯 Scenario: Over-Delivery
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Predicted: 5000 new members | Actual: 7500 members (+50%)
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-600">Certificate bought at:</p>
                      <p className="font-semibold text-gray-900">$10</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Settles at:</p>
                      <p className="font-semibold text-green-600">$15 (+50% profit)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    ⚠️ Scenario: Under-Delivery
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Predicted: $250K treasury growth | Actual: $150K (-40%)
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-600">Certificate bought at:</p>
                      <p className="font-semibold text-gray-900">$15</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Settles at:</p>
                      <p className="font-semibold text-red-600">$9 (-40% loss)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-base">Research Foundation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Hypercerts Protocol</p>
                  <p className="text-xs text-gray-600">
                    Protocol Labs - Framework for tracking and funding positive impact
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Impact Certificates</p>
                  <p className="text-xs text-gray-600">
                    Certificates of Impact - Paul Christiano's mechanism for funding AI safety
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Retroactive Public Goods</p>
                  <p className="text-xs text-gray-600">
                    Optimism's RPGF combined with predictive market mechanisms
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
