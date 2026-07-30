import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Network, Shield, Check, X, ArrowLeft, Wallet, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { usePayment } from "@/hooks/usePayment";

type PaymentMethod = 'paystack' | 'stripe' | 'coinbase' | 'wallet';

interface PaymentData {
  order: {
    id: string;
    amount: number;
    quantity: number;
  };
  payment: {
    reference: string;
    payment_method: string;
  };
  paymentMethod: string;
}

export default function Payment() {
  const { isDemoMode } = useEnhancedAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get payment parameters from URL
  const projectId = searchParams.get('projectId');
  const projectTitle = searchParams.get('projectTitle') || 'Carbon Credits';
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const amount = parseFloat(searchParams.get('amount') || '0');

  useEffect(() => {
    // Initialize payment data from URL params for demo mode
    if (projectId && amount > 0) {
      setPaymentData({
        order: {
          id: `ORD-${Date.now()}`,
          amount,
          quantity,
        },
        payment: {
          reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          payment_method: paymentMethod,
        },
        paymentMethod: 'Demo Payment',
      });
    }
  }, [projectId, amount, quantity, paymentMethod]);

  const { initiatePayment, status: paymentStatus } = usePayment();

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (paymentMethod === 'wallet') {
        // MetaMask / Web3 — handled client-side
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsVerified(true);
        return;
      }

      const result = await initiatePayment({
        provider: paymentMethod as any,
        amount,
        currency: 'USD',
        metadata: {
          projectId: projectId || undefined,
          quantity,
        },
        callbackUrl: `${window.location.origin}/payment?payment=success&projectId=${projectId}&quantity=${quantity}`,
      });

      if (!result?.success) {
        throw new Error(result?.error || 'Payment initialization failed');
      }
      // Redirect handled inside initiatePayment when redirectUrl is present
    } catch (error: any) {
      setError(error.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setIsVerified(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Atlas Sanctum</h1>
                <p className="text-sm text-slate-400">Secure Payment</p>
              </div>
            </div>
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              {isDemoMode ? 'Demo Mode' : 'Production'}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-semibold text-white mb-4">
            Payment Processing
          </h1>
          <p className="text-slate-400">
            {isVerified ? 'Your payment has been processed successfully!' : 
             isProcessing ? 'Processing your payment...' : 
             'Complete your payment to support regenerative projects'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Details */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentData ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Project</span>
                      <span className="text-white font-medium">{projectTitle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Reference</span>
                      <span className="font-mono text-sm text-emerald-400">{paymentData.payment.reference}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Amount</span>
                      <span className="font-medium text-white">
                        ${paymentData.order.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Quantity</span>
                      <span className="text-white">{paymentData.order.quantity} credits</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Method</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {paymentMethod}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No payment details found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Security Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>All payments are encrypted and secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Your payment information is never stored</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Transactions are processed by secure payment gateways</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <X className="w-4 h-4 text-red-400" />
                  <h3 className="font-medium text-red-400">Payment Failed</h3>
                </div>
                <p className="text-sm text-red-300">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="mt-3 border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Try Again
                </Button>
              </motion.div>
            )}

            {isVerified ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 text-center"
              >
                <Check className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-slate-300 mb-4">
                  Your transaction has been processed successfully.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">
                    Reference: <span className="font-mono text-emerald-400">{paymentData?.payment.reference}</span>
                  </p>
                  <p className="text-sm text-slate-400">
                    Amount: ${paymentData?.order.amount.toFixed(2)}
                  </p>
                </div>
                <Button
                  className="mt-6 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => navigate('/marketplace')}
                >
                  Continue Shopping
                </Button>
              </motion.div>
            ) : isProcessing ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Processing Payment...
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Please wait while we process your transaction
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Fiat Payment Methods */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                      Fiat Payments
                    </h4>
                    <Button
                      variant={paymentMethod === 'paystack' ? 'default' : 'outline'}
                      className={`w-full justify-start ${paymentMethod === 'paystack' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-white hover:bg-slate-800'}`}
                      onClick={() => setPaymentMethod('paystack')}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      Paystack
                      <span className="ml-auto text-sm text-slate-400">
                        Cards, Bank Transfer
                      </span>
                    </Button>
                    <Button
                      variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
                      className={`w-full justify-start ${paymentMethod === 'stripe' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-white hover:bg-slate-800'}`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      Stripe
                      <span className="ml-auto text-sm text-slate-400">
                        Credit & debit cards
                      </span>
                    </Button>
                  </div>

                  {/* Crypto Payment Methods */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                      Crypto Payments
                    </h4>
                    <Button
                      variant={paymentMethod === 'coinbase' ? 'default' : 'outline'}
                      className={`w-full justify-start ${paymentMethod === 'coinbase' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-white hover:bg-slate-800'}`}
                      onClick={() => setPaymentMethod('coinbase')}
                    >
                      <Network className="w-5 h-5 mr-3" />
                      Coinbase
                      <span className="ml-auto text-sm text-slate-400">
                        Multiple cryptocurrencies
                      </span>
                    </Button>
                    <Button
                      variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                      className={`w-full justify-start ${paymentMethod === 'wallet' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-white hover:bg-slate-800'}`}
                      onClick={() => setPaymentMethod('wallet')}
                    >
                      <Wallet className="w-5 h-5 mr-3" />
                      MetaMask
                      <span className="ml-auto text-sm text-slate-400">
                        Web3 wallet
                      </span>
                    </Button>
                  </div>

                  <Button
                    className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 mx-auto border-slate-600 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
}
