/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Investigation Workspace
 * 
 * Deep investigation interface for analysts and forensic teams
 */

import React, { useState, useEffect } from 'react';

interface Entity {
  id: string;
  name: string;
  type: string;
  riskScore: number;
  watchStatus: string;
  attributes: Record<string, unknown>;
}

interface Alert {
  id: string;
  severity: string;
  findings: string[];
  createdAt: string;
}

interface Case {
  id: string;
  title: string;
  description: string;
  riskScore: number;
  confidence: number;
  status: string;
  priority: string;
  owner: string;
  riskFactors: string[];
  recommendedAction: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  severity: string;
}

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  riskScore: number;
}

interface NetworkLink {
  source: string;
  target: string;
  type: string;
}

interface InvestigationWorkspaceProps {
  caseId?: string;
  entityId?: string;
}

export default function InvestigationWorkspace({ caseId, entityId }: InvestigationWorkspaceProps) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [networkLinks, setNetworkLinks] = useState<NetworkLink[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'network' | 'evidence' | 'notes'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching investigation data
    const fetchData = async () => {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      setEntity({
        id: entityId || 'vendor_001',
        name: 'Alpha Supply Ltd',
        type: 'vendor',
        riskScore: 87,
        watchStatus: 'flagged',
        attributes: {
          address: 'Nairobi',
          phone: '+254700123456',
          bank_account_hash: 'abc123',
          registration_date: '2024-01-15'
        }
      });

      setCaseData({
        id: caseId || 'case_001',
        title: 'Suspicious Procurement Ring - Alpha Supply Ltd',
        description: 'Multiple indicators suggest coordinated manipulation: invoice splitting, shared ownership with competitor, abnormal award concentration.',
        riskScore: 87,
        confidence: 0.91,
        status: 'investigating',
        priority: 'high',
        owner: 'risk_team_queue',
        riskFactors: [
          'pricing anomaly',
          'shared director with competitor',
          'abnormal award concentration',
          'linked approval cluster'
        ],
        recommendedAction: 'freeze_high_value_approvals_and_open_case'
      });

      setAlerts([
        {
          id: 'alert_001',
          severity: 'high',
          findings: ['3 invoices split below approval threshold', 'shared phone number with another vendor'],
          createdAt: '2026-03-22T10:30:00Z'
        },
        {
          id: 'alert_002',
          severity: 'critical',
          findings: ['pricing 42% above peer median', 'linked to blacklisted vendor'],
          createdAt: '2026-03-22T09:15:00Z'
        }
      ]);

      setTimeline([
        {
          id: 'event_001',
          timestamp: '2026-03-22T10:30:00Z',
          type: 'alert',
          description: 'High severity alert triggered: Invoice splitting pattern detected',
          severity: 'high'
        },
        {
          id: 'event_002',
          timestamp: '2026-03-22T09:15:00Z',
          type: 'alert',
          description: 'Critical alert triggered: Pricing anomaly detected',
          severity: 'critical'
        },
        {
          id: 'event_003',
          timestamp: '2026-03-21T14:15:00Z',
          type: 'invoice',
          description: 'Invoice INV-8833 submitted for $9,500',
          severity: 'medium'
        },
        {
          id: 'event_004',
          timestamp: '2026-03-20T10:30:00Z',
          type: 'invoice',
          description: 'Invoice INV-8832 submitted for $9,800',
          severity: 'medium'
        },
        {
          id: 'event_005',
          timestamp: '2026-03-19T11:00:00Z',
          type: 'payment',
          description: 'Payment approved for $9,800',
          severity: 'low'
        }
      ]);

      setNetworkNodes([
        { id: 'vendor_001', name: 'Alpha Supply Ltd', type: 'vendor', riskScore: 87 },
        { id: 'vendor_002', name: 'Beta Services Ltd', type: 'vendor', riskScore: 76 },
        { id: 'person_001', name: 'John Kamau', type: 'person', riskScore: 45 },
        { id: 'account_001', name: 'Business Account 1234', type: 'account', riskScore: 82 }
      ]);

      setNetworkLinks([
        { source: 'vendor_001', target: 'person_001', type: 'director_of' },
        { source: 'vendor_002', target: 'person_001', type: 'director_of' },
        { source: 'vendor_001', target: 'account_001', type: 'paid_to' },
        { source: 'vendor_002', target: 'account_001', type: 'paid_to' }
      ]);

      setLoading(false);
    };

    fetchData();
  }, [caseId, entityId]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'action_required': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{entity?.name}</h1>
            <p className="text-gray-600">{entity?.type} • {entity?.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData?.status || 'open')}`}>
              {caseData?.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              caseData?.priority === 'critical' ? 'bg-red-100 text-red-800' :
              caseData?.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {caseData?.priority} priority
            </span>
          </div>
        </div>
      </div>

      {/* Risk Score Banner */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-500">Composite Risk Score</div>
            <div className="text-4xl font-bold text-red-600">{caseData?.riskScore}</div>
            <div className="text-sm text-gray-500">Confidence: {((caseData?.confidence || 0) * 100).toFixed(0)}%</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Recommended Action</div>
            <div className="text-lg font-semibold text-gray-900">{caseData?.recommendedAction?.replace(/_/g, ' ')}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Risk Factors</div>
          <div className="flex flex-wrap gap-2">
            {caseData?.riskFactors.map((factor, index) => (
              <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
                {factor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'network', label: 'Network Graph' },
              { id: 'evidence', label: 'Evidence' },
              { id: 'notes', label: 'Analyst Notes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Entity Profile */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Profile</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium">{entity?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium">{entity?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk Score</span>
                    <span className={`font-medium ${
                      (entity?.riskScore || 0) >= 80 ? 'text-red-600' :
                      (entity?.riskScore || 0) >= 60 ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {entity?.riskScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Watch Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      entity?.watchStatus === 'flagged' ? 'bg-red-100 text-red-800' :
                      entity?.watchStatus === 'watchlisted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {entity?.watchStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attributes</h4>
                  <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                    {Object.entries(entity?.attributes || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Alerts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{alert.id}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <ul className="text-sm space-y-1">
                        {alert.findings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gray-500">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Timeline</h3>
              <div className="space-y-4">
                {timeline.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        event.severity === 'critical' ? 'bg-red-500' :
                        event.severity === 'high' ? 'bg-orange-500' :
                        event.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                    </div>
                    <div className="flex-grow pb-4 border-l border-gray-200 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{event.description}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{event.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Network Graph Tab */}
          {activeTab === 'network' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Network</h3>
              <div className="bg-gray-100 rounded-lg p-8 min-h-96">
                <div className="grid grid-cols-2 gap-8">
                  {/* Nodes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Connected Entities</h4>
                    <div className="space-y-2">
                      {networkNodes.map((node) => (
                        <div 
                          key={node.id}
                          className={`p-3 rounded border ${
                            node.id === entity?.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{node.name}</div>
                              <div className="text-xs text-gray-500">{node.type}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              node.riskScore >= 80 ? 'bg-red-100 text-red-800' :
                              node.riskScore >= 60 ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {node.riskScore}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Relationships</h4>
                    <div className="space-y-2">
                      {networkLinks.map((link, index) => (
                        <div key={index} className="p-3 rounded border border-gray-200 bg-white">
                          <div className="text-sm">
                            <span className="font-medium">{link.source}</span>
                            <span className="text-gray-500 mx-2">→</span>
                            <span className="font-medium">{link.target}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{link.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  Interactive graph visualization would be rendered here using Cytoscape.js
                </div>
              </div>
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === 'evidence' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Bundle</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Invoice INV-8832</span>
                    <span className="text-xs text-gray-500">2026-03-20</span>
                  </div>
                  <div className="text-sm text-gray-600">Amount: $9,800 • Submitted by: user_44</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Invoice INV-8833</span>
                    <span className="text-xs text-gray-500">2026-03-21</span>
                  </div>
                  <div className="text-sm text-gray-600">Amount: $9,500 • Submitted by: user_44</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Payment Approval</span>
                    <span className="text-xs text-gray-500">2026-03-22</span>
                  </div>
                  <div className="text-sm text-gray-600">Approver: user_18 • District: Nakuru</div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyst Notes</h3>
              <textarea
                className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none"
                placeholder="Add investigation notes..."
              />
              <div className="mt-4 flex justify-end gap-3">
                <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                  Cancel
                </button>
                <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            Assign to Me
          </button>
          <button className="px-4 py-2 text-white bg-orange-600 rounded hover:bg-orange-700">
            Escalate
          </button>
          <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
            Execute Intervention
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
            Generate Evidence Bundle
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
            Mark as Resolved
          </button>
        </div>
      </div>
    </div>
  );
}
