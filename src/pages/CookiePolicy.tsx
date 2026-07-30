import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Shield, Eye, Settings, CheckCircle } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  useEffect(() => {
    // Log page access for audit
    const logAccess = async () => {
      try {
        await fetch('/api/audit-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_access',
            payload: { page: 'cookie_policy' }
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
              <Cookie className="w-4 h-4" />
              Cookie Policy
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Our Cookie Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How we use cookies and similar technologies on Atlas Sanctum
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-emerald-500" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Cookies are small text files that are stored on your device when you visit a website.
                  They help us provide you with a better experience by remembering your preferences and
                  understanding how you use our platform.
                </p>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies like local storage and web beacons to enhance
                  your experience, analyze usage, and provide personalized content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <h4 className="font-semibold mb-2">Essential Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Required for the platform to function properly. These enable core functionality
                      such as security, authentication, and access to secure areas.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-2">Performance Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors interact with our platform by collecting anonymous
                      analytics data. This helps us improve performance and user experience.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold mb-2">Functional Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Remember your preferences and choices to provide enhanced, more personalized features.
                      These may include language preferences and display settings.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Used to deliver advertisements that are relevant to you and your interests.
                      These track your browsing habits across websites to build a profile of your interests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-500" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  You have control over the cookies we use. Here's how you can manage your preferences:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Browser Settings:</strong> Most web browsers allow you to control cookies through
                      their settings. You can block, delete, or set notifications for cookies.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Cookie Banner:</strong> When you first visit Atlas Sanctum, you'll see a cookie
                      consent banner where you can accept or decline non-essential cookies.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Account Settings:</strong> Logged-in users can manage their cookie preferences
                      through their account settings page.
                    </span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Note:</strong> Disabling essential cookies may prevent you from using certain features
                    of our platform. We recommend keeping essential cookies enabled for the best experience.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Third-Party Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We may allow third-party services to place cookies on your device for the following purposes:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Analytics</h4>
                    <p className="text-xs text-muted-foreground">Google Analytics, Microsoft Clarity</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Authentication</h4>
                    <p className="text-xs text-muted-foreground">OAuth providers, identity services</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Payment Processing</h4>
                    <p className="text-xs text-muted-foreground">Stripe, Paystack, other payment gateways</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Communication</h4>
                    <p className="text-xs text-muted-foreground">Email services, chat platforms</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  These third parties have their own privacy policies and cookie policies. We encourage you to
                  review their policies to understand how they use your data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Updates to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices,
                  technology, or legal requirements. We will notify you of any material changes by:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Posting a notice on our platform</li>
                  <li>• Sending an email notification to registered users</li>
                  <li>• Updating the "Last Updated" date at the bottom of this policy</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-emerald-500" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Cookie Policy or how we use cookies, please contact us:
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

export default CookiePolicy;
