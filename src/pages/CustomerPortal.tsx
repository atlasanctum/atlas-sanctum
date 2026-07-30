/**
 * Customer Portal
 * 
 * Comprehensive customer self-service portal with billing history,
 * account management, subscription management, and support.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  CreditCard,
  Shield,
  Download,
  Edit,
  Save,
  ChevronRight,
  FileText,
  Receipt,
  TrendingUp,
  CheckCircle,
  Plus,
  Settings,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  DollarSign,
  Package,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

// Mock billing history data
const MOCK_INVOICES = [
  {
    id: 'INV-2025-001',
    date: '2025-01-28',
    description: 'Carbon Credits - 100 tons CO2',
    amount: 2750,
    status: 'paid',
    paymentMethod: 'Credit Card ****4242',
  },
  {
    id: 'INV-2025-002',
    date: '2025-01-15',
    description: 'Nature Credits - 50 hectares',
    amount: 2500,
    status: 'paid',
    paymentMethod: 'PayPal',
  },
  {
    id: 'INV-2025-003',
    date: '2025-01-05',
    description: 'Ocean Credits - 200 tons CO2',
    amount: 7700,
    status: 'paid',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'INV-2025-004',
    date: '2024-12-20',
    description: 'Biodiversity Credits - 10 species',
    amount: 1000,
    status: 'paid',
    paymentMethod: 'Credit Card ****4242',
  },
  {
    id: 'INV-2025-005',
    date: '2024-12-10',
    description: 'Platform Subscription - Enterprise Plan',
    amount: 999,
    status: 'paid',
    paymentMethod: 'Credit Card ****4242',
  },
  {
    id: 'INV-2025-006',
    date: '2024-11-25',
    description: 'Carbon Credits - 500 tons CO2',
    amount: 12500,
    status: 'paid',
    paymentMethod: 'Ethereum',
  },
];

// Mock subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    interval: 'month',
    features: [
      'Up to 100 credits/month',
      'Basic analytics',
      'Email support',
      'Standard verification',
    ],
    current: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 199,
    interval: 'month',
    features: [
      'Up to 500 credits/month',
      'Advanced analytics',
      'Priority support',
      'Fast verification',
      'API access',
      'Custom reports',
    ],
    current: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    interval: 'month',
    features: [
      'Unlimited credits',
      'Full analytics suite',
      'Dedicated account manager',
      'Instant verification',
      'Full API access',
      'White-label reports',
      'SLA guarantee',
      'Custom integrations',
    ],
    current: false,
  },
];

// Mock activity log
const ACTIVITY_LOG = [
  {
    id: 1,
    type: 'purchase',
    title: 'Credit Purchase',
    description: 'Purchased 100 Carbon Credits',
    date: '2025-01-28 14:32',
    icon: CreditCard,
    color: 'text-emerald-500',
  },
  {
    id: 2,
    type: 'login',
    title: 'Login',
    description: 'Logged in from Nairobi, Kenya',
    date: '2025-01-28 09:15',
    icon: User,
    color: 'text-blue-500',
  },
  {
    id: 3,
    type: 'download',
    title: 'Report Download',
    description: 'Downloaded Impact Report Q4 2024',
    date: '2025-01-27 16:45',
    icon: Download,
    color: 'text-purple-500',
  },
  {
    id: 4,
    type: 'update',
    title: 'Profile Updated',
    description: 'Updated phone number',
    date: '2025-01-26 11:20',
    icon: Edit,
    color: 'text-amber-500',
  },
  {
    id: 5,
    type: 'security',
    title: 'Password Changed',
    description: 'Password successfully updated',
    date: '2025-01-25 08:00',
    icon: Shield,
    color: 'text-green-500',
  },
  {
    id: 6,
    type: 'support',
    title: 'Support Ticket',
    description: 'Ticket #1234 resolved',
    date: '2025-01-24 15:30',
    icon: Users,
    color: 'text-cyan-500',
  },
];

export default function CustomerPortal() {
  const { user } = useAuth();
  const { isDemoMode } = useEnhancedAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+254759895739',
    company: 'Acme Sustainability Corp',
    role: 'Sustainability Director',
    address: '123 Green Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'US',
    website: 'https://acme-sustainability.com',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    purchaseConfirmations: true,
    weeklyReports: true,
    marketUpdates: false,
    securityAlerts: true,
    marketingEmails: false,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Billing state
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // Subscription state
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  // Handle profile save
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated',
    });
  };

  // Handle password change
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast({
      title: 'Password changed',
      description: 'Your password has been successfully updated',
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast({
      title: 'Preferences updated',
      description: `${key} notifications ${notifications[key] ? 'disabled' : 'enabled'}`,
    });
  };

  // Handle subscription plan change
  const handleChangePlan = (planId: string) => {
    setIsChangingPlan(true);
    setTimeout(() => {
      setIsChangingPlan(false);
      toast({
        title: 'Plan changed',
        description: `Successfully switched to ${planId} plan`,
      });
    }, 1500);
  };

  // Calculate billing stats
  const totalSpent = MOCK_INVOICES.reduce((sum, inv) => sum + inv.amount, 0);
  const invoicesThisYear = MOCK_INVOICES.filter(inv => inv.date.startsWith('2025')).length;
  const averageOrderValue = totalSpent / MOCK_INVOICES.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-xl bg-primary/10">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {isDemoMode ? 'Demo Customer' : `${profileData.firstName} ${profileData.lastName}`}
                </h1>
                <p className="text-muted-foreground">
                  {profileData.company} • {profileData.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button asChild>
                <Link to="/checkout">
                  <Plus className="w-4 h-4 mr-2" />
                  Purchase Credits
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders This Year</p>
                  <p className="text-2xl font-bold">{invoicesThisYear}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">${averageOrderValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Credits Owned</p>
                  <p className="text-2xl font-bold">1,250</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Invoices */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Your latest billing history</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/billing">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_INVOICES.slice(0, 4).map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{invoice.description}</p>
                            <p className="text-xs text-muted-foreground">{invoice.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {invoice.status}
                          </Badge>
                          <span className="font-semibold">${invoice.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto flex-col py-4" asChild>
                      <Link to="/checkout">
                        <CreditCard className="w-6 h-6 mb-2" />
                        <span>Purchase Credits</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col py-4">
                      <Download className="w-6 h-6 mb-2" />
                      <span>Download Reports</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col py-4">
                      <FileText className="w-6 h-6 mb-2" />
                      <span>View Certificates</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col py-4" asChild>
                      <Link to="/support">
                        <Users className="w-6 h-6 mb-2" />
                        <span>Contact Support</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Credit Portfolio</CardTitle>
                  <CardDescription>Your regenerative credit holdings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Carbon Credits', amount: 500, unit: 'tons CO2', color: 'bg-emerald-500' },
                      { name: 'Nature Credits', amount: 150, unit: 'hectares', color: 'bg-green-500' },
                      { name: 'Ocean Credits', amount: 200, unit: 'tons CO2', color: 'bg-blue-500' },
                      { name: 'Biodiversity Credits', amount: 10, unit: 'species', color: 'bg-amber-500' },
                    ].map((credit) => (
                      <div key={credit.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{credit.name}</span>
                          <span className="font-medium">{credit.amount} {credit.unit}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${credit.color} rounded-full`}
                            style={{ width: `${(credit.amount / 600) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest account activity</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ACTIVITY_LOG.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {activity.date.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Billing Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Total Spent (All Time)</p>
                    <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">This Year</p>
                    <p className="text-3xl font-bold">
                      ${MOCK_INVOICES.filter(inv => inv.date.startsWith('2025')).reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Pending Amount</p>
                    <p className="text-3xl font-bold text-emerald-500">$0.00</p>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice History */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice History</CardTitle>
                  <CardDescription>All your past invoices and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_INVOICES.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.description}</TableCell>
                          <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                              className={invoice.status === 'paid' ? 'bg-emerald-500' : ''}
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Method
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#003087] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">PP</span>
                        </div>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Default</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#1a1f71] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">VISA</span>
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Set Default</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#627eea] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">Ξ</span>
                        </div>
                        <div>
                          <p className="font-medium">Ethereum</p>
                          <p className="text-sm text-muted-foreground">0x7a...3f2d</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Set Default</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <div className="space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your current subscription and usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <Badge className="mb-2">Current Plan</Badge>
                        <h3 className="text-2xl font-bold">Professional</h3>
                        <p className="text-muted-foreground">$199/month • Renews Feb 15, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsChangingPlan(!isChangingPlan)}>
                      {isChangingPlan ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      )}
                      Change Plan
                    </Button>
                  </div>

                  {/* Usage Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">API Calls</span>
                        <span className="text-sm font-medium">7,500 / 10,000</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Storage</span>
                        <span className="text-sm font-medium">45 GB / 100 GB</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Team Members</span>
                        <span className="text-sm font-medium">3 / 10</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <Card key={plan.id} className={plan.current ? 'ring-2 ring-primary' : ''}>
                    <CardHeader>
                      {plan.current && (
                        <Badge className="mb-2 w-fit">Current Plan</Badge>
                      )}
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        <span className="text-3xl font-bold">${plan.price}</span>
                        /{plan.interval}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={plan.current ? 'outline' : 'default'}
                        disabled={plan.current || isChangingPlan}
                        onClick={() => handleChangePlan(plan.id)}
                      >
                        {plan.current ? 'Current Plan' : 'Switch to ' + plan.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>Your billing and shipping address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Address</Label>
                    <Input
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>State/Province</Label>
                      <Input
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Postal Code</Label>
                      <Input
                        value={profileData.postalCode}
                        onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Select
                        value={profileData.country}
                        onValueChange={(value) => setProfileData({ ...profileData, country: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="KE">Kenya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleChangePassword}>Update Password</Button>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important account alerts' },
                    { key: 'purchaseConfirmations', label: 'Purchase Confirmations', description: 'Get receipts for purchases' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Summary of your impact metrics' },
                    { key: 'marketUpdates', label: 'Market Updates', description: 'Carbon credit market news' },
                    { key: 'securityAlerts', label: 'Security Alerts', description: 'Login attempts and security events' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotions and new features' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={() => handleNotificationToggle(item.key as keyof typeof notifications)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Enhance your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Key className="w-4 h-4 mr-2" />
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Complete history of your account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ACTIVITY_LOG.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.title}</p>
                          <Badge variant="secondary" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2025 Atlas Sanctum</span>
              <span>|</span>
              <a href="/privacy-policy" className="hover:text-foreground">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-foreground">Terms of Service</a>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Import missing components
import { Link } from 'react-router-dom';
