import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Key,
  Zap,
  Info,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

interface ZKVoteProof {
  proofHash: string;
  commitment: string;
  nullifier: string;
  timestamp: string;
  verified: boolean;
}

interface PrivateVote {
  proposalId: string;
  proposalTitle: string;
  encryptedVote: string;
  proof: ZKVoteProof;
  votedAt: string;
}

interface ProposalWithPrivacy {
  id: string;
  title: string;
  description: string;
  votesFor: number; // Public tally
  votesAgainst: number; // Public tally
  totalVotes: number; // Public count
  privacyEnabled: boolean;
  hasVoted: boolean;
  zkProofsCount: number;
}

export function ZKPrivacyVoting() {
  const [activeTab, setActiveTab] = useState("overview");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);

  // Mock data
  const proposals: ProposalWithPrivacy[] = [
    {
      id: "1",
      title: "Implement Privacy-Preserving Treasury Transactions",
      description: "Enable shielded transactions for sensitive treasury operations",
      votesFor: 247, // Only totals are public
      votesAgainst: 89,
      totalVotes: 336,
      privacyEnabled: true,
      hasVoted: false,
      zkProofsCount: 336,
    },
    {
      id: "2",
      title: "Anonymous Whistleblower Protection System",
      description: "Create secure channel for reporting governance issues",
      votesFor: 412,
      votesAgainst: 45,
      totalVotes: 457,
      privacyEnabled: true,
      hasVoted: true,
      zkProofsCount: 457,
    },
    {
      id: "3",
      title: "Salary Disclosure Requirements for Core Team",
      description: "Require public disclosure of all core team compensation",
      votesFor: 189,
      votesAgainst: 234,
      totalVotes: 423,
      privacyEnabled: true,
      hasVoted: false,
      zkProofsCount: 423,
    },
  ];

  const myPrivateVotes: PrivateVote[] = [
    {
      proposalId: "2",
      proposalTitle: "Anonymous Whistleblower Protection System",
      encryptedVote: "0x7f3a9b2c...e5d8a1f4",
      proof: {
        proofHash: "0x9d4e2a...b7c3f8",
        commitment: "0x3f8d...9a2e",
        nullifier: "0x5c1b...e7f4",
        timestamp: "2026-01-22T14:32:00Z",
        verified: true,
      },
      votedAt: "2026-01-22T14:32:00Z",
    },
  ];

  const handleCastPrivateVote = async (proposalId: string, vote: "for" | "against") => {
    setIsGeneratingProof(true);
    
    // Simulate ZK proof generation (in production, this would use actual ZK library)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsGeneratingProof(false);
    toast.success("Private vote submitted successfully! Your vote is encrypted and anonymous.");
    
    // In production, this would:
    // 1. Generate ZK proof that you're eligible to vote
    // 2. Encrypt your vote
    // 3. Submit proof + encrypted vote to smart contract
    // 4. Nullifier prevents double voting
  };

  const zkTechnology = [
    {
      name: "zk-SNARKs",
      description: "Zero-Knowledge Succinct Non-Interactive Argument of Knowledge",
      use: "Prove you can vote without revealing who you are",
      status: "active",
    },
    {
      name: "Pedersen Commitments",
      description: "Cryptographic commitment scheme",
      use: "Commit to your vote without revealing it",
      status: "active",
    },
    {
      name: "Nullifiers",
      description: "Unique identifier preventing double voting",
      use: "Ensure one vote per member without tracking",
      status: "active",
    },
    {
      name: "Homomorphic Encryption",
      description: "Compute on encrypted data",
      use: "Tally votes without decrypting individual ballots",
      status: "active",
    },
  ];

  const privacyThreats = [
    {
      threat: "Voter Coercion",
      description: "Forcing someone to vote a certain way",
      mitigation: "Votes are private, cannot be proven to anyone",
      severity: "high",
    },
    {
      threat: "Vote Buying",
      description: "Paying for votes with proof of compliance",
      mitigation: "Cannot prove how you voted, makes buying impossible",
      severity: "high",
    },
    {
      threat: "Social Pressure",
      description: "Community pressure to vote certain way",
      mitigation: "Vote remains secret, resist pressure without consequences",
      severity: "medium",
    },
    {
      threat: "Employer/Authority Tracking",
      description: "Powerful entities tracking voting behavior",
      mitigation: "Zero knowledge proofs hide all voting patterns",
      severity: "high",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2>Zero-Knowledge Privacy Voting</h2>
            <p className="text-sm text-gray-600">
              Anonymous voting with public verification using cryptographic proofs
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Status Card */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your Privacy Protection</h3>
              <p className="text-sm text-gray-600">
                Zero-knowledge proofs ensure your vote remains private while publicly verifiable
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Vote Privacy</span>
              </div>
              <p className="text-xs text-gray-600">
                Your vote choice is encrypted and never revealed
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Identity Privacy</span>
              </div>
              <p className="text-xs text-gray-600">
                Your identity is hidden from all observers
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Public Verification</span>
              </div>
              <p className="text-xs text-gray-600">
                Anyone can verify the tally is correct
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Enable Privacy Mode</span>
              <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
            </div>
            <p className="text-xs text-gray-600">
              {privacyMode
                ? "✓ All your votes will use zero-knowledge proofs for maximum privacy"
                : "⚠ Privacy mode disabled - your votes will be public"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vote">Cast Vote</TabsTrigger>
          <TabsTrigger value="proofs">My Proofs</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-indigo-600" />
                  How ZK Voting Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Generate Proof</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Create cryptographic proof that you're eligible to vote
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Encrypt Vote</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Your vote is encrypted so no one can see your choice
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Submit Anonymously</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Vote is recorded without linking to your identity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Public Tally</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Results are computed and verified without revealing individual votes
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Threats Prevented */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Privacy Threats Prevented
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {privacyThreats.map((threat, index) => (
                    <div key={index} className="bg-white rounded-lg p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{threat.threat}</h4>
                        <Badge
                          variant="outline"
                          className={
                            threat.severity === "high"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : "bg-yellow-100 text-yellow-700 border-yellow-300"
                          }
                        >
                          {threat.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{threat.description}</p>
                      <div className="flex items-start gap-2 bg-green-50 rounded p-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-700">{threat.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mathematical Guarantees */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Mathematical Privacy Guarantees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Computational Soundness
                  </h4>
                  <p className="text-xs text-gray-600">
                    It's computationally infeasible to fake a proof without being eligible.
                    Even quantum computers can't break the encryption in reasonable time.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Perfect Hiding
                  </h4>
                  <p className="text-xs text-gray-600">
                    Your vote commitment reveals absolutely zero information about your choice.
                    Not probabilistic - mathematically impossible to extract.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Non-Interactive
                  </h4>
                  <p className="text-xs text-gray-600">
                    Proofs don't require back-and-forth communication. Submit once and
                    anyone can verify independently.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Unlinkable
                  </h4>
                  <p className="text-xs text-gray-600">
                    Even if you vote multiple times on different proposals, your votes
                    cannot be linked together.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Benefits */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                Works With All Voting Mechanisms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Quadratic Voting</h4>
                  <p className="text-xs text-gray-600">
                    Spend credits privately without revealing intensity
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Conviction Voting</h4>
                  <p className="text-xs text-gray-600">
                    Commit tokens anonymously while proving ownership
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Liquid Democracy</h4>
                  <p className="text-xs text-gray-600">
                    Delegate privately without revealing to whom
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vote Tab */}
        <TabsContent value="vote" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cast Private Votes</CardTitle>
              <p className="text-sm text-gray-600">
                Your vote will be encrypted and submitted with a zero-knowledge proof
              </p>
            </CardHeader>
            <CardContent>
              {!privacyMode && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Privacy Mode Disabled</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Enable privacy mode in the Overview tab to cast anonymous votes
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {proposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {proposal.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700 border-green-300"
                          >
                            <Lock className="w-3 h-3 mr-1" />
                            Privacy Enabled
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {proposal.zkProofsCount} anonymous votes
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Public Tally (no individual votes shown) */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Public Tally</span>
                        <span className="text-sm font-medium text-gray-900">
                          {proposal.totalVotes} total votes
                        </span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className="flex-1">
                          <Progress
                            value={(proposal.votesFor / proposal.totalVotes) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          For: {proposal.votesFor} (
                          {((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)}%)
                        </span>
                        <span>
                          Against: {proposal.votesAgainst} (
                          {((proposal.votesAgainst / proposal.totalVotes) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    {/* Voting Actions */}
                    {!proposal.hasVoted ? (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleCastPrivateVote(proposal.id, "for")}
                          disabled={!privacyMode || isGeneratingProof}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isGeneratingProof ? (
                            <>
                              <Zap className="w-4 h-4 mr-2 animate-pulse" />
                              Generating Proof...
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Vote For (Private)
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleCastPrivateVote(proposal.id, "against")}
                          disabled={!privacyMode || isGeneratingProof}
                          variant="outline"
                          className="flex-1"
                        >
                          {isGeneratingProof ? (
                            <>
                              <Zap className="w-4 h-4 mr-2 animate-pulse" />
                              Generating Proof...
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Vote Against (Private)
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-900">
                          You've voted privately on this proposal
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Proofs Tab */}
        <TabsContent value="proofs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Zero-Knowledge Proofs</CardTitle>
              <p className="text-sm text-gray-600">
                Cryptographic proofs of your votes - verifiable but reveals nothing about your choice
              </p>
            </CardHeader>
            <CardContent>
              {myPrivateVotes.length === 0 ? (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No private votes yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPrivateVotes.map((vote, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {vote.proposalTitle}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Voted: {new Date(vote.votedAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            vote.proof.verified
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-yellow-100 text-yellow-700 border-yellow-300"
                          }
                        >
                          {vote.proof.verified ? "✓ Verified" : "⏳ Pending"}
                        </Badge>
                      </div>

                      <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Encrypted Vote</span>
                          <code className="text-xs font-mono text-gray-900">
                            {vote.encryptedVote}
                          </code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Proof Hash</span>
                          <code className="text-xs font-mono text-gray-900">
                            {vote.proof.proofHash}
                          </code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Commitment</span>
                          <code className="text-xs font-mono text-gray-900">
                            {vote.proof.commitment}
                          </code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Nullifier</span>
                          <code className="text-xs font-mono text-gray-900">
                            {vote.proof.nullifier}
                          </code>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800">
                          <Info className="w-3 h-3 inline mr-1" />
                          This proof confirms you voted without revealing your choice or identity.
                          Anyone can verify it's valid, but no one can link it to you.
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technology Tab */}
        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Zero-Knowledge Technology Stack</CardTitle>
              <p className="text-sm text-gray-600">
                Cryptographic primitives powering private voting
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zkTechnology.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{tech.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{tech.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Active
                      </Badge>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 mt-3">
                      <p className="text-xs text-indigo-900">
                        <strong>Use Case:</strong> {tech.use}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Security Parameters</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Curve:</span>
                    <code className="ml-2 font-mono text-gray-900">BN254</code>
                  </div>
                  <div>
                    <span className="text-gray-600">Security Level:</span>
                    <code className="ml-2 font-mono text-gray-900">128-bit</code>
                  </div>
                  <div>
                    <span className="text-gray-600">Proof Size:</span>
                    <code className="ml-2 font-mono text-gray-900">~200 bytes</code>
                  </div>
                  <div>
                    <span className="text-gray-600">Verification Time:</span>
                    <code className="ml-2 font-mono text-gray-900">~5ms</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research References */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base">Academic Foundations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1">MACI (Minimal Anti-Collusion Infrastructure)</p>
                  <p className="text-xs text-gray-600">
                    Vitalik Buterin et al. - Combines ZK-SNARKs with vote encryption to prevent bribery
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1">zk-SNARKs</p>
                  <p className="text-xs text-gray-600">
                    Groth16, PLONK - Succinct proofs enabling efficient blockchain verification
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1">Semaphore Protocol</p>
                  <p className="text-xs text-gray-600">
                    Privacy-preserving group membership proofs for anonymous signaling
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
