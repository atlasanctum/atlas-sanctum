 /**
  * Real-time Price Alerts Hook
  * Implements Supabase Realtime with polling fallback for price monitoring
  */
 
 import { useEffect, useState, useCallback, useRef } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useSupabaseAuth } from './useSupabaseAuth';
 import { usePriceAlerts } from './usePriceAlerts';
 import type { RealtimeChannel } from '@supabase/supabase-js';
 
 type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
 
 interface PriceUpdate {
   projectId: string;
   price: number;
   previousPrice: number;
   changePercent: number;
   timestamp: string;
 }
 
 export function useRealtimePriceAlerts() {
   const { user } = useSupabaseAuth();
   const { alerts, checkPriceAlerts } = usePriceAlerts();
   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
   const [lastPriceUpdate, setLastPriceUpdate] = useState<PriceUpdate | null>(null);
   const channelRef = useRef<RealtimeChannel | null>(null);
   const pollIntervalRef = useRef<number>(5000);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const lastSyncRef = useRef<string | null>(null);
 
   // Process price change and check alerts
   const handlePriceChange = useCallback(async (
     projectId: string,
     newPrice: number,
     oldPrice: number
   ) => {
     const changePercent = oldPrice > 0 
       ? ((newPrice - oldPrice) / oldPrice) * 100 
       : 0;
 
     setLastPriceUpdate({
       projectId,
       price: newPrice,
       previousPrice: oldPrice,
       changePercent,
       timestamp: new Date().toISOString(),
     });
 
     // Reset poll interval on successful update
     pollIntervalRef.current = 5000;
     lastSyncRef.current = new Date().toISOString();
 
     // Check if any alerts should be triggered
     await checkPriceAlerts();
   }, [checkPriceAlerts]);
 
   // Setup Realtime subscription
   const setupRealtimeSubscription = useCallback(() => {
     if (!user) return;
 
     setConnectionStatus('connecting');
 
     const channel = supabase
       .channel('carbon_projects_prices')
       .on(
         'postgres_changes',
         {
           event: 'UPDATE',
           schema: 'public',
           table: 'carbon_projects',
         },
         (payload) => {
           console.log('Realtime price update:', payload);
           const newData = payload.new as { id: string; price_per_credit: number };
           const oldData = payload.old as { price_per_credit?: number };
           
           handlePriceChange(
             newData.id,
             newData.price_per_credit,
             oldData?.price_per_credit || newData.price_per_credit
           );
           
           setConnectionStatus('connected');
         }
       )
       .subscribe((status, err) => {
         console.log('Channel status:', status, err);
         if (status === 'SUBSCRIBED') {
           setConnectionStatus('connected');
         } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
           setConnectionStatus('error');
           console.error('Realtime subscription error:', err);
         } else if (status === 'CLOSED') {
           setConnectionStatus('disconnected');
         }
       });
 
     channelRef.current = channel;
   }, [user, handlePriceChange]);
 
   // Polling fallback with exponential backoff
   const pollForUpdates = useCallback(async () => {
     if (!user || alerts.length === 0) {
       pollTimeoutRef.current = setTimeout(pollForUpdates, pollIntervalRef.current);
       return;
     }
 
     try {
       // Get project IDs from active alerts
       const projectIds = [...new Set(alerts.map(a => a.project_id))];
       
       const query = supabase
         .from('carbon_projects')
         .select('id, price_per_credit, updated_at')
         .in('id', projectIds);
 
       // Only get updates since last sync if available
       if (lastSyncRef.current) {
         query.gt('updated_at', lastSyncRef.current);
       }
 
       const { data, error } = await query;
 
       if (error) throw error;
 
       if (data && data.length > 0) {
         // Process each updated project
         for (const project of data) {
           const alert = alerts.find(a => a.project_id === project.id);
           if (alert?.carbon_projects) {
             await handlePriceChange(
               project.id,
               project.price_per_credit,
               alert.carbon_projects.price_per_credit
             );
           }
         }
         pollIntervalRef.current = 5000; // Reset on changes
         setConnectionStatus('connected');
       } else {
         // Backoff when no changes (1.5x multiplier, max 30s)
         pollIntervalRef.current = Math.min(pollIntervalRef.current * 1.5, 30000);
       }
     } catch (error) {
       console.error('Polling error:', error);
       pollIntervalRef.current = Math.min(pollIntervalRef.current * 1.5, 30000);
       setConnectionStatus('error');
     } finally {
       pollTimeoutRef.current = setTimeout(pollForUpdates, pollIntervalRef.current);
     }
   }, [user, alerts, handlePriceChange]);
 
   // Initialize subscriptions
   useEffect(() => {
     if (!user) return;
 
     setupRealtimeSubscription();
     pollTimeoutRef.current = setTimeout(pollForUpdates, pollIntervalRef.current);
 
     return () => {
       if (channelRef.current) {
         supabase.removeChannel(channelRef.current);
       }
       if (pollTimeoutRef.current) {
         clearTimeout(pollTimeoutRef.current);
       }
     };
   }, [user, setupRealtimeSubscription, pollForUpdates]);
 
   // Reconnect on status change
   useEffect(() => {
     if (connectionStatus === 'error' && user) {
       const reconnectTimeout = setTimeout(() => {
         console.log('Attempting to reconnect...');
         if (channelRef.current) {
           supabase.removeChannel(channelRef.current);
         }
         setupRealtimeSubscription();
       }, 5000);
 
       return () => clearTimeout(reconnectTimeout);
     }
   }, [connectionStatus, user, setupRealtimeSubscription]);
 
   return {
     connectionStatus,
     lastPriceUpdate,
     isConnected: connectionStatus === 'connected',
   };
 }