/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Control Tower Dashboard
 * 
 * Real-time operating picture for executives and compliance leads
 */

import React, { useState, useEffect } from 'react';

interface RiskTrend {
  date: string;
  riskScore: number;
}

interface TopEntity {
  id: string;
  name: string;
  type: string;
  riskScore: number;
  alertCount: number;
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  entityId: string;
  entityName: string;
  findings: string[];
  createdAt: string;
}

interface RegionRisk {
  region: string;
  anomalyDensity: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ControlTowerStats {
  totalActiveCases: number;
  highRiskCases: number;
  unresolvedAlerts: number;
  falsePositiveRate: number;
  systemicPressureIndex: number;
}

export default function ControlTower() {
  const [stats, setStats] = useState<ControlTowerStats>({
    totalActiveCases: 0,
    highRiskCases: 0,
    unresolvedAlerts: 0,
    falsePositiveRate: 0,
    systemicPressureIndex: 0
  });

  const [riskTrend, setRiskTrend] = useState<RiskTrend[]>([]);
  const [topEntities, setTopEntities] = useState<TopEntity[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [regionRisks, setRegionRisks] = useState<RegionRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      setStats({
        totalActiveCases: 12,
        highRiskCases: 5,
        unresolvedAlerts: 23,
        falsePositiveRate: 0.15,
        systemicPressureIndex: 67
      });

      setRiskTrend([
        { date: '2026-03-16', riskScore: 45 },
        { date: '2026-03-17', riskScore: 52 },
        { date: '2026-03-18', riskScore: 58 },
        { date: '2026-03-19', riskScore: 65 },
        { date: '2026-03-20', riskScore: 72 },
        { date: '2026-03-21', riskScore: 75 },
        { date: '2026-03-22', riskScore: 78 }
      ]);

      setTopEntities([
        { id: 'vendor_001', name: 'Alpha Supply Ltd', type: 'vendor', riskScore: 87, alertCount: 4 },
        { id: 'vendor_002', name: 'Beta Services Ltd', type: 'vendor', riskScore: 76, alertCount: 3 },
        { id: 'person_001', name: 'John Kamau', type: 'person', riskScore: 68, alertCount: 2 },
        { id: 'account_001', name: 'Business Account 1234', type: 'account', riskScore: 82, alertCount: 5 },
        { id: 'vendor_003', name: 'Gamma Logistics', type: 'vendor', riskScore: 65, alertCount: 2 }
      ]);

      setRecentAlerts([
        {
          id: 'alert_001',
          severity: 'high',
          entityId: 'vendor_001',
          entityName: 'Alpha Supply Ltd',
          findings: ['3 invoices split below threshold', 'shared phone with competitor'],
          createdAt: '2026-03-22T10:30:00Z'
        },
        {
          id: 'alert_002',
          severity: 'critical',
          entityId: 'account_001',
          entityName: 'Business Account 1234',
          findings: ['circular payment flow detected', 'linked to 5 beneficiaries'],
          createdAt: '2026-03-22T09:15:00Z'
        },
        {
          id: 'alert_003',
          severity: 'medium',
          entityId: 'vendor_002',
          entityName: 'Beta Services Ltd',
          findings: ['pricing 42% above peer median'],
          createdAt: '2026-03-22T08:45:00Z'
        }
      ]);

      setRegionRisks([
        { region: 'Nairobi East', anomalyDensity: 0.78, riskLevel: 'high' },
        { region: 'Mombasa Coast', anomalyDensity: 0.45, riskLevel: 'medium' },
        { region: 'Kisumu Central', anomalyDensity: 0.32, riskLevel: 'low' },
        { region: 'Nakuru District', anomalyDensity: 0.65, riskLevel: 'high' }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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
        <h1 className="text-3xl font-bold text-gray-900">Anti-Manipulation Control Tower</h1>
        <p className="text-gray-600 mt-2">Real-time risk intelligence and detection monitoring</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Active Cases</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalActiveCases}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-sm font-medium text-gray-500">High Risk Cases</div>
          <div className="text-2xl font-bold text-red-600">{stats.highRiskCases}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="text-sm font-medium text-gray-500">Unresolved Alerts</div>
          <div className="text-2xl font-bold text-orange-600">{stats.unresolvedAlerts}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500">False Positive Rate</div>
          <div className="text-2xl font-bold text-green-600">{(stats.falsePositiveRate * 100).toFixed(1)}%</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm font-medium text-gray-500">Systemic Pressure</div>
          <div className="text-2xl font-bold text-purple-600">{stats.systemicPressureIndex}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Trend (7 Days)</h2>
          <div className="h-48 flex items-end justify-between gap-2">
            {riskTrend.map((point, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${point.riskScore}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{point.date.slice(5)}</div>
                <div className="text-xs font-medium text-gray-700">{point.riskScore}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Entities by Risk */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Entities by Risk</h2>
          <div className="space-y-3">
            {topEntities.map((entity, index) => (
              <div key={entity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  <div>
                    <div className="font-medium text-gray-900">{entity.name}</div>
                    <div className="text-xs text-gray-500">{entity.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{entity.alertCount} alerts</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    entity.riskScore >= 80 ? 'bg-red-100 text-red-800' :
                    entity.riskScore >= 60 ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entity.riskScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{alert.entityName}</span>
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

        {/* Region Risk Heatmap */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Region Risk Heatmap</h2>
          <div className="space-y-4">
            {regionRisks.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskLevelColor(region.riskLevel)}`}></div>
                  <span className="font-medium text-gray-900">{region.region}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getRiskLevelColor(region.riskLevel)}`}
                      style={{ width: `${region.anomalyDensity * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {(region.anomalyDensity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Top Systemic Threats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Procurement ring activity</span>
                <span className="font-medium text-red-600">High</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Invoice splitting pattern</span>
                <span className="font-medium text-orange-600">Medium</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Identity overlap clusters</span>
                <span className="font-medium text-yellow-600">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Queue */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Intervention Queue</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommended Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  case_001
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  Alpha Supply Ltd
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
                    87
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  Freeze high-value approvals
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    Execute
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  case_002
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  Business Account 1234
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 rounded text-sm font-medium bg-orange-100 text-orange-800">
                    82
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  Require second approver
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    Executed
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
