import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Leaf, ShieldCheck, CreditCard, Network } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CarbonProject } from '@/types/marketplace';
import { toast } from 'sonner';

interface PurchaseModalProps {
  project: CarbonProject;
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'paystack' | 'stripe' | 'coinbase' | 'wallet';

export function PurchaseModal({ project, isOpen, onClose }: PurchaseModalProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');
  // Remove user check for testing purposes
  // const { user } = useSupabaseAuth();

  const totalPrice = quantity * project.price_per_credit;
  const totalOffset = quantity * project.co2_offset_per_credit;
  const maxQuantity = Math.min(project.available_credits, 1000);

  const handlePurchase = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      if (paymentMethod === 'wallet') {
        // Crypto wallet payment - simulate connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentStep('success');
        setTimeout(() => {
          toast.success('Payment successful!');
          onClose();
        }, 1500);
      } else {
        // Redirect to local payment page with project details
        const params = new URLSearchParams({
          projectId: project.id,
          projectTitle: project.title,
          quantity: quantity.toString(),
          amount: totalPrice.toString(),
          paymentMethod,
        });
        navigate(`/payment?${params.toString()}`);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
      setIsProcessing(false);
      setPaymentStep('select');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Purchase Carbon Credits</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {project.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {paymentStep === 'select' && (
            <>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="border-border/50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <label className="sr-only" htmlFor="quantity-input">Quantity of carbon credits</label>
                <Input
                  id="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                  className="w-24 text-center bg-muted border-border/50"
                  min={1}
                  max={maxQuantity}
                  autoComplete="off"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="border-border/50"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border/30">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per credit</span>
                  <span className="text-foreground">${project.price_per_credit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="text-foreground">{quantity} credits</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border/30">
                  <span className="text-foreground font-medium">Total</span>
                  <span className="text-2xl font-bold text-gradient-gold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select payment method">
                  <button
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'paystack'
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-border'
                    }`}
                    role="radio"
                    aria-checked={paymentMethod === 'paystack' ? 'true' : 'false'}
                    aria-label="Paystack - Cards, Bank Transfer"
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'paystack' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'paystack' ? 'text-primary' : 'text-foreground'}`}>
                      Paystack
                    </span>
                    <span className="text-xs text-muted-foreground">Cards, Bank Transfer</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'stripe'
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-border'
                    }`}
                    role="radio"
                    aria-checked={paymentMethod === 'stripe' ? 'true' : 'false'}
                    aria-label="Stripe - Credit & Debit Cards"
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'stripe' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'stripe' ? 'text-primary' : 'text-foreground'}`}>
                      Stripe
                    </span>
                    <span className="text-xs text-muted-foreground">Credit & Debit Cards</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('coinbase')}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'coinbase'
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-border'
                    }`}
                    role="radio"
                    aria-checked={paymentMethod === 'coinbase' ? 'true' : 'false'}
                    aria-label="Coinbase - Multiple Cryptocurrencies"
                  >
                    <Network className={`w-6 h-6 ${paymentMethod === 'coinbase' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'coinbase' ? 'text-primary' : 'text-foreground'}`}>
                      Coinbase
                    </span>
                    <span className="text-xs text-muted-foreground">Multiple Cryptocurrencies</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'wallet'
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-border'
                    }`}
                    role="radio"
                    aria-checked={paymentMethod === 'wallet' ? 'true' : 'false'}
                    aria-label="MetaMask - Web3 Wallet"
                  >
                    <Network className={`w-6 h-6 ${paymentMethod === 'wallet' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'wallet' ? 'text-primary' : 'text-foreground'}`}>
                      MetaMask
                    </span>
                    <span className="text-xs text-muted-foreground">Web3 Wallet</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Leaf className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground/80">
                  This purchase will offset <strong>{totalOffset.toFixed(1)} tonnes</strong> of CO₂
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-border/50"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchase}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isProcessing}
                >
                  {paymentMethod === 'paystack' || paymentMethod === 'stripe' ? (
                    <CreditCard className="w-4 h-4 mr-2" />
                  ) : paymentMethod === 'coinbase' ? (
                    <Network className="w-4 h-4 mr-2" />
                  ) : (
                    <Network className="w-4 h-4 mr-2" />
                  )}
                  Pay ${totalPrice.toFixed(2)}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure payment via {paymentMethod === 'paystack' ? 'Paystack' : 
                   paymentMethod === 'stripe' ? 'Stripe' : 
                   paymentMethod === 'coinbase' ? 'Coinbase' : 'MetaMask'}</span>
              </div>
            </>
          )}

          {paymentStep === 'processing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  {paymentMethod === 'wallet' ? 'Connecting to Wallet...' : 'Redirecting to Payment...'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {paymentMethod === 'wallet' 
                    ? 'Please check your MetaMask extension to confirm the transaction' 
                    : 'Please complete the payment on the secure payment page'}
                </p>
              </div>
            </motion.div>
          )}

          {paymentStep === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-foreground">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your carbon credits have been purchased and will be added to your portfolio shortly.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
