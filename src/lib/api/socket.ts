import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface PriceUpdateData {
  assetId: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface GovernanceUpdateData {
  proposalId: string;
  type: 'created' | 'updated' | 'voted' | 'executed' | 'cancelled';
  proposal?: Record<string, unknown>;
  voterId?: string;
  vote?: Record<string, unknown>;
  timestamp: string;
}

export interface MarketplaceActivityData {
  type: 'listing_created' | 'listing_updated' | 'listing_deleted' | 'purchase' | 'bid' | 'offer';
  listingId: string;
  userId: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface DashboardUpdateData {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export type SocketEventData =
  | NotificationData
  | PriceUpdateData
  | GovernanceUpdateData
  | MarketplaceActivityData
  | DashboardUpdateData;

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Event listeners
  private listeners: { [event: string]: ((data: SocketEventData) => void)[] } = {};

  setToken(token: string) {
    this.token = token;
    if (this.socket) {
      this.socket.auth = { token };
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(SOCKET_URL, {
        auth: {
          token: this.token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.socket.on('connect', () => {
        console.log('🔌 Connected to WebSocket server');
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from WebSocket server:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔌 WebSocket connection error:', error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to WebSocket server'));
        }
      });

      // Set up event forwarding
      this.setupEventForwarding();
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventForwarding() {
    if (!this.socket) return;

    // Forward all events to registered listeners
    const events = [
      'notification',
      'price-update',
      'governance-update',
      'marketplace-activity',
      'dashboard-update'
    ];

    events.forEach(event => {
      this.socket?.on(event, (data: SocketEventData) => {
        this.notifyListeners(event, data);
      });
    });
  }

  private notifyListeners(event: string, data: SocketEventData) {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Subscribe to real-time feeds
  subscribe(channels: string[]) {
    if (this.socket) {
      this.socket.emit('subscribe', channels);
    }
  }

  // Unsubscribe from real-time feeds
  unsubscribe(channels: string[]) {
    if (this.socket) {
      this.socket.emit('unsubscribe', channels);
    }
  }

  // Event listener management
  on(event: string, callback: (data: SocketEventData) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners[event].indexOf(callback);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    };
  }

  // Remove all listeners for an event
  off(event: string) {
    delete this.listeners[event];
  }

  // Remove specific listener
  removeListener(event: string, callback: (data: SocketEventData) => void) {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Check connection status
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket ID
  get socketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();