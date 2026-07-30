import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Users, Mail } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    // Log page access for audit
    const logAccess = async () => {
      try {
        await fetch('/api/audit-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_access',
            payload: { page: 'privacy_policy' }
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
              <Shield className="w-4 h-4" />
              Privacy Policy
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-muted-foreground">
              How we collect, use, and protect your personal information
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account,
                  use our services, or contact us for support.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Account Information</h4>
                      <p className="text-sm text-muted-foreground">Name, email, and profile details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Usage Data</h4>
                      <p className="text-sm text-muted-foreground">How you interact with our platform</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Provide and maintain our regenerative impact platform</li>
                  <li>• Process transactions and verify ecosystem measurements</li>
                  <li>• Communicate with you about your account and our services</li>
                  <li>• Improve our platform through analytics and research</li>
                  <li>• Ensure security and prevent fraud</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• End-to-end encryption for data transmission</li>
                  <li>• Secure cloud infrastructure with regular security audits</li>
                  <li>• Access controls and authentication requirements</li>
                  <li>• Regular security updates and monitoring</li>
                  <li>• Data backup and disaster recovery procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@atlassanctum.com</p>
                  <p><strong>Address:</strong> San Francisco, CA, United States</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Last updated: January 2025</p>
            <p className="mt-2">
              This policy may be updated periodically. We will notify you of any material changes.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;