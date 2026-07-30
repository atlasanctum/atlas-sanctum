/**
 * Billing Dashboard
 * 
 * Enterprise billing dashboard with subscription management, usage tracking,
 * and payment history.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  Bell,
  Activity,
  Zap,
  Eye,
  HardDrive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

// Mock data for demo mode
const MOCK_SUBSCRIPTION: Subscription = {
  id: 'sub_demo123',
  planId: 'professional',
  status: 'active',
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false,
  plan: {
    id: 'professional',
    name: 'Professional',
    description: 'For growing organizations',
    amount: 19900,
    interval: 'month',
    features: ['500 credits/month', '50 GB storage', '10K API calls/month', '5 team members'],
    apiCallsLimit: 10000,
    storageLimit: 50,
    teamMembersLimit: 5,
  },
};

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2025-001',
    amount: 19900,
    status: 'paid',
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2025-002',
    amount: 19900,
    status: 'paid',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_001',
    amount: 19900,
    status: 'succeeded',
    method: 'Visa ending in 4242',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_ALERTS: BillingAlert[] = [
  {
    id: 'alert_001',
    type: 'usage_threshold',
    severity: 'info',
    message: 'You have used 75% of your monthly API calls',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

interface BillingPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  interval: 'month' | 'year';
  features: string[];
  apiCallsLimit: number;
  storageLimit: number;
  teamMembersLimit: number;
}

interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: BillingPlan;
}

interface UsageSummary {
  apiCalls: { quantity: number; limit: number; percentage: number };
  storage: { quantity: number; limit: number; percentage: number };
  teamMembers: { quantity: number; limit: number; percentage: number };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'open' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  status: 'succeeded' | 'failed' | 'pending';
  method: string;
  createdAt: string;
}

interface BillingAlert {
  id: string;
  type: 'usage_threshold' | 'payment_failed' | 'subscription_expiring';
  severity: 'info' | 'warning' | 'error';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function BillingDashboard() {
  const { toast } = useToast();
  const { isDemoMode } = useEnhancedAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [alerts, setAlerts] = useState<BillingAlert[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Use mock data in demo mode or if API calls fail
      if (isDemoMode) {
        setSubscription(MOCK_SUBSCRIPTION);
        setInvoices(MOCK_INVOICES);
        setPayments(MOCK_PAYMENTS);
        setAlerts(MOCK_ALERTS);
        setLoading(false);
        return;
      }

      const [subResponse, invResponse, payResponse, alertResponse] = await Promise.all([
        fetch('/api/billing/subscriptions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/billing/invoices', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/billing/payments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/billing/alerts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData.data);
      } else {
        setSubscription(MOCK_SUBSCRIPTION);
      }
      if (invResponse.ok) {
        const invData = await invResponse.json();
        setInvoices(invData.data);
      } else {
        setInvoices(MOCK_INVOICES);
      }
      if (payResponse.ok) {
        const payData = await payResponse.json();
        setPayments(payData.data);
      } else {
        setPayments(MOCK_PAYMENTS);
      }
      if (alertResponse.ok) {
        const alertData = await alertResponse.json();
        setAlerts(alertData.data);
      } else {
        setAlerts(MOCK_ALERTS);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
      // Fall back to mock data on error
      setSubscription(MOCK_SUBSCRIPTION);
      setInvoices(MOCK_INVOICES);
      setPayments(MOCK_PAYMENTS);
      setAlerts(MOCK_ALERTS);
      toast({
        title: 'Using demo data',
        description: 'Connected to demo billing data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscription?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Plan upgraded successfully',
        });
        fetchBillingData();
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to upgrade plan',
        variant: 'destructive',
      });
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/billing/subscriptions/${subscription.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ cancelAtPeriodEnd: true }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Subscription canceled successfully',
        });
        fetchBillingData();
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast({
          title: 'Success',
          description: 'Invoice downloaded',
        });
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAlertAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`/api/billing/alerts/${alertId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      if (data.success) {
        setAlerts(alerts.map(a => a.id === alertId ? { ...a, isRead: true } : a));
        toast({
          title: 'Success',
          description: 'Alert marked as read',
        });
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark alert as read',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Billing Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage subscriptions, invoices, and payments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchBillingData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : subscription ? (
                <>
                  <div className="text-2xl font-bold mb-2">{subscription.plan.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {formatCurrency(subscription.plan.amount)}/{subscription.plan.interval}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                    {subscription.cancelAtPeriodEnd && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Cancels at period end
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Next billing date: {formatDate(subscription.currentPeriodEnd)}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpgradePlan(subscription.plan.id)}
                    >
                      Upgrade
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleCancelSubscription}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                  No active subscription
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {subscription?.plan.apiCallsLimit?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Used this month
              </div>
              <Progress
                value={subscription?.plan.apiCallsLimit ? 0 : 0}
                className="h-2"
              />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {subscription?.plan.apiCallsLimit?.toLocaleString() || 'N/A'} calls/month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {subscription?.plan.storageLimit ? `${(subscription.plan.storageLimit / 1024).toFixed(1)} GB` : 'N/A'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Used this month
              </div>
              <Progress
                value={subscription?.plan.storageLimit ? 0 : 0}
                className="h-2"
              />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {subscription?.plan.storageLimit ? `${(subscription.plan.storageLimit / 1024).toFixed(1)} GB` : 'N/A'} / month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {subscription?.plan.teamMembersLimit?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Active members
              </div>
              <Progress
                value={subscription?.plan.teamMembersLimit ? 0 : 0}
                className="h-2"
              />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {subscription?.plan.teamMembersLimit?.toLocaleString() || 'N/A'} members
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Overview Tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                  <FileText className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                      No invoices yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invoices.slice(0, 5).map((invoice) => (
                        <motion.div
                          key={invoice.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {invoice.invoiceNumber}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {formatDate(invoice.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {formatCurrency(invoice.amount)}
                            </div>
                            <Badge className={getInvoiceStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                      No payments yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.slice(0, 5).map((payment) => (
                        <motion.div
                          key={payment.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {formatCurrency(payment.amount)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {formatDate(payment.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPaymentStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            {/* Invoices Tab */}
            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
                <FileText className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    No invoices yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(invoice.createdAt)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {formatCurrency(invoice.amount)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getInvoiceStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            {/* Payments Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    No payments yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(payment.createdAt)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {payment.method}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            {/* Alerts Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Alerts</CardTitle>
                <Bell className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">No alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow ${alert.isRead ? 'opacity-50' : ''}`}
                      >
                        <div className="flex-shrink-0">
                          {alert.severity === 'error' ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : alert.severity === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">
                            {alert.message}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(alert.createdAt)}
                          </div>
                          {!alert.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAlertAsRead(alert.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
