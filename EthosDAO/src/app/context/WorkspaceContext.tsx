import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { wsService, ConnectionStatus } from '@/app/services/websocket.service';
import { logger } from '@/app/services/logger.service';
import { apiService } from '@/app/services/api.service';
import { toast } from 'sonner';

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
type Priority = 'high' | 'medium' | 'low';
type Role = 'protocol' | 'ai' | 'integrator';

export type Task = {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
    role: Role;
  };
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  labels: string[];
  createdAt: number;
  updatedAt: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  expertise: string[];
  lastSeen?: number;
};

export type ChatMessage = {
  id: string;
  sender: string;
  senderId: string;
  avatar: string;
  message: string;
  timestamp: number;
  role: Role;
};

export type PresenceUpdate = {
  userId: string;
  status: 'online' | 'away' | 'offline';
  timestamp: number;
};

type WorkspaceContextType = {
  // Connection
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  
  // Tasks
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Team
  teamMembers: TeamMember[];
  updatePresence: (userId: string, status: 'online' | 'away' | 'offline') => void;
  
  // Chat
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;
  
  // Real-time updates
  lastUpdate: number | null;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  
  const isInitialized = useRef(false);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    logger.info('Initializing Workspace Context', 'WorkspaceContext');

    // Connect to WebSocket
    wsService.connect();

    // Subscribe to connection status
    const unsubscribeStatus = wsService.onConnectionStatusChange((status) => {
      setConnectionStatus(status);
      logger.info(`WebSocket status changed: ${status}`, 'WorkspaceContext');
      
      if (status === 'connected') {
        toast.success('Connected to workspace');
        loadInitialData();
      } else if (status === 'disconnected') {
        toast.error('Disconnected from workspace');
      } else if (status === 'error') {
        toast.error('Connection error - retrying...');
      }
    });

    // Subscribe to real-time updates
    const unsubscribeTask = wsService.subscribe('task_update', handleTaskUpdate);
    const unsubscribeChat = wsService.subscribe('chat', handleChatMessage);
    const unsubscribePresence = wsService.subscribe('presence', handlePresenceUpdate);

    return () => {
      unsubscribeStatus();
      unsubscribeTask();
      unsubscribeChat();
      unsubscribePresence();
      wsService.disconnect();
    };
  }, []);

  // Load initial data
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      logger.info('Loading initial workspace data', 'WorkspaceContext');

      // In production, these would be real API calls
      const [tasksRes, membersRes, messagesRes] = await Promise.all([
        apiService.get<Task[]>('/api/workspace/tasks', { cache: true, cacheTTL: 30000 }),
        apiService.get<TeamMember[]>('/api/workspace/members', { cache: true, cacheTTL: 60000 }),
        apiService.get<ChatMessage[]>('/api/workspace/messages', { cache: true, cacheTTL: 10000 })
      ]);

      if (tasksRes.data) setTasks(tasksRes.data);
      if (membersRes.data) setTeamMembers(membersRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);

      logger.info('Workspace data loaded successfully', 'WorkspaceContext');
    } catch (err: any) {
      const errorMsg = 'Failed to load workspace data';
      logger.error(errorMsg, 'WorkspaceContext', err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Task operations
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    logger.info('Creating task', 'WorkspaceContext', { title: taskData.title });

    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Optimistic update
    setTasks(prev => [...prev, newTask]);
    setLastUpdate(Date.now());

    try {
      // Send to server
      const response = await apiService.post<Task>('/api/workspace/tasks', newTask);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Broadcast via WebSocket
      wsService.send('task_update', {
        action: 'create',
        task: newTask
      });

      toast.success('Task created successfully');
      logger.trackAction('task_created', { taskId: newTask.id });
    } catch (err: any) {
      // Rollback on error
      setTasks(prev => prev.filter(t => t.id !== newTask.id));
      logger.error('Failed to create task', 'WorkspaceContext', err);
      toast.error('Failed to create task');
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    logger.info('Updating task', 'WorkspaceContext', { id, updates });

    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
    ));
    setLastUpdate(Date.now());

    try {
      const response = await apiService.patch<Task>(`/api/workspace/tasks/${id}`, updates);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Broadcast via WebSocket
      wsService.send('task_update', {
        action: 'update',
        taskId: id,
        updates
      });

      logger.trackAction('task_updated', { taskId: id });
    } catch (err: any) {
      // Could implement rollback here
      logger.error('Failed to update task', 'WorkspaceContext', err);
      toast.error('Failed to update task');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    logger.info('Deleting task', 'WorkspaceContext', { id });

    // Optimistic update
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    setLastUpdate(Date.now());

    try {
      const response = await apiService.delete(`/api/workspace/tasks/${id}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Broadcast via WebSocket
      wsService.send('task_update', {
        action: 'delete',
        taskId: id
      });

      toast.success('Task deleted');
      logger.trackAction('task_deleted', { taskId: id });
    } catch (err: any) {
      // Rollback on error
      if (taskToDelete) {
        setTasks(prev => [...prev, taskToDelete]);
      }
      logger.error('Failed to delete task', 'WorkspaceContext', err);
      toast.error('Failed to delete task');
      throw err;
    }
  }, [tasks]);

  // Real-time update handlers
  const handleTaskUpdate = useCallback((payload: any) => {
    logger.debug('Received task update', 'WorkspaceContext', payload);
    
    switch (payload.action) {
      case 'create':
        setTasks(prev => {
          if (prev.find(t => t.id === payload.task.id)) return prev;
          return [...prev, payload.task];
        });
        break;
      case 'update':
        setTasks(prev => prev.map(t =>
          t.id === payload.taskId ? { ...t, ...payload.updates, updatedAt: Date.now() } : t
        ));
        break;
      case 'delete':
        setTasks(prev => prev.filter(t => t.id !== payload.taskId));
        break;
    }
    
    setLastUpdate(Date.now());
  }, []);

  const handleChatMessage = useCallback((payload: ChatMessage) => {
    logger.debug('Received chat message', 'WorkspaceContext', payload);
    
    setMessages(prev => {
      // Prevent duplicates
      if (prev.find(m => m.id === payload.id)) return prev;
      return [...prev, payload];
    });
    
    setLastUpdate(Date.now());
  }, []);

  const handlePresenceUpdate = useCallback((payload: PresenceUpdate) => {
    logger.debug('Received presence update', 'WorkspaceContext', payload);
    
    setTeamMembers(prev => prev.map(member =>
      member.id === payload.userId
        ? { ...member, status: payload.status, lastSeen: payload.timestamp }
        : member
    ));
    
    setLastUpdate(Date.now());
  }, []);

  // Chat operations
  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) return;

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'current_user.eth', // Replace with actual user
      senderId: 'current_user_id',
      avatar: 'https://i.pravatar.cc/150?u=current',
      message: message.trim(),
      timestamp: Date.now(),
      role: 'protocol' // Replace with actual role
    };

    // Optimistic update
    setMessages(prev => [...prev, chatMessage]);
    setLastUpdate(Date.now());

    // Send via WebSocket
    wsService.send('chat', chatMessage);

    logger.trackAction('message_sent', { messageId: chatMessage.id });
  }, []);

  // Presence update
  const updatePresence = useCallback((userId: string, status: 'online' | 'away' | 'offline') => {
    wsService.send('presence', {
      userId,
      status,
      timestamp: Date.now()
    });
  }, []);

  const value: WorkspaceContextType = {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    tasks,
    createTask,
    updateTask,
    deleteTask,
    teamMembers,
    updatePresence,
    messages,
    sendMessage,
    isLoading,
    error,
    lastUpdate
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
