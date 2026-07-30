import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UserRole, AuthenticationData } from "@/types/auth";
import { getAuthenticationMethods } from "@/utils/authUtils";

interface AuthenticationMethodsProps {
  role: UserRole;
  onAuthenticate: (method: string, data: AuthenticationData) => void;
}

export const AuthenticationMethods: React.FC<AuthenticationMethodsProps> = ({ role, onAuthenticate }) => {
  const methods = getAuthenticationMethods(role);
  const [selectedMethod, setSelectedMethod] = useState<string>(methods.find(m => m.isDefault)?.id || methods[0].id);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setInputValue("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticate(selectedMethod, { value: inputValue });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">
              Welcome to Atlas Sanctum
            </h1>
            <p className="text-slate-600">
              Choose your preferred way to continue
            </p>
          </div>

          {/* Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {methods.map((method) => (
              <Button
                key={method.id}
                variant={selectedMethod === method.id ? "default" : "outline"}
                className="h-auto py-4"
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-semibold">{method.name}</span>
                  <span className="text-xs text-slate-600">{method.description}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Input Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {methods.find(m => m.id === selectedMethod)?.icon}
                {methods.find(m => m.id === selectedMethod)?.name}
              </CardTitle>
              <CardDescription>
                {methods.find(m => m.id === selectedMethod)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {selectedMethod === 'sms' ? 'Phone Number' :
                     selectedMethod === 'email-passkey' ? 'Email Address' :
                     selectedMethod === 'sso' ? 'Institutional Email' :
                     'Wallet Address'}
                  </label>
                  <Input
                    type={selectedMethod === 'sms' ? 'tel' :
                          selectedMethod === 'email-passkey' || selectedMethod === 'sso' ? 'email' :
                          'text'}
                    placeholder={selectedMethod === 'sms' ? '+1 (555) 000-0000' :
                                  selectedMethod === 'email-passkey' ? 'you@example.com' :
                                  selectedMethod === 'sso' ? 'you@institution.gov' :
                                  '0x...'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Offline Option */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => onAuthenticate('offline', {})}
              className="text-slate-600 hover:text-slate-800"
            >
              Continue without login (limited access)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
