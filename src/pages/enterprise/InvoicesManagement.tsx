/**
 * Invoices Management
 * 
 * Enterprise invoices management with invoice list, detail view,
 * PDF download, and invoice settings.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Mail,
  Settings,
  Search,
  ChevronRight,
  RefreshCw,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

// Mock data for demo mode
const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2025-001',
    amount: 19900,
    status: 'paid',
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    currency: 'USD',
    subtotal: 18500,
    tax: 1400,
    total: 19900,
    items: [
      { id: 'item_1', description: 'Professional Plan - Monthly', quantity: 1, unitPrice: 18500, amount: 18500 },
    ],
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2025-002',
    amount: 19900,
    status: 'open',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    currency: 'USD',
    subtotal: 18500,
    tax: 1400,
    total: 19900,
    items: [
      { id: 'item_1', description: 'Professional Plan - Monthly', quantity: 1, unitPrice: 18500, amount: 18500 },
    ],
  },
];

const MOCK_SETTINGS: InvoiceSettings = {
  id: 'settings_001',
  invoicePrefix: 'INV',
  invoiceTerms: 'Payment due within 30 days',
  taxRate: 7.5,
  currency: 'USD',
  organizationId: 'org_demo123',
};

const MOCK_STATISTICS: InvoiceStatistics = {
  totalInvoices: 12,
  totalAmount: 238800,
  paidAmount: 199000,
  pendingAmount: 39800,
  overdueAmount: 0,
  averageInvoiceAmount: 19900,
};

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'open' | 'paid' | 'overdue' | 'void';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceSettings {
  id: string;
  invoicePrefix: string;
  invoiceTerms: string;
  taxRate: number;
  currency: string;
  organizationId: string;
}

interface InvoiceStatistics {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageInvoiceAmount: number;
}

export default function InvoicesManagement() {
  const { toast } = useToast();
  const { isDemoMode } = useEnhancedAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings | null>(null);
  const [statistics, setStatistics] = useState<InvoiceStatistics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchInvoicesData();
  }, []);

  const fetchInvoicesData = async () => {
    try {
      setLoading(true);
      
      // Use mock data in demo mode or if API calls fail
      if (isDemoMode) {
        setInvoices(MOCK_INVOICES);
        setInvoiceSettings(MOCK_SETTINGS);
        setStatistics(MOCK_STATISTICS);
        setLoading(false);
        return;
      }

      const [invResponse, settingsResponse, statsResponse] = await Promise.all([
        fetch('/api/billing/invoices', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/billing/invoices/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/billing/invoices/statistics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      if (invResponse.ok) {
        const invData = await invResponse.json();
        setInvoices(invData.data);
      } else {
        setInvoices(MOCK_INVOICES);
      }
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setInvoiceSettings(settingsData.data);
      } else {
        setInvoiceSettings(MOCK_SETTINGS);
      }
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData.data);
      } else {
        setStatistics(MOCK_STATISTICS);
      }
    } catch (error) {
      console.error('Error fetching invoices data:', error);
      setInvoices(MOCK_INVOICES);
      setInvoiceSettings(MOCK_SETTINGS);
      setStatistics(MOCK_STATISTICS);
    } finally {
      setLoading(false);
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

  const handleSendInvoiceEmail = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Invoice sent via email',
        });
      }
    } catch (error) {
      console.error('Error sending invoice email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invoice email',
        variant: 'destructive',
      });
    }
  };

  const handleVoidInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to void this invoice? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/void`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Invoice voided successfully',
        });
        fetchInvoicesData();
      }
    } catch (error) {
      console.error('Error voiding invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to void invoice',
        variant: 'destructive',
      });
    }
  };

  const handleRetryInvoicePayment = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/retry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Payment retry initiated',
        });
        fetchInvoicesData();
      }
    } catch (error) {
      console.error('Error retrying invoice payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to retry payment',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSettings = async (settings: Partial<InvoiceSettings>) => {
    try {
      const response = await fetch('/api/billing/invoices/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Invoice settings updated',
        });
        fetchInvoicesData();
        setShowSettings(false);
      }
    } catch (error) {
      console.error('Error updating invoice settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update invoice settings',
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
      currency: invoiceSettings?.currency || 'USD',
    }).format(amount / 100);
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'void':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'open':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'void':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.items.some((item) =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                Invoices
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and track your invoices
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchInvoicesData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invoice Settings</DialogTitle>
                    <DialogDescription>
                      Configure your invoice preferences
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                      <Input
                        id="invoicePrefix"
                        defaultValue={invoiceSettings?.invoicePrefix || 'INV-'}
                        placeholder="INV-"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoiceTerms">Invoice Terms</Label>
                      <Textarea
                        id="invoiceTerms"
                        defaultValue={invoiceSettings?.invoiceTerms || ''}
                        placeholder="Payment terms..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        defaultValue={invoiceSettings?.taxRate || 0}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue={invoiceSettings?.currency || 'USD'}>
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => {
                        const prefix = (document.getElementById('invoicePrefix') as HTMLInputElement)?.value;
                        const terms = (document.getElementById('invoiceTerms') as HTMLTextAreaElement)?.value;
                        const taxRate = parseFloat((document.getElementById('taxRate') as HTMLInputElement)?.value) || 0;
                        const currency = (document.getElementById('currency') as HTMLSelectElement)?.value;
                        handleUpdateSettings({ invoicePrefix: prefix, invoiceTerms: terms, taxRate, currency });
                      }}
                    >
                      Save Settings
                    </Button>
                  </div>
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
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <FileText className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalInvoices}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  All time
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-600" />
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
                <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(statistics.paidAmount)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Collected
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(statistics.pendingAmount)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Outstanding
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <FileText className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                No invoices found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInvoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowDetail(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getInvoiceStatusIcon(invoice.status)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {formatDate(invoice.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(invoice.total)}
                        </div>
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Detail Dialog */}
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
              <DialogDescription>
                {selectedInvoice?.invoiceNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Invoice Number
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {selectedInvoice.invoiceNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Status
                    </div>
                    <Badge className={getInvoiceStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Created Date
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {formatDate(selectedInvoice.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Due Date
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {formatDate(selectedInvoice.dueDate)}
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Invoice Items
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-400">
                            Description
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-600 dark:text-slate-400">
                            Quantity
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-600 dark:text-slate-400">
                            Unit Price
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-600 dark:text-slate-400">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-900 dark:text-white">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-900 dark:text-white">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-900 dark:text-white">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(selectedInvoice.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Tax</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(selectedInvoice.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="text-slate-900 dark:text-white">
                      {formatCurrency(selectedInvoice.total)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleDownloadInvoice(selectedInvoice.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendInvoiceEmail(selectedInvoice.id)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  {selectedInvoice.status === 'overdue' && (
                    <Button
                      variant="outline"
                      onClick={() => handleRetryInvoicePayment(selectedInvoice.id)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Payment
                    </Button>
                  )}
                  {selectedInvoice.status === 'open' && (
                    <Button
                      variant="destructive"
                      onClick={() => handleVoidInvoice(selectedInvoice.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Void Invoice
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
