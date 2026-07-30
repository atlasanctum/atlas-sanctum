import React, { useEffect, useState } from 'react';
import { healthCheck } from '@/app/utils/api';
import { Badge } from './ui/badge';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export const BackendStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await healthCheck();
        if (result.status === 'ok') {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        console.error('Health check failed:', error);
        setStatus('offline');
      }
    };

    checkHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs">Checking...</span>
      </Badge>
    );
  }

  if (status === 'online') {
    return (
      <Badge variant="outline" className="gap-1 border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
        <Wifi className="h-3 w-3" />
        <span className="text-xs">Backend Online</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
      <WifiOff className="h-3 w-3" />
      <span className="text-xs">Backend Offline</span>
    </Badge>
  );
};
