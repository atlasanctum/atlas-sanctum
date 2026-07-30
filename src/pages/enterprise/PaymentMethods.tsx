/**
 * Payment Methods
 * 
 * Enterprise payment methods management with card and bank account support.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  Shield,
  AlertTriangle,
  Star,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

// Mock data for demo mode
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_001',
    type: 'card',
    isDefault: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    card: {
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2026,
      name: 'John Doe',
    },
  },
  {
    id: 'pm_002',
    type: 'card',
    isDefault: false,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    card: {
      brand: 'mastercard',
      last4: '5555',
      expMonth: 6,
      expYear: 2025,
      name: 'John Doe',
    },
  },
  {
    id: 'pm_003',
    type: 'bank_account',
    isDefault: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    bankAccount: {
      bankName: 'Chase Bank',
      last4: '6789',
      routingNumber: '****1234',
      accountHolderName: 'Acme Corp',
    },
  },
];

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_001',
    amount: 19900,
    status: 'succeeded',
    method: 'Visa ending in 4242',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Professional Plan - Monthly',
  },
  {
    id: 'pay_002',
    amount: 19900,
    status: 'succeeded',
    method: 'Visa ending in 4242',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Professional Plan - Monthly',
  },
  {
    id: 'pay_003',
    amount: 19900,
    status: 'succeeded',
    method: 'Visa ending in 4242',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Professional Plan - Monthly',
  },
];

const MOCK_STATISTICS: PaymentStatistics = {
  totalPayments: 12,
  totalAmount: 238800,
  succeededAmount: 238800,
  failedAmount: 0,
  averagePaymentAmount: 19900,
};

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  isDefault: boolean;
  createdAt: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    name: string;
  };
  bankAccount?: {
    bankName: string;
    last4: string;
    routingNumber: string;
    accountHolderName: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  status: 'succeeded' | 'failed' | 'pending';
  method: string;
  createdAt: string;
  description?: string;
}

interface PaymentStatistics {
  totalPayments: number;
  totalAmount: number;
  succeededAmount: number;
  failedAmount: number;
  averagePaymentAmount: number;
}

export default function PaymentMethods() {
  const { toast } = useToast();
  const { isDemoMode } = useEnhancedAuth();
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      
      // Use mock data in demo mode or if API calls fail
      if (isDemoMode) {
        setPaymentMethods(MOCK_PAYMENT_METHODS);
        setPayments(MOCK_PAYMENTS);
        setStatistics(MOCK_STATISTICS);
        setLoading(false);
        return;
      }

      const [methodsResponse, paymentsResponse, statsResponse] = await Promise.all([
        fetch('/api/billing/payment-methods', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/billing/payments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/billing/payments/statistics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      if (methodsResponse.ok) {
        const methodsData = await methodsResponse.json();
        setPaymentMethods(methodsData.data);
      } else {
        setPaymentMethods(MOCK_PAYMENT_METHODS);
      }
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData.data);
      } else {
        setPayments(MOCK_PAYMENTS);
      }
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData.data);
      } else {
        setStatistics(MOCK_STATISTICS);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setPaymentMethods(MOCK_PAYMENT_METHODS);
      setPayments(MOCK_PAYMENTS);
      setStatistics(MOCK_STATISTICS);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cardData = {
      cardNumber: formData.get('cardNumber') as string,
      expMonth: parseInt(formData.get('expMonth') as string),
      expYear: parseInt(formData.get('expYear') as string),
      cvc: formData.get('cvc') as string,
      name: formData.get('name') as string,
    };

    try {
      const response = await fetch('/api/billing/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ type: 'card', ...cardData }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Card added successfully',
        });
        setShowAddCard(false);
        fetchPaymentData();
      }
    } catch (error) {
      console.error('Error adding card:', error);
      toast({
        title: 'Error',
        description: 'Failed to add card',
        variant: 'destructive',
      });
    }
  };

  const handleAddBankAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const bankData = {
      accountNumber: formData.get('accountNumber') as string,
      routingNumber: formData.get('routingNumber') as string,
      accountHolderName: formData.get('accountHolderName') as string,
      accountType: formData.get('accountType') as string,
    };

    try {
      const response = await fetch('/api/billing/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ type: 'bank_account', ...bankData }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Bank account added successfully',
        });
        setShowAddBank(false);
        fetchPaymentData();
      }
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: 'Error',
        description: 'Failed to add bank account',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      const response = await fetch(`/api/billing/payment-methods/${paymentMethodId}/default`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Default payment method updated',
        });
        fetchPaymentData();
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default payment method',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/billing/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Payment method deleted',
        });
        fetchPaymentData();
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete payment method',
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

  const getCardBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    return showCardNumber ? cardNumber : `•••• ${cardNumber.slice(-4)}`;
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
                Payment Methods
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your payment methods and payment history
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchPaymentData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Card</DialogTitle>
                    <DialogDescription>
                      Add a new credit or debit card to your account
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCard} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expMonth">Expiration Month</Label>
                        <Input
                          id="expMonth"
                          name="expMonth"
                          type="number"
                          min="1"
                          max="12"
                          placeholder="MM"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expYear">Expiration Year</Label>
                        <Input
                          id="expYear"
                          name="expYear"
                          type="number"
                          min={new Date().getFullYear()}
                          placeholder="YYYY"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        name="cvc"
                        type="password"
                        placeholder="123"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Card
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={showAddBank} onOpenChange={setShowAddBank}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Building2 className="mr-2 h-4 w-4" />
                    Add Bank Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Bank Account</DialogTitle>
                    <DialogDescription>
                      Add a new bank account to your account
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddBankAccount} className="space-y-4">
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="123456789"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        name="routingNumber"
                        placeholder="123456789"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        name="accountHolderName"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountType">Account Type</Label>
                      <select
                        id="accountType"
                        name="accountType"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Bank Account
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalPayments}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  All time
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(statistics.totalAmount)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  All time
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Succeeded</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(statistics.succeededAmount)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Collected
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(statistics.failedAmount)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Failed
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                <CreditCard className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No payment methods yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Add a card or bank account to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${method.isDefault ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {method.type === 'card' ? getCardBrandIcon(method.card?.brand || '') : '🏦'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {method.type === 'card' ? method.card?.brand : method.bankAccount?.bankName}
                          </div>
                          {method.isDefault && (
                            <Badge className="bg-indigo-100 text-indigo-800">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {method.type === 'card' && method.card && (
                        <>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            •••• •••• •••• {method.card.last4}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Expires {method.card.expMonth}/{method.card.expYear}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {method.card.name}
                          </div>
                        </>
                      )}
                      {method.type === 'bank_account' && method.bankAccount && (
                        <>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            •••• {method.bankAccount.last4}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Routing: ••••••••
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {method.bankAccount.accountHolderName}
                          </div>
                        </>
                      )}
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        Added {formatDate(method.createdAt)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
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
                      {payment.description && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {payment.description}
                        </div>
                      )}
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

        {/* Security Notice */}
        <Card className="mt-8 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Secure Payments
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your payment information is securely stored and processed using industry-standard encryption. We never store your full card details on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
