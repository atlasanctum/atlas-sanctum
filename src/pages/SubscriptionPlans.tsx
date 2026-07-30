/**
 * Subscription Plans Page
 * 
 * Dedicated subscription tier comparison page with Free, Pro, and Enterprise plans.
 * Features detailed feature comparison, pricing, and upgrade flow.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Sparkles,
  Shield,
  Clock,
  ChevronRight,
  Phone,
  Mail,
  HelpCircle,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

// Plan definitions
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'For individuals getting started with regenerative finance',
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    features: {
      credits: { included: 10, unit: 'credits/month', label: '10 credits/month' },
      storage: { included: 1, unit: 'GB', label: '1 GB storage' },
      apiCalls: { included: 100, unit: '/month', label: '100 API calls/month' },
      teamMembers: { included: 1, label: '1 team member' },
      support: { level: 'Community', label: 'Community forum' },
      verification: { level: 'Standard', label: 'Standard verification (5-7 days)' },
      reports: { type: 'Basic', label: 'Basic reports' },
      analytics: { type: 'Limited', label: 'Limited analytics' },
      integrations: { type: 'Core', label: 'Core integrations only' },
      sla: { type: false, label: 'No SLA guarantee' },
      accountManager: { type: false, label: 'No dedicated account manager' },
      customBranding: { type: false, label: 'No white-label options' },
      prioritySupport: { type: false, label: 'No priority support' },
    },
    includedFeatures: [
      '10 regenerative credits/month',
      '1 GB cloud storage',
      '100 API calls/month',
      'Basic analytics dashboard',
      'Standard verification (5-7 days)',
      'Community forum support',
      'Core platform access',
    ],
    notIncludedFeatures: [
      'Advanced analytics',
      'API access',
      'Team collaboration',
      'Priority support',
      'White-label reports',
      'SLA guarantee',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing organizations with advanced needs',
    monthlyPrice: 49,
    annualPrice: 470,
    popular: true,
    features: {
      credits: { included: 500, unit: 'credits/month', label: '500 credits/month' },
      storage: { included: 50, unit: 'GB', label: '50 GB storage' },
      apiCalls: { included: 10000, unit: '/month', label: '10K API calls/month' },
      teamMembers: { included: 5, label: '5 team members' },
      support: { level: 'Email', label: 'Email support (48h response)' },
      verification: { level: 'Fast', label: 'Fast verification (2-3 days)' },
      reports: { type: 'Advanced', label: 'Advanced reports' },
      analytics: { type: 'Full', label: 'Full analytics suite' },
      integrations: { type: 'Standard', label: 'Standard integrations' },
      sla: { type: false, label: 'No SLA guarantee' },
      accountManager: { type: false, label: 'No dedicated account manager' },
      customBranding: { type: false, label: 'No white-label options' },
      prioritySupport: { type: true, label: 'Priority email support' },
    },
    includedFeatures: [
      '500 regenerative credits/month',
      '50 GB cloud storage',
      '10,000 API calls/month',
      '5 team members',
      'Full analytics suite',
      'Advanced impact reports',
      'Fast verification (2-3 days)',
      'Priority email support',
      'Standard integrations',
      'API access',
    ],
    notIncludedFeatures: [
      'White-label reports',
      'SLA guarantee',
      'Dedicated account manager',
      'Phone support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    monthlyPrice: 199,
    annualPrice: 1990,
    popular: false,
    features: {
      credits: { included: -1, unit: 'credits/month', label: 'Unlimited credits' },
      storage: { included: 500, unit: 'GB', label: '500 GB storage' },
      apiCalls: { included: -1, unit: '/month', label: 'Unlimited API calls' },
      teamMembers: { included: -1, label: 'Unlimited team members' },
      support: { level: 'Dedicated', label: 'Dedicated account manager' },
      verification: { level: 'Instant', label: 'Instant verification' },
      reports: { type: 'Custom', label: 'Custom white-label reports' },
      analytics: { type: 'Enterprise', label: 'Enterprise analytics' },
      integrations: { type: 'Custom', label: 'Custom integrations' },
      sla: { type: true, label: '99.9% SLA guarantee' },
      accountManager: { type: true, label: 'Dedicated account manager' },
      customBranding: { type: true, label: 'Full white-label options' },
      prioritySupport: { type: true, label: '24/7 priority phone support' },
    },
    includedFeatures: [
      'Unlimited regenerative credits',
      '500 GB cloud storage',
      'Unlimited API calls',
      'Unlimited team members',
      'Enterprise analytics suite',
      'Custom white-label reports',
      'Instant verification',
      'Dedicated account manager',
      '24/7 priority phone support',
      'Custom integrations',
      '99.9% SLA guarantee',
      'White-label mobile app',
      'SSO/SAML authentication',
      'Advanced security features',
    ],
    notIncludedFeatures: [],
  },
];

// Feature comparison categories
const FEATURE_CATEGORIES = [
  {
    name: 'Core Features',
    features: [
      { name: 'Credits Included', key: 'credits', free: '10/month', pro: '500/month', enterprise: 'Unlimited' },
      { name: 'Cloud Storage', key: 'storage', free: '1 GB', pro: '50 GB', enterprise: '500 GB' },
      { name: 'API Calls', key: 'apiCalls', free: '100/month', pro: '10K/month', enterprise: 'Unlimited' },
      { name: 'Team Members', key: 'teamMembers', free: '1', pro: '5', enterprise: 'Unlimited' },
    ],
  },
  {
    name: 'Support & Verification',
    features: [
      { name: 'Verification Speed', key: 'verification', free: '5-7 days', pro: '2-3 days', enterprise: 'Instant' },
      { name: 'Support Level', key: 'support', free: 'Community', pro: 'Email (48h)', enterprise: '24/7 Phone' },
    ],
  },
  {
    name: 'Analytics & Reports',
    features: [
      { name: 'Analytics', key: 'analytics', free: 'Limited', pro: 'Full Suite', enterprise: 'Enterprise' },
      { name: 'Reports', key: 'reports', free: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
    ],
  },
  {
    name: 'Advanced Features',
    features: [
      { name: 'API Access', key: 'apiAccess', free: false, pro: true, enterprise: true },
      { name: 'Integrations', key: 'integrations', free: 'Core', pro: 'Standard', enterprise: 'Custom' },
      { name: 'White-Label', key: 'customBranding', free: false, pro: false, enterprise: true },
      { name: 'SLA Guarantee', key: 'sla', free: false, pro: false, enterprise: true },
      { name: 'Dedicated Account Manager', key: 'accountManager', free: false, pro: false, enterprise: true },
    ],
  },
];

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const { isDemoMode } = useEnhancedAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Billing cycle toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Track which plan is being upgraded
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    if (!user && !isDemoMode) {
      navigate('/auth?redirect=/pricing');
      return;
    }

    if (planId === 'free') {
      toast({
        title: 'Free Plan',
        description: 'You already have access to free features',
      });
      return;
    }

    setUpgradingPlan(planId);
    
    // Simulate processing
    setTimeout(() => {
      setUpgradingPlan(null);
      navigate(`/checkout?plan=${planId}&billing=${billingCycle}`);
    }, 1000);
  };

  // Calculate annual discount
  const getAnnualPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 10); // 2 months free
  };

  // Feature checkmark component
  const CheckIcon = ({ included }: { included: boolean }) => (
    included ? (
      <Check className="w-5 h-5 text-emerald-500" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/40" />
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Atlas Sanctum</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Simple, Transparent Pricing
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Choose the Right Plan for Your
            <span className="text-gradient"> Regeneration Journey</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're an individual or an enterprise, we have a plan that fits your needs.
            All plans include access to our regenerative marketplace.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="ml-2">
              Save 17%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? 'ring-2 ring-primary shadow-lg scale-105 z-10'
                    : 'hover:border-primary/30 transition-colors'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <Badge variant="outline" className="w-fit mx-auto mb-2">
                    {plan.name}
                  </Badge>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-6">
                    {plan.monthlyPrice === 0 ? (
                      <div>
                        <span className="text-4xl font-bold">Free</span>
                        <p className="text-sm text-muted-foreground mt-1">Forever</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : getAnnualPrice(plan.monthlyPrice)}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                        {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                          <p className="text-sm text-emerald-500 mt-1">
                            Save ${(plan.monthlyPrice * 2).toFixed(0)}/year
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* CTA Button */}
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular ? '' : 'variant-outline'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={upgradingPlan !== null}
                  >
                    {upgradingPlan === plan.id ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : plan.id === 'free' ? (
                      'Current Plan'
                    ) : (
                      <>
                        Get {plan.name}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>

                  {/* Key Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Key Features:</p>
                    {plan.includedFeatures.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.includedFeatures.length > 5 && (
                      <p className="text-sm text-muted-foreground">
                        +{plan.includedFeatures.length - 5} more features
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Compare Plans in Detail
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Free</th>
                      <th className="text-center p-4 font-semibold">Pro</th>
                      <th className="text-center p-4 font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURE_CATEGORIES.map((category, catIndex) => (
                      <React.Fragment key={category.name}>
                        {catIndex > 0 && <tr className="border-b"><td colSpan={4} /></tr>}
                        <tr className="bg-muted/30">
                          <td colSpan={4} className="p-4 font-semibold text-sm">
                            {category.name}
                          </td>
                        </tr>
                        {category.features.map((feature, index) => (
                          <tr key={feature.name} className="border-b last:border-0">
                            <td className="p-4 text-sm">{feature.name}</td>
                            <td className="p-4 text-center text-sm">
                              {typeof feature.free === 'boolean' ? (
                                <CheckIcon included={feature.free} />
                              ) : (
                                feature.free
                              )}
                            </td>
                            <td className="p-4 text-center text-sm">
                              {typeof feature.pro === 'boolean' ? (
                                <CheckIcon included={feature.pro} />
                              ) : (
                                feature.pro
                              )}
                            </td>
                            <td className="p-4 text-center text-sm">
                              {typeof feature.enterprise === 'boolean' ? (
                                <CheckIcon included={feature.enterprise} />
                              ) : (
                                feature.enterprise
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Can I switch plans at any time?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any payments.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, bank transfers, and cryptocurrency (ETH, BTC, USDT).',
              },
              {
                q: 'Is there a free trial for Pro/Enterprise?',
                a: 'Yes! Both Pro and Enterprise plans come with a 14-day free trial. No credit card required to start.',
              },
              {
                q: 'What happens to my credits if I downgrade?',
                a: 'Your credits are yours to keep regardless of your plan. You just won\'t receive new monthly credits on lower-tier plans.',
              },
              {
                q: 'Do you offer non-profit discounts?',
                a: 'Yes, we offer special pricing for registered non-profits and educational institutions. Contact sales@atlassanctum.com.',
              },
              {
                q: 'What\'s included in the SLA guarantee?',
                a: 'Our Enterprise SLA guarantees 99.9% uptime with credits applied to your account if we fall below this threshold.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is here to help you find the right plan for your organization.
              Get personalized recommendations and pricing for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
              <Button size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Schedule a Demo
              </Button>
            </div>
          </CardContent>
        </Card>
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
import { Link } from 'react-router-dom';
