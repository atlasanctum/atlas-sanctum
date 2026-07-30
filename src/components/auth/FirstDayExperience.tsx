import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/types/auth";
import { getRoleSpecificData } from "@/utils/authUtils";

interface FirstDayExperienceProps {
  role: UserRole;
  onContinue: () => void;
}

export const FirstDayExperience: React.FC<FirstDayExperienceProps> = ({ role, onContinue }) => {
  const roleData = getRoleSpecificData(role);

  if (!roleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <span className="text-3xl">{roleData.icon}</span>
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">
              Welcome, {roleData.title}
            </h1>
            <p className="text-lg text-slate-600">
              Your journey to regeneration starts now
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Metric Card */}
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-white">🌱 Current Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold mb-2">{roleData.firstDayExperience.metric}</p>
                <p className="text-emerald-100 text-sm">This is your potential impact</p>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-white">✨ First Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">{roleData.firstDayExperience.action}</p>
                <p className="text-blue-100 text-sm">Start making a difference today</p>
              </CardContent>
            </Card>

            {/* Story Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-white">👥 Success Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{roleData.firstDayExperience.story}</p>
                <p className="text-purple-100 text-xs">See how others are succeeding</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Regeneration Dashboard</CardTitle>
              <CardDescription>
                Here's what matters most to you today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-slate-800 mb-1">
                    Active Projects
                  </h3>
                  <p className="text-2xl font-bold text-emerald-600">45</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-slate-800 mb-1">
                    Total Impact
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">12,000 tons CO₂</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-slate-800 mb-1">
                    Community Members
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">1,250</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-slate-800 mb-1">
                    Success Rate
                  </h3>
                  <p className="text-2xl font-bold text-amber-600">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              className="w-full py-6 text-lg"
              onClick={onContinue}
            >
              🚀 Start Exploring
            </Button>

            <Button
              variant="outline"
              className="w-full py-6 text-lg"
              onClick={() => {}}
            >
              📚 View Tutorials
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500">
            <p>
              Remember: <strong>Your identity shapes your experience</strong>. We're here to support you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
