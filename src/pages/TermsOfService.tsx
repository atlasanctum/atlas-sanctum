import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, Users, Shield, DollarSign } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  useEffect(() => {
    // Log page access for audit
    const logAccess = async () => {
      try {
        await fetch('/api/audit-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_access',
            payload: { page: 'terms_of_service' }
          })
        });
      } catch (error) {
        console.error('Failed to log page access:', error);
      }
    };
    logAccess();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              Terms of Service
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              The rules and guidelines for using Atlas Sanctum's regenerative platform
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-500" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using Atlas Sanctum, you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  User Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  When you create an account with us, you must provide information that is accurate,
                  complete, and current at all times.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• You are responsible for safeguarding your account credentials</li>
                  <li>• You agree to accept responsibility for all activities under your account</li>
                  <li>• You must notify us immediately of any unauthorized use</li>
                  <li>• Accounts may be terminated for violations of these terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Platform Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our platform facilitates regenerative impact trading and ecosystem measurements.
                  Users agree to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use the platform only for lawful purposes</li>
                  <li>• Provide accurate data for measurements and valuations</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Not engage in fraudulent or manipulative activities</li>
                  <li>• Comply with all applicable environmental regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  You may not use our service:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• To violate any law or regulation</li>
                  <li>• To infringe on intellectual property rights</li>
                  <li>• To distribute malware or harmful code</li>
                  <li>• To attempt unauthorized access to our systems</li>
                  <li>• To submit false or misleading information</li>
                  <li>• To harass or harm other users</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-emerald-500" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In no event shall Atlas Sanctum be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising out of or related to your use of the service.
                  Our total liability shall not exceed the amount paid by you for the service in the
                  twelve months preceding the claim.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> legal@atlassanctum.com</p>
                  <p><strong>Address:</strong> San Francisco, CA, United States</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Last updated: January 2025</p>
            <p className="mt-2">
              These terms may be updated periodically. Continued use constitutes acceptance of changes.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;