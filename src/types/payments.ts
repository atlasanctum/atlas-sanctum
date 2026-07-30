/**
 * Payment Types
 * Comprehensive type definitions for the payment system
 */

// Payment Status
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'disputed';

// Payment Method
export type PaymentMethod =
  | 'card'
  | 'bank_transfer'
  | 'crypto'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay';

// Currency
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'USDC' | 'ETH' | 'BTC';

// Transaction Type
export type TransactionType =
  | 'purchase'
  | 'refund'
  | 'payout'
  | 'subscription'
  | 'credit'
  | 'debit';

// Subscription Status
export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'trialing'
  | 'paused'
  | 'unpaid';

// Subscription Interval
export type SubscriptionInterval = 'month' | 'year' | 'week' | 'day';

// Plan Type
export type PlanType = 'individual' | 'enterprise' | 'nonprofit' | 'government';

// Payment Intent
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  clientSecret: string;
  metadata?: Record<string, string>;
  createdAt: string;
  completedAt?: string;
}

// Payment Method (Card)
export interface CardPaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  billingDetails: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  isDefault: boolean;
  createdAt: string;
}

// Payment Method (General)
export interface PaymentMethodInfo {
  id: string;
  type: PaymentMethod;
  details: Record<string, unknown>;
  billingDetails: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  isDefault: boolean;
  createdAt: string;
}

// Subscription Plan
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  price: number;
  currency: Currency;
  interval: SubscriptionInterval;
  features: string[];
  limits: {
    projects: number;
    users: number;
    apiCalls: number;
    storageGb: number;
  };
  trialDays: number;
  stripePriceId?: string;
  isPopular?: boolean;
  isActive: boolean;
}

// Subscription
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  trialEnd?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
}

// Invoice
export interface Invoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: Currency;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate: string;
  paidAt?: string;
  invoiceNumber: string;
  lineItems: InvoiceLineItem[];
  pdfUrl?: string;
  hostedInvoiceUrl?: string;
  createdAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  period: {
    start: string;
    end: string;
  };
}

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  paymentMethodId?: string;
  description: string;
  metadata?: Record<string, string>;
  referenceId?: string;
  invoiceId?: string;
  createdAt: string;
  completedAt?: string;
}

// Tax Info
export interface TaxInfo {
  id: string;
  userId: string;
  taxId?: string;
  taxIdType?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  verified: boolean;
  createdAt: string;
}

// Billing Address
export interface BillingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

// Checkout Session
export interface CheckoutSession {
  id: string;
  url: string;
  paymentIntentId?: string;
  subscriptionId?: string;
  mode: 'payment' | 'subscription';
  status: 'open' | 'complete' | 'expired';
  createdAt: string;
  expiresAt: string;
}

// Refund
export interface Refund {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: Currency;
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  createdAt: string;
}

// API Response Types
export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
}

// Filter Types
export interface TransactionFilter {
  userId?: string;
  status?: PaymentStatus[];
  type?: TransactionType[];
  paymentMethod?: PaymentMethod[];
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface InvoiceFilter {
  userId?: string;
  status?: Invoice['status'][];
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Pagination
export interface TransactionPage {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface InvoicePage {
  invoices: Invoice[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

// Webhook Event Types
export type WebhookEventType =
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'checkout.session.completed';

export interface WebhookEvent {
  type: WebhookEventType;
  data: Record<string, unknown>;
  createdAt: string;
}

// Context Type
export interface PaymentContextType {
  // State
  transactions: Transaction[];
  invoices: Invoice[];
  subscription: Subscription | null;
  availablePlans: SubscriptionPlan[];
  paymentMethods: PaymentMethodInfo[];
  isLoading: boolean;
  error: string | null;

  // Payment Intent
  createPaymentIntent: (amount: number, currency: Currency, metadata?: Record<string, string>) => Promise<CreatePaymentIntentResponse>;
  confirmPayment: (paymentIntentId: string, paymentMethodId: string) => Promise<{ success: boolean; error?: string }>;

  // Checkout
  createCheckoutSession: (priceId: string, mode: 'payment' | 'subscription') => Promise<CreateCheckoutSessionResponse>;
  redirectToCheckout: (sessionId: string) => Promise<void>;

  // Subscription
  createSubscription: (priceId: string, paymentMethodId?: string) => Promise<{ subscriptionId: string; clientSecret?: string }>;
  cancelSubscription: (subscriptionId: string, immediately?: boolean) => Promise<void>;
  updateSubscription: (subscriptionId: string, newPriceId: string) => Promise<void>;
  pauseSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;

  // Payment Methods
  addPaymentMethod: (paymentMethodId: string, setAsDefault?: boolean) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;

  // Invoices
  getInvoices: (filter?: InvoiceFilter) => Promise<InvoicePage>;
  downloadInvoice: (invoiceId: string) => Promise<string>;

  // Transactions
  getTransactions: (filter?: TransactionFilter) => Promise<TransactionPage>;
  getTransaction: (transactionId: string) => Promise<Transaction | null>;

  // Refunds
  createRefund: (paymentIntentId: string, amount?: number, reason?: string) => Promise<Refund>;

  // Tax
  updateTaxInfo: (taxInfo: TaxInfo) => Promise<void>;
}
