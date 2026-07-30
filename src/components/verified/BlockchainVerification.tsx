import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Shield,
  Key,
  Hash,
  Link,
  CheckSquare,
  FileText,
  Database,
  Network,
  Zap,
  Eye
} from 'lucide-react';

interface VerificationRecord {
  id: string;
  type: 'carbon_credit' | 'measurement' | 'transaction' | 'project' | 'user';
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  hash: string;
  timestamp: Date;
  blockNumber?: number;
  transactionHash?: string;
  verifier: string;
  confidence: number;
  metadata: Record<string, any>;
}

interface BlockchainNode {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'syncing';
  blockHeight: number;
  peers: number;
  location: string;
  lastSeen: Date;
}

interface SmartContract {
  address: string;
  name: string;
  version: string;
  status: 'active' | 'deprecated' | 'audited';
  lastAudit: Date;
  functions: string[];
}

const BlockchainVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'network' | 'contracts' | 'audit'>('verification');
  const [verificationRecords, setVerificationRecords] = useState<VerificationRecord[]>([
    {
      id: '1',
      type: 'carbon_credit',
      status: 'verified',
      hash: '0x8ba1f109551bD432803012645A...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      blockNumber: 15467890,
      transactionHash: '0x5a4b3c2d1e...',
      verifier: 'Atlas Genesis Oracle',
      confidence: 0.98,
      metadata: {
        projectId: 'PRJ-001',
        credits: 1000,
        vintage: 2024
      }
    },
    {
      id: '2',
      type: 'measurement',
      status: 'pending',
      hash: '0x9cd2f210652cD543814023756B...',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      verifier: 'Sentinel-2 Satellite',
      confidence: 0.85,
      metadata: {
        location: 'Amazon Rainforest',
        metric: 'NDVI',
        value: 0.72
      }
    },
    {
      id: '3',
      type: 'transaction',
      status: 'verified',
      hash: '0x7ef3g321763dE654925134867C...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      blockNumber: 15467885,
      transactionHash: '0x3b2a1c9d8e...',
      verifier: 'Multi-sig Wallet',
      confidence: 1.0,
      metadata: {
        from: '0x742d35Cc6634C0532925a3b8...',
        to: '0x8ba1f109551bD432803012645A...',
        amount: 500,
        currency: 'RIU'
      }
    }
  ]);

  const [blockchainNodes, setBlockchainNodes] = useState<BlockchainNode[]>([
    {
      id: '1',
      name: 'Atlas Node EU-1',
      status: 'active',
      blockHeight: 15467890,
      peers: 47,
      location: 'Frankfurt, Germany',
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Atlas Node US-1',
      status: 'active',
      blockHeight: 15467890,
      peers: 52,
      location: 'Virginia, USA',
      lastSeen: new Date()
    },
    {
      id: '3',
      name: 'Atlas Node AS-1',
      status: 'syncing',
      blockHeight: 15467885,
      peers: 38,
      location: 'Singapore',
      lastSeen: new Date(Date.now() - 1000 * 30)
    }
  ]);

  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([
    {
      address: '0x742d35Cc6634C0532925a3b8444c35848',
      name: 'CarbonCreditToken',
      version: '2.1.0',
      status: 'active',
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      functions: ['mint', 'transfer', 'burn', 'verify']
    },
    {
      address: '0x8ba1f109551bD432803012645Ac136216',
      name: 'MeasurementOracle',
      version: '1.8.3',
      status: 'audited',
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      functions: ['submitMeasurement', 'validateData', 'getConsensus']
    },
    {
      address: '0x9cd2f210652cD543814023756Bc247327',
      name: 'GovernanceDAO',
      version: '3.0.1',
      status: 'active',
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      functions: ['propose', 'vote', 'execute', 'delegate']
    }
  ]);

  const tabs = [
    { id: 'verification', label: 'Verification', icon: CheckCircle },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'contracts', label: 'Smart Contracts', icon: FileText },
    { id: 'audit', label: 'Audit Trail', icon: Eye }
  ];

  const VerificationCard: React.FC<{ record: VerificationRecord }> = ({ record }) => {
    const statusColors = {
      verified: 'bg-green-500/10 text-green-500 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
      expired: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };

    const typeIcons = {
      carbon_credit: Database,
      measurement: Eye,
      transaction: Link,
      project: FileText,
      user: Shield
    };

    const TypeIcon = typeIcons[record.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize">
                {record.type.replace('_', ' ')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {record.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[record.status]}`}>
            {record.status.toUpperCase()}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Hash</span>
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {record.hash.substring(0, 16)}...
            </span>
          </div>

          {record.blockNumber && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Block</span>
              <span className="font-medium">#{record.blockNumber.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium">{(record.confidence * 100).toFixed(1)}%</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Verifier</span>
            <span className="font-medium">{record.verifier}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              View Metadata
            </summary>
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <pre className="text-xs text-muted-foreground overflow-x-auto">
                {JSON.stringify(record.metadata, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </motion.div>
    );
  };

  const NodeCard: React.FC<{ node: BlockchainNode }> = ({ node }) => {
    const statusColors = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      inactive: 'bg-red-500/10 text-red-500 border-red-500/20',
      syncing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{node.name}</h3>
            <p className="text-sm text-muted-foreground">{node.location}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[node.status]}`}>
            {node.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{node.blockHeight.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Block Height</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{node.peers}</div>
            <p className="text-xs text-muted-foreground">Peers</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Last seen: {node.lastSeen.toLocaleString()}
          </p>
        </div>
      </motion.div>
    );
  };

  const ContractCard: React.FC<{ contract: SmartContract }> = ({ contract }) => {
    const statusColors = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      deprecated: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      audited: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{contract.name}</h3>
            <p className="text-sm text-muted-foreground">v{contract.version}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[contract.status]}`}>
            {contract.status.toUpperCase()}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Address</span>
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {contract.address.substring(0, 10)}...
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Audit</span>
            <span className="font-medium">{contract.lastAudit.toLocaleDateString()}</span>
          </div>

          <div>
            <span className="text-sm text-muted-foreground block mb-2">Functions</span>
            <div className="flex flex-wrap gap-1">
              {contract.functions.map((func) => (
                <span
                  key={func}
                  className="px-2 py-1 bg-muted/50 text-xs rounded border border-border/50"
                >
                  {func}()
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Blockchain Verification</h1>
              <p className="text-muted-foreground mt-1">Immutable verification and decentralized trust</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Network Secure</span>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Key className="w-4 h-4 inline mr-2" />
                Verify New Record
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'verification' | 'network' | 'contracts' | 'audit')}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Verification Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {verificationRecords.filter(r => r.status === 'verified').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Verified Records</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {verificationRecords.filter(r => r.status === 'pending').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Pending Verification</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Hash className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {verificationRecords.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {(verificationRecords.reduce((acc, r) => acc + r.confidence, 0) / verificationRecords.length * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                </div>
              </div>

              {/* Verification Records */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Verification Records</h3>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      New Verification
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {verificationRecords.map((record) => (
                    <VerificationCard key={record.id} record={record} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'network' && (
            <motion.div
              key="network"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Network Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Network className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {blockchainNodes.filter(n => n.status === 'active').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Nodes</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Database className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {Math.max(...blockchainNodes.map(n => n.blockHeight)).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Latest Block</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {blockchainNodes.reduce((acc, n) => acc + n.peers, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Peers</p>
                </div>
              </div>

              {/* Network Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blockchainNodes.map((node) => (
                  <NodeCard key={node.id} node={node} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contracts' && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {smartContracts.map((contract) => (
                  <ContractCard key={contract.address} contract={contract} />
                ))}
              </div>

              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Contract Deployment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Recent Deployments</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">CarbonCreditToken v2.1.0</p>
                          <p className="text-xs text-muted-foreground">Deployed 2 days ago</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">MeasurementOracle v1.8.3</p>
                          <p className="text-xs text-muted-foreground">Deployed 1 week ago</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Security Audits</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">GovernanceDAO Audit</p>
                          <p className="text-xs text-muted-foreground">Completed 1 week ago</p>
                        </div>
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">CarbonCreditToken Audit</p>
                          <p className="text-xs text-muted-foreground">In progress</p>
                        </div>
                        <Clock className="w-5 h-5 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Audit Trail</h3>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Carbon credit verification',
                      actor: 'Atlas Genesis Oracle',
                      timestamp: new Date(Date.now() - 1000 * 60 * 30),
                      details: 'Verified 1000 credits for project PRJ-001'
                    },
                    {
                      action: 'Smart contract deployment',
                      actor: 'System Admin',
                      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                      details: 'Deployed GovernanceDAO v3.0.1'
                    },
                    {
                      action: 'Measurement validation',
                      actor: 'Sentinel-2 Satellite',
                      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
                      details: 'Validated NDVI measurement for Amazon location'
                    },
                    {
                      action: 'Security audit',
                      actor: 'Certik Security',
                      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
                      details: 'Completed comprehensive security audit'
                    }
                  ].map((audit, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{audit.action}</h4>
                          <span className="text-xs text-muted-foreground">
                            {audit.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{audit.details}</p>
                        <p className="text-xs text-muted-foreground">Actor: {audit.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlockchainVerification;