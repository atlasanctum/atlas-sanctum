/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Narrative Integrity Dashboard
 * 
 * Compares claims vs evidence for leadership and accountability units
 */

import React, { useState, useEffect } from 'react';

interface NarrativeAnalysis {
  id: number;
  documentId: string;
  entityId?: string;
  entityName?: string;
  consistencyScore: number;
  contradictions: Array<{
    claim: string;
    evidence: string;
    severity: string;
  }>;
  omissions: Array<{
    description: string;
    riskLevel: string;
  }>;
  analyzedAt: string;
}

interface NarrativeStats {
  total: number;
  averageConsistency: number;
  lowConsistencyCount: number;
  totalContradictions: number;
  totalOmissions: number;
}

export default function NarrativeIntegrityDashboard() {
  const [analyses, setAnalyses] = useState<NarrativeAnalysis[]>([]);
  const [stats, setStats] = useState<NarrativeStats>({
    total: 0,
    averageConsistency: 0,
    lowConsistencyCount: 0,
    totalContradictions: 0,
    totalOmissions: 0
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState<NarrativeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      setStats({
        total: 15,
        averageConsistency: 0.72,
        lowConsistencyCount: 4,
        totalContradictions: 8,
        totalOmissions: 12
      });

      setAnalyses([
        {
          id: 1,
          documentId: 'report_77',
          entityId: 'vendor_001',
          entityName: 'Alpha Supply Ltd',
          consistencyScore: 0.46,
          contradictions: [
            {
              claim: '95% of sensors are operational',
              evidence: 'Only 61% reported uptime in telemetry',
              severity: 'critical'
            },
            {
              claim: 'No delays in last-mile delivery',
              evidence: '3 delivery delays detected in evidence',
              severity: 'high'
            }
          ],
          omissions: [
            {
              description: 'Service interruption in 3 districts not mentioned',
              riskLevel: 'high'
            }
          ],
          analyzedAt: '2026-03-22T10:30:00Z'
        },
        {
          id: 2,
          documentId: 'report_78',
          entityId: 'vendor_002',
          entityName: 'Beta Services Ltd',
          consistencyScore: 0.85,
          contradictions: [],
          omissions: [
            {
              description: 'Minor delay in 1 district not mentioned',
              riskLevel: 'low'
            }
          ],
          analyzedAt: '2026-03-22T09:15:00Z'
        },
        {
          id: 3,
          documentId: 'report_79',
          entityId: 'vendor_003',
          entityName: 'Gamma Logistics',
          consistencyScore: 0.62,
          contradictions: [
            {
              claim: 'All supplies delivered on time',
              evidence: '2 deliveries were late by 3-5 days',
              severity: 'medium'
            }
          ],
          omissions: [],
          analyzedAt: '2026-03-21T16:45:00Z'
        },
        {
          id: 4,
          documentId: 'report_80',
          entityId: 'vendor_004',
          entityName: 'Delta Operations',
          consistencyScore: 0.38,
          contradictions: [
            {
              claim: '100% compliance with safety standards',
              evidence: '5 safety violations found in audit',
              severity: 'critical'
            },
            {
              claim: 'Zero environmental incidents',
              evidence: '2 environmental incidents reported',
              severity: 'critical'
            }
          ],
          omissions: [
            {
              description: 'Staff turnover of 40% not mentioned',
              riskLevel: 'high'
            },
            {
              description: 'Equipment failures affecting operations',
              riskLevel: 'high'
            }
          ],
          analyzedAt: '2026-03-20T14:20:00Z'
        }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const getConsistencyColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConsistencyBg = (score: number) => {
    if (score >= 0.8) return 'bg-green-100';
    if (score >= 0.6) return 'bg-yellow-100';
    if (score >= 0.4) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Narrative Integrity Dashboard</h1>
        <p className="text-gray-600">Claims vs evidence verification and consistency monitoring</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Total Reports</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500">Avg Consistency</div>
          <div className={`text-2xl font-bold ${getConsistencyColor(stats.averageConsistency)}`}>
            {(stats.averageConsistency * 100).toFixed(0)}%
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-sm font-medium text-gray-500">Low Consistency</div>
          <div className="text-2xl font-bold text-red-600">{stats.lowConsistencyCount}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="text-sm font-medium text-gray-500">Contradictions</div>
          <div className="text-2xl font-bold text-orange-600">{stats.totalContradictions}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm font-medium text-gray-500">Omissions</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.totalOmissions}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div 
                key={analysis.id}
                onClick={() => setSelectedAnalysis(analysis)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAnalysis?.id === analysis.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{analysis.documentId}</span>
                    <span className="text-gray-500 ml-2">• {analysis.entityName}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConsistencyBg(analysis.consistencyScore)} ${getConsistencyColor(analysis.consistencyScore)}`}>
                    {(analysis.consistencyScore * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{analysis.contradictions.length} contradictions</span>
                  <span>{analysis.omissions.length} omissions</span>
                  <span>{new Date(analysis.analyzedAt).toLocaleDateString()}</span>
                </div>

                {analysis.contradictions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1">Top Contradiction:</div>
                    <div className="text-sm text-gray-600 truncate">
                      {analysis.contradictions[0].claim}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Detail */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Detail</h2>
          
          {selectedAnalysis ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{selectedAnalysis.documentId}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConsistencyBg(selectedAnalysis.consistencyScore)} ${getConsistencyColor(selectedAnalysis.consistencyScore)}`}>
                    {(selectedAnalysis.consistencyScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-sm text-gray-500">{selectedAnalysis.entityName}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Analyzed: {new Date(selectedAnalysis.analyzedAt).toLocaleString()}
                </div>
              </div>

              {/* Consistency Meter */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Consistency Score</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      selectedAnalysis.consistencyScore >= 0.8 ? 'bg-green-500' :
                      selectedAnalysis.consistencyScore >= 0.6 ? 'bg-yellow-500' :
                      selectedAnalysis.consistencyScore >= 0.4 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${selectedAnalysis.consistencyScore * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Contradictions */}
              {selectedAnalysis.contradictions.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Contradictions</div>
                  <div className="space-y-2">
                    {selectedAnalysis.contradictions.map((contradiction, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded border ${getSeverityColor(contradiction.severity)}`}
                      >
                        <div className="text-xs font-medium mb-1">Claim:</div>
                        <div className="text-sm mb-2">{contradiction.claim}</div>
                        <div className="text-xs font-medium mb-1">Evidence:</div>
                        <div className="text-sm">{contradiction.evidence}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Omissions */}
              {selectedAnalysis.omissions.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Omissions</div>
                  <div className="space-y-2">
                    {selectedAnalysis.omissions.map((omission, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded border ${getSeverityColor(omission.riskLevel)}`}
                      >
                        <div className="text-sm">{omission.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm mb-2">
                  View Full Report
                </button>
                <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                  Generate Evidence Bundle
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a report to view details
            </div>
          )}
        </div>
      </div>

      {/* Impact Washing Monitor */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact Washing Risk Monitor</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-red-200 bg-red-50 rounded">
            <div className="text-sm font-medium text-red-800 mb-2">High Risk</div>
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-xs text-red-700 mt-1">Reports with critical contradictions</div>
          </div>
          
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded">
            <div className="text-sm font-medium text-yellow-800 mb-2">Medium Risk</div>
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-xs text-yellow-700 mt-1">Reports with significant omissions</div>
          </div>
          
          <div className="p-4 border border-green-200 bg-green-50 rounded">
            <div className="text-sm font-medium text-green-800 mb-2">Low Risk</div>
            <div className="text-2xl font-bold text-green-600">10</div>
            <div className="text-xs text-green-700 mt-1">Reports with high consistency</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Discrepancy History</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Alpha Supply Ltd</span>
              <span className="text-red-600 font-medium">3 discrepancies</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Delta Operations</span>
              <span className="text-red-600 font-medium">2 discrepancies</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Gamma Logistics</span>
              <span className="text-yellow-600 font-medium">1 discrepancy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
