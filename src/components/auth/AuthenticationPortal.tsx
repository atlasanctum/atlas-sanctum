import React, { useState } from "react";
import { UniversalWelcomeScreen } from "./UniversalWelcomeScreen";
import { AuthenticationMethods } from "./AuthenticationMethods";
import { EthicalConsentScreen } from "./EthicalConsentScreen";
import { RoleSpecificOnboarding } from "./RoleSpecificOnboarding";
import { FirstDayExperience } from "./FirstDayExperience";
import type { User, UserRole, ConsentState, AuthenticationData } from "@/types/auth";
import { createTemporaryUser } from "@/utils/authUtils";

type PortalStep = 'welcome' | 'auth-methods' | 'consent' | 'onboarding' | 'first-day' | 'complete';

interface AuthenticationPortalProps {
  onComplete?: (user: Partial<User>) => void;
}

export const AuthenticationPortal: React.FC<AuthenticationPortalProps> = ({ onComplete = () => {} }) => {
  const [currentStep, setCurrentStep] = useState<PortalStep>('welcome');
  const [selectedRole, setSelectedRole] = useState<UserRole>('producer');
  const [consentState, setConsentState] = useState<ConsentState>({});
  const [authData, setAuthData] = useState<AuthenticationData>({});

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('auth-methods');
  };

  const handleAuthenticate = (method: string, data: AuthenticationData) => {
    setAuthData({ method, ...data });
    setCurrentStep('consent');
  };

  const handleConsentComplete = (consent: ConsentState) => {
    setConsentState(consent);
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentStep('first-day');
  };

  const handleFirstDayComplete = () => {
    const temporaryUser = createTemporaryUser(selectedRole);
    setCurrentStep('complete');
    
    // Simulate finalization and user creation
    setTimeout(() => {
      onComplete(temporaryUser);
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <UniversalWelcomeScreen onRoleSelect={handleRoleSelect} />;
      
      case 'auth-methods':
        return <AuthenticationMethods role={selectedRole} onAuthenticate={handleAuthenticate} />;
      
      case 'consent':
        return <EthicalConsentScreen role={selectedRole} onConsentComplete={handleConsentComplete} />;
      
      case 'onboarding':
        return <RoleSpecificOnboarding role={selectedRole} onComplete={handleOnboardingComplete} />;
      
      case 'first-day':
        return <FirstDayExperience role={selectedRole} onContinue={handleFirstDayComplete} />;
      
      case 'complete':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h1 className="text-3xl font-bold text-emerald-800 mb-4">
                  Welcome to the Movement!
                </h1>
                <p className="text-xl text-slate-600 mb-8">
                  You're now part of the Atlas Sanctum community.
                </p>
                <div className="animate-pulse text-emerald-500 text-lg mb-8">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-emerald-500 w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <UniversalWelcomeScreen onRoleSelect={handleRoleSelect} />;
    }
  };

  return renderStep();
};
