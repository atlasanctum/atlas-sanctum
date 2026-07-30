import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApiStatusProps {
  apiUrl?: string;
  showLabel?: boolean;
}

const ApiStatus = ({ apiUrl, showLabel = false }: ApiStatusProps) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      // Use /api/health (proxied by Vite in dev, absolute URL in production)
      const base = apiUrl
        ? apiUrl.replace(/\/api$/, '')
        : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : '');
      const healthUrl = base ? `${base}/health` : '/health';

      try {
        const startTime = Date.now();
        const response = await fetch(healthUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        const endTime = Date.now();

        if (response.ok) {
          setStatus('online');
          setLatency(endTime - startTime);
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
        setLatency(null);
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, [apiUrl]);

  if (!showLabel && status === 'online') {
    return null; // Don't show anything if online and label not requested
  }

  return (
    <Badge
      variant={status === 'online' ? 'default' : 'destructive'}
      className="flex items-center gap-1.5"
    >
      {status === 'checking' && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === 'online' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'offline' && <XCircle className="w-3 h-3" />}
      {showLabel && (
        <span>
          API {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking'}
          {latency && status === 'online' && ` (${latency}ms)`}
        </span>
      )}
    </Badge>
  );
};

export default ApiStatus;

