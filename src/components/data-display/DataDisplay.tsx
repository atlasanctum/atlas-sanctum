/**
 * StatsCard Component
 * Display key metrics with trends and sparklines
 */

import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  iconColor?: string;
  onClick?: () => void;
  href?: string;
}

export function StatsCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  trend,
  icon,
  iconColor = 'blue',
  onClick,
  href,
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };

  const content = (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow ${
        onClick || href ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {unit && <span className="ml-1 text-lg text-slate-500">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className="mt-2 flex items-center">
              {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' || trend === 'stable'
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="ml-1 text-sm text-slate-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${colorClasses[iconColor as keyof typeof colorClasses] || colorClasses.blue} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
      {(onClick || href) && (
        <div className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-700">
          View details
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

/**
 * ProgressRing Component
 * Circular progress indicator
 */

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  value?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#10b981',
  backgroundColor = '#e2e8f0',
  showLabel = true,
  label,
  value,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {value && <span className="text-2xl font-bold text-slate-900">{value}</span>}
          {label && <span className="text-xs text-slate-500">{label}</span>}
        </div>
      )}
    </div>
  );
}

/**
 * EmptyState Component
 * Display when there's no data
 */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      {description && <p className="mt-2 text-slate-500">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Skeleton Component
 * Loading placeholder
 */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-slate-200';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

/**
 * Badge Component
 * Status or label indicator
 */

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            variant === 'success' ? 'bg-emerald-500' :
            variant === 'warning' ? 'bg-amber-500' :
            variant === 'error' ? 'bg-red-500' :
            variant === 'info' ? 'bg-blue-500' :
            'bg-slate-500'
          }`}
        />
      )}
      {children}
    </span>
  );
}

/**
 * Timeline Component
 * Vertical timeline for events
 */

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`relative border-l border-slate-200 ml-4 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="mb-8 ml-6 relative">
          {/* Timeline dot */}
          <div
            className={`absolute -left-9 w-5 h-5 rounded-full border-2 border-white ${
              item.color || 'bg-blue-500'
            }`}
            style={{ backgroundColor: item.color || undefined }}
          />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">{item.date}</p>
              <h4 className="font-medium text-slate-900 mt-1">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-slate-600 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;
