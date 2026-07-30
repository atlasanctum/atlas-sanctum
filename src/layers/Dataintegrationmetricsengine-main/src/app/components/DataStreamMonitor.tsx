import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { DataStream } from '../data/advancedMockData';
import { Wifi, WifiOff, AlertCircle, Clock, Activity } from 'lucide-react';
import { cn } from './ui/utils';
import { formatDistanceToNow } from 'date-fns';

interface DataStreamMonitorProps {
  streams: DataStream[];
}

export const DataStreamMonitor: React.FC<DataStreamMonitorProps> = ({ streams }) => {
  const activeStreams = streams.filter(s => s.status === 'active').length;
  const errorStreams = streams.filter(s => s.status === 'error').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Data Stream Monitor
            </CardTitle>
            <CardDescription>Real-time data ingestion and processing status</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{activeStreams}/{streams.length}</div>
            <div className="text-xs text-muted-foreground">Active Streams</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {streams.map((stream) => (
            <div 
              key={stream.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                stream.status === 'active' ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40' :
                stream.status === 'error' ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' :
                'bg-muted/50 border-muted hover:border-muted-foreground/20'
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "p-2 rounded-full",
                  stream.status === 'active' ? 'bg-green-500/10' :
                  stream.status === 'error' ? 'bg-red-500/10' : 'bg-muted'
                )}>
                  {stream.status === 'active' ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : stream.status === 'error' ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm truncate">{stream.name}</h4>
                    <Badge variant={stream.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                      {stream.source}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {stream.throughput}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stream.latency}ms
                    </span>
                    <span className={cn(
                      stream.errorRate > 0.1 ? 'text-red-500' : 
                      stream.errorRate > 0.05 ? 'text-yellow-500' : ''
                    )}>
                      {(stream.errorRate * 100).toFixed(2)}% errors
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {formatDistanceToNow(stream.lastSync, { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
        
        {errorStreams > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {errorStreams} data stream{errorStreams > 1 ? 's' : ''} require{errorStreams === 1 ? 's' : ''} attention
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
