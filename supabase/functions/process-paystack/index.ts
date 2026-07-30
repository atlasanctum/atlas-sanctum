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
  email: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured');
    }

    const { projectId, quantity, pricePerCredit, email, userId }: PaymentRequest = await req.json();
    
    console.log('Processing Paystack payment:', { projectId, quantity, pricePerCredit, email });

    const totalAmount = quantity * pricePerCredit * 100; // Paystack uses kobo (smallest currency unit)
    const reference = `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: totalAmount,
        reference,
        callback_url: `${req.headers.get('origin')}/marketplace?payment=success`,
        metadata: {
          projectId,
          quantity,
          pricePerCredit,
          userId,
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log('Paystack response:', paystackData);

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Failed to initialize Paystack payment');
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
        payment_method: 'paystack',
      });

    if (txError) {
      console.error('Error creating transaction:', txError);
    }

    return new Response(JSON.stringify({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Paystack payment error:', error);
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
