import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserRole, ConsentState } from "@/types/auth";
import { getConsentOptions, validateConsent } from "@/utils/authUtils";

interface EthicalConsentScreenProps {
  role: UserRole;
  onConsentComplete: (consent: ConsentState) => void;
}

export const EthicalConsentScreen: React.FC<EthicalConsentScreenProps> = ({ role, onConsentComplete }) => {
  const consentOptions = getConsentOptions(role);
  const [consentState, setConsentState] = useState<ConsentState>(
    consentOptions.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.isRequired }), {})
  );

  const handleConsentChange = (optionId: string, value: boolean) => {
    setConsentState(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleSubmit = () => {
    if (validateConsent(consentState, consentOptions)) {
      onConsentComplete(consentState);
    }
  };

  const allRequiredChecked = validateConsent(consentState, consentOptions);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">
              Your Data, Your Control
            </h1>
            <p className="text-slate-600">
              We're transparent about how your data is used. All consent is voluntary and can be revoked at any time.
            </p>
          </div>

          {/* Consent Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What we collect and why</CardTitle>
              <CardDescription>
                Every piece of data helps create a regenerative future. We never sell your data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={consentState[option.id]}
                      onCheckedChange={(checked) => handleConsentChange(option.id, !!checked)}
                      disabled={option.isRequired}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{option.title}</h4>
                      <p className="text-sm text-slate-600">{option.description}</p>
                      {option.isRequired && (
                        <p className="text-xs text-amber-600 mt-1">
                          Required to use this platform
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-semibold text-sm">Encrypted Storage</h4>
                  <p className="text-xs text-slate-600">Your data is always encrypted</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-sm">Purpose-Based</h4>
                  <p className="text-xs text-slate-600">Data only used for stated purposes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏛️</div>
                  <h4 className="font-semibold text-sm">DAO Governed</h4>
                  <p className="text-xs text-slate-600">Data policies approved by the community</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!allRequiredChecked}
            className="w-full py-3 text-lg"
          >
            {allRequiredChecked ? 'Continue' : 'Please agree to all required terms'}
          </Button>
        </div>
      </div>
    </div>
  );
};
