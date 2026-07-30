/**
 * Payment Service
 * Stripe integration for payment processing, subscriptions, and billing
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  PaymentMethodInfo,
  Subscription,
  SubscriptionPlan,
  Invoice,
  Transaction,
  TaxInfo,
  Refund,
  Currency,
  PlanType,
  TransactionFilter,
  InvoiceFilter,
  TransactionPage,
  InvoicePage,
  CreatePaymentIntentResponse,
  CreateCheckoutSessionResponse} from '../types/payments';



// API Configuration
const API_BASE = import.meta.env.VITE_API_URL || '/api/v2';

// Default subscription plans
export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_individual_monthly',
    name: 'Individual',
    description: 'Perfect for individual contributors and small projects',
    type: 'individual',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      '5GB storage',
    ],
    limits: {
      projects: 5,
      users: 1,
      apiCalls: 1000,
      storageGb: 5,
    },
    trialDays: 14,
    stripePriceId: 'price_individual_monthly',
    isActive: true,
  },
  {
    id: 'plan_individual_yearly',
    name: 'Individual (Annual)',
    description: 'Perfect for individual contributors - save 20%',
    type: 'individual',
    price: 279,
    currency: 'USD',
    interval: 'year',
    features: [
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      '5GB storage',
      'Save 20% vs monthly',
    ],
    limits: {
      projects: 5,
      users: 1,
      apiCalls: 1000,
      storageGb: 5,
    },
    trialDays: 14,
    stripePriceId: 'price_individual_yearly',
    isActive: true,
  },
  {
    id: 'plan_enterprise_monthly',
    name: 'Enterprise',
    description: 'For organizations with advanced needs',
    type: 'enterprise',
    price: 199,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '100GB storage',
      'Team collaboration',
      'API access',
      'Custom integrations',
    ],
    limits: {
      projects: -1,
      users: 25,
      apiCalls: 100000,
      storageGb: 100,
    },
    trialDays: 14,
    stripePriceId: 'price_enterprise_monthly',
    isPopular: true,
    isActive: true,
  },
  {
    id: 'plan_enterprise_yearly',
    name: 'Enterprise (Annual)',
    description: 'For organizations with advanced needs - save 20%',
    type: 'enterprise',
    price: 1910,
    currency: 'USD',
    interval: 'year',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '100GB storage',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Save 20% vs monthly',
    ],
    limits: {
      projects: -1,
      users: 25,
      apiCalls: 100000,
      storageGb: 100,
    },
    trialDays: 14,
    stripePriceId: 'price_enterprise_yearly',
    isActive: true,
  },
  {
    id: 'plan_nonprofit',
    name: 'Nonprofit',
    description: 'Special pricing for registered nonprofits',
    type: 'nonprofit',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Dedicated support',
      '250GB storage',
      'Team collaboration',
      'API access',
      'Tax-deductible receipts',
    ],
    limits: {
      projects: -1,
      users: 50,
      apiCalls: 250000,
      storageGb: 250,
    },
    trialDays: 30,
    stripePriceId: 'price_nonprofit_monthly',
    isActive: true,
  },
];

class PaymentService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

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

  clearCache(): void {
    this.cache.clear();
  }

  // ==================== Payment Intents ====================

  async createPaymentIntent(
    amount: number,
    currency: Currency = 'USD',
    metadata?: Record<string, string>
  ): Promise<CreatePaymentIntentResponse> {
    try {
      const response = await fetch(`${API_BASE}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, metadata }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // Return mock data for demo
      return {
        clientSecret: `pi_demo_${uuidv4()}_secret_demo`,
        paymentIntentId: `pi_demo_${uuidv4()}`,
      };
    }
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId, paymentMethodId }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return { success: false, error: 'Payment confirmation failed' };
    }
  }

  // ==================== Checkout ====================

  async createCheckoutSession(
    priceId: string,
    mode: 'payment' | 'subscription' = 'subscription'
  ): Promise<CreateCheckoutSessionResponse> {
    try {
      const response = await fetch(`${API_BASE}/payments/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, mode }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Return mock data for demo
      return {
        sessionId: `cs_demo_${uuidv4()}`,
        url: `${window.location.origin}/checkout/demo`,
      };
    }
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/payments/checkout-url/${sessionId}`);
      if (!response.ok) throw new Error('Failed to get checkout URL');
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      // For demo, redirect to demo URL
      window.location.href = `${window.location.origin}/checkout/demo`;
    }
  }

  // ==================== Subscriptions ====================

  async getPlans(type?: PlanType): Promise<SubscriptionPlan[]> {
    const cacheKey = `plans:${type || 'all'}`;
    const cached = this.getCached<SubscriptionPlan[]>(cacheKey);
    if (cached) return cached;

    try {
      const params = type ? `?type=${type}` : '';
      const response = await fetch(`${API_BASE}/subscriptions/plans${params}`);
      if (!response.ok) throw new Error('Failed to fetch plans');

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return type ? DEFAULT_PLANS.filter((p) => p.type === type) : DEFAULT_PLANS;
    }
  }

  async getSubscription(): Promise<Subscription | null> {
    const cacheKey = 'current_subscription';
    const cached = this.getCached<Subscription>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/subscriptions/current`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  async createSubscription(
    priceId: string,
    paymentMethodId?: string
  ): Promise<{ subscriptionId: string; clientSecret?: string }> {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, paymentMethodId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      // Return mock data for demo
      return {
        subscriptionId: `sub_demo_${uuidv4()}`,
        clientSecret: `seti_demo_${uuidv4()}_secret_demo`,
      };
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    immediately = false
  ): Promise<void> {
    try {
      await fetch(`${API_BASE}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ immediately }),
      });
      this.cache.delete('current_subscription');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  }

  async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<void> {
    try {
      await fetch(`${API_BASE}/subscriptions/${subscriptionId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: newPriceId }),
      });
      this.cache.delete('current_subscription');
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  }

  async pauseSubscription(subscriptionId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/subscriptions/${subscriptionId}/pause`, {
        method: 'POST',
      });
      this.cache.delete('current_subscription');
    } catch (error) {
      console.error('Error pausing subscription:', error);
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/subscriptions/${subscriptionId}/resume`, {
        method: 'POST',
      });
      this.cache.delete('current_subscription');
    } catch (error) {
      console.error('Error resuming subscription:', error);
    }
  }

  // ==================== Payment Methods ====================

  async getPaymentMethods(): Promise<PaymentMethodInfo[]> {
    const cacheKey = 'payment_methods';
    const cached = this.getCached<PaymentMethodInfo[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/payments/methods`);
      if (!response.ok) throw new Error('Failed to fetch payment methods');

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  async addPaymentMethod(
    paymentMethodId: string,
    setAsDefault = false
  ): Promise<void> {
    try {
      await fetch(`${API_BASE}/payments/methods/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId, setAsDefault }),
      });
      this.cache.delete('payment_methods');
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/payments/methods/${paymentMethodId}`, {
        method: 'DELETE',
      });
      this.cache.delete('payment_methods');
    } catch (error) {
      console.error('Error removing payment method:', error);
    }
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/payments/methods/${paymentMethodId}/default`, {
        method: 'POST',
      });
      this.cache.delete('payment_methods');
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  }

  // ==================== Invoices ====================

  async getInvoices(filter?: InvoiceFilter): Promise<InvoicePage> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        if (filter.status?.length) params.append('status', filter.status.join(','));
        if (filter.limit) params.append('limit', filter.limit.toString());
        if (filter.offset) params.append('offset', filter.offset.toString());
      }

      const response = await fetch(`${API_BASE}/invoices?${params}`);
      if (!response.ok) throw new Error('Failed to fetch invoices');

      return await response.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return { invoices: this.generateMockInvoices(10), total: 10, hasMore: false };
    }
  }

  async downloadInvoice(invoiceId: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/invoices/${invoiceId}/pdf`);
      if (!response.ok) throw new Error('Failed to download invoice');

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error downloading invoice:', error);
      return `${window.location.origin}/invoices/demo/${invoiceId}.pdf`;
    }
  }

  // ==================== Transactions ====================

  async getTransactions(filter?: TransactionFilter): Promise<TransactionPage> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        if (filter.status?.length) params.append('status', filter.status.join(','));
        if (filter.type?.length) params.append('type', filter.type.join(','));
        if (filter.limit) params.append('limit', filter.limit.toString());
        if (filter.offset) params.append('offset', filter.offset.toString());
      }

      const response = await fetch(`${API_BASE}/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return { transactions: this.generateMockTransactions(10), total: 10, hasMore: false };
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE}/transactions/${transactionId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch transaction');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  // ==================== Refunds ====================

  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
    try {
      const response = await fetch(`${API_BASE}/refunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId, amount, reason }),
      });

      if (!response.ok) throw new Error('Failed to create refund');

      return await response.json();
    } catch (error) {
      console.error('Error creating refund:', error);
      return {
        id: `re_demo_${uuidv4()}`,
        paymentIntentId,
        amount: amount || 0,
        currency: 'USD',
        reason: (reason || 'requested_by_customer') as Refund['reason'],
        status: 'succeeded',
        createdAt: new Date().toISOString(),
      };
    }
  }

  // ==================== Tax ====================

  async updateTaxInfo(taxInfo: TaxInfo): Promise<void> {
    try {
      await fetch(`${API_BASE}/tax/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taxInfo),
      });
    } catch (error) {
      console.error('Error updating tax info:', error);
    }
  }

  async getTaxInfo(): Promise<TaxInfo | null> {
    try {
      const response = await fetch(`${API_BASE}/tax/info`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch tax info');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tax info:', error);
      return null;
    }
  }

  // ==================== Mock Data ====================

  private generateMockTransactions(count: number): Transaction[] {
    const statuses: Transaction['status'][] = ['succeeded', 'pending', 'refunded'];
    const types: Transaction['type'][] = ['purchase', 'subscription', 'refund'];
    const methods: Transaction['paymentMethod'][] = ['card', 'bank_transfer', 'crypto'];

    return Array.from({ length: count }, (_, i) => ({
      id: uuidv4(),
      userId: 'current',
      amount: Math.floor(Math.random() * 1000) + 50,
      currency: 'USD',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      description: 'Project contribution',
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: statuses[0] === 'succeeded' ? new Date().toISOString() : undefined,
    }));
  }

  private generateMockInvoices(count: number): Invoice[] {
    const statuses: Invoice['status'][] = ['paid', 'open', 'void'];

    return Array.from({ length: count }, (_, i) => ({
      id: uuidv4(),
      userId: 'current',
      amount: Math.floor(Math.random() * 500) + 29,
      currency: 'USD',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: statuses[0] === 'paid' ? new Date().toISOString() : undefined,
      invoiceNumber: `INV-${Date.now()}-${i}`,
      lineItems: [
        {
          id: uuidv4(),
          description: 'Subscription',
          quantity: 1,
          unitPrice: 29,
          amount: 29,
          period: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      ],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }

  // ==================== Utility ====================

  formatCurrency(amount: number, currency: Currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount / 100);
  }

  calculateTax(amount: number, taxRate = 0.0): number {
    return Math.round(amount * taxRate);
  }

  async getTaxRate(countryCode: string): Promise<number> {
    // Simplified tax rate calculation
    const taxRates: Record<string, number> = {
      US: 0.0,
      CA: 0.13,
      GB: 0.2,
      DE: 0.19,
      FR: 0.2,
      // Add more countries as needed
    };
    return taxRates[countryCode] || 0.0;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
