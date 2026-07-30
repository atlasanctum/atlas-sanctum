/**
 * Notification Service
 * Handles push, email, SMS, and in-app notifications
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  Notification,
  NotificationCategory,
  NotificationPreferences,
  NotificationTemplate,
  NotificationBatchRequest,
  NotificationAnalytics,
  NotificationFilter,
  NotificationPage,
  ToastNotification,
  SendNotificationResponse,
  InAppNotification} from '../types/notifications';



// API Configuration
const API_BASE = import.meta.env.VITE_API_URL || '/api/v2';

/**
 * Template variable replacer
 */
function replaceVariables(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || `{{${key}}}`);
}

/**
 * Default notification templates
 */
const DEFAULT_TEMPLATES: Record<string, NotificationTemplate> = {
  investment_confirmation: {
    id: 'investment_confirmation',
    name: 'Investment Confirmation',
    category: 'investment',
    channels: ['push', 'email', 'in_app'],
    pushTemplate: {
      title: 'Investment Confirmed!',
      body: 'Your investment of {{amount}} has been confirmed.',
      icon: 'dollar-sign',
    },
    emailTemplate: {
      subject: 'Your Investment Confirmation - Atlas Sanctum',
      htmlBody: `
        <h1>Investment Confirmed</h1>
        <p>Dear {{userName}},</p>
        <p>Your investment of <strong>{{amount}}</strong> has been confirmed.</p>
        <p>Project: {{projectName}}</p>
        <p>Transaction ID: {{transactionId}}</p>
      `,
    },
    inAppTemplate: {
      title: 'Investment Confirmed!',
      message: 'Your investment of {{amount}} has been confirmed.',
      type: 'success',
    },
    variables: ['userName', 'amount', 'projectName', 'transactionId'],
  },
  impact_milestone: {
    id: 'impact_milestone',
    name: 'Impact Milestone',
    category: 'impact',
    channels: ['push', 'email', 'in_app'],
    pushTemplate: {
      title: 'Impact Milestone Reached!',
      body: '{{projectName}} has reached {{milestone}}!',
      icon: 'award',
    },
    emailTemplate: {
      subject: 'Impact Milestone Reached - {{projectName}}',
      htmlBody: `
        <h1>Impact Milestone Achieved!</h1>
        <p>Dear {{userName}},</p>
        <p>Congratulations! {{projectName}} has reached {{milestone}}.</p>
        <p>This wouldn't be possible without your contribution.</p>
      `,
    },
    inAppTemplate: {
      title: 'Impact Milestone!',
      message: '{{projectName}} has reached {{milestone}}!',
      type: 'success',
    },
    variables: ['userName', 'projectName', 'milestone'],
  },
  transaction_update: {
    id: 'transaction_update',
    name: 'Transaction Update',
    category: 'transaction',
    channels: ['push', 'email', 'sms', 'in_app'],
    pushTemplate: {
      title: 'Transaction Update',
      body: 'Your transaction status: {{status}}',
      icon: 'refresh-cw',
    },
    emailTemplate: {
      subject: 'Transaction Update - {{transactionId}}',
      htmlBody: `
        <h1>Transaction Update</h1>
        <p>Your transaction (ID: {{transactionId}}) status has been updated to: <strong>{{status}}</strong>.</p>
      `,
    },
    smsTemplate: {
      body: 'Atlas Sanctum: Your transaction {{transactionId}} status: {{status}}',
    },
    inAppTemplate: {
      title: 'Transaction Update',
      message: 'Status: {{status}}',
      type: 'info',
    },
    variables: ['transactionId', 'status'],
  },
  verification_complete: {
    id: 'verification_complete',
    name: 'Verification Complete',
    category: 'verification',
    channels: ['push', 'email', 'in_app'],
    pushTemplate: {
      title: 'Verification Complete',
      body: '{{projectName}} has been verified.',
      icon: 'check-circle',
    },
    emailTemplate: {
      subject: 'Verification Complete - {{projectName}}',
      htmlBody: `
        <h1>Verification Complete</h1>
        <p>{{projectName}} has been successfully verified.</p>
        <p>Verification ID: {{verificationId}}</p>
      `,
    },
    inAppTemplate: {
      title: 'Verification Complete',
      message: '{{projectName}} has been verified.',
      type: 'success',
    },
    variables: ['projectName', 'verificationId'],
  },
  community_mention: {
    id: 'community_mention',
    name: 'Community Mention',
    category: 'community',
    channels: ['push', 'in_app'],
    pushTemplate: {
      title: 'You were mentioned',
      body: '{{userName}} mentioned you in {{context}}',
      icon: 'message-circle',
    },
    inAppTemplate: {
      title: 'You were mentioned',
      message: '{{userName}} mentioned you in {{context}}',
      type: 'info',
    },
    variables: ['userName', 'context'],
  },
  weekly_digest: {
    id: 'weekly_digest',
    name: 'Weekly Digest',
    category: 'marketing',
    channels: ['email'],
    emailTemplate: {
      subject: 'Your Weekly Impact Digest',
      htmlBody: `
        <h1>Your Weekly Impact</h1>
        <p>Dear {{userName}},</p>
        <p>Here's what you accomplished this week:</p>
        <ul>
          <li>Carbon offset: {{carbonOffset}} tons</li>
          <li>Projects supported: {{projectsSupported}}</li>
        </ul>
      `,
    },
    variables: ['userName', 'carbonOffset', 'projectsSupported'],
  },
};

class NotificationService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private toastCallbacks: ((toast: ToastNotification) => void)[] = [];
  private inAppNotifications: InAppNotification[] = [];
  private maxInAppNotifications = 50;

  // ==================== Cache Methods ====================

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // ==================== Toast Notifications ====================

  onToast(callback: (toast: ToastNotification) => void): () => void {
    this.toastCallbacks.push(callback);
    return () => {
      this.toastCallbacks = this.toastCallbacks.filter((cb) => cb !== callback);
    };
  }

  private emitToast(toast: Omit<ToastNotification, 'id'>): void {
    const id = uuidv4();
    const fullToast: ToastNotification = { ...toast, id };
    this.toastCallbacks.forEach((callback) => callback(fullToast));
    const inAppNotification: InAppNotification = {
      id,
      userId: 'current',
      category: 'system',
      priority: 'medium',
      channels: ['in_app'],
      channel: 'in_app',
      title: toast.title,
      message: toast.message || '',
      type: toast.type,
      dismissible: true,
      persistent: false,
      status: 'delivered',
      createdAt: new Date().toISOString(),
    };
    this.addInAppNotification(inAppNotification);
  }

  showToast(toast: Omit<ToastNotification, 'id'>): void {
    this.emitToast(toast);
  }

  // ==================== In-App Notifications ====================

  private addInAppNotification(notification: InAppNotification): void {
    this.inAppNotifications.unshift(notification);
    if (this.inAppNotifications.length > this.maxInAppNotifications) {
      this.inAppNotifications = this.inAppNotifications.slice(0, this.maxInAppNotifications);
    }
  }

  getInAppNotifications(): InAppNotification[] {
    return this.inAppNotifications.filter((n) => !n.readAt);
  }

  dismissInAppNotification(id: string): void {
    const index = this.inAppNotifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.inAppNotifications[index].readAt = new Date().toISOString();
    }
  }

  clearAllInApp(): void {
    this.inAppNotifications = [];
  }

  // ==================== Send Notification ====================

  async sendNotification(
    notification: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<SendNotificationResponse> {
    try {
      const response = await fetch(`${API_BASE}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) throw new Error('Failed to send notification');

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      // For demo mode, simulate success
      const simulatedId = uuidv4();
      return {
        success: true,
        notificationId: simulatedId,
      };
    }
  }

  async sendTemplatedNotification(
    templateId: string,
    userId: string,
    variables: Record<string, string>
  ): Promise<SendNotificationResponse> {
    const template = DEFAULT_TEMPLATES[templateId];
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Build notification based on channel - create typed notification
    let notification: Notification;
    
    if (template.pushTemplate && template.channels.includes('push')) {
      notification = {
        id: uuidv4(),
        userId,
        category: template.category,
        priority: 'medium',
        channels: ['push'],
        channel: 'push',
        title: replaceVariables(template.pushTemplate.title, variables),
        body: replaceVariables(template.pushTemplate.body, variables),
        icon: template.pushTemplate.icon,
        imageUrl: template.pushTemplate.imageUrl,
        status: 'pending',
        metadata: { templateId, variables },
        createdAt: new Date().toISOString(),
      };
    } else if (template.emailTemplate && template.channels.includes('email')) {
      notification = {
        id: uuidv4(),
        userId,
        category: template.category,
        priority: 'medium',
        channels: ['email'],
        channel: 'email',
        to: variables.email || '',
        subject: replaceVariables(template.emailTemplate.subject, variables),
        htmlBody: replaceVariables(template.emailTemplate.htmlBody, variables),
        textBody: template.emailTemplate.textBody
          ? replaceVariables(template.emailTemplate.textBody, variables)
          : undefined,
        status: 'pending',
        metadata: { templateId, variables },
        createdAt: new Date().toISOString(),
      };
    } else if (template.smsTemplate && template.channels.includes('sms')) {
      notification = {
        id: uuidv4(),
        userId,
        category: template.category,
        priority: 'medium',
        channels: ['sms'],
        channel: 'sms',
        to: variables.phone || '',
        body: replaceVariables(template.smsTemplate.body, variables),
        status: 'pending',
        metadata: { templateId, variables },
        createdAt: new Date().toISOString(),
      };
    } else if (template.inAppTemplate && template.channels.includes('in_app')) {
      notification = {
        id: uuidv4(),
        userId,
        category: template.category,
        priority: 'medium',
        channels: ['in_app'],
        channel: 'in_app',
        title: replaceVariables(template.inAppTemplate.title, variables),
        message: replaceVariables(template.inAppTemplate.message, variables),
        type: template.inAppTemplate.type,
        dismissible: true,
        persistent: false,
        status: 'pending',
        metadata: { templateId, variables },
        createdAt: new Date().toISOString(),
      };
    } else {
      throw new Error('No valid channel found in template');
    }

    return this.sendNotification(notification);
  }

  async sendBatch(request: NotificationBatchRequest): Promise<{
    success: boolean;
    sent: number;
    failed: number;
  }> {
    try {
      const response = await fetch(`${API_BASE}/notifications/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to send batch notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending batch notifications:', error);
      // Simulate partial success for demo
      return {
        success: true,
        sent: request.notifications.length,
        failed: 0,
      };
    }
  }

  // ==================== Notification Management ====================

  async getNotifications(
    filter?: NotificationFilter,
    page = 1,
    pageSize = 20
  ): Promise<NotificationPage> {
    const cacheKey = `notifications:${JSON.stringify({ filter, page, pageSize })}`;
    const cached = this.getCached<NotificationPage>(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (filter) {
        if (filter.category?.length) params.append('category', filter.category.join(','));
        if (filter.priority?.length) params.append('priority', filter.priority.join(','));
        if (filter.status?.length) params.append('status', filter.status.join(','));
        if (filter.channel?.length) params.append('channel', filter.channel.join(','));
        if (filter.startDate) params.append('startDate', filter.startDate);
        if (filter.endDate) params.append('endDate', filter.endDate);
      }

      const response = await fetch(`${API_BASE}/notifications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return mock data for demo
      return {
        notifications: this.generateMockNotifications(pageSize),
        total: 100,
        hasMore: page * pageSize < 100,
        nextOffset: page * pageSize,
      };
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    this.dismissInAppNotification(notificationId);
  }

  async markAllAsRead(): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
    this.inAppNotifications.forEach((n) => {
      n.readAt = new Date().toISOString();
    });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/${notificationId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
    this.inAppNotifications = this.inAppNotifications.filter((n) => n.id !== notificationId);
  }

  async clearAll(): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/clear-all`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
    this.clearAllInApp();
  }

  async getUnreadCount(): Promise<number> {
    const notifications = await this.getNotifications({ status: ['pending', 'sent', 'delivered'] });
    return notifications.notifications.filter((n) => !n.readAt).length;
  }

  // ==================== Preferences ====================

  async getPreferences(): Promise<NotificationPreferences> {
    const cacheKey = 'notification_preferences';
    const cached = this.getCached<NotificationPreferences>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/notifications/preferences`);
      if (!response.ok) throw new Error('Failed to fetch preferences');

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      this.cache.delete('notification_preferences');
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      userId: 'current',
      email: {
        investmentUpdates: true,
        impactReports: true,
        communityActivity: true,
        marketing: false,
        transactionAlerts: true,
        weeklyDigest: true,
        monthlyReport: true,
      },
      push: {
        transactionAlerts: true,
        impactMilestones: true,
        challenges: true,
        communityMentions: true,
        projectUpdates: true,
      },
      sms: {
        criticalAlerts: true,
        twoFactor: true,
        transactionConfirmations: false,
      },
      inApp: {
        showInvestmentAlerts: true,
        showImpactNotifications: true,
        showCommunityActivity: true,
        showSystemUpdates: true,
        soundEnabled: true,
      },
    };
  }

  // ==================== Subscriptions ====================

  async subscribeToPush(
    deviceToken: string,
    platform: 'ios' | 'android' | 'web'
  ): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceToken, platform }),
      });
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  }

  async unsubscribeFromPush(deviceToken: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceToken }),
      });
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    }
  }

  // ==================== Analytics ====================

  async getAnalytics(startDate?: string, endDate?: string): Promise<NotificationAnalytics> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE}/notifications/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return this.getMockAnalytics();
    }
  }

  // ==================== Mock Data ====================

  private generateMockNotifications(count: number): Notification[] {
    const categories: NotificationCategory[] = ['investment', 'impact', 'transaction', 'verification', 'community'];
    
    return Array.from({ length: count }, () => {
      const notification: InAppNotification = {
        id: uuidv4(),
        userId: 'current',
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: 'medium',
        channels: ['in_app'],
        channel: 'in_app',
        title: 'Notification',
        message: 'Your notification message',
        type: 'info',
        dismissible: true,
        persistent: false,
        status: 'sent',
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      return notification;
    });
  }

  private getMockAnalytics(): NotificationAnalytics {
    return {
      totalSent: 1250,
      delivered: 1180,
      read: 890,
      clicked: 450,
      failed: 70,
      byChannel: {
        push: { sent: 500, delivered: 480, failed: 20 },
        email: { sent: 400, delivered: 390, failed: 10 },
        sms: { sent: 200, delivered: 180, failed: 20 },
        in_app: { sent: 150, delivered: 130, failed: 20 },
      },
      byCategory: {
        investment: { sent: 300, read: 250 },
        impact: { sent: 250, read: 200 },
        transaction: { sent: 350, read: 300 },
        verification: { sent: 150, read: 100 },
        community: { sent: 100, read: 40 },
        system: { sent: 50, read: 0 },
        marketing: { sent: 30, read: 0 },
        reminder: { sent: 20, read: 0 },
      },
      averageDeliveryTime: 1500,
      period: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    };
  }

  // ==================== Utility ====================

  clearCache(): void {
    this.cache.clear();
  }

  isQuietHours(preferences?: NotificationPreferences): boolean {
    const prefs = preferences || {
      quietHours: { enabled: false, startTime: '22:00', endTime: '07:00', timezone: 'UTC' }
    };
    if (!prefs.quietHours?.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { startTime, endTime } = prefs.quietHours;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    }
    // Handle overnight quiet hours
    return currentTime >= startTime || currentTime <= endTime;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
