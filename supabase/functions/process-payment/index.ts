import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  provider: 'paystack' | 'paypal' | 'card' | 'bank' | 'stripe' | 'coinbase-commerce' | 'metamask' | 'eth' | 'btc' | 'usdc' | 'usdt' | 'cardano' | 'matic' | 'flutterwave' | 'mpesa' | 'mtn-momo' | 'airtel-money' | 'chipper';
  amount: number;
  currency: string;
  email: string;
  userId: string;
  metadata: {
    planId?: string;
    planName?: string;
    billingPeriod?: 'monthly' | 'yearly';
    creditType?: string;
    quantity?: number;
    projectId?: string;
  };
  billingDetails?: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    taxId?: string;
    phone?: string;
  };
  callbackUrl?: string;
}

interface PaymentResponse {
  success: boolean;
  provider: string;
  paymentId?: string;
  redirectUrl?: string;
  reference?: string;
  status: 'pending' | 'redirect' | 'completed' | 'failed';
  message?: string;
  error?: string;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('PayPal auth error:', data);
    throw new Error('Failed to authenticate with PayPal');
  }

  return data.access_token;
}

async function processPaystack(request: PaymentRequest, origin: string): Promise<PaymentResponse> {
  const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!paystackSecretKey) {
    throw new Error('Paystack secret key not configured');
  }

  const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const amountInKobo = Math.round(request.amount * 100);

  const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: request.email,
      amount: amountInKobo,
      currency: request.currency === 'USD' ? 'USD' : 'NGN',
      reference,
      callback_url: request.callbackUrl || `${origin}/pricing?payment=success`,
      metadata: {
        ...request.metadata,
        userId: request.userId,
        billingDetails: request.billingDetails,
      },
      channels: ['card', 'bank', 'ussd', 'bank_transfer'],
    }),
  });

  const paystackData = await paystackResponse.json();
  console.log('Paystack response:', paystackData);

  if (!paystackData.status) {
    throw new Error(paystackData.message || 'Failed to initialize Paystack payment');
  }

  return {
    success: true,
    provider: 'paystack',
    paymentId: paystackData.data.reference,
    redirectUrl: paystackData.data.authorization_url,
    reference: paystackData.data.reference,
    status: 'redirect',
    message: 'Redirecting to payment gateway',
  };
}

async function processPayPal(request: PaymentRequest, origin: string): Promise<PaymentResponse> {
  const accessToken = await getPayPalAccessToken();
  const amountValue = request.amount.toFixed(2);

  const orderResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `PAY-${Date.now()}`,
        description: request.metadata.planName 
          ? `${request.metadata.planName} - ${request.metadata.billingPeriod}` 
          : 'Carbon Credits Purchase',
        amount: {
          currency_code: request.currency || 'USD',
          value: amountValue,
        },
        custom_id: JSON.stringify({
          ...request.metadata,
          userId: request.userId,
        }),
      }],
      application_context: {
        return_url: request.callbackUrl || `${origin}/pricing?payment=success`,
        cancel_url: `${origin}/pricing?payment=cancelled`,
        brand_name: 'Regenerative Platform',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    }),
  });

  const orderData = await orderResponse.json();
  console.log('PayPal order response:', orderData);

  if (!orderResponse.ok) {
    throw new Error(orderData.message || 'Failed to create PayPal order');
  }

  const approvalLink = orderData.links.find((link: any) => link.rel === 'approve');

  return {
    success: true,
    provider: 'paypal',
    paymentId: orderData.id,
    redirectUrl: approvalLink?.href,
    reference: orderData.id,
    status: 'redirect',
    message: 'Redirecting to PayPal',
  };
}

async function processStripe(request: PaymentRequest, origin: string): Promise<PaymentResponse> {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecretKey) {
    throw new Error('Stripe secret key not configured');
  }

  const amountInCents = Math.round(request.amount * 100);
  const description = request.metadata.planName
    ? `${request.metadata.planName} - ${request.metadata.billingPeriod}`
    : 'Carbon Credits Purchase';

  const sessionRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': (request.currency || 'USD').toLowerCase(),
      'line_items[0][price_data][unit_amount]': amountInCents.toString(),
      'line_items[0][price_data][product_data][name]': description,
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'success_url': request.callbackUrl || `${origin}/pricing?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${origin}/pricing?payment=cancelled`,
      'customer_email': request.email,
      'metadata[userId]': request.userId,
      'metadata[planId]': request.metadata.planId || '',
      'metadata[quantity]': String(request.metadata.quantity || 1),
      'metadata[projectId]': request.metadata.projectId || '',
    }),
  });

  const sessionData = await sessionRes.json();
  if (!sessionRes.ok) {
    throw new Error(sessionData.error?.message || 'Failed to create Stripe session');
  }

  return {
    success: true,
    provider: 'stripe',
    paymentId: sessionData.id,
    redirectUrl: sessionData.url,
    reference: sessionData.id,
    status: 'redirect',
    message: 'Redirecting to Stripe',
  };
}

async function processCoinbaseCommerce(request: PaymentRequest, origin: string): Promise<PaymentResponse> {
  const coinbaseApiKey = Deno.env.get('COINBASE_COMMERCE_API_KEY');
  if (!coinbaseApiKey) {
    throw new Error('Coinbase Commerce API key not configured');
  }

  const description = request.metadata.planName
    ? `${request.metadata.planName} - ${request.metadata.billingPeriod}`
    : 'Carbon Credits Purchase';

  const chargeRes = await fetch('https://api.commerce.coinbase.com/charges', {
    method: 'POST',
    headers: {
      'X-CC-Api-Key': coinbaseApiKey,
      'X-CC-Version': '2018-03-22',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: description,
      description,
      pricing_type: 'fixed_price',
      local_price: { amount: request.amount.toFixed(2), currency: request.currency || 'USD' },
      metadata: { userId: request.userId, ...request.metadata },
      redirect_url: request.callbackUrl || `${origin}/pricing?payment=success`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
    }),
  });

  const chargeData = await chargeRes.json();
  if (!chargeRes.ok) {
    throw new Error(chargeData.error?.message || 'Failed to create Coinbase Commerce charge');
  }

  return {
    success: true,
    provider: 'coinbase-commerce',
    paymentId: chargeData.data.id,
    redirectUrl: chargeData.data.hosted_url,
    reference: chargeData.data.code,
    status: 'redirect',
    message: 'Redirecting to Coinbase Commerce',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const origin = req.headers.get('origin') || 'https://lovable.app';
    const request: PaymentRequest = await req.json();
    
    console.log('Processing payment request:', {
      provider: request.provider,
      amount: request.amount,
      currency: request.currency,
      userId: request.userId,
    });

    // Validate request
    if (!request.provider || !request.amount || !request.email || !request.userId) {
      throw new Error('Missing required payment fields');
    }

    if (request.amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let paymentResponse: PaymentResponse;

    // Process payment based on provider
    switch (request.provider) {
      case 'paystack':
      case 'card':
      case 'bank':
      case 'flutterwave':
      case 'mpesa':
      case 'mtn-momo':
      case 'airtel-money':
      case 'chipper':
        paymentResponse = await processPaystack(request, origin);
        break;
      case 'paypal':
        paymentResponse = await processPayPal(request, origin);
        break;
      case 'stripe':
        paymentResponse = await processStripe(request, origin);
        break;
      case 'coinbase-commerce':
        paymentResponse = await processCoinbaseCommerce(request, origin);
        break;
      // Crypto wallets — return instructions for client-side handling
      case 'metamask':
      case 'eth':
      case 'btc':
      case 'usdc':
      case 'usdt':
      case 'cardano':
      case 'matic':
        paymentResponse = {
          success: true,
          provider: request.provider,
          status: 'pending',
          message: 'Crypto payment initiated — complete on-chain to confirm.',
          reference: `CRYPTO-${Date.now()}`,
        };
        break;
      default:
        throw new Error(`Unsupported payment provider: ${request.provider}`);
    }

    // Create pending transaction record
    const transactionData: any = {
      user_id: request.userId,
      quantity: request.metadata.quantity || 1,
      price_per_credit: request.amount / (request.metadata.quantity || 1),
      total_amount: request.amount,
      status: 'pending',
      transaction_type: request.metadata.planId ? 'subscription' : 'purchase',
      payment_method: request.provider,
    };

    // Only include project_id if it's a valid UUID
    if (request.metadata.projectId && request.metadata.projectId !== 'subscription') {
      transactionData.project_id = request.metadata.projectId;
    }

    // For subscriptions, we may need to use a placeholder project or skip project_id
    if (request.metadata.planId) {
      // Get first active project as placeholder for subscription transactions
      const { data: projects } = await supabase
        .from('carbon_projects')
        .select('id')
        .eq('status', 'active')
        .limit(1);
      
      if (projects && projects.length > 0) {
        transactionData.project_id = projects[0].id;
      }
    }

    const { error: txError } = await supabase
      .from('transactions')
      .insert(transactionData);

    if (txError) {
      console.error('Error creating transaction record:', txError);
      // Don't fail the payment if transaction record fails
    }

    console.log('Payment initiated successfully:', paymentResponse);

    return new Response(JSON.stringify(paymentResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Payment processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const errorResponse: PaymentResponse = {
      success: false,
      provider: 'unknown',
      status: 'failed',
      error: errorMessage,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
