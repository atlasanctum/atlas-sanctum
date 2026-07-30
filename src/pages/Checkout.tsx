/**
 * Checkout Page
 * 
 * Comprehensive checkout and payment flow for purchasing regenerative credits.
 * Supports both fiat and crypto payment methods.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  Lock,
  TreePine,
  Leaf,
  Droplets,
  Wind,
  Mountain,
  Sun,
  ArrowRight,
  Building2,
  User,
  FileText,
  Download,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { supabase } from '@/integrations/supabase/client';

// Credit types available for purchase
const CREDIT_TYPES = [
  {
    id: 'carbon',
    name: 'Carbon Credits',
    icon: Wind,
    description: 'Verified carbon offset credits from forest conservation and reforestation',
    unit: 'ton CO2',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500',
    popular: false,
    pricePerUnit: 25,
  },
  {
    id: 'nature',
    name: 'Nature Credits',
    icon: Leaf,
    description: 'Biodiversity conservation credits protecting endangered ecosystems',
    unit: 'hectare',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500',
    popular: true,
    pricePerUnit: 50,
  },
  {
    id: 'ocean',
    name: 'Ocean Credits',
    icon: Droplets,
    description: 'Marine ecosystem restoration and blue carbon credits',
    unit: 'ton CO2',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500',
    popular: false,
    pricePerUnit: 35,
  },
  {
    id: 'biodiversity',
    name: 'Biodiversity Credits',
    icon: Mountain,
    description: 'Species protection and habitat restoration credits',
    unit: 'species',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500',
    popular: false,
    pricePerUnit: 100,
  },
  {
    id: 'water',
    name: 'Water Credits',
    icon: Droplets,
    description: 'Watershed protection and water quality improvement credits',
    unit: 'million liters',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500',
    popular: false,
    pricePerUnit: 15,
  },
  {
    id: 'social',
    name: 'Social Impact Credits',
    icon: Sun,
    description: 'Community development and social welfare credits',
    unit: 'beneficiary',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500',
    popular: false,
    pricePerUnit: 20,
  },
];

// Preset quantity options
const QUANTITY_PRESETS = [
  { amount: 10, discount: 0 },
  { amount: 50, discount: 5 },
  { amount: 100, discount: 10 },
  { amount: 500, discount: 15 },
  { amount: 1000, discount: 20 },
];

// Country list for billing
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
];

interface CartItem {
  typeId: string;
  quantity: number;
  pricePerUnit: number;
}

export default function Checkout() {
  const { user } = useAuth();
  const { isDemoMode } = useEnhancedAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Checkout steps
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { id: 'credits', title: 'Select Credits' },
    { id: 'details', title: 'Billing Details' },
    { id: 'payment', title: 'Payment' },
    { id: 'confirmation', title: 'Confirmation' },
  ];

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCreditType, setSelectedCreditType] = useState(CREDIT_TYPES[0]);
  const [quantity, setQuantity] = useState(10);
  const [presetAmount, setPresetAmount] = useState(10);

  // Billing details
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    taxId: '',
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat');
  const [fiatProvider, setFiatProvider] = useState('card');
  const [cryptoCurrency, setCryptoCurrency] = useState('eth');
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Initialize from URL params if present
  useEffect(() => {
    const creditType = searchParams.get('type');
    const creditQuantity = searchParams.get('quantity');

    if (creditType) {
      const found = CREDIT_TYPES.find(c => c.id === creditType);
      if (found) {
        setSelectedCreditType(found);
      }
    }

    if (creditQuantity) {
      const qty = parseInt(creditQuantity, 10);
      setQuantity(qty);
      setPresetAmount(qty);
    }
  }, [searchParams]);

  // Calculate totals
  const subtotal = quantity * selectedCreditType.pricePerUnit;
  const discount = QUANTITY_PRESETS.find(p => p.amount === presetAmount)?.discount || 0;
  const discountAmount = (subtotal * discount) / 100;
  const platformFee = subtotal * 0.02; // 2% platform fee
  const total = subtotal - discountAmount + platformFee;

  // Handle quantity preset selection
  const handlePresetSelect = (amount: number, discount: number) => {
    setPresetAmount(amount);
    setQuantity(amount);
  };

  // Handle quantity input
  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value, 10) || 0;
    setQuantity(Math.max(1, qty));
    setPresetAmount(qty);
  };

  // Add to cart
  const handleAddToCart = () => {
    const existingIndex = cart.findIndex(item => item.typeId === selectedCreditType.id);
    
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, {
        typeId: selectedCreditType.id,
        quantity,
        pricePerUnit: selectedCreditType.pricePerUnit,
      }]);
    }

    toast({
      title: 'Added to cart',
      description: `${quantity} ${selectedCreditType.unit} of ${selectedCreditType.name} added`,
    });
  };

  // Remove from cart
  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Continue to next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    try {
      const provider = paymentMethod === 'fiat'
        ? (fiatProvider as any)
        : cryptoCurrency === 'wallet'
          ? 'metamask'
          : cryptoCurrency;

      const { data, error: invokeError } = await supabase.functions.invoke('process-payment', {
        body: {
          provider,
          amount: total,
          currency: 'USD',
          email: user?.email,
          userId: user?.id,
          metadata: {
            creditType: selectedCreditType.id,
            quantity,
          },
          callbackUrl: `${window.location.origin}/checkout?payment=success`,
        },
      });

      if (invokeError) throw new Error(invokeError.message);

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return; // page will redirect
      }

      // Providers that confirm inline (crypto wallets)
      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setOrderId(newOrderId);

      toast({
        title: 'Payment successful!',
        description: 'Your credits have been added to your portfolio',
      });

      setCurrentStep(3);
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'Please try again or use a different payment method',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-2 ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                index < currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Render credit selection step
  const renderCreditSelection = () => (
    <div className="space-y-6">
      {/* Credit Type Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Credit Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CREDIT_TYPES.map((credit) => (
            <motion.div
              key={credit.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedCreditType.id === credit.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:border-primary/30'
                }`}
                onClick={() => setSelectedCreditType(credit)}
              >
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${credit.bgColor} flex items-center justify-center mb-3`}>
                    <credit.icon className="w-5 h-5 text-white" />
                  </div>
                  {credit.popular && (
                    <Badge className="mb-2 text-xs" variant="secondary">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <h3 className="font-semibold text-sm">{credit.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">${credit.pricePerUnit}/{credit.unit}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Credit Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${selectedCreditType.bgColor} flex items-center justify-center`}>
              <selectedCreditType.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>{selectedCreditType.name}</CardTitle>
              <CardDescription>{selectedCreditType.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quantity Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">
              Select Quantity ({selectedCreditType.unit})
            </Label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {QUANTITY_PRESETS.map((preset) => (
                <Button
                  key={preset.amount}
                  variant={presetAmount === preset.amount ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresetSelect(preset.amount, preset.discount)}
                  className="text-sm"
                >
                  {preset.amount}
                  {preset.discount > 0 && (
                    <span className="ml-1 text-xs opacity-80">(-{preset.discount}%)</span>
                  )}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min={1}
                className="w-32"
              />
              <span className="text-muted-foreground">
                × ${selectedCreditType.pricePerUnit}/{selectedCreditType.unit}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <Button onClick={handleAddToCart} variant="outline" className="flex-1">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Continue to Details
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cart.map((item, index) => {
                const creditType = CREDIT_TYPES.find(c => c.id === item.typeId);
                if (!creditType) return null;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${creditType.bgColor} flex items-center justify-center`}>
                        <creditType.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{creditType.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ${item.pricePerUnit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        ${(item.quantity * item.pricePerUnit).toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromCart(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button onClick={handleNext} className="w-full mt-4">
              Proceed to Checkout
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Render billing details step
  const renderBillingDetails = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Enter your billing details for the invoice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={billingDetails.firstName}
                onChange={(e) => setBillingDetails({ ...billingDetails, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={billingDetails.lastName}
                onChange={(e) => setBillingDetails({ ...billingDetails, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={billingDetails.email}
                onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={billingDetails.phone}
                onChange={(e) => setBillingDetails({ ...billingDetails, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              value={billingDetails.company}
              onChange={(e) => setBillingDetails({ ...billingDetails, company: e.target.value })}
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={billingDetails.address}
              onChange={(e) => setBillingDetails({ ...billingDetails, address: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={billingDetails.city}
                onChange={(e) => setBillingDetails({ ...billingDetails, city: e.target.value })}
                placeholder="New York"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={billingDetails.state}
                onChange={(e) => setBillingDetails({ ...billingDetails, state: e.target.value })}
                placeholder="NY"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={billingDetails.postalCode}
                onChange={(e) => setBillingDetails({ ...billingDetails, postalCode: e.target.value })}
                placeholder="10001"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={billingDetails.country}
                onValueChange={(value) => setBillingDetails({ ...billingDetails, country: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="taxId">Tax ID / VAT Number (Optional)</Label>
            <Input
              id="taxId"
              value={billingDetails.taxId}
              onChange={(e) => setBillingDetails({ ...billingDetails, taxId: e.target.value })}
              placeholder="EU123456789"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Continue to Payment
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render payment step
  const renderPayment = () => (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{quantity} {selectedCreditType.name}</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>Discount ({discount}%)</span>
                <span>-${discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Platform Fee (2%)</span>
              <span>${platformFee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Type Toggle */}
          <div className="flex gap-4">
            <Button
              variant={paymentMethod === 'fiat' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('fiat')}
              className="flex-1"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Fiat Payment
            </Button>
            <Button
              variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('crypto')}
              className="flex-1"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Crypto Payment
            </Button>
          </div>

          {/* Fiat Payment Options */}
          {paymentMethod === 'fiat' && (
            <RadioGroup value={fiatProvider} onValueChange={setFiatProvider}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="w-5 h-5" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                    <span className="font-bold">PP</span>
                    <span>PayPal</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="paystack" id="paystack" />
                  <Label htmlFor="paystack" className="flex items-center gap-2 cursor-pointer">
                    <span className="font-bold text-xs">PS</span>
                    <span>Paystack</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="w-5 h-5" />
                    <span>Bank Transfer</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          )}

          {/* Crypto Payment Options */}
          {paymentMethod === 'crypto' && (
            <RadioGroup value={cryptoCurrency} onValueChange={setCryptoCurrency}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="eth" id="eth" />
                  <Label htmlFor="eth" className="flex items-center gap-2 cursor-pointer">
                    <span className="font-bold text-sm">Ξ</span>
                    <span>Ethereum</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="btc" id="btc" />
                  <Label htmlFor="btc" className="flex items-center gap-2 cursor-pointer">
                    <span className="font-bold text-sm">₿</span>
                    <span>Bitcoin</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="usdt" id="usdt" />
                  <Label htmlFor="usdt" className="flex items-center gap-2 cursor-pointer">
                    <span className="font-bold text-sm">₮</span>
                    <span>USDT</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </Label>
                </div>
              </div>

              {/* Wallet Address Input (if connect wallet selected) */}
              {cryptoCurrency === 'wallet' && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <Label>Wallet Address</Label>
                  <Input
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                    className="mt-2"
                  />
                </div>
              )}
            </RadioGroup>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Your payment is secured with 256-bit SSL encryption. We never store your full card details.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay ${total.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render confirmation step
  const renderConfirmation = () => (
    <div className="space-y-6">
      <Card className="text-center py-8">
        <CardContent>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-4">
            Thank you for your purchase. Your credits have been added to your portfolio.
          </p>
          <div className="text-sm text-muted-foreground mb-6">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-semibold">{quantity} {selectedCreditType.unit}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Credit Type</p>
              <p className="font-semibold">{selectedCreditType.name}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="font-semibold">${total.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/portfolio">
                <FileText className="w-4 h-4 mr-2" />
                View Portfolio
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button asChild>
              <Link to="/marketplace">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TreePine className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Atlas Sanctum</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        {currentStep < 3 && renderStepIndicator()}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of 3</span>
            <span>{Math.round(((currentStep + 1) / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && renderCreditSelection()}
            {currentStep === 1 && renderBillingDetails()}
            {currentStep === 2 && renderPayment()}
            {currentStep === 3 && renderConfirmation()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2025 Atlas Sanctum</span>
              <span>|</span>
              <a href="/privacy-policy" className="hover:text-foreground">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-foreground">Terms of Service</a>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Import missing components
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
