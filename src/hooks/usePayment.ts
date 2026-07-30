import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export type PaymentProvider =
  // African fintech
  | 'paystack' | 'flutterwave' | 'mpesa' | 'mtn-momo' | 'airtel-money' | 'chipper'
  // Global fiat
  | 'paypal' | 'stripe' | 'card' | 'bank'
  // Crypto
  | 'eth' | 'btc' | 'usdc' | 'usdt' | 'cardano' | 'matic' | 'coinbase-commerce' | 'metamask';
export type PaymentStatus = 'idle' | 'processing' | 'redirecting' | 'verifying' | 'completed' | 'failed';

interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId?: string;
}

interface PaymentMetadata {
  planId?: string;
  planName?: string;
  billingPeriod?: 'monthly' | 'yearly';
  creditType?: string;
  quantity?: number;
  projectId?: string;
  promoCode?: string;
  discountAmount?: number;
}

interface PaymentRequest {
  provider: PaymentProvider;
  amount: number;
  currency?: string;
  metadata: PaymentMetadata;
  billingDetails?: BillingDetails;
  callbackUrl?: string;
}

interface PaymentResult {
  success: boolean;
  provider: string;
  paymentId?: string;
  redirectUrl?: string;
  reference?: string;
  status: string;
  message?: string;
  error?: string;
}

interface VerificationResult {
  success: boolean;
  verified: boolean;
  message?: string;
  error?: string;
}

export function usePayment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const initiatePayment = useCallback(async (request: PaymentRequest): Promise<PaymentResult | null> => {
    if (!user?.email || !user?.id) {
      setError('Please sign in to make a payment');
      toast({
        title: 'Authentication required',
        description: 'Please sign in to continue with payment',
        variant: 'destructive',
      });
      return null;
    }

    setStatus('processing');
    setError(null);

    try {
      console.log('Initiating payment:', request);

      const { data, error: invokeError } = await supabase.functions.invoke('process-payment', {
        body: {
          ...request,
          email: user.email,
          userId: user.id,
          currency: request.currency || 'USD',
        },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      const result = data as PaymentResult;
      setPaymentResult(result);

      if (result.success && result.redirectUrl) {
        setStatus('redirecting');
        toast({
          title: 'Redirecting to payment',
          description: 'You will be redirected to complete your payment',
        });
        
        // Redirect to payment gateway
        setTimeout(() => {
          window.location.href = result.redirectUrl!;
        }, 1500);
      } else if (!result.success) {
        throw new Error(result.error || 'Payment initialization failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      setStatus('failed');
      
      toast({
        title: 'Payment failed',
        description: errorMessage,
        variant: 'destructive',
      });

      return null;
    }
  }, [user, toast]);

  const verifyPayment = useCallback(async (
    provider: 'paystack' | 'paypal',
    reference?: string,
    orderId?: string
  ): Promise<VerificationResult | null> => {
    setStatus('verifying');
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('verify-payment', {
        body: { provider, reference, orderId },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      const result = data as VerificationResult;

      if (result.success && result.verified) {
        setStatus('completed');
        toast({
          title: 'Payment verified!',
          description: result.message || 'Your payment has been confirmed',
        });
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      setStatus('failed');
      
      toast({
        title: 'Verification failed',
        description: errorMessage,
        variant: 'destructive',
      });

      return null;
    }
  }, [toast]);

  const resetPayment = useCallback(() => {
    setStatus('idle');
    setError(null);
    setPaymentResult(null);
  }, []);

  return {
    status,
    error,
    paymentResult,
    isProcessing: status === 'processing' || status === 'redirecting' || status === 'verifying',
    initiatePayment,
    verifyPayment,
    resetPayment,
  };
}
