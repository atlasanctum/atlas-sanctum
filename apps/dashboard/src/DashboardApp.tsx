/**
 * Atlas Sanctum — Dashboard App
 * Primary platform dashboard: planetary metrics, impact portfolio,
 * governance activity, agent network, sensor fabric, digital twins.
 */

import React, { useEffect, useState } from 'react';
import {
  MetricCard,
  ProgressBar,
  StatusDot,
  CreditTypeBadge,
  EthicsScore,
  PlanetaryBoundaryGauge,
  AgentStatusCard,
  SectionHeader,
  Badge,
} from '../../../packages/ui/src/index';
import { PLANETARY_BOUNDARIES } from '../../../packages/shared/index';
import AtlasAgentNetwork from '../../../services/ai/agents/AgentNetwork';
import AtlasSensorFabric from '../../../services/ai/sensor-fabric/SensorFabric';
import AtlasPlanetaryTwins from '../../../services/ai/digital-twins/PlanetaryTwins';

// ─── Planetary Metrics Panel ──────────────────────────────────────────────────

const PlanetaryMetricsPanel: React.FC = () => (
  <section>
    <SectionHeader title="🌍 Planetary Metrics" subtitle="Real-time Earth system indicators" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <MetricCard label="Carbon Budget" value="380" unit="Gt remaining" trend="down" trendValue="2.4 Gt/yr" />
      <MetricCard label="Biodiversity Index" value="72" unit="%" trend="down" trendValue="-0.3%/yr" />
      <MetricCard label="Hectares Protected" value="12M" trend="up" trendValue="+240K this quarter" />
      <MetricCard label="Carbon Verification" value="99.9" unit="%" trend="stable" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <PlanetaryBoundaryGauge
        label="CO₂ Concentration"
        current={422} boundary={350} unit="ppm"
        lowerIsBetter
      />
      <PlanetaryBoundaryGauge
        label="Biodiversity Intactness"
        current={72} boundary={PLANETARY_BOUNDARIES.biodiversityIntactnessMin} unit="%"
      />
      <PlanetaryBoundaryGauge
        label="Freshwater Use"
        current={2800} boundary={PLANETARY_BOUNDARIES.freshwaterMax} unit="km³/yr"
        lowerIsBetter
      />
      <PlanetaryBoundaryGauge
        label="Ocean Aragonite Saturation"
        current={3.1} boundary={PLANETARY_BOUNDARIES.oceanAcidificationMin} unit="Ω"
      />
    </div>
  </section>
);

// ─── Agent Network Panel ──────────────────────────────────────────────────────

const AgentNetworkPanel: React.FC = () => {
  const health = AtlasAgentNetwork.health();
  const agents = AtlasAgentNetwork.registry.getHealthReport().slice(0, 6);

  return (
    <section>
      <SectionHeader
        title="🤖 Agent Council"
        subtitle={`${health.online}/${health.total} agents online`}
        action={<EthicsScore score={health.avgEthicsScore} />}
      />
      <div className="space-y-2">
        {agents.map(a => (
          <AgentStatusCard
            key={a.agentId}
            agentId={a.agentId}
            role={a.role}
            status={a.status}
            ethicsScore={a.avgEthicsScore}
            tasksCompleted={a.tasksCompleted}
          />
        ))}
      </div>
    </section>
  );
};

// ─── Sensor Fabric Panel ──────────────────────────────────────────────────────

const SensorFabricPanel: React.FC = () => {
  const health = AtlasSensorFabric.health();
  const alerts = AtlasSensorFabric.stream.getAlerts(false);

  return (
    <section>
      <SectionHeader
        title="📡 Sensor Fabric"
        subtitle={`${health.totalSensors} sensors across ${health.coverageBioregions.length} bioregions`}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard label="Online" value={health.online} />
        <MetricCard label="Offline" value={health.offline} />
        <MetricCard label="Readings (24h)" value={health.readingsLast24h.toLocaleString()} />
        <MetricCard label="Active Alerts" value={health.alertsActive} />
      </div>
      <ProgressBar
        label="Avg Quality Score"
        value={health.avgQualityScore * 100}
        color="#16a34a"
      />
      {alerts.length > 0 && (
        <div className="mt-3 space-y-1">
          {alerts.slice(0, 3).map(a => (
            <div key={a.alertId} className="flex items-center gap-2 text-sm p-2 rounded bg-red-50 border border-red-200">
              <Badge label={a.severity} variant={a.severity === 'critical' ? 'critical' : 'warning'} />
              <span className="text-gray-700 truncate">{a.message}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ─── Digital Twins Panel ──────────────────────────────────────────────────────

const DigitalTwinsPanel: React.FC = () => {
  const status = AtlasPlanetaryTwins.networkStatus();
  const twins = AtlasPlanetaryTwins.registry.all();

  return (
    <section>
      <SectionHeader
        title="🌐 Planetary Digital Twins"
        subtitle={`${status.synced} synced · ${status.diverged} diverged`}
      />
      <div className="space-y-2">
        {twins.map(t => (
          <div key={t.twinId} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <StatusDot status={t.status as any} />
              <div>
                <div className="text-sm font-semibold text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400 capitalize">{t.entityType.replace('_', ' ')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ProgressBar
                value={t.divergenceScore * 100}
                color={t.divergenceScore > 0.3 ? '#dc2626' : '#16a34a'}
                showValue
                className="w-24"
              />
              <Badge
                label={t.status}
                variant={t.status === 'synced' ? 'success' : t.status === 'diverged' ? 'critical' : 'neutral'}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Credit Activity Panel ────────────────────────────────────────────────────

const CreditActivityPanel: React.FC = () => (
  <section>
    <SectionHeader title="💱 Credit Activity" subtitle="Regenerative Value Exchange" />
    <div className="flex flex-wrap gap-2 mb-4">
      {(['carbon', 'biodiversity', 'water', 'ocean', 'community'] as const).map(type => (
        <CreditTypeBadge key={type} type={type} amount={Math.floor(Math.random() * 50000 + 1000)} />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3">
      <MetricCard label="Credits Issued (YTD)" value="2.4M" trend="up" trendValue="+18% vs last year" />
      <MetricCard label="Credits Retired (YTD)" value="890K" trend="up" trendValue="+24% vs last year" />
    </div>
  </section>
);

// ─── Dashboard App ────────────────────────────────────────────────────────────

const DashboardApp: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">🌍 Atlas Sanctum</h1>
          <p className="text-xs text-gray-500">Regenerative Intelligence Platform</p>
        </div>
        <div className="text-xs text-gray-400">
          Updated {lastUpdated.toLocaleTimeString()}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <PlanetaryMetricsPanel />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AgentNetworkPanel />
          <SensorFabricPanel />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DigitalTwinsPanel />
          <CreditActivityPanel />
        </div>
      </main>
    </div>
  );
};

export default DashboardApp;
