import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'none';

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionFeatures {
  canAccessApi: boolean;
  canAccessAdvancedAnalytics: boolean;
  canAccessTeamMembers: boolean;
  maxTeamMembers: number;
  canAccessCustomIntegrations: boolean;
  canAccessWhiteLabel: boolean;
  maxCarbonCredits: number;
  hasPrioritySupport: boolean;
  hasDedicatedAccountManager: boolean;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  features: SubscriptionFeatures;
  isFeatureEnabled: (feature: keyof SubscriptionFeatures) => boolean;
  canAccessFeature: (feature: string) => boolean;
}

const defaultFeatures: SubscriptionFeatures = {
  canAccessApi: false,
  canAccessAdvancedAnalytics: false,
  canAccessTeamMembers: false,
  maxTeamMembers: 1,
  canAccessCustomIntegrations: false,
  canAccessWhiteLabel: false,
  maxCarbonCredits: 100,
  hasPrioritySupport: false,
  hasDedicatedAccountManager: false,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/billing/subscriptions');
      const data = await response.json();

      if (data.success && data.data) {
        setSubscription({
          id: data.data.id,
          planId: data.data.plan_id,
          planName: data.data.plan_name || 'Unknown',
          tier: mapPlanIdToTier(data.data.plan_id),
          status: data.data.status || 'none',
          currentPeriodStart: data.data.current_period_start,
          currentPeriodEnd: data.data.current_period_end,
          cancelAtPeriodEnd: data.data.cancel_at_period_end || false,
        });
      } else {
        // No subscription found
        setSubscription(null);
      }
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      setError('Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const features = getFeaturesForTier(subscription?.tier || 'none');

  const isFeatureEnabled = useCallback((feature: keyof SubscriptionFeatures): boolean => {
    return Boolean(features[feature]);
  }, [features]);

  const canAccessFeature = useCallback((feature: string): boolean => {
    const featureMap: Record<string, keyof SubscriptionFeatures> = {
      'api:access': 'canAccessApi',
      'analytics:advanced': 'canAccessAdvancedAnalytics',
      'team:members': 'canAccessTeamMembers',
      'integrations:custom': 'canAccessCustomIntegrations',
      'white-label': 'canAccessWhiteLabel',
      'support:priority': 'hasPrioritySupport',
      'account-manager': 'hasDedicatedAccountManager',
    };

    const featureKey = featureMap[feature];
    if (featureKey) {
      return Boolean(features[featureKey]);
    }
    return false;
  }, [features]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refetch: fetchSubscription,
        features,
        isFeatureEnabled,
        canAccessFeature,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Helper function to map plan ID to tier
function mapPlanIdToTier(planId: string): SubscriptionTier {
  const tierMap: Record<string, SubscriptionTier> = {
    starter: 'starter',
    professional: 'professional',
    enterprise: 'enterprise',
  };
  return tierMap[planId] || 'none';
}

// Helper function to get features based on tier
function getFeaturesForTier(tier: SubscriptionTier): SubscriptionFeatures {
  switch (tier) {
    case 'starter':
      return {
        ...defaultFeatures,
        canAccessApi: false,
        canAccessAdvancedAnalytics: false,
        canAccessTeamMembers: true,
        maxTeamMembers: 1,
        maxCarbonCredits: 100,
        hasPrioritySupport: false,
        hasDedicatedAccountManager: false,
      };
    case 'professional':
      return {
        ...defaultFeatures,
        canAccessApi: true,
        canAccessAdvancedAnalytics: true,
        canAccessTeamMembers: true,
        maxTeamMembers: 5,
        canAccessCustomIntegrations: false,
        canAccessWhiteLabel: false,
        maxCarbonCredits: 1000,
        hasPrioritySupport: true,
        hasDedicatedAccountManager: false,
      };
    case 'enterprise':
      return {
        ...defaultFeatures,
        canAccessApi: true,
        canAccessAdvancedAnalytics: true,
        canAccessTeamMembers: true,
        maxTeamMembers: -1, // Unlimited
        canAccessCustomIntegrations: true,
        canAccessWhiteLabel: true,
        maxCarbonCredits: -1, // Unlimited
        hasPrioritySupport: true,
        hasDedicatedAccountManager: true,
      };
    case 'none':
    default:
      return {
        ...defaultFeatures,
        canAccessTeamMembers: false,
        maxTeamMembers: 0,
        maxCarbonCredits: 0,
      };
  }
}

// Hook for conditional rendering based on subscription tier
export function useSubscriptionTier(requiredTier: SubscriptionTier | SubscriptionTier[]) {
  const { subscription } = useSubscription();
  
  if (!subscription) {
    return { hasAccess: false, reason: 'no_subscription' };
  }

  if (subscription.status === 'canceled' || subscription.status === 'past_due' || subscription.status === 'unpaid') {
    return { hasAccess: false, reason: 'subscription_inactive', status: subscription.status };
  }

  const tiers: SubscriptionTier[] = ['starter', 'professional', 'enterprise'];
  const userTierIndex = tiers.indexOf(subscription.tier);
  const requiredTiers = Array.isArray(requiredTier) ? requiredTier : [requiredTier];
  const minRequiredIndex = Math.min(...requiredTiers.map(t => tiers.indexOf(t)));

  if (userTierIndex >= minRequiredIndex) {
    return { hasAccess: true };
  }

  return { hasAccess: false, reason: 'insufficient_tier', currentTier: subscription.tier, requiredTier: requiredTier };
}

// Component for conditionally rendering based on subscription tier
export function SubscriptionGate({
  children,
  fallback,
  tier,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  tier: SubscriptionTier | SubscriptionTier[];
}) {
  const { hasAccess, reason } = useSubscriptionTier(tier);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback based on reason
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-muted-foreground">
        {reason === 'no_subscription' && 'Please subscribe to access this feature.'}
        {reason === 'insufficient_tier' && 'Upgrade your subscription to access this feature.'}
        {reason === 'subscription_inactive' && 'Your subscription is inactive. Please renew to access this feature.'}
      </p>
    </div>
  );
}
