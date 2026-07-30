/**
 * Production WebSocket Service
 * Handles real-time collaboration features with reconnection logic
 */

export type WSMessage = {
  type: 'chat' | 'task_update' | 'code_review' | 'presence' | 'notification';
  payload: any;
  userId: string;
  timestamp: number;
};

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private connectionStatusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionStatus: ConnectionStatus = 'disconnected';

  connect(url: string = process.env.WS_URL || 'ws://localhost:8080') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connected');
      return;
    }

    this.updateConnectionStatus('connecting');
    console.log('[WS] Connecting to:', url);

    try {
      this.ws = new WebSocket(url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('[WS] Connection error:', error);
      this.updateConnectionStatus('error');
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('[WS] Connected successfully');
      this.reconnectAttempts = 0;
      this.updateConnectionStatus('connected');
      this.startHeartbeat();
    };

    this.ws.onclose = (event) => {
      console.log('[WS] Connection closed:', event.code, event.reason);
      this.updateConnectionStatus('disconnected');
      this.stopHeartbeat();
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('[WS] WebSocket error:', error);
      this.updateConnectionStatus('error');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('[WS] Failed to parse message:', error);
      }
    };
  }

  private handleMessage(message: WSMessage) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => callback(message.payload));
    }

    // Also notify 'all' listeners
    const allListeners = this.listeners.get('all');
    if (allListeners) {
      allListeners.forEach(callback => callback(message));
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  send(type: WSMessage['type'], payload: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Cannot send message - not connected');
      return false;
    }

    const message: WSMessage = {
      type,
      payload,
      userId: this.getUserId(),
      timestamp: Date.now()
    };

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('[WS] Failed to send message:', error);
      return false;
    }
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  onConnectionStatusChange(callback: (status: ConnectionStatus) => void) {
    this.connectionStatusListeners.add(callback);
    // Immediately call with current status
    callback(this.connectionStatus);

    return () => {
      this.connectionStatusListeners.delete(callback);
    };
  }

  private updateConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.connectionStatusListeners.forEach(callback => callback(status));
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateConnectionStatus('disconnected');
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  private getUserId(): string {
    // In production, get from auth context
    return localStorage.getItem('userId') || 'anonymous';
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
