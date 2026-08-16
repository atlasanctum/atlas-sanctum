/**
 * @atlas-sanctum/ui
 * Shared component library — design tokens, primitives, and domain components.
 * Built on Tailwind CSS + Framer Motion. Zero external UI framework dependency.
 */

import React from 'react';

// ─── Design Tokens ────────────────────────────────────────────────────────────

export const tokens = {
  color: {
    regenerative: '#16a34a',   // green-600
    ocean:        '#0284c7',   // sky-600
    earth:        '#92400e',   // amber-800
    governance:   '#7c3aed',   // violet-600
    warning:      '#d97706',   // amber-600
    critical:     '#dc2626',   // red-600
    neutral:      '#6b7280',   // gray-500
  },
  creditType: {
    carbon:          '#16a34a',
    biodiversity:    '#15803d',
    water:           '#0284c7',
    ocean:           '#0369a1',
    community:       '#7c3aed',
    healthcare:      '#db2777',
    circular_economy:'#d97706',
  },
} as const;

// ─── Primitives ───────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'critical' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', className = '' }) => {
  const variantClass: Record<string, string> = {
    success:  'bg-green-100 text-green-800 border-green-200',
    warning:  'bg-amber-100 text-amber-800 border-amber-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
    info:     'bg-sky-100 text-sky-800 border-sky-200',
    neutral:  'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variantClass[variant]} ${className}`}>
      {label}
    </span>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, unit, trend, trendValue, icon, className = '',
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className={`mt-1 text-xs font-medium ${trendColor}`}>
          {trendArrow} {trendValue}
        </div>
      )}
    </div>
  );
};

interface ProgressBarProps {
  value: number;       // 0–100
  max?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value, max = 100, label, color = '#16a34a', showValue = true, className = '',
}) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          {label && <span>{label}</span>}
          {showValue && <span>{pct.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

interface StatusDotProps {
  status: 'online' | 'offline' | 'degraded' | 'synced' | 'diverged' | 'active' | 'idle' | 'error';
  label?: string;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, label, className = '' }) => {
  const colorMap: Record<string, string> = {
    online:   'bg-green-500',
    synced:   'bg-green-500',
    active:   'bg-green-500',
    idle:     'bg-gray-400',
    offline:  'bg-gray-400',
    degraded: 'bg-amber-500',
    diverged: 'bg-red-500',
    error:    'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`w-2 h-2 rounded-full ${colorMap[status] ?? 'bg-gray-400'}`} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </span>
  );
};

// ─── Domain Components ────────────────────────────────────────────────────────

interface CreditTypeBadgeProps {
  type: keyof typeof tokens.creditType;
  amount?: number;
  className?: string;
}

export const CreditTypeBadge: React.FC<CreditTypeBadgeProps> = ({ type, amount, className = '' }) => {
  const color = tokens.creditType[type] ?? tokens.color.neutral;
  const labels: Record<string, string> = {
    carbon:          '🌳 Carbon',
    biodiversity:    '🦋 Biodiversity',
    water:           '💧 Water',
    ocean:           '🌊 Ocean',
    community:       '🤝 Community',
    healthcare:      '❤️ Healthcare',
    circular_economy:'♻️ Circular',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {labels[type] ?? type}
      {amount !== undefined && <span className="opacity-90">· {amount.toLocaleString()}</span>}
    </span>
  );
};

interface EthicsScoreProps {
  score: number;   // 0–1
  showLabel?: boolean;
  className?: string;
}

export const EthicsScore: React.FC<EthicsScoreProps> = ({ score, showLabel = true, className = '' }) => {
  const pct = Math.round(score * 100);
  const color = score >= 0.7 ? '#16a34a' : score >= 0.4 ? '#d97706' : '#dc2626';
  const label = score >= 0.7 ? 'Aligned' : score >= 0.4 ? 'Review' : 'Blocked';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.9" fill="none"
            stroke={color} strokeWidth="3"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color }}>
          {pct}
        </span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium" style={{ color }}>{label}</span>
      )}
    </div>
  );
};

interface PlanetaryBoundaryGaugeProps {
  label: string;
  current: number;
  boundary: number;
  unit: string;
  lowerIsBetter?: boolean;
  className?: string;
}

export const PlanetaryBoundaryGauge: React.FC<PlanetaryBoundaryGaugeProps> = ({
  label, current, boundary, unit, lowerIsBetter = false, className = '',
}) => {
  const ratio = current / boundary;
  const exceeded = lowerIsBetter ? ratio > 1 : ratio < 1;
  const pct = Math.min(100, ratio * 100);
  const color = exceeded ? '#dc2626' : ratio > 0.8 ? '#d97706' : '#16a34a';

  return (
    <div className={`p-3 rounded-lg border ${exceeded ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <Badge
          label={exceeded ? 'Exceeded' : 'Safe'}
          variant={exceeded ? 'critical' : 'success'}
        />
      </div>
      <ProgressBar value={pct} color={color} showValue={false} />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{current.toLocaleString()} {unit}</span>
        <span>Boundary: {boundary.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
};

interface AgentStatusCardProps {
  agentId: string;
  role: string;
  status: 'idle' | 'active' | 'deliberating' | 'blocked' | 'error' | 'offline';
  ethicsScore?: number;
  tasksCompleted?: number;
  className?: string;
}

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  agentId, role, status, ethicsScore, tasksCompleted, className = '',
}) => {
  const statusVariant: Record<string, BadgeProps['variant']> = {
    idle: 'neutral', active: 'success', deliberating: 'info',
    blocked: 'warning', error: 'critical', offline: 'neutral',
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white ${className}`}>
      <div className="flex items-center gap-3">
        <StatusDot status={status} />
        <div>
          <div className="text-sm font-semibold text-gray-800 capitalize">{role}</div>
          <div className="text-xs text-gray-400">{agentId}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {tasksCompleted !== undefined && (
          <span className="text-xs text-gray-500">{tasksCompleted} tasks</span>
        )}
        {ethicsScore !== undefined && <EthicsScore score={ethicsScore} showLabel={false} />}
        <Badge label={status} variant={statusVariant[status] ?? 'neutral'} />
      </div>
    </div>
  );
};

// ─── Layout Primitives ────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '🌱', title, description, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
    <span className="text-4xl mb-3">{icon}</span>
    <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Badge,
  MetricCard,
  ProgressBar,
  StatusDot,
  CreditTypeBadge,
  EthicsScore,
  PlanetaryBoundaryGauge,
  AgentStatusCard,
  SectionHeader,
  EmptyState,
};
