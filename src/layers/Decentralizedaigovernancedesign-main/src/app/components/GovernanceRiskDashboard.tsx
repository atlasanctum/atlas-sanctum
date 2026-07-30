import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Eye,
  Zap,
  Target,
  Clock,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ThreatDetection {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  detectedAt: string;
  affected: string;
  status: "active" | "mitigated" | "investigating";
  confidence: number;
}

interface VotingPattern {
  pattern: string;
  addresses: string[];
  suspicionScore: number;
  firstDetected: string;
  occurrences: number;
}

interface ConcentrationRisk {
  metric: string;
  value: number;
  threshold: number;
  status: "safe" | "warning" | "danger";
  trend: "improving" | "stable" | "worsening";
}

interface SecurityMetric {
  name: string;
  value: number;
  status: "healthy" | "warning" | "critical";
  change24h: number;
}

export function GovernanceRiskDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("24h");

  // Mock data
  const overallThreatLevel = 28; // 0-100

  const threats: ThreatDetection[] = [
    {
      id: "1",
      type: "Coordinated Voting",
      severity: "high",
      description: "15 addresses voting identically across 8 proposals. Possible Sybil attack or vote buying.",
      detectedAt: "2026-01-23T08:30:00Z",
      affected: "Proposal #234, #235, #237-242",
      status: "investigating",
      confidence: 87,
    },
    {
      id: "2",
      type: "Whale Accumulation",
      severity: "medium",
      description: "Single address accumulated 4.2% of total voting power in 48 hours.",
      detectedAt: "2026-01-22T14:15:00Z",
      affected: "Voting Power Distribution",
      status: "active",
      confidence: 92,
    },
    {
      id: "3",
      type: "Unusual Delegation Pattern",
      severity: "medium",
      description: "23 new addresses delegating to same delegate within 2-hour window.",
      detectedAt: "2026-01-22T10:00:00Z",
      affected: "Delegate 0x7d4b...a8c6",
      status: "mitigated",
      confidence: 76,
    },
    {
      id: "4",
      type: "Flash Loan Voting",
      severity: "critical",
      description: "Attempt to borrow tokens, vote, and return within same block detected.",
      detectedAt: "2026-01-21T18:45:00Z",
      affected: "Proposal #229",
      status: "mitigated",
      confidence: 98,
    },
  ];

  const votingPatterns: VotingPattern[] = [
    {
      pattern: "Identical Vote Timing",
      addresses: [
        "0x1a2b...c3d4",
        "0x5e6f...g7h8",
        "0x9i0j...k1l2",
        "0x3m4n...o5p6",
        "0x7q8r...s9t0",
      ],
      suspicionScore: 85,
      firstDetected: "2026-01-20",
      occurrences: 12,
    },
    {
      pattern: "Sequential Block Voting",
      addresses: ["0xaa1b...c2d3", "0xee4f...g5h6", "0xii7j...k8l9"],
      suspicionScore: 72,
      firstDetected: "2026-01-19",
      occurrences: 8,
    },
    {
      pattern: "Mirror Voting (Same Choices)",
      addresses: [
        "0x2bb3...d4e5",
        "0x6ff7...h8i9",
        "0x0jj1...l2m3",
        "0x4nn5...p6q7",
        "0x8rr9...t0u1",
        "0x2vv3...x4y5",
        "0x6zz7...a8b9",
      ],
      suspicionScore: 91,
      firstDetected: "2026-01-18",
      occurrences: 15,
    },
  ];

  const concentrationRisks: ConcentrationRisk[] = [
    {
      metric: "Top 10 Holders Voting Power",
      value: 42,
      threshold: 50,
      status: "warning",
      trend: "worsening",
    },
    {
      metric: "Single Delegate Power",
      value: 8,
      threshold: 15,
      status: "safe",
      trend: "stable",
    },
    {
      metric: "Proposal Success Rate (24h)",
      value: 94,
      threshold: 80,
      status: "warning",
      trend: "worsening",
    },
    {
      metric: "Treasury Concentration",
      value: 67,
      threshold: 70,
      status: "warning",
      trend: "improving",
    },
    {
      metric: "Active Voter Diversity",
      value: 82,
      threshold: 70,
      status: "safe",
      trend: "stable",
    },
  ];

  const securityMetrics: SecurityMetric[] = [
    {
      name: "Voting Power Distribution (Gini)",
      value: 0.38,
      status: "healthy",
      change24h: -2.3,
    },
    {
      name: "Average Vote Participation",
      value: 67,
      status: "healthy",
      change24h: 3.4,
    },
    {
      name: "Delegation Centralization",
      value: 34,
      status: "warning",
      change24h: 5.7,
    },
    {
      name: "Proposal Success Rate",
      value: 94,
      status: "warning",
      change24h: 8.2,
    },
    {
      name: "New Voter Rate",
      value: 12,
      status: "healthy",
      change24h: -1.2,
    },
    {
      name: "Treasury Withdrawal Velocity",
      value: 23,
      status: "healthy",
      change24h: -4.1,
    },
  ];

  const recentEvents = [
    {
      time: "3m ago",
      event: "Flash loan attack blocked",
      severity: "critical",
      action: "Automatic defense triggered",
    },
    {
      time: "15m ago",
      event: "Whale accumulation detected",
      severity: "medium",
      action: "Monitoring initiated",
    },
    {
      time: "1h ago",
      event: "Coordinated voting pattern",
      severity: "high",
      action: "Investigation started",
    },
    {
      time: "2h ago",
      event: "Unusual delegation spike",
      severity: "medium",
      action: "Alert sent to guardians",
    },
    {
      time: "4h ago",
      event: "Proposal similarity to known exploit",
      severity: "high",
      action: "Proposal flagged for review",
    },
  ];

  const getThreatLevelColor = (level: number) => {
    if (level >= 75) return "text-red-600";
    if (level >= 50) return "text-orange-600";
    if (level >= 25) return "text-yellow-600";
    return "text-green-600";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "mitigated":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "investigating":
        return <Eye className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskStatusColor = (status: string) => {
    switch (status) {
      case "danger":
        return "bg-red-100 text-red-700 border-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white p-2 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2>Governance Risk Dashboard</h2>
            <p className="text-sm text-gray-600">
              Real-time threat detection and attack monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Threat Level Card */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Overall Threat Level</h3>
              <p className="text-sm text-gray-600">
                AI-powered analysis of governance attack risks
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getThreatLevelColor(overallThreatLevel)}`}>
                {overallThreatLevel}
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 mt-2">
                Elevated
              </Badge>
            </div>
          </div>

          <div className="mb-4">
            <Progress value={overallThreatLevel} className="h-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs text-gray-600">Critical</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">High</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-600">Medium</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Active Threats</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Real-time Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Real-Time Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            event.severity === "critical"
                              ? "bg-red-600"
                              : event.severity === "high"
                              ? "bg-orange-600"
                              : event.severity === "medium"
                              ? "bg-yellow-600"
                              : "bg-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900">{event.event}</p>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {event.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{event.action}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Concentration Risks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  Concentration Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {concentrationRisks.map((risk, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{risk.metric}</p>
                        <Badge variant="outline" className={getRiskStatusColor(risk.status)}>
                          {risk.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">{risk.value}%</span>
                        <span className="text-xs text-gray-600">Threshold: {risk.threshold}%</span>
                      </div>
                      <Progress
                        value={(risk.value / risk.threshold) * 100}
                        className="h-1 mb-2"
                      />
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        {risk.trend === "improving" && (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-600 rotate-180" />
                            <span className="text-green-600">Improving</span>
                          </>
                        )}
                        {risk.trend === "worsening" && (
                          <>
                            <TrendingUp className="w-3 h-3 text-red-600" />
                            <span className="text-red-600">Worsening</span>
                          </>
                        )}
                        {risk.trend === "stable" && (
                          <>
                            <Activity className="w-3 h-3" />
                            <span>Stable</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What We Monitor */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                What We Monitor 24/7
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Attack Vectors</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Flash loan attacks</li>
                    <li>• Sybil attacks</li>
                    <li>• Vote buying schemes</li>
                    <li>• Governance takeovers</li>
                    <li>• Treasury drain attempts</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Voting Patterns</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Coordinated voting</li>
                    <li>• Unusual timing patterns</li>
                    <li>• Delegation anomalies</li>
                    <li>• Power concentration</li>
                    <li>• Bot-like behavior</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Economic Signals</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Whale movements</li>
                    <li>• Token accumulation</li>
                    <li>• Proposal success rates</li>
                    <li>• Treasury velocity</li>
                    <li>• Voting power shifts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threats Tab */}
        <TabsContent value="threats" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{threats.length} active threats detected</p>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div className="space-y-4">
            {threats.map((threat, index) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={threat.severity === "critical" ? "border-2 border-red-300" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{threat.type}</h3>
                          <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                            {getStatusIcon(threat.status)}
                            <span className="text-gray-700">{threat.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Detected: {new Date(threat.detectedAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>Confidence: {threat.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Affected:</p>
                      <p className="text-sm font-medium text-gray-900">{threat.affected}</p>
                    </div>

                    {threat.confidence >= 85 && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">
                              High Confidence Detection
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                              Automated defense mechanisms have been activated
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suspicious Voting Patterns</CardTitle>
              <p className="text-sm text-gray-600">
                AI-detected patterns that may indicate coordinated attacks
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {votingPatterns.map((pattern, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{pattern.pattern}</h4>
                        <p className="text-xs text-gray-500">
                          First detected: {pattern.firstDetected} • {pattern.occurrences} occurrences
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${
                            pattern.suspicionScore >= 85
                              ? "text-red-600"
                              : pattern.suspicionScore >= 70
                              ? "text-orange-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {pattern.suspicionScore}
                        </div>
                        <p className="text-xs text-gray-600">Suspicion</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-2">
                        Involved Addresses ({pattern.addresses.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pattern.addresses.map((addr, i) => (
                          <code key={i} className="text-xs bg-white px-2 py-1 rounded border">
                            {addr}
                          </code>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Health Metrics</CardTitle>
              <p className="text-sm text-gray-600">
                Key indicators of governance system health
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 flex-1">{metric.name}</h4>
                      <Badge
                        variant="outline"
                        className={
                          metric.status === "healthy"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : metric.status === "warning"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                            : "bg-red-100 text-red-700 border-red-300"
                        }
                      >
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="flex items-end justify-between">
                      <span
                        className={`text-2xl font-bold ${
                          metric.status === "healthy"
                            ? "text-green-600"
                            : metric.status === "warning"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.value}
                        {metric.name.includes("Rate") || metric.name.includes("Participation")
                          ? "%"
                          : ""}
                      </span>
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          metric.change24h > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {metric.change24h > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3 rotate-180" />
                        )}
                        <span>{Math.abs(metric.change24h).toFixed(1)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Automated Defenses */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Automated Defenses Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Flash Loan Protection</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Automatic detection and blocking of same-block voting attempts
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Sybil Resistance</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Pattern recognition identifies coordinated fake accounts
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Rate Limiting</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Prevents spam attacks and rapid proposal submission
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Anomaly Detection</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    ML models flag unusual voting and delegation patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Card */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            Integration with Other Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Optimistic Governance</h4>
              <p className="text-xs text-gray-600">
                Automatically challenges suspicious proposals during timelock
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Ethics Arbitrator</h4>
              <p className="text-xs text-gray-600">
                Feeds threat intelligence to ethics review system
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Reputation System</h4>
              <p className="text-xs text-gray-600">
                Suspicious behavior reduces reputation scores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
