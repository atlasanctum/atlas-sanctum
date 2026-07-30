import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { DataQuality } from '../data/advancedMockData';
import { cn } from './ui/utils';

interface DataQualityIndicatorProps {
  quality: DataQuality;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DataQualityIndicator: React.FC<DataQualityIndicatorProps> = ({ 
  quality, 
  showLabel = false,
  size = 'sm' 
}) => {
  const config = {
    excellent: { 
      icon: CheckCircle, 
      color: 'text-green-500', 
      bg: 'bg-green-500/10',
      label: 'Excellent' 
    },
    good: { 
      icon: CheckCircle, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      label: 'Good' 
    },
    fair: { 
      icon: AlertTriangle, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-500/10',
      label: 'Fair' 
    },
    poor: { 
      icon: XCircle, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10',
      label: 'Poor' 
    },
  };

  const { icon: Icon, color, bg, label } = config[quality];
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';

  if (showLabel) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', bg, color)}>
        <Icon className={iconSize} />
        {label}
      </span>
    );
  }

  return <Icon className={cn(iconSize, color)} />;
};
