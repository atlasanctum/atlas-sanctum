import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/types/auth";
import { getRoleSpecificData } from "@/utils/authUtils";

interface RoleSpecificOnboardingProps {
  role: UserRole;
  onComplete: () => void;
}

export const RoleSpecificOnboarding: React.FC<RoleSpecificOnboardingProps> = ({ role, onComplete }) => {
  const roleData = getRoleSpecificData(role);
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!roleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < roleData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = roleData.steps[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {roleData.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center ${
                    index <= currentStep ? 'text-emerald-800' : 'text-slate-400'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    index === currentStep ? 'bg-emerald-500 text-white' :
                    index < currentStep ? 'bg-emerald-200 text-emerald-800' :
                    'bg-slate-200 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <p className="text-xs mt-1">{step.title}</p>
                </div>
              ))}
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / roleData.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {currentStepData.type === 'form' && (
                <div className="space-y-4">
                  {currentStepData.id === 'where-care' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Primary Environment
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="land">🌾 Land / Soil</SelectItem>
                          <SelectItem value="ocean">🌊 Ocean / Water</SelectItem>
                          <SelectItem value="forest">🌳 Forest</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {currentStepData.id === 'investment-intent' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Investment Focus
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your focus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="climate">🌱 Climate</SelectItem>
                          <SelectItem value="health">❤️ Health</SelectItem>
                          <SelectItem value="oceans">🌊 Oceans</SelectItem>
                          <SelectItem value="mixed">🎯 Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {currentStepData.id === 'purpose' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Purpose
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="learn">📚 Learn</SelectItem>
                          <SelectItem value="teach">🎓 Teach</SelectItem>
                          <SelectItem value="research">🔬 Research</SelectItem>
                          <SelectItem value="build">🛠️ Build</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {currentStepData.id === 'jurisdiction' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jurisdiction
                      </label>
                      <Input placeholder="Country or region" />
                    </div>
                  )}

                  {currentStepData.id === 'proof-of-place' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location Verification
                      </label>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          📍 Use Current Location
                        </Button>
                        <Button variant="outline" className="w-full">
                          📸 Upload Photo
                        </Button>
                        <Button variant="outline" className="w-full">
                          📧 Get Community Verified
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStepData.type === 'info' && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h3 className="font-semibold text-emerald-800 mb-2">
                      🎯 What to Expect
                    </h3>
                    <p className="text-sm text-emerald-700">
                      {roleData.firstDayExperience.metric}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      ✨ First Action
                    </h3>
                    <p className="text-sm text-blue-700">
                      {roleData.firstDayExperience.action}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      👥 Success Story
                    </h3>
                    <p className="text-sm text-purple-700">
                      {roleData.firstDayExperience.story}
                    </p>
                  </div>
                </div>
              )}

              {currentStepData.type === 'action' && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      🎯 Quick Start
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Choose your access level to get started
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full">
                      📊 Open Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      🤖 Ethical AI Library
                    </Button>
                    <Button variant="outline" className="w-full">
                      🎮 Sandbox Environment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            <Button onClick={handleNext} className="ml-auto">
              {currentStep === roleData.steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
