/**
 * Atlas Sanctum Mission Control Dashboard
 * Main dashboard showing system overview
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Activity,
  TrendingUp
} from 'lucide-react';

interface DashboardSummary {
  activeCovenants: number;
  criticalRegions: number;
  verifiedInterventions: number;
  reserveCoverageUsd: number;
}

interface RiskTrend {
  date: string;
  riskScore: number;
}

interface CovenantStatus {
  id: string;
  title: string;
  status: string;
  regionId: string;
  minRiskScore: number;
}

interface MissionControlProps {
  summary: DashboardSummary;
  riskTrend: RiskTrend[];
  covenants: CovenantStatus[];
}

export function MissionControl({ summary, riskTrend, covenants }: MissionControlProps) {
  const getSeverityColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 55) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      armed: 'default',
      triggered: 'destructive',
      executed: 'outline',
      verified: 'default',
      failed: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atlas Sanctum</h1>
          <p className="text-slate-400 mt-1">Covenant Runtime Mission Control</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Activity className="w-3 h-3 mr-1" />
            System Active
          </Badge>
          <div className="text-right">
            <p className="text-sm text-slate-400">Connected Wallet</p>
            <p className="font-mono text-sm">0x1234...5678</p>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Active Covenants
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeCovenants}</div>
            <p className="text-xs text-slate-500 mt-1">Armed and monitoring</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Critical Regions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {summary.criticalRegions}
            </div>
            <p className="text-xs text-slate-500 mt-1">Risk score ≥ 75</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Verified Interventions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.verifiedInterventions}</div>
            <p className="text-xs text-slate-500 mt-1">Impact confirmed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Reserve Coverage
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary.reserveCoverageUsd.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Available for deployment</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Risk Trend - Nairobi East Basin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {riskTrend.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className={`w-full rounded-t ${getSeverityColor(point.riskScore)}`}
                    style={{ height: `${point.riskScore * 2.5}px` }}
                  />
                  <span className="text-xs text-slate-500 mt-2">
                    {point.date.split('-')[2]}
                  </span>
                  <span className="text-xs font-medium">{point.riskScore}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-500">
              <span>Low (0-29)</span>
              <span>Medium (30-54)</span>
              <span>High (55-74)</span>
              <span>Critical (75-100)</span>
            </div>
          </CardContent>
        </Card>

        {/* Reserve Health */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Reserve Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Total Balance</span>
                  <span className="font-medium">$25,000</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Committed</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-0" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Available</span>
                  <span className="font-medium text-green-400">$25,000</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Proof Verified</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Last checked: 2 minutes ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Covenants Table */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Armed Covenants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Covenant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Region
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Threshold
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {covenants.map((covenant) => (
                  <tr
                    key={covenant.id}
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium">{covenant.title}</p>
                      <p className="text-xs text-slate-500">{covenant.id}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">{covenant.regionId}</td>
                    <td className="py-3 px-4 text-sm">
                      Risk ≥ {covenant.minRiskScore}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadge(covenant.status)}>
                        {covenant.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-sm text-blue-400 hover:text-blue-300">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Intervention Timeline */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Recent Interventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 'int_001',
                type: 'Cash Release',
                amount: '$5,000',
                status: 'Confirmed',
                time: '2 hours ago',
              },
              {
                id: 'int_002',
                type: 'Supply Dispatch',
                amount: '$3,200',
                status: 'Pending',
                time: '5 hours ago',
              },
            ].map((intervention) => (
              <div
                key={intervention.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{intervention.type}</p>
                    <p className="text-sm text-slate-500">{intervention.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{intervention.amount}</p>
                  <p className="text-sm text-slate-500">{intervention.time}</p>
                </div>
                <Badge
                  variant={
                    intervention.status === 'Confirmed'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {intervention.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
