import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { onboardingState, nextStep, previousStep, completeStep, skipStep, updateOnboardingData, completeOnboarding, getSegmentConfig, getCurrentStepConfig } = useOnboarding();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const segmentConfig = getSegmentConfig();
  const currentStepConfig = getCurrentStepConfig();

  if (!segmentConfig || !currentStepConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  const progress = ((onboardingState.currentStep + 1) / segmentConfig.onboardingSteps.length) * 100;

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    completeStep(currentStepConfig.id, formData);
    if (onboardingState.currentStep < segmentConfig.onboardingSteps.length - 1) {
      nextStep();
    } else {
      completeOnboarding();
      navigate(segmentConfig.defaultRoute);
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSkip = () => {
    skipStep(currentStepConfig.id);
    if (onboardingState.currentStep < segmentConfig.onboardingSteps.length - 1) {
      nextStep();
    } else {
      completeOnboarding();
      navigate(segmentConfig.defaultRoute);
    }
  };

  const renderStepContent = () => {
    switch (currentStepConfig.id) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${segmentConfig.color.replace('text-', 'bg-')}/10`}>
              <span className="text-4xl">
                {segmentConfig.icon === 'TreePine' && '🌲'}
                {segmentConfig.icon === 'GraduationCap' && '🎓'}
                {segmentConfig.icon === 'Briefcase' && '💼'}
                {segmentConfig.icon === 'Building2' && '🏢'}
                {segmentConfig.icon === 'TrendingUp' && '📈'}
                {segmentConfig.icon === 'Network' && '🔗'}
                {segmentConfig.icon === 'Heart' && '❤️'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Welcome to Atlas Sanctum
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              You're joining as a <span className={`font-semibold ${segmentConfig.color}`}>{segmentConfig.name}</span>
            </p>
            <div className="bg-muted/50 border border-border rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-foreground mb-3">What you'll get:</h3>
              <ul className="space-y-2 text-left">
                {segmentConfig.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <Check className={`w-4 h-4 ${segmentConfig.color} flex-shrink-0 mt-0.5`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Pricing:</strong> {segmentConfig.pricingModel}
                </p>
                <p className={`text-lg font-bold ${segmentConfig.color}`}>
                  {segmentConfig.priceRange}
                </p>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName || user?.displayName || ''}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                placeholder="Your organization name"
                value={formData.organization || ''}
                onChange={(e) => handleFieldChange('organization', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Tell us about your goals...</Label>
              <Textarea
                id="bio"
                placeholder="Describe what you hope to achieve..."
                value={formData.bio || ''}
                onChange={(e) => handleFieldChange('bio', e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                value={formData.country || ''}
                onChange={(e) => handleFieldChange('country', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region/State</Label>
              <Input
                id="region"
                placeholder="California"
                value={formData.region || ''}
                onChange={(e) => handleFieldChange('region', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bioregion">Bioregion (Optional)</Label>
              <Input
                id="bioregion"
                placeholder="e.g., Pacific Northwest, etc."
                value={formData.bioregion || ''}
                onChange={(e) => handleFieldChange('bioregion', e.target.value)}
              />
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Input
                id="idType"
                placeholder="e.g., Passport, Driver's License, etc."
                value={formData.idType || ''}
                onChange={(e) => handleFieldChange('idType', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                placeholder="Your ID number"
                value={formData.idNumber || ''}
                onChange={(e) => handleFieldChange('idNumber', e.target.value)}
              />
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Identity verification is required for impact tracking and credit verification. Your information is securely stored and only shared with authorized verification partners.
              </p>
            </div>
          </div>
        );

      case 'organization':
      case 'company':
      case 'firm':
      case 'institution':
        return (
          <div className="space-y-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Your organization name"
                value={formData.orgName || ''}
                onChange={(e) => handleFieldChange('orgName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type</Label>
              <Input
                id="orgType"
                placeholder="e.g., Corporation, Nonprofit, etc."
                value={formData.orgType || ''}
                onChange={(e) => handleFieldChange('orgType', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgSize">Number of Members</Label>
              <Input
                id="orgSize"
                type="number"
                placeholder="e.g., 1-10, 11-50, 50+"
                value={formData.orgSize || ''}
                onChange={(e) => handleFieldChange('orgSize', e.target.value)}
              />
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="primaryGoal">Primary Impact Goal</Label>
              <Textarea
                id="primaryGoal"
                placeholder="e.g., Carbon restoration, biodiversity protection, etc."
                value={formData.primaryGoal || ''}
                onChange={(e) => handleFieldChange('primaryGoal', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetYear">Target Year</Label>
              <Input
                id="targetYear"
                type="number"
                placeholder="e.g., 2030"
                value={formData.targetYear || ''}
                onChange={(e) => handleFieldChange('targetYear', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalGoals">Additional Goals (Optional)</Label>
              <Textarea
                id="additionalGoals"
                placeholder="Describe any additional impact goals..."
                value={formData.additionalGoals || ''}
                onChange={(e) => handleFieldChange('additionalGoals', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6 py-8">
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">Payment Setup:</strong> Configure your payment methods for transactions and subscriptions.
              </p>
              <Badge variant="secondary" className="mb-2">
                Coming Soon
              </Badge>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Additional Details (Optional)</Label>
              <Textarea
                id="details"
                placeholder="Any additional information..."
                value={formData.details || ''}
                onChange={(e) => handleFieldChange('details', e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
        );

      case 'tutorial':
        return (
          <div className="space-y-6 py-8">
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Platform Tutorial</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Explore Your Dashboard</p>
                    <p className="text-sm text-muted-foreground">Access your personalized dashboard with metrics and insights.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Discover Features</p>
                    <p className="text-sm text-muted-foreground">Browse marketplace, community, and other platform features.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Manage Your Account</p>
                    <p className="text-sm text-muted-foreground">Update your profile, settings, and preferences anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6 py-8">
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground">
                This step is being configured. Please continue to the next step.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/segment-selection')}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Change Segment
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {segmentConfig.name} Onboarding
              </h1>
              <p className="text-sm text-muted-foreground">
                Step {onboardingState.currentStep + 1} of {segmentConfig.onboardingSteps.length}
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {segmentConfig.pricingModel}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {segmentConfig.onboardingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index < onboardingState.currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index === onboardingState.currentStep
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepConfig.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {currentStepConfig.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentStepConfig.description}
                  </p>
                </div>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={onboardingState.currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {!currentStepConfig.required && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {onboardingState.currentStep === segmentConfig.onboardingSteps.length - 1 ? (
                <>
                  Complete Onboarding
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
