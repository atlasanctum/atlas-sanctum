import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePayment } from '@/hooks/usePayment';

type PaymentState = 'idle' | 'success' | 'cancelled' | 'failed' | 'verifying';

interface PaymentStatusProps {
  onContinue?: () => void;
  onRetry?: () => void;
}

export function PaymentStatus({ onContinue, onRetry }: PaymentStatusProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { verifyPayment, status: verificationStatus } = usePayment();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    const paymentParam = searchParams.get('payment');
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const orderId = searchParams.get('token');

    if (paymentParam === 'success') {
      setPaymentState('verifying');
      
      // Auto-verify payment
      if (!verificationAttempted) {
        setVerificationAttempted(true);
        
        if (reference) {
          verifyPayment('paystack', reference).then((result) => {
            setPaymentState(result?.success ? 'success' : 'failed');
          });
        } else if (orderId) {
          verifyPayment('paypal', undefined, orderId).then((result) => {
            setPaymentState(result?.success ? 'success' : 'failed');
          });
        } else {
          // No reference, assume success (webhook will handle)
          setTimeout(() => setPaymentState('success'), 1500);
        }
      }
    } else if (paymentParam === 'cancelled') {
      setPaymentState('cancelled');
    } else if (paymentParam === 'failed') {
      setPaymentState('failed');
    }
  }, [searchParams, verifyPayment, verificationAttempted]);

  const handleDismiss = () => {
    setPaymentState('idle');
    searchParams.delete('payment');
    searchParams.delete('reference');
    searchParams.delete('trxref');
    searchParams.delete('token');
    setSearchParams(searchParams);
    onContinue?.();
  };

  if (paymentState === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              {paymentState === 'verifying' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <CardTitle>Verifying Payment</CardTitle>
                  <CardDescription>
                    Please wait while we confirm your payment...
                  </CardDescription>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Processing
                  </Badge>
                </div>
              )}

              {paymentState === 'success' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-primary">Payment Successful!</CardTitle>
                  <CardDescription>
                    Your subscription has been activated. Thank you for your purchase!
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    Secured by 256-bit encryption
                  </div>
                  <Button onClick={handleDismiss} className="w-full mt-4">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {paymentState === 'cancelled' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <CardTitle>Payment Cancelled</CardTitle>
                  <CardDescription>
                    Your payment was cancelled. No charges were made.
                  </CardDescription>
                  <div className="flex gap-3 w-full mt-4">
                    <Button variant="outline" onClick={handleDismiss} className="flex-1">
                      Close
                    </Button>
                    <Button onClick={onRetry} className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {paymentState === 'failed' && (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <CardTitle className="text-destructive">Payment Failed</CardTitle>
                  <CardDescription>
                    We couldn't process your payment. Please try again or use a different payment method.
                  </CardDescription>
                  <div className="flex gap-3 w-full mt-4">
                    <Button variant="outline" onClick={handleDismiss} className="flex-1">
                      Close
                    </Button>
                    <Button onClick={onRetry} className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
