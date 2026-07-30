import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, icon, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl">{value}</p>
        </div>
        {icon && (
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            {icon}
          </div>
        )}
      </div>
      
      {(change !== undefined || subtitle) && (
        <div className="flex items-center gap-2">
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
          {subtitle && (
            <span className="text-sm text-gray-500">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
