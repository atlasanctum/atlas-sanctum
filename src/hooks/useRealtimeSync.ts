import { useEffect, useState, useCallback } from 'react';

interface RealtimeData {
  carbonCredits: number;
  activeProjects: number;
  tradingVolume: number;
  ecosystemHealth: number;
}

export const useRealtimeSync = () => {
  const [data, setData] = useState<RealtimeData>({
    carbonCredits: 24500000,
    activeProjects: 2847,
    tradingVolume: 1840000000,
    ecosystemHealth: 94
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const simulateRealtimeUpdates = useCallback(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        carbonCredits: prev.carbonCredits + Math.floor(Math.random() * 1000),
        activeProjects: prev.activeProjects + Math.floor(Math.random() * 5),
        tradingVolume: prev.tradingVolume + Math.floor(Math.random() * 100000),
        ecosystemHealth: Math.min(100, prev.ecosystemHealth + (Math.random() - 0.5) * 2)
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const connectWebSocket = useCallback(() => {
    // WebSocket connection for real-time updates
    const wsUrl = import.meta.env.PROD 
      ? 'wss://api.atlas-genesis.com/ws'
      : 'ws://localhost:4000/ws';

    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        console.log('🔗 Real-time connection established');
      };

      ws.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data);
          setData(prev => ({ ...prev, ...update }));
          setLastUpdate(new Date());
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('🔌 Real-time connection closed');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      return simulateRealtimeUpdates();
    }
  }, [simulateRealtimeUpdates]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  return {
    data,
    isConnected,
    lastUpdate,
    refresh: () => setLastUpdate(new Date())
  };
};