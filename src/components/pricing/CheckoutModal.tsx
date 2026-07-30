// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle, Building2, Loader2,
  ChevronRight, ChevronLeft, Sparkles, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { PaymentProvider } from '@/hooks/usePayment';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export interface PlanDetails {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'one-time' | 'contract' | 'transaction';
  features: string[];
  segmentType?: 'subscription' | 'enterprise' | 'transaction' | 'free';
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDetails | null;
}

// ─── Payment Method Definitions ──────────────────────────────────────────────

const PAYMENT_GROUPS = [
  {
    id: 'african',
    label: '🌍 African Fintech',
    methods: [
      { id: 'paystack', name: 'Paystack', tag: 'NG · GH · KE · ZA', color: '#00C3F7', symbol: 'PS', desc: 'Cards, Bank, USSD' },
      { id: 'flutterwave', name: 'Flutterwave', tag: '30+ African countries', color: '#F5A623', symbol: 'FW', desc: 'Cards, Bank, Mobile Money' },
      { id: 'mpesa', name: 'M-Pesa', tag: 'Kenya · Tanzania · Uganda', color: '#4CAF50', symbol: 'MP', desc: 'Mobile money transfer' },
      { id: 'mtn-momo', name: 'MTN MoMo', tag: '17 African markets', color: '#FFCC00', symbol: 'MM', desc: 'Mobile money wallet' },
      { id: 'airtel-money', name: 'Airtel Money', tag: '14 African countries', color: '#FF0000', symbol: 'AM', desc: 'Airtel mobile wallet' },
      { id: 'chipper', name: 'Chipper Cash', tag: 'Pan-African', color: '#7B61FF', symbol: 'CC', desc: 'Cross-border transfers' },
    ],
  },
  {
    id: 'global',
    label: '💳 Global Fiat',
    methods: [
      { id: 'paypal', name: 'PayPal', tag: 'Global', color: '#003087', symbol: 'PP', desc: 'PayPal account or card' },
      { id: 'stripe', name: 'Stripe', tag: 'Global', color: '#635BFF', symbol: 'ST', desc: 'Cards · Bank · Apple/Google Pay' },
      { id: 'card', name: 'Credit / Debit Card', tag: 'Visa · Mastercard · Amex', color: '#1A1F36', symbol: '💳', desc: 'Secure card payment' },
      { id: 'bank', name: 'Bank Transfer', tag: 'SWIFT · SEPA · ACH', color: '#2D7DD2', symbol: '🏦', desc: 'Direct bank transfer' },
    ],
  },
  {
    id: 'crypto',
    label: '⛓️ Crypto / Web3',
    methods: [
      { id: 'usdc', name: 'USDC', tag: 'Stablecoin', color: '#2775CA', symbol: '$', desc: 'USD Coin · Ethereum / Polygon' },
      { id: 'usdt', name: 'USDT', tag: 'Stablecoin', color: '#26A17B', symbol: '₮', desc: 'Tether · Multi-chain' },
      { id: 'eth', name: 'Ethereum', tag: 'ETH / ERC-20', color: '#627EEA', symbol: 'Ξ', desc: 'Pay with ETH or ERC-20' },
      { id: 'cardano', name: 'Cardano', tag: 'ADA', color: '#0033AD', symbol: '₳', desc: 'Native Cardano payments' },
      { id: 'matic', name: 'Polygon', tag: 'MATIC', color: '#8247E5', symbol: '⬡', desc: 'Low-fee L2 payments' },
      { id: 'btc', name: 'Bitcoin', tag: 'BTC · Lightning', color: '#F7931A', symbol: '₿', desc: 'BTC or Lightning Network' },
      { id: 'coinbase-commerce', name: 'Coinbase Commerce', tag: 'Multi-coin', color: '#0052FF', symbol: 'CB', desc: 'Any major crypto via Coinbase' },
      { id: 'metamask', name: 'MetaMask', tag: 'Web3 Wallet', color: '#E2761B', symbol: '🦊', desc: 'Connect Web3 wallet' },
    ],
  },
];

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' }, { code: 'KE', name: 'Kenya' }, { code: 'ZA', name: 'South Africa' },
  { code: 'GH', name: 'Ghana' }, { code: 'ET', name: 'Ethiopia' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'UG', name: 'Uganda' }, { code: 'RW', name: 'Rwanda' }, { code: 'SN', name: 'Senegal' },
  { code: 'CI', name: "Côte d'Ivoire" }, { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' }, { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' }, { code: 'IN', name: 'India' }, { code: 'BR', name: 'Brazil' },
  { code: 'JP', name: 'Japan' }, { code: 'SG', name: 'Singapore' },
];

// ─── Segment-aware CTA labels ─────────────────────────────────────────────────

function ctaLabel(plan: PlanDetails): string {
  if (plan.segmentType === 'free') return 'Apply for Free Access';
  if (plan.segmentType === 'enterprise') return 'Request Contract';
  if (plan.segmentType === 'transaction') return 'Confirm & Enable';
  return `Pay $${plan.price.toLocaleString()}`;
}

// ─── Method Card ──────────────────────────────────────────────────────────────

function MethodCard({ method, selected, onSelect }: {
  method: typeof PAYMENT_GROUPS[0]['methods'][0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
        selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/40'
      }`}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: method.color }}
      >
        {method.symbol}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{method.name}</p>
        <p className="text-xs text-muted-foreground truncate">{method.desc}</p>
      </div>
      <Badge variant="outline" className="text-xs hidden sm:block shrink-0">{method.tag}</Badge>
      {selected && <CheckCircle className="w-4 h-4 text-primary absolute top-2 right-2" />}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckoutModal({ isOpen, onClose, plan }: CheckoutModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { initiatePayment, status, isProcessing, error, resetPayment } = usePayment();
  const [step, setStep] = useState<'auth-gate' | 'billing' | 'payment' | 'processing'>('billing');
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider>('paystack');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [billing, setBilling] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', company: '', address: '', city: '',
    state: '', postalCode: '', country: 'NG', taxId: '',
  });

  // Auth gate: redirect unauthenticated users
  useEffect(() => {
    if (isOpen && !user) {
      setStep('auth-gate');
    } else if (isOpen && user) {
      setStep('billing');
      setBilling(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) { resetPayment(); setPromoCode(''); setAppliedPromo(null); setPromoError(''); setFormErrors({}); }
  }, [isOpen, resetPayment]);

  const isFree = plan?.segmentType === 'free';
  const isEnterprise = plan?.segmentType === 'enterprise';

  const total = plan ? Math.max(0, plan.price - (appliedPromo?.discountAmount || 0)) : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!billing.firstName.trim()) e.firstName = 'Required';
    if (!billing.lastName.trim()) e.lastName = 'Required';
    if (!billing.email.trim()) e.email = 'Required';
    if (!isFree && !isEnterprise && !billing.address.trim()) e.address = 'Required';
    if (!isFree && !isEnterprise && !billing.city.trim()) e.city = 'Required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePromo = async () => {
    if (!promoCode.trim()) return;
    setIsValidatingPromo(true); setPromoError('');
    try {
      const res = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, planId: plan?.id, purchaseAmount: plan?.price }),
      });
      const data = await res.json();
      if (data.valid) setAppliedPromo({ code: data.promoCode.code, discountAmount: data.discountAmount });
      else setPromoError(data.errorMessage || 'Invalid promo code');
    } catch { setPromoError('Failed to validate'); }
    finally { setIsValidatingPromo(false); }
  };

  const handlePay = async () => {
    if (!plan) return;
    setStep('processing');
    const result = await initiatePayment({
      provider: paymentMethod,
      amount: total,
      currency: 'USD',
      metadata: {
        planId: plan.id, planName: plan.name, billingPeriod: plan.billingPeriod,
        promoCode: appliedPromo?.code, discountAmount: appliedPromo?.discountAmount,
      },
      billingDetails: { ...billing },
    });
    if (!result?.success) setStep('payment');
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {isFree ? 'Apply for Access' : isEnterprise ? 'Request Enterprise Contract' : `Checkout — ${plan.name}`}
          </DialogTitle>
          <DialogDescription>{plan.name} · {plan.billingPeriod}</DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        {step !== 'auth-gate' && (
          <div className="flex items-center justify-center gap-1 py-3">
            {(['billing', 'payment', 'processing'] as const).map((s, i) => {
              const labels = ['Billing', isFree || isEnterprise ? 'Review' : 'Payment', 'Confirm'];
              const past = ['billing', 'payment', 'processing'].indexOf(step) > i;
              const active = step === s;
              return (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    active ? 'bg-primary text-primary-foreground' : past ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {past ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs ${active ? 'font-medium' : 'text-muted-foreground'}`}>{labels[i]}</span>
                  {i < 2 && <ChevronRight className="w-3 h-3 text-muted-foreground mx-1" />}
                </div>
              );
            })}
          </div>
        )}

        <Separator />

        <AnimatePresence mode="wait">

          {/* ── Auth Gate ── */}
          {step === 'auth-gate' && (
            <motion.div key="auth-gate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Sign in to continue</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Authenticated access is required to purchase <strong>{plan.name}</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={() => { onClose(); navigate('/auth', { state: { returnTo: '/pricing' } }); }}>
                  Sign In / Register
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Billing Step ── */}
          {step === 'billing' && (
            <motion.div key="billing" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="space-y-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                {(['firstName', 'lastName'] as const).map(f => (
                  <div key={f}>
                    <Label htmlFor={f}>{f === 'firstName' ? 'First Name' : 'Last Name'} *</Label>
                    <Input id={f} value={billing[f]} onChange={e => setBilling({ ...billing, [f]: e.target.value })}
                      className={formErrors[f] ? 'border-destructive' : ''} />
                    {formErrors[f] && <p className="text-xs text-destructive mt-1">{formErrors[f]}</p>}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={billing.email}
                    onChange={e => setBilling({ ...billing, email: e.target.value })}
                    className={formErrors.email ? 'border-destructive' : ''} />
                  {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone / WhatsApp</Label>
                  <Input id="phone" placeholder="+234 800 000 0000" value={billing.phone}
                    onChange={e => setBilling({ ...billing, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Organisation (optional)</Label>
                <Input id="company" value={billing.company} onChange={e => setBilling({ ...billing, company: e.target.value })} />
              </div>
              {!isFree && !isEnterprise && (
                <>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" value={billing.address}
                      onChange={e => setBilling({ ...billing, address: e.target.value })}
                      className={formErrors.address ? 'border-destructive' : ''} />
                    {formErrors.address && <p className="text-xs text-destructive mt-1">{formErrors.address}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" value={billing.city}
                        onChange={e => setBilling({ ...billing, city: e.target.value })}
                        className={formErrors.city ? 'border-destructive' : ''} />
                    </div>
                    <div>
                      <Label htmlFor="state">State / Region</Label>
                      <Input id="state" value={billing.state} onChange={e => setBilling({ ...billing, state: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" value={billing.postalCode} onChange={e => setBilling({ ...billing, postalCode: e.target.value })} />
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country</Label>
                  <Select value={billing.country} onValueChange={v => setBilling({ ...billing, country: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="taxId">Tax ID / VAT (optional)</Label>
                  <Input id="taxId" placeholder="EU123456789" value={billing.taxId} onChange={e => setBilling({ ...billing, taxId: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={() => validate() && setStep('payment')} className="flex-1">
                  {isFree ? 'Review & Submit' : isEnterprise ? 'Review Request' : 'Choose Payment'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Payment Step ── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-5 py-4">

              {/* Order Summary */}
              <div className="p-4 bg-muted/40 rounded-xl space-y-2">
                <p className="font-semibold text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Order Summary</p>
                <div className="flex justify-between text-sm"><span>{plan.name} ({plan.billingPeriod})</span><span>${plan.price.toLocaleString()}</span></div>
                {appliedPromo && <div className="flex justify-between text-sm text-emerald-500"><span>Promo: {appliedPromo.code}</span><span>-${appliedPromo.discountAmount}</span></div>}
                <Separator />
                <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">{isFree ? 'Free' : `$${total.toLocaleString()}`}</span></div>
              </div>

              {/* Promo Code */}
              {!isFree && !isEnterprise && !appliedPromo && (
                <div className="flex gap-2">
                  <Input placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} className="flex-1" />
                  <Button variant="outline" onClick={handlePromo} disabled={isValidatingPromo || !promoCode.trim()}>
                    {isValidatingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </Button>
                </div>
              )}
              {promoError && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{promoError}</p>}
              {appliedPromo && (
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Promo applied — saving ${appliedPromo.discountAmount}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setAppliedPromo(null); setPromoCode(''); }}>Remove</Button>
                </div>
              )}

              {/* Payment Method Selector */}
              {!isFree && !isEnterprise && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Payment Method</Label>
                  <Tabs defaultValue="african">
                    <TabsList className="w-full grid grid-cols-3 mb-4">
                      {PAYMENT_GROUPS.map(g => (
                        <TabsTrigger key={g.id} value={g.id} className="text-xs">{g.label}</TabsTrigger>
                      ))}
                    </TabsList>
                    {PAYMENT_GROUPS.map(g => (
                      <TabsContent key={g.id} value={g.id}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {g.methods.map(m => (
                            <MethodCard key={m.id} method={m}
                              selected={paymentMethod === m.id}
                              onSelect={() => setPaymentMethod(m.id as PaymentProvider)} />
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {isEnterprise && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Our enterprise team will contact you within 2 business days to arrange contract and payment terms.
                </div>
              )}
              {isFree && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Free access — no payment required. Your application will be reviewed within 48 hours.
                </div>
              )}

              {/* Security badge */}
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                256-bit SSL encryption · PCI DSS compliant · All transactions are logged on-chain for transparency
              </div>

              {error && <p className="p-3 bg-destructive/10 rounded-lg text-sm text-destructive">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('billing')} className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />Back
                </Button>
                <Button onClick={handlePay} disabled={isProcessing} className="flex-1">
                  {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                  {ctaLabel(plan)}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Processing Step ── */}
          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-14 gap-4">
              {status === 'redirecting' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold">Redirecting to payment gateway</h3>
                  <p className="text-muted-foreground text-sm text-center max-w-xs">
                    You will be redirected to complete your payment securely.
                  </p>
                </>
              ) : status === 'completed' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Payment confirmed</h3>
                  <p className="text-muted-foreground text-sm">Your {plan.name} access has been activated.</p>
                  <Button onClick={onClose}>Continue to Dashboard</Button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold">Processing payment…</h3>
                  <p className="text-muted-foreground text-sm">Please wait while we securely process your payment.</p>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
