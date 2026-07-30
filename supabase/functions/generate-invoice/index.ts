import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;

    const {
      subscriptionId,
      transactionId,
      amount,
      currency = 'USD',
      billingName,
      billingEmail,
      billingAddress,
      items,
      paymentMethod,
      paymentReference,
      planName,
      billingPeriod,
    } = await req.json();

    if (!amount || !billingEmail || !items) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Use service role to insert (since user inserts via RLS)
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    const { data: invoice, error: invoiceError } = await adminClient
      .from('invoices')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId || null,
        transaction_id: transactionId || null,
        invoice_number: invoiceNumber,
        amount,
        currency,
        status: 'paid',
        billing_name: billingName,
        billing_email: billingEmail,
        billing_address: billingAddress,
        items,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Invoice creation error:', invoiceError);
      throw new Error('Failed to create invoice');
    }

    // If this is a subscription payment, create/update subscription
    if (planName && billingPeriod) {
      const periodEnd = new Date();
      if (billingPeriod === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      // Deactivate existing subscriptions
      await adminClient
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('user_id', userId)
        .eq('status', 'active');

      // Create new subscription
      await adminClient
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planName.toLowerCase().replace(/\s+/g, '-'),
          plan_name: planName,
          status: 'active',
          billing_period: billingPeriod,
          amount,
          currency,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          payment_method: paymentMethod,
          payment_reference: paymentReference,
        });
    }

    console.log('Invoice generated:', invoiceNumber);

    return new Response(JSON.stringify({ 
      success: true, 
      invoice,
      invoiceNumber,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Invoice generation error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
