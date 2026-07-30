import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { healthCheck } from '@/app/utils/api';

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await healthCheck();
      if (response.status === 'ok') {
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setStatus('disconnected');
    }
  };

  if (status === 'checking') {
    return (
      <Badge variant="outline" className="gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting...
      </Badge>
    );
  }

  if (status === 'connected') {
    return (
      <Badge variant="outline" className="gap-1.5 border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
        <CheckCircle2 className="h-3 w-3" />
        Connected
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400">
      <XCircle className="h-3 w-3" />
      Offline
    </Badge>
  );
};
