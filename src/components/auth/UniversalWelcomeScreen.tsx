import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/types/auth";

interface RoleOption {
  value: UserRole;
  label: string;
  icon: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "producer",
    label: "I care for land or oceans",
    icon: "🌱",
    description: "Join a community of regenerative stewards"
  },
  {
    value: "investor",
    label: "I invest in regenerative impact",
    icon: "💰",
    description: "Invest in verified impact"
  },
  {
    value: "institution",
    label: "I represent a public institution",
    icon: "🏛️",
    description: "Shape policy and governance"
  },
  {
    value: "knowledge_builder",
    label: "I research, build, or teach",
    icon: "🧪",
    description: "Advance regeneration knowledge"
  }
];

interface UniversalWelcomeScreenProps {
  onRoleSelect: (role: UserRole) => void;
}

export const UniversalWelcomeScreen: React.FC<UniversalWelcomeScreenProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Welcome */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">
              Welcome to Atlas Sanctum
            </h1>
            <p className="text-xl text-slate-600">
              Where value regenerates life
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleOptions.map((role) => (
              <Card
                key={role.value}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-emerald-500"
                onClick={() => onRoleSelect(role.value)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{role.icon}</div>
                  <CardTitle className="text-lg">{role.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-slate-600">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Statement */}
          <div className="mt-12 text-center text-sm text-slate-500">
            <p className="max-w-2xl mx-auto">
              Your identity will shape your experience. We never sell your data.
              All information is encrypted and your consent is always respected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
