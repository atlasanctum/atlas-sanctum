/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Intervention Console
 * 
 * Authorized operations interface for compliance and ops teams
 */

import React, { useState, useEffect } from 'react';

interface Intervention {
  id: string;
  caseId: string;
  caseTitle: string;
  actionType: string;
  actionLevel: number;
  reason: string;
  status: 'pending' | 'executed' | 'overturned' | 'failed';
  executedBy?: string;
  executedAt?: string;
  createdAt: string;
}

interface InterventionPolicy {
  level: number;
  name: string;
  actions: string[];
  requiredAuthority: string[];
  cooldownMinutes: number;
}

export default function InterventionConsole() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [policies, setPolicies] = useState<InterventionPolicy[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      setInterventions([
        {
          id: 'int_001',
          caseId: 'case_001',
          caseTitle: 'Suspicious Procurement Ring - Alpha Supply Ltd',
          actionType: 'pause_disbursement',
          actionLevel: 3,
          reason: 'High confidence collusion cluster detected',
          status: 'pending',
          createdAt: '2026-03-22T10:30:00Z'
        },
        {
          id: 'int_002',
          caseId: 'case_002',
          caseTitle: 'Invoice Splitting Pattern - Beta Services',
          actionType: 'require_verification',
          actionLevel: 2,
          reason: 'Multiple invoices below threshold',
          status: 'executed',
          executedBy: 'user_123',
          executedAt: '2026-03-22T09:15:00Z',
          createdAt: '2026-03-22T08:45:00Z'
        },
        {
          id: 'int_003',
          caseId: 'case_003',
          caseTitle: 'Shared Bank Account - Multiple Beneficiaries',
          actionType: 'soft_flag',
          actionLevel: 1,
          reason: 'One account linked to 5 beneficiaries',
          status: 'executed',
          executedBy: 'user_456',
          executedAt: '2026-03-21T16:20:00Z',
          createdAt: '2026-03-21T15:50:00Z'
        },
        {
          id: 'int_004',
          caseId: 'case_004',
          caseTitle: 'Narrative Inconsistency - Gamma Report',
          actionType: 'quarantine_report',
          actionLevel: 3,
          reason: 'Critical contradictions in impact claims',
          status: 'pending',
          createdAt: '2026-03-21T14:30:00Z'
        }
      ]);

      setPolicies([
        {
          level: 0,
          name: 'Observe',
          actions: ['log_signal'],
          requiredAuthority: ['analyst'],
          cooldownMinutes: 0
        },
        {
          level: 1,
          name: 'Soft Flag',
          actions: ['notify_analyst', 'add_to_watchlist'],
          requiredAuthority: ['analyst', 'risk_team'],
          cooldownMinutes: 0
        },
        {
          level: 2,
          name: 'Friction',
          actions: ['require_second_approver', 'enhanced_verification'],
          requiredAuthority: ['risk_team', 'compliance'],
          cooldownMinutes: 30
        },
        {
          level: 3,
          name: 'Containment',
          actions: ['pause_disbursement', 'lock_procurement', 'quarantine_report'],
          requiredAuthority: ['compliance', 'operations'],
          cooldownMinutes: 60
        },
        {
          level: 4,
          name: 'Escalation',
          actions: ['open_investigation', 'notify_compliance', 'generate_evidence'],
          requiredAuthority: ['compliance', 'legal'],
          cooldownMinutes: 120
        },
        {
          level: 5,
          name: 'Automated Enforcement',
          actions: ['smart_contract_deny', 'vendor_blocklist', 'wallet_freeze'],
          requiredAuthority: ['legal', 'executive'],
          cooldownMinutes: 240
        }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'executed': return 'bg-green-100 text-green-800';
      case 'overturned': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'bg-red-100 text-red-800';
    if (level >= 3) return 'bg-orange-100 text-orange-800';
    if (level >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getActionName = (actionType: string) => {
    return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleExecute = (interventionId: string) => {
    setInterventions(prev => prev.map(int => 
      int.id === interventionId 
        ? { ...int, status: 'executed', executedBy: 'current_user', executedAt: new Date().toISOString() }
        : int
    ));
  };

  const handleOverturn = (interventionId: string) => {
    setInterventions(prev => prev.map(int => 
      int.id === interventionId 
        ? { ...int, status: 'overturned' }
        : int
    ));
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Intervention Console</h1>
        <p className="text-gray-600">Authorized operations for compliance and risk management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm font-medium text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {interventions.filter(i => i.status === 'pending').length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500">Executed</div>
          <div className="text-2xl font-bold text-green-600">
            {interventions.filter(i => i.status === 'executed').length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
          <div className="text-sm font-medium text-gray-500">Overturned</div>
          <div className="text-2xl font-bold text-gray-600">
            {interventions.filter(i => i.status === 'overturned').length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-sm font-medium text-gray-500">Failed</div>
          <div className="text-2xl font-bold text-red-600">
            {interventions.filter(i => i.status === 'failed').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interventions List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Intervention Queue</h2>
          <div className="space-y-4">
            {interventions.map((intervention) => (
              <div 
                key={intervention.id}
                onClick={() => setSelectedIntervention(intervention)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedIntervention?.id === intervention.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{intervention.id}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(intervention.status)}`}>
                      {intervention.status}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(intervention.actionLevel)}`}>
                    Level {intervention.actionLevel}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700 mb-2">{intervention.caseTitle}</div>
                <div className="text-sm text-gray-500 mb-2">{getActionName(intervention.actionType)}</div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(intervention.createdAt).toLocaleString()}
                </div>

                {intervention.status === 'pending' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExecute(intervention.id);
                      }}
                      className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 text-xs"
                    >
                      Execute
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOverturn(intervention.id);
                      }}
                      className="px-3 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                    >
                      Overturn
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="space-y-6">
          {/* Selected Intervention */}
          {selectedIntervention && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Intervention Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID</span>
                  <span className="font-medium">{selectedIntervention.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Case</span>
                  <span className="font-medium">{selectedIntervention.caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Action</span>
                  <span className="font-medium">{getActionName(selectedIntervention.actionType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(selectedIntervention.actionLevel)}`}>
                    {selectedIntervention.actionLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedIntervention.status)}`}>
                    {selectedIntervention.status}
                  </span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-1">Reason</div>
                  <div className="text-sm text-gray-600">{selectedIntervention.reason}</div>
                </div>

                {selectedIntervention.executedBy && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-1">Execution</div>
                    <div className="text-sm text-gray-600">
                      By: {selectedIntervention.executedBy}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(selectedIntervention.executedAt!).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Intervention Policies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Intervention Levels</h3>
            <div className="space-y-3">
              {policies.map((policy) => (
                <div key={policy.level} className="p-3 border border-gray-200 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">Level {policy.level}: {policy.name}</span>
                    <span className="text-xs text-gray-500">{policy.cooldownMinutes}min cooldown</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Actions: {policy.actions.map(a => getActionName(a)).join(', ')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Required: {policy.requiredAuthority.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm">
                Create New Intervention
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                View All Policies
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Export Audit Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
