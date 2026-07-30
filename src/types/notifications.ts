/**
 * Notification Types
 * Comprehensive type definitions for the notification system
 */

// Notification Channels
export type NotificationChannel = 'push' | 'email' | 'sms' | 'in_app';

// Notification Priority
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Notification Category
export type NotificationCategory =
  | 'investment'
  | 'impact'
  | 'transaction'
  | 'verification'
  | 'community'
  | 'system'
  | 'marketing'
  | 'reminder';

// Notification Status
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

// Base Notification Interface
export interface BaseNotification {
  id: string;
  userId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  status: NotificationStatus;
  createdAt: string;
  expiresAt?: string;
  readAt?: string;
  metadata?: Record<string, unknown>;
}

// Push Notification
export interface PushNotification extends BaseNotification {
  channel: 'push';
  title: string;
  body: string;
  icon?: string;
  imageUrl?: string;
  actionUrl?: string;
  badge?: number;
  sound?: string;
  tag?: string;
  data?: Record<string, string>;
  collapseKey?: string;
}

// Email Notification
export interface EmailNotification extends BaseNotification {
  channel: 'email';
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  content: string; // Base64 encoded
  size?: number;
}

// SMS Notification
export interface SMSNotification extends BaseNotification {
  channel: 'sms';
  to: string;
  body: string;
  from?: string;
  statusCallback?: string;
}

// In-App Notification
export interface InAppNotification extends BaseNotification {
  channel: 'in_app';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  dismissible: boolean;
  persistent: boolean;
}

// Union type for all notifications
export type Notification = PushNotification | EmailNotification | SMSNotification | InAppNotification;

// Notification Template
export interface NotificationTemplate {
  id: string;
  name: string;
  category: NotificationCategory;
  channels: NotificationChannel[];
  pushTemplate?: {
    title: string;
    body: string;
    icon?: string;
    imageUrl?: string;
  };
  emailTemplate?: {
    subject: string;
    htmlBody: string;
    textBody?: string;
  };
  smsTemplate?: {
    body: string;
  };
  inAppTemplate?: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  };
  variables: string[];
}

// Notification Preferences
export interface NotificationPreferences {
  userId: string;
  email: {
    investmentUpdates: boolean;
    impactReports: boolean;
    communityActivity: boolean;
    marketing: boolean;
    transactionAlerts: boolean;
    weeklyDigest: boolean;
    monthlyReport: boolean;
  };
  push: {
    transactionAlerts: boolean;
    impactMilestones: boolean;
    challenges: boolean;
    communityMentions: boolean;
    projectUpdates: boolean;
  };
  sms: {
    criticalAlerts: boolean;
    twoFactor: boolean;
    transactionConfirmations: boolean;
  };
  inApp: {
    showInvestmentAlerts: boolean;
    showImpactNotifications: boolean;
    showCommunityActivity: boolean;
    showSystemUpdates: boolean;
    soundEnabled: boolean;
  };
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    timezone: string;
  };
}

// Notification Subscription
export interface NotificationSubscription {
  id: string;
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
  enabled: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

// Notification Batch Request
export interface NotificationBatchRequest {
  notifications: Omit<Notification, 'id' | 'createdAt'>[];
  scheduleFor?: string; // ISO date for scheduled notifications
  dryRun?: boolean;
}

// Notification Analytics
export interface NotificationAnalytics {
  totalSent: number;
  delivered: number;
  read: number;
  clicked: number;
  failed: number;
  byChannel: Record<NotificationChannel, {
    sent: number;
    delivered: number;
    failed: number;
  }>;
  byCategory: Record<NotificationCategory, {
    sent: number;
    read: number;
  }>;
  averageDeliveryTime: number; // in milliseconds
  period: {
    start: string;
    end: string;
  };
}

// Notification Search/Filter
export interface NotificationFilter {
  userId?: string;
  category?: NotificationCategory[];
  priority?: NotificationPriority[];
  status?: NotificationStatus[];
  channel?: NotificationChannel[];
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Pagination Result
export interface NotificationPage {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

// Toast Notification (for UI)
export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

// Notification Context Type
export interface NotificationContextType {
  // State
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<{ success: boolean; notification?: Notification }>;
  sendBatch: (request: NotificationBatchRequest) => Promise<{ success: boolean; sent: number; failed: number }>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;

  // Preferences
  getPreferences: () => Promise<NotificationPreferences>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;

  // Subscriptions
  subscribeToPush: (deviceToken: string, platform: 'ios' | 'android' | 'web') => Promise<void>;
  unsubscribeFromPush: (deviceToken: string) => Promise<void>;

  // Toast
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;
}

// API Response Types
export interface SendNotificationResponse {
  success: boolean;
  notificationId: string;
  channelResults?: Record<NotificationChannel, {
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}

export interface NotificationHistoryResponse {
  notifications: Notification[];
  total: number;
  page: number;
  pageSize: number;
}
