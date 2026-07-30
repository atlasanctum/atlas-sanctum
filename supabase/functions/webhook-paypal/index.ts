import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyPayPalWebhook(
  webhookId: string,
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  authAlgo: string,
  transmissionSig: string,
  webhookEvent: any
): Promise<boolean> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    console.error('PayPal credentials not configured');
    return false;
  }

  try {
    // Get access token
    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    const tokenData = await tokenResponse.json();
    
    // Verify webhook signature
    const verifyResponse = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhook_id: webhookId,
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_event: webhookEvent,
      }),
    });

    const verifyData = await verifyResponse.json();
    return verifyData.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying PayPal webhook:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const event = JSON.parse(body);
    
    console.log('PayPal webhook event:', event.event_type, event.id);

    // Optional: Verify webhook signature (requires webhook ID from PayPal dashboard)
    const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');
    if (webhookId) {
      const transmissionId = req.headers.get('paypal-transmission-id') || '';
      const transmissionTime = req.headers.get('paypal-transmission-time') || '';
      const certUrl = req.headers.get('paypal-cert-url') || '';
      const authAlgo = req.headers.get('paypal-auth-algo') || '';
      const transmissionSig = req.headers.get('paypal-transmission-sig') || '';

      const isValid = await verifyPayPalWebhook(
        webhookId,
        transmissionId,
        transmissionTime,
        certUrl,
        authAlgo,
        transmissionSig,
        event
      );

      if (!isValid) {
        console.error('Invalid PayPal webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different PayPal events
    if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = event.resource;
      let metadata: any = null;

      // Extract metadata from custom_id
      if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const customId = resource.custom_id;
        if (customId) {
          try {
            metadata = JSON.parse(customId);
          } catch {
            console.error('Failed to parse custom_id:', customId);
          }
        }
      } else if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
        const purchaseUnits = resource.purchase_units;
        if (purchaseUnits?.[0]?.custom_id) {
          try {
            metadata = JSON.parse(purchaseUnits[0].custom_id);
          } catch {
            console.error('Failed to parse custom_id');
          }
        }
      }

      console.log('Processing PayPal payment with metadata:', metadata);

      if (metadata?.projectId && metadata?.userId) {
        // Check if transaction already processed
        const { data: existingHolding } = await supabase
          .from('credit_holdings')
          .select('id')
          .eq('user_id', metadata.userId)
          .eq('project_id', metadata.projectId)
          .gte('purchased_at', new Date(Date.now() - 60000).toISOString())
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
          .eq('payment_method', 'paypal');

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

        console.log('Successfully processed PayPal payment for user:', metadata.userId);
      }
    } else if (event.event_type === 'PAYMENT.CAPTURE.DENIED' || event.event_type === 'PAYMENT.CAPTURE.REFUNDED') {
      // Handle failed or refunded payments
      const customId = event.resource?.custom_id;
      if (customId) {
        try {
          const metadata = JSON.parse(customId);
          const status = event.event_type === 'PAYMENT.CAPTURE.REFUNDED' ? 'refunded' : 'failed';
          
          await supabase
            .from('transactions')
            .update({ status })
            .eq('user_id', metadata.userId)
            .eq('project_id', metadata.projectId)
            .eq('payment_method', 'paypal');

          console.log(`Marked transaction as ${status}`);
        } catch {
          console.error('Failed to parse custom_id for failed payment');
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('PayPal webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
