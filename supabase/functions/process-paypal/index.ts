import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  projectId: string;
  quantity: number;
  pricePerCredit: number;
  userId: string;
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, quantity, pricePerCredit, userId }: PaymentRequest = await req.json();
    
    console.log('Processing PayPal payment:', { projectId, quantity, pricePerCredit });

    const totalAmount = (quantity * pricePerCredit).toFixed(2);
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `CC-${Date.now()}`,
          description: `Carbon Credits Purchase - ${quantity} credits`,
          amount: {
            currency_code: 'USD',
            value: totalAmount,
          },
          custom_id: JSON.stringify({ projectId, quantity, pricePerCredit, userId }),
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/marketplace?payment=success`,
          cancel_url: `${req.headers.get('origin')}/marketplace?payment=cancelled`,
          brand_name: 'Carbon Credits Marketplace',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const orderData = await orderResponse.json();
    console.log('PayPal order response:', orderData);

    if (!orderResponse.ok) {
      throw new Error(orderData.message || 'Failed to create PayPal order');
    }

    // Store pending transaction in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        project_id: projectId,
        quantity,
        price_per_credit: pricePerCredit,
        total_amount: quantity * pricePerCredit,
        status: 'pending',
        transaction_type: 'purchase',
        payment_method: 'paypal',
      });

    if (txError) {
      console.error('Error creating transaction:', txError);
    }

    const approvalLink = orderData.links.find((link: any) => link.rel === 'approve');

    return new Response(JSON.stringify({
      success: true,
      approval_url: approvalLink?.href,
      order_id: orderData.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('PayPal payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
