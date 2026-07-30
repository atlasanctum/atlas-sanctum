import { useEffect, useRef, useState, useCallback } from 'react';
import type { NotificationData, PriceUpdateData, GovernanceUpdateData, MarketplaceActivityData, DashboardUpdateData } from '@/lib/api/socket';
import { socketService } from '@/lib/api/socket';
import { useAuth } from './useAuth';

interface UseSocketOptions {
  autoConnect?: boolean;
  channels?: string[];
}

interface UseSocketReturn {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (channels: string[]) => void;
  unsubscribe: (channels: string[]) => void;
  onNotification: (callback: (data: NotificationData) => void) => () => void;
  onPriceUpdate: (callback: (data: PriceUpdateData) => void) => () => void;
  onGovernanceUpdate: (callback: (data: GovernanceUpdateData) => void) => () => void;
  onMarketplaceActivity: (callback: (data: MarketplaceActivityData) => void) => () => void;
  onDashboardUpdate: (callback: (data: DashboardUpdateData) => void) => () => void;
}

/**
 * Hook for WebSocket connections using Socket.io
 * Provides real-time updates for notifications, price changes, governance, and marketplace activity
 */
export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { autoConnect = true, channels = [] } = options;
  const { user, tokens } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const unsubscribeFunctionsRef = useRef<(() => void)[]>([]);

  // Update token when user changes
  useEffect(() => {
    if (tokens?.accessToken) {
      socketService.setToken(tokens.accessToken);
    }
  }, [tokens?.accessToken]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (autoConnect && user && tokens?.accessToken) {
      connect();
    }

    return () => {
      // Cleanup all listeners on unmount
      unsubscribeFunctionsRef.current.forEach(unsubscribe => unsubscribe());
      unsubscribeFunctionsRef.current = [];
    };
  }, [autoConnect, user, tokens?.accessToken]);

  // Subscribe to channels when connected
  useEffect(() => {
    if (isConnected && channels.length > 0) {
      socketService.subscribe(channels);
    }
  }, [isConnected, channels]);

  const connect = useCallback(async () => {
    try {
      await socketService.connect();
      setIsConnected(socketService.isConnected);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
  }, []);

  const subscribe = useCallback((channelsToSubscribe: string[]) => {
    socketService.subscribe(channelsToSubscribe);
  }, []);

  const unsubscribe = useCallback((channelsToUnsubscribe: string[]) => {
    socketService.unsubscribe(channelsToUnsubscribe);
  }, []);

  // Event listener helpers with proper type casting
  const onNotification = useCallback((callback: (data: NotificationData) => void) => {
    const unsubscribe = socketService.on('notification', (data) => callback(data as NotificationData));
    unsubscribeFunctionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  const onPriceUpdate = useCallback((callback: (data: PriceUpdateData) => void) => {
    const unsubscribe = socketService.on('price-update', (data) => callback(data as PriceUpdateData));
    unsubscribeFunctionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  const onGovernanceUpdate = useCallback((callback: (data: GovernanceUpdateData) => void) => {
    const unsubscribe = socketService.on('governance-update', (data) => callback(data as GovernanceUpdateData));
    unsubscribeFunctionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  const onMarketplaceActivity = useCallback((callback: (data: MarketplaceActivityData) => void) => {
    const unsubscribe = socketService.on('marketplace-activity', (data) => callback(data as MarketplaceActivityData));
    unsubscribeFunctionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  const onDashboardUpdate = useCallback((callback: (data: DashboardUpdateData) => void) => {
    const unsubscribe = socketService.on('dashboard-update', (data) => callback(data as DashboardUpdateData));
    unsubscribeFunctionsRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    onNotification,
    onPriceUpdate,
    onGovernanceUpdate,
    onMarketplaceActivity,
    onDashboardUpdate,
  };
}

/**
 * Hook for real-time notifications
 */
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { onNotification } = useSocket({ channels: ['notifications'] });

  useEffect(() => {
    const unsubscribe = onNotification((data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50)); // Keep last 50 notifications
    });

    return unsubscribe;
  }, [onNotification]);

  return { notifications };
}

/**
 * Hook for real-time price updates
 */
export function useRealtimePrices() {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdateData[]>([]);
  const { onPriceUpdate } = useSocket({ channels: ['price-updates'] });

  useEffect(() => {
    const unsubscribe = onPriceUpdate((data) => {
      setPriceUpdates(prev => [data, ...prev].slice(0, 100)); // Keep last 100 updates
    });

    return unsubscribe;
  }, [onPriceUpdate]);

  return { priceUpdates };
}

/**
 * Hook for real-time governance updates
 */
export function useRealtimeGovernance() {
  const [governanceUpdates, setGovernanceUpdates] = useState<GovernanceUpdateData[]>([]);
  const { onGovernanceUpdate } = useSocket({ channels: ['governance'] });

  useEffect(() => {
    const unsubscribe = onGovernanceUpdate((data) => {
      setGovernanceUpdates(prev => [data, ...prev].slice(0, 50)); // Keep last 50 updates
    });

    return unsubscribe;
  }, [onGovernanceUpdate]);

  return { governanceUpdates };
}

/**
 * Hook for real-time marketplace activity
 */
export function useRealtimeMarketplace() {
  const [marketplaceActivity, setMarketplaceActivity] = useState<MarketplaceActivityData[]>([]);
  const { onMarketplaceActivity } = useSocket({ channels: ['marketplace'] });

  useEffect(() => {
    const unsubscribe = onMarketplaceActivity((data) => {
      setMarketplaceActivity(prev => [data, ...prev].slice(0, 50)); // Keep last 50 activities
    });

    return unsubscribe;
  }, [onMarketplaceActivity]);

  return { marketplaceActivity };
}