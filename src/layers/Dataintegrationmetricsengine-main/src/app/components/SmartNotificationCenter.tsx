import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bell, 
  BellOff,
  Mail,
  MessageSquare,
  Smartphone,
  Check,
  Settings,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'alert' | 'insight' | 'update' | 'milestone';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  sector?: string;
  source: string;
}

interface NotificationRule {
  id: string;
  name: string;
  enabled: boolean;
  channels: ('email' | 'sms' | 'in-app')[];
  triggers: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const SmartNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      priority: 'critical',
      title: 'Critical Anomaly Detected',
      message: 'Soil organic carbon levels dropped 34% below expected values in Region A',
      timestamp: new Date(Date.now() - 180000),
      read: false,
      actionable: true,
      sector: 'Agriculture',
      source: 'Anomaly Detection Engine',
    },
    {
      id: '2',
      type: 'insight',
      priority: 'high',
      title: 'Optimization Opportunity',
      message: 'ML model suggests reallocating 12% water resources could increase impact by 8%',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      actionable: true,
      sector: 'Agriculture',
      source: 'AI Insights',
    },
    {
      id: '3',
      type: 'milestone',
      priority: 'medium',
      title: 'Milestone Achieved',
      message: 'Healthcare access rate reached 94% - ahead of quarterly target',
      timestamp: new Date(Date.now() - 900000),
      read: true,
      actionable: false,
      sector: 'Healthcare',
      source: 'Impact Tracker',
    },
    {
      id: '4',
      type: 'update',
      priority: 'low',
      title: 'Data Pipeline Completed',
      message: 'IoT Sensor Data Pipeline successfully processed 15,398 records',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
      actionable: false,
      source: 'Pipeline Orchestrator',
    },
  ]);

  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: 'r1',
      name: 'Critical Anomalies',
      enabled: true,
      channels: ['email', 'sms', 'in-app'],
      triggers: ['Anomaly detected', 'Data quality critical'],
      priority: 'critical',
    },
    {
      id: 'r2',
      name: 'AI Insights',
      enabled: true,
      channels: ['in-app', 'email'],
      triggers: ['High impact opportunity', 'Optimization found'],
      priority: 'high',
    },
    {
      id: 'r3',
      name: 'Milestones',
      enabled: true,
      channels: ['in-app'],
      triggers: ['Target achieved', 'Goal reached'],
      priority: 'medium',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'actionable'>('all');

  const getTypeConfig = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'insight':
        return { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      case 'update':
        return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'milestone':
        return { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' };
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRule = (id: string) => {
    setRules(prev =>
      prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'actionable') return n.actionable;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Smart Notification Center
            </CardTitle>
            <CardDescription>
              Intelligent alerts with customizable rules and multi-channel delivery
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-500">{unreadCount} Unread</Badge>
            )}
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-3 w-3 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="rules">Notification Rules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'actionable' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('actionable')}
              >
                Actionable ({notifications.filter(n => n.actionable).length})
              </Button>
            </div>

            {/* Notifications List */}
            <ScrollArea className="h-[500px]">
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <BellOff className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => {
                      const typeConfig = getTypeConfig(notification.type);
                      const TypeIcon = typeConfig.icon;

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          layout
                          className={cn(
                            "p-4 rounded-lg border transition-all cursor-pointer",
                            notification.read
                              ? "bg-muted/20 opacity-70"
                              : "bg-background hover:bg-muted/30"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg shrink-0", typeConfig.bg)}>
                              <TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant="outline"
                                  className={cn("text-xs", getPriorityColor(notification.priority))}
                                >
                                  {notification.priority.toUpperCase()}
                                </Badge>
                                {notification.sector && (
                                  <Badge variant="secondary" className="text-xs">
                                    {notification.sector}
                                  </Badge>
                                )}
                                {notification.actionable && (
                                  <Badge className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                                    Actionable
                                  </Badge>
                                )}
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-primary ml-auto" />
                                )}
                              </div>
                              <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{notification.source}</span>
                                <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                              </div>
                            </div>
                            {notification.actionable && (
                              <Button size="sm" variant="outline" className="shrink-0">
                                Take Action
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{rule.name}</h4>
                        <Badge 
                          variant="outline"
                          className={cn("text-xs", getPriorityColor(rule.priority))}
                        >
                          {rule.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Triggers: {rule.triggers.join(', ')}
                      </p>
                      <div className="flex items-center gap-2">
                        {rule.channels.includes('email') && (
                          <Badge variant="secondary" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Badge>
                        )}
                        {rule.channels.includes('sms') && (
                          <Badge variant="secondary" className="text-xs">
                            <Smartphone className="h-3 w-3 mr-1" />
                            SMS
                          </Badge>
                        )}
                        {rule.channels.includes('in-app') && (
                          <Badge variant="secondary" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            In-App
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                <div>
                  <Label className="text-sm font-medium">SMS Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                <div>
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive push notifications on mobile</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                <div>
                  <Label className="text-sm font-medium">Digest Mode</Label>
                  <p className="text-xs text-muted-foreground">Receive daily summary instead of real-time</p>
                </div>
                <Switch />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
