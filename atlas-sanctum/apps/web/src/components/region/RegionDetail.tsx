/**
 * Atlas Sanctum Region Detail Page
 * Shows region profile, risk assessment, and covenant status
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Users,
  Activity
} from 'lucide-react';

interface Region {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  vulnerabilityIndex: number;
}

interface RiskSnapshot {
  id: string;
  regionId: string;
  rainfallMm24h: number;
  riverLevelMeters?: number;
  soilSaturation?: number;
  forecastRainMm48h?: number;
  vulnerabilityIndex: number;
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

interface Covenant {
  id: string;
  title: string;
  status: string;
  minRiskScore: number;
  payoutAmountUsd: number;
}

interface RegionDetailProps {
  region: Region;
  latestRisk: RiskSnapshot | null;
  riskHistory: { date: string; riskScore: number }[];
  covenants: Covenant[];
  onRunRiskEvaluation: () => void;
  onCreateCovenant: () => void;
}

export function RegionDetail({
  region,
  latestRisk,
  riskHistory,
  covenants,
  onRunRiskEvaluation,
  onCreateCovenant,
}: RegionDetailProps) {
  const getSeverityColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 55) return 'text-yellow-400';
    if (score < 75) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSeverityBg = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 55) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSeverityLabel = (score: number) => {
    if (score < 30) return 'Low';
    if (score < 55) return 'Medium';
    if (score < 75) return 'High';
    return 'Critical';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
          <span>Regions</span>
          <span>/</span>
          <span>{region.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{region.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{region.country}</span>
              </div>
              <span>•</span>
              <span>{region.lat.toFixed(4)}, {region.lng.toFixed(4)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onRunRiskEvaluation} className="bg-blue-600 hover:bg-blue-700">
              <Activity className="h-4 w-4 mr-2" />
              Run Risk Evaluation
            </Button>
            <Button onClick={onCreateCovenant} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Create Covenant
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Thermometer */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestRisk ? (
              <div className="space-y-6">
                {/* Large Risk Score Display */}
                <div className="text-center py-8">
                  <div className={`text-8xl font-bold ${getSeverityColor(latestRisk.riskScore)}`}>
                    {latestRisk.riskScore}
                  </div>
                  <Badge className={`mt-4 ${getSeverityBg(latestRisk.riskScore)}`}>
                    {getSeverityLabel(latestRisk.riskScore)} Risk
                  </Badge>
                  <p className="text-slate-400 mt-2">
                    Last updated: {new Date(latestRisk.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Risk Thermometer Bar */}
                <div className="relative">
                  <div className="h-8 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSeverityBg(latestRisk.riskScore)} transition-all duration-500`}
                      style={{ width: `${latestRisk.riskScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Low (0-29)</span>
                    <span>Medium (30-54)</span>
                    <span>High (55-74)</span>
                    <span>Critical (75-100)</span>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400">Rainfall 24h</p>
                    <p className="text-xl font-bold">{latestRisk.rainfallMm24h}mm</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400">Forecast 48h</p>
                    <p className="text-xl font-bold">{latestRisk.forecastRainMm48h ?? 0}mm</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400">River Level</p>
                    <p className="text-xl font-bold">{latestRisk.riverLevelMeters ?? 0}m</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400">Vulnerability</p>
                    <p className="text-xl font-bold">{(latestRisk.vulnerabilityIndex * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No risk data available</p>
                <Button onClick={onRunRiskEvaluation} className="mt-4">
                  Run First Risk Evaluation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Region Profile */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              Region Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Region ID</p>
                <p className="font-mono text-sm mt-1">{region.id}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Country</p>
                <p className="font-medium mt-1">{region.country}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Coordinates</p>
                <p className="font-mono text-sm mt-1">
                  {region.lat.toFixed(6)}, {region.lng.toFixed(6)}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Vulnerability Index</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${region.vulnerabilityIndex * 100}%` }}
                    />
                  </div>
                  <span className="font-bold">
                    {(region.vulnerabilityIndex * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Trend Chart */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            7-Day Risk Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {riskHistory.length > 0 ? (
            <div className="h-64 flex items-end gap-2">
              {riskHistory.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className={`w-full rounded-t ${getSeverityBg(point.riskScore)}`}
                    style={{ height: `${point.riskScore * 2.5}px` }}
                  />
                  <span className="text-xs text-slate-500 mt-2">
                    {point.date.split('-')[2]}
                  </span>
                  <span className="text-xs font-medium">{point.riskScore}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trend data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Covenants */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Active Covenants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {covenants.length > 0 ? (
            <div className="space-y-4">
              {covenants.map((covenant) => (
                <div
                  key={covenant.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{covenant.title}</h3>
                    <Badge>{covenant.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Threshold</p>
                      <p>Risk ≥ {covenant.minRiskScore}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Payout</p>
                      <p className="text-green-400">
                        ${covenant.payoutAmountUsd.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No covenants for this region</p>
              <Button onClick={onCreateCovenant} className="mt-4">
                Create First Covenant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intervention History */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Intervention History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No interventions yet</p>
            <p className="text-sm mt-1">
              Intervention history will appear here after covenant executions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
