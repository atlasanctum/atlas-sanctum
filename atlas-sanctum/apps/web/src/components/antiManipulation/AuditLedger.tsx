/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Audit Ledger View
 * 
 * Immutable audit trail for regulators and external auditors
 */

import React, { useState, useEffect } from 'react';

interface AuditEntry {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  userId?: string;
  userName?: string;
  details: Record<string, unknown>;
  evidenceHash?: string;
  createdAt: string;
}

interface AuditStats {
  total: number;
  today: number;
  thisWeek: number;
  byAction: Record<string, number>;
  byEntityType: Record<string, number>;
}

export default function AuditLedger() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    byAction: {},
    byEntityType: {}
  });
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntityType, setFilterEntityType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      setStats({
        total: 156,
        today: 12,
        thisWeek: 45,
        byAction: {
          'case_created': 23,
          'intervention_executed': 18,
          'alert_generated': 45,
          'entity_updated': 32,
          'rule_triggered': 28,
          'narrative_analyzed': 10
        },
        byEntityType: {
          'vendor': 45,
          'person': 32,
          'case': 28,
          'alert': 35,
          'intervention': 16
        }
      });

      setEntries([
        {
          id: 1,
          action: 'intervention_executed',
          entityType: 'intervention',
          entityId: 'int_001',
          entityName: 'Pause Disbursement',
          userId: 'user_123',
          userName: 'John Analyst',
          details: {
            case_id: 'case_001',
            action_type: 'pause_disbursement',
            reason: 'High confidence collusion cluster detected',
            risk_score: 87
          },
          evidenceHash: '0xabc123...',
          createdAt: '2026-03-22T10:30:00Z'
        },
        {
          id: 2,
          action: 'case_created',
          entityType: 'case',
          entityId: 'case_001',
          entityName: 'Suspicious Procurement Ring - Alpha Supply Ltd',
          userId: 'system',
          userName: 'System',
          details: {
            entity_ids: ['vendor_001', 'vendor_002', 'person_001'],
            alert_ids: ['alert_001', 'alert_002'],
            risk_score: 87,
            confidence: 0.91
          },
          evidenceHash: '0xdef456...',
          createdAt: '2026-03-22T10:25:00Z'
        },
        {
          id: 3,
          action: 'alert_generated',
          entityType: 'alert',
          entityId: 'alert_001',
          entityName: 'Invoice Splitting Pattern',
          userId: 'system',
          userName: 'Rule Engine',
          details: {
            rule_id: 'rule_001',
            entity_id: 'vendor_001',
            severity: 'high',
            findings: ['3 invoices split below threshold']
          },
          evidenceHash: '0xghi789...',
          createdAt: '2026-03-22T10:20:00Z'
        },
        {
          id: 4,
          action: 'entity_updated',
          entityType: 'entity',
          entityId: 'vendor_001',
          entityName: 'Alpha Supply Ltd',
          userId: 'user_456',
          userName: 'Mary Compliance',
          details: {
            field: 'watch_status',
            old_value: 'normal',
            new_value: 'flagged',
            reason: 'Multiple risk signals detected'
          },
          evidenceHash: '0xjkl012...',
          createdAt: '2026-03-22T09:45:00Z'
        },
        {
          id: 5,
          action: 'rule_triggered',
          entityType: 'rule',
          entityId: 'rule_002',
          entityName: 'Circular Payments',
          userId: 'system',
          userName: 'Graph Engine',
          details: {
            entity_id: 'vendor_001',
            connected_entities: ['vendor_002', 'account_001'],
            pattern: 'circular_payment',
            confidence: 0.85
          },
          evidenceHash: '0xmno345...',
          createdAt: '2026-03-22T09:30:00Z'
        },
        {
          id: 6,
          action: 'narrative_analyzed',
          entityType: 'narrative',
          entityId: 'report_77',
          entityName: 'Q1 Impact Report',
          userId: 'system',
          userName: 'Narrative Engine',
          details: {
            document_id: 'report_77',
            entity_id: 'vendor_001',
            consistency_score: 0.46,
            contradictions: 2,
            omissions: 1
          },
          evidenceHash: '0xpqr678...',
          createdAt: '2026-03-22T09:15:00Z'
        }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('executed') || action.includes('created')) {
      return 'bg-green-100 text-green-800';
    }
    if (action.includes('alert') || action.includes('triggered')) {
      return 'bg-orange-100 text-orange-800';
    }
    if (action.includes('updated')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getEntityTypeColor = (entityType: string) => {
    switch (entityType) {
      case 'case': return 'bg-purple-100 text-purple-800';
      case 'intervention': return 'bg-red-100 text-red-800';
      case 'alert': return 'bg-orange-100 text-orange-800';
      case 'entity': return 'bg-blue-100 text-blue-800';
      case 'rule': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filterAction !== 'all' && entry.action !== filterAction) return false;
    if (filterEntityType !== 'all' && entry.entityType !== filterEntityType) return false;
    return true;
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Audit Ledger</h1>
        <p className="text-gray-600">Immutable event trail for regulators and auditors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Total Events</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500">Today</div>
          <div className="text-2xl font-bold text-green-600">{stats.today}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm font-medium text-gray-500">This Week</div>
          <div className="text-2xl font-bold text-purple-600">{stats.thisWeek}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="text-sm font-medium text-gray-500">Unique Actions</div>
          <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.byAction).length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by Action:</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Actions</option>
              {Object.keys(stats.byAction).map(action => (
                <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by Entity Type:</label>
            <select
              value={filterEntityType}
              onChange={(e) => setFilterEntityType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Types</option>
              {Object.keys(stats.byEntityType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Entries */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h2>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div 
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedEntry?.id === entry.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(entry.action)}`}>
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEntityTypeColor(entry.entityType)}`}>
                      {entry.entityType}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700 mb-1">{entry.entityName || entry.entityId}</div>
                <div className="text-xs text-gray-500">
                  By: {entry.userName || entry.userId}
                </div>

                {entry.evidenceHash && (
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    Hash: {entry.evidenceHash}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="space-y-6">
          {/* Selected Entry */}
          {selectedEntry && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID</span>
                  <span className="font-medium">{selectedEntry.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Action</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(selectedEntry.action)}`}>
                    {selectedEntry.action.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entity Type</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEntityTypeColor(selectedEntry.entityType)}`}>
                    {selectedEntry.entityType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entity ID</span>
                  <span className="font-medium font-mono text-sm">{selectedEntry.entityId}</span>
                </div>
                {selectedEntry.entityName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Entity Name</span>
                    <span className="font-medium">{selectedEntry.entityName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">User</span>
                  <span className="font-medium">{selectedEntry.userName || selectedEntry.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timestamp</span>
                  <span className="font-medium">{new Date(selectedEntry.createdAt).toLocaleString()}</span>
                </div>
                
                {selectedEntry.evidenceHash && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-1">Evidence Hash</div>
                    <div className="text-xs font-mono text-gray-600 break-all">{selectedEntry.evidenceHash}</div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Details</div>
                  <div className="bg-gray-50 rounded p-3 text-xs font-mono overflow-auto max-h-48">
                    <pre>{JSON.stringify(selectedEntry.details, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Distribution</h3>
            <div className="space-y-3">
              {Object.entries(stats.byAction).map(([action, count]) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{action.replace(/_/g, ' ')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm">
                Export Full Ledger (CSV)
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Export Filtered (JSON)
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Generate Report (PDF)
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Verify Integrity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
