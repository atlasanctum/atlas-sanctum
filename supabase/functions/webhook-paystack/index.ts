import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

async function verifyPaystackSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hash === signature;
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

    // Verify webhook signature
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();
    
    if (signature) {
      const isValid = await verifyPaystackSignature(body, signature, paystackSecretKey);
      
      if (!isValid) {
        console.error('Invalid Paystack webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event, event.data?.reference);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.event === 'charge.success') {
      const { metadata, reference, amount, customer } = event.data;
      
      console.log('Processing successful charge:', { reference, amount, metadata });

      if (metadata?.projectId && metadata?.userId) {
        // Check if transaction already processed
        const { data: existingHolding } = await supabase
          .from('credit_holdings')
          .select('id')
          .eq('user_id', metadata.userId)
          .eq('project_id', metadata.projectId)
          .gte('purchased_at', new Date(Date.now() - 60000).toISOString()) // Within last minute
          .single();

        if (existingHolding) {
          console.log('Transaction already processed, skipping');
          return new Response(JSON.stringify({ received: true, status: 'already_processed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Update transaction status
        const { error: txError } = await supabase
          .from('transactions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('user_id', metadata.userId)
          .eq('project_id', metadata.projectId)
          .eq('status', 'pending')
          .eq('payment_method', 'paystack');

        if (txError) {
          console.error('Error updating transaction:', txError);
        }

        // Add credits to user holdings
        const { error: holdingError } = await supabase
          .from('credit_holdings')
          .insert({
            user_id: metadata.userId,
            project_id: metadata.projectId,
            quantity: metadata.quantity,
            purchase_price: metadata.pricePerCredit,
          });

        if (holdingError) {
          console.error('Error creating holding:', holdingError);
          throw holdingError;
        }

        // Update available credits on project
        const { data: project } = await supabase
          .from('carbon_projects')
          .select('available_credits')
          .eq('id', metadata.projectId)
          .single();

        if (project) {
          await supabase
            .from('carbon_projects')
            .update({
              available_credits: project.available_credits - metadata.quantity,
            })
            .eq('id', metadata.projectId);
        }

        console.log('Successfully processed Paystack payment for user:', metadata.userId);
      }
    } else if (event.event === 'charge.failed') {
      const { metadata } = event.data;
      
      if (metadata?.userId && metadata?.projectId) {
        await supabase
          .from('transactions')
          .update({ status: 'failed' })
          .eq('user_id', metadata.userId)
          .eq('project_id', metadata.projectId)
          .eq('status', 'pending')
          .eq('payment_method', 'paystack');

        console.log('Marked transaction as failed');
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Paystack webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
