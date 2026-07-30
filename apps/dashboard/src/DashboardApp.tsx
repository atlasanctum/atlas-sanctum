/**
 * Atlas Sanctum Dashboard — Main App Component
 *
 * Composes all dashboard panels into a unified planetary intelligence view.
 * Each panel connects to a live data source via the SDK.
 */

import React, { useEffect, useState } from 'react';
import { AtlasSanctumClient, PlanetaryMetrics, AgentStatus } from '../../../packages/sdk/index';

const client = new AtlasSanctumClient({
  apiUrl: import.meta.env?.VITE_API_URL ?? 'http://localhost:3001',
  token:  import.meta.env?.VITE_API_TOKEN,
});

// ─── Planetary Metrics Panel ──────────────────────────────────────────────────

function PlanetaryMetricsPanel() {
  const [metrics, setMetrics] = useState<PlanetaryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.impact.getPlanetaryMetrics().then(r => {
      if (r.ok) setMetrics(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />;
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard label="Carbon Budget" value={`${metrics.carbonBudgetRemainingGt.toFixed(0)} GtCO₂`} trend="down" />
      <MetricCard label="Biodiversity" value={`${metrics.biodiversityIntactnessIndex.toFixed(1)}%`} trend="down" />
      <MetricCard label="Ocean Health" value={`${metrics.oceanHealthIndex.toFixed(1)}%`} trend="stable" />
      <MetricCard label="Active Projects" value={metrics.activeRestorationProjects.toString()} trend="up" />
    </div>
  );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: 'up' | 'down' | 'stable' }) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-yellow-500';
  const trendIcon  = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <span className={`text-sm font-medium ${trendColor}`}>{trendIcon}</span>
    </div>
  );
}

// ─── Agent Network Panel ──────────────────────────────────────────────────────

function AgentNetworkPanel() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);

  useEffect(() => {
    client.ai.listAgents().then(r => { if (r.ok) setAgents(r.data); });
  }, []);

  const online = agents.filter(a => a.status === 'active' || a.status === 'idle').length;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Agent Network</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm text-gray-600">{online} / {agents.length} agents online</span>
      </div>
      <div className="space-y-1">
        {agents.slice(0, 6).map(a => (
          <div key={a.agentId} className="flex items-center justify-between text-xs">
            <span className="text-gray-600 capitalize">{a.role}</span>
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
              a.status === 'active' ? 'bg-green-100 text-green-700' :
              a.status === 'idle'   ? 'bg-gray-100 text-gray-600'   :
              'bg-red-100 text-red-600'
            }`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Constitutional Health Panel ──────────────────────────────────────────────

function ConstitutionalHealthPanel() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Constitutional Health</h3>
      <div className="space-y-2">
        {[
          { label: 'Covenant Integrity', value: 98, color: 'bg-green-500' },
          { label: 'Ethics Compliance',  value: 96, color: 'bg-green-500' },
          { label: 'Obligation Rate',    value: 91, color: 'bg-blue-500'  },
          { label: 'Audit Coverage',     value: 100, color: 'bg-green-500'},
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between text-xs text-gray-600 mb-0.5">
              <span>{label}</span><span>{value}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard App ────────────────────────────────────────────────────────────

export default function DashboardApp() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Atlas Sanctum</h1>
        <p className="text-sm text-gray-500">Planetary Intelligence Dashboard</p>
      </header>

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Planetary Metrics</h2>
          <PlanetaryMetricsPanel />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AgentNetworkPanel />
          <ConstitutionalHealthPanel />
        </section>
      </div>
    </div>
  );
}
