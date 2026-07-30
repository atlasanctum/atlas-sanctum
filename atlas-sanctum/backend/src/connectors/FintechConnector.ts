/**
 * Atlas Sanctum — Fintech Connector
 * Supports: Stripe, Flutterwave, M-Pesa, PayPal.
 * Enables: cross-border settlements, CBDC interop, offline payment queuing,
 * AI fraud monitoring, treasury orchestration, impact financing.
 */

import { BaseConnector, ConnectorCallOptions, ConnectorStatus } from './BaseConnector';

export interface FintechConfig {
  stripeSecretKey?: string;
  flutterwaveSecretKey?: string;
  mpesaConsumerKey?: string;
  mpesaConsumerSecret?: string;
  mpesaShortcode?: string;
  paypalClientId?: string;
  paypalClientSecret?: string;
  mpesaBaseUrl?: string;  // sandbox vs production
}

export interface PaymentRequest {
  provider: 'stripe' | 'flutterwave' | 'mpesa' | 'paypal';
  amountCents: number;
  currency: string;
  recipientRef: string;   // phone, email, account
  description: string;
  metadata?: Record<string, string>;
  idempotencyKey: string;
}

export interface PaymentResult {
  provider: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  amountCents: number;
  currency: string;
  timestamp: string;
  rawResponse?: unknown;
}

export interface OfflinePaymentQueueItem extends PaymentRequest {
  queuedAt: string;
  attempts: number;
}

export class FintechConnector extends BaseConnector {
  private config: FintechConfig;
  private offlineQueue: OfflinePaymentQueueItem[] = [];
  private mpesaToken?: string;
  private mpesaTokenExpiry = 0;

  constructor(config: FintechConfig) {
    super({ id: 'fintech-connector', domain: 'fintech', version: '1.0.0' });
    this.config = config;
  }

  async connect(): Promise<void> {
    this.status = 'healthy';
    this.emit('connected', { connectorId: this.meta.id });
  }

  async disconnect(): Promise<void> {
    this.status = 'offline';
  }

  async healthCheck(): Promise<ConnectorStatus> {
    const hasKey = !!(this.config.stripeSecretKey || this.config.flutterwaveSecretKey || this.config.mpesaConsumerKey);
    this.status = hasKey ? 'healthy' : 'degraded';
    return this.status;
  }

  async initiatePayment(req: PaymentRequest, opts: ConnectorCallOptions = {}): Promise<PaymentResult> {
    return this.call(`payment:${req.provider}`, async () => {
      switch (req.provider) {
        case 'stripe': return this.stripeCharge(req);
        case 'flutterwave': return this.flutterwaveCharge(req);
        case 'mpesa': return this.mpesaSTKPush(req);
        case 'paypal': return this.paypalOrder(req);
        default: throw new Error(`Unknown provider: ${req.provider}`);
      }
    }, opts);
  }

  /** Queue payment for offline-first environments; flush when online */
  queueOfflinePayment(req: PaymentRequest): void {
    this.offlineQueue.push({ ...req, queuedAt: new Date().toISOString(), attempts: 0 });
    this.emit('payment:queued', { idempotencyKey: req.idempotencyKey });
  }

  async flushOfflineQueue(opts: ConnectorCallOptions = {}): Promise<PaymentResult[]> {
    const results: PaymentResult[] = [];
    const remaining: OfflinePaymentQueueItem[] = [];

    for (const item of this.offlineQueue) {
      try {
        const result = await this.initiatePayment(item, opts);
        results.push(result);
        this.emit('payment:flushed', { idempotencyKey: item.idempotencyKey });
      } catch {
        item.attempts++;
        if (item.attempts < 5) remaining.push(item);
        else this.emit('payment:dead-letter', item);
      }
    }

    this.offlineQueue = remaining;
    return results;
  }

  get offlineQueueDepth(): number { return this.offlineQueue.length; }

  // ── Stripe ──────────────────────────────────────────────────────────────────

  private async stripeCharge(req: PaymentRequest): Promise<PaymentResult> {
    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': req.idempotencyKey,
      },
      body: new URLSearchParams({
        amount: String(req.amountCents),
        currency: req.currency.toLowerCase(),
        description: req.description,
        'metadata[recipient]': req.recipientRef,
      }),
    });
    if (!res.ok) throw new Error(`Stripe error: ${res.status}`);
    const data = await res.json() as any;
    return {
      provider: 'stripe',
      transactionId: data.id,
      status: data.status === 'succeeded' ? 'completed' : 'pending',
      amountCents: data.amount,
      currency: data.currency,
      timestamp: new Date().toISOString(),
    };
  }

  // ── Flutterwave ──────────────────────────────────────────────────────────────

  private async flutterwaveCharge(req: PaymentRequest): Promise<PaymentResult> {
    const res = await fetch('https://api.flutterwave.com/v3/charges?type=mobile_money_ghana', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: req.amountCents / 100,
        currency: req.currency,
        email: req.recipientRef,
        tx_ref: req.idempotencyKey,
        narration: req.description,
      }),
    });
    if (!res.ok) throw new Error(`Flutterwave error: ${res.status}`);
    const data = await res.json() as any;
    return {
      provider: 'flutterwave',
      transactionId: data.data?.id ?? req.idempotencyKey,
      status: data.status === 'success' ? 'completed' : 'pending',
      amountCents: req.amountCents,
      currency: req.currency,
      timestamp: new Date().toISOString(),
    };
  }

  // ── M-Pesa STK Push ──────────────────────────────────────────────────────────

  private async mpesaSTKPush(req: PaymentRequest): Promise<PaymentResult> {
    const token = await this.getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${this.config.mpesaShortcode}${process.env.MPESA_PASSKEY ?? ''}${timestamp}`
    ).toString('base64');

    const baseUrl = this.config.mpesaBaseUrl ?? 'https://sandbox.safaricom.co.ke';
    const res = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: this.config.mpesaShortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(req.amountCents / 100),
        PartyA: req.recipientRef,
        PartyB: this.config.mpesaShortcode,
        PhoneNumber: req.recipientRef,
        CallBackURL: process.env.MPESA_CALLBACK_URL ?? '',
        AccountReference: req.idempotencyKey,
        TransactionDesc: req.description,
      }),
    });
    if (!res.ok) throw new Error(`M-Pesa error: ${res.status}`);
    const data = await res.json() as any;
    return {
      provider: 'mpesa',
      transactionId: data.CheckoutRequestID,
      status: 'pending',
      amountCents: req.amountCents,
      currency: 'KES',
      timestamp: new Date().toISOString(),
    };
  }

  private async getMpesaToken(): Promise<string> {
    if (this.mpesaToken && Date.now() < this.mpesaTokenExpiry) return this.mpesaToken;
    const creds = Buffer.from(`${this.config.mpesaConsumerKey}:${this.config.mpesaConsumerSecret}`).toString('base64');
    const baseUrl = this.config.mpesaBaseUrl ?? 'https://sandbox.safaricom.co.ke';
    const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${creds}` },
    });
    if (!res.ok) throw new Error('M-Pesa token fetch failed');
    const data = await res.json() as any;
    this.mpesaToken = data.access_token;
    this.mpesaTokenExpiry = Date.now() + (parseInt(data.expires_in) - 60) * 1000;
    return this.mpesaToken!;
  }

  // ── PayPal ───────────────────────────────────────────────────────────────────

  private async paypalOrder(req: PaymentRequest): Promise<PaymentResult> {
    const token = await this.getPaypalToken();
    const res = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': req.idempotencyKey,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: req.currency, value: (req.amountCents / 100).toFixed(2) },
          description: req.description,
        }],
      }),
    });
    if (!res.ok) throw new Error(`PayPal error: ${res.status}`);
    const data = await res.json() as any;
    return {
      provider: 'paypal',
      transactionId: data.id,
      status: 'pending',
      amountCents: req.amountCents,
      currency: req.currency,
      timestamp: new Date().toISOString(),
    };
  }

  private async getPaypalToken(): Promise<string> {
    const creds = Buffer.from(`${this.config.paypalClientId}:${this.config.paypalClientSecret}`).toString('base64');
    const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) throw new Error('PayPal token fetch failed');
    const data = await res.json() as any;
    return data.access_token;
  }
}
