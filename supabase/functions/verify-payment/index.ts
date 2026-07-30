import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  provider: 'paystack' | 'paypal';
  reference?: string;
  orderId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, reference, orderId }: VerifyRequest = await req.json();
    console.log('Verifying payment:', { provider, reference, orderId });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let verified = false;
    let metadata: any = null;

    if (provider === 'paystack' && reference) {
      const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
      
      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
        },
      });

      const verifyData = await verifyResponse.json();
      console.log('Paystack verification:', verifyData);

      if (verifyData.status && verifyData.data.status === 'success') {
        verified = true;
        metadata = verifyData.data.metadata;
      }
    } else if (provider === 'paypal' && orderId) {
      const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      const auth = btoa(`${clientId}:${clientSecret}`);
      
      // Get access token
      const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });
      
      const tokenData = await tokenResponse.json();
      
      // Capture the order
      const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const captureData = await captureResponse.json();
      console.log('PayPal capture:', captureData);

      if (captureData.status === 'COMPLETED') {
        verified = true;
        const customId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id || 
                        captureData.purchase_units?.[0]?.custom_id;
        metadata = customId ? JSON.parse(customId) : null;
      }
    }

    if (verified && metadata) {
      // Update transaction to completed
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('project_id', metadata.projectId)
        .eq('user_id', metadata.userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      // Add to holdings
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
      }

      // Update available credits on the project
      const { data: projectData, error: projectError } = await supabase
        .from('carbon_projects')
        .select('available_credits, title')
        .eq('id', metadata.projectId)
        .single();

      if (!projectError && projectData) {
        await supabase
          .from('carbon_projects')
          .update({ 
            available_credits: Math.max(0, projectData.available_credits - metadata.quantity) 
          })
          .eq('id', metadata.projectId);

        // Send confirmation email (fire and forget)
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', metadata.userId)
            .maybeSingle();

          const { data: authUser } = await supabase.auth.admin.getUserById(metadata.userId);
          
          if (authUser?.user?.email) {
            const emailPayload = {
              type: 'purchase_confirmation',
              to: authUser.user.email,
              data: {
                userName: profile?.full_name || 'Valued Investor',
                projectTitle: projectData.title,
                quantity: metadata.quantity,
                totalAmount: metadata.quantity * metadata.pricePerCredit,
                transactionId: metadata.projectId,
                purchaseDate: new Date().toLocaleDateString(),
              },
            };

            // Call send-email function
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
            
            fetch(`${supabaseUrl}/functions/v1/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseAnonKey}`,
              },
              body: JSON.stringify(emailPayload),
            }).catch(err => console.error('Email send error:', err));
          }
        } catch (emailErr) {
          console.error('Error preparing email:', emailErr);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        verified: true,
        message: 'Payment verified and credits added to your portfolio',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      verified: false,
      message: 'Payment verification failed',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
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
