import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accessibility as AccessibilityIcon, Eye, Keyboard, Volume2, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const AccessibilityPage = () => {
  useEffect(() => {
    // Log page access for audit
    const logAccess = async () => {
      try {
        await fetch('/api/audit-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_access',
            payload: { page: 'accessibility' }
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
              <AccessibilityIcon className="w-4 h-4" />
              Accessibility Statement
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Accessibility at Atlas Sanctum
            </h1>
            <p className="text-xl text-muted-foreground">
              Our commitment to making regenerative impact accessible to everyone
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AccessibilityIcon className="w-5 h-5 text-emerald-500" />
                  Our Commitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Atlas Sanctum is committed to ensuring digital accessibility for people with disabilities.
                  We are continually improving the user experience for everyone and applying the relevant
                  accessibility standards.
                </p>
                <p className="text-muted-foreground">
                  We believe that regenerative impact should be accessible to everyone, regardless of ability.
                  Our platform is designed to be inclusive, providing equal access to information and
                  functionality for all users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Accessibility Standards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA,
                  which sets out requirements for making web content more accessible to people with disabilities.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Visual Accessibility</h4>
                      <p className="text-sm text-muted-foreground">High contrast ratios, scalable text, and screen reader support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Keyboard className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Keyboard Navigation</h4>
                      <p className="text-sm text-muted-foreground">Full keyboard accessibility and clear focus indicators</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Volume2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Auditory Accessibility</h4>
                      <p className="text-sm text-muted-foreground">Captions for multimedia and visual alternatives to audio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AccessibilityIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Cognitive Accessibility</h4>
                      <p className="text-sm text-muted-foreground">Clear language, consistent navigation, and error prevention</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our platform includes the following accessibility features:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Semantic HTML:</strong> Proper use of HTML elements for screen readers and assistive technologies
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>ARIA Labels:</strong> Descriptive labels for interactive elements and form controls
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Focus Management:</strong> Clear visual focus indicators and logical tab order
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Color Contrast:</strong> Text and background colors meet WCAG AA contrast requirements
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Responsive Design:</strong> Works seamlessly across devices and screen sizes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Error Handling:</strong> Clear error messages and guidance for correction
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Skip Links:</strong> Skip to main content and skip navigation links
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-emerald-500" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Atlas Sanctum supports keyboard navigation throughout the platform:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="font-mono text-sm mb-1">Tab</div>
                    <p className="text-xs text-muted-foreground">Move focus to next element</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="font-mono text-sm mb-1">Shift + Tab</div>
                    <p className="text-xs text-muted-foreground">Move focus to previous element</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="font-mono text-sm mb-1">Enter / Space</div>
                    <p className="text-xs text-muted-foreground">Activate buttons and links</p>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="font-mono text-sm mb-1">Escape</div>
                    <p className="text-xs text-muted-foreground">Close modals and menus</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-emerald-500" />
                  Known Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  While we strive for full accessibility, we are aware of some limitations:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Some third-party integrations may have limited accessibility features</li>
                  <li>• Complex data visualizations may require additional screen reader optimization</li>
                  <li>• We are continuously working to improve accessibility across all features</li>
                </ul>
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Feedback Welcome:</strong> If you encounter any accessibility barriers, please let us know
                    so we can address them promptly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AccessibilityIcon className="w-5 h-5 text-emerald-500" />
                  Ongoing Efforts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We are committed to continuous improvement of our accessibility:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Regular accessibility audits and testing</li>
                  <li>• Training for our development team on accessibility best practices</li>
                  <li>• User testing with people who use assistive technologies</li>
                  <li>• Monitoring WCAG guidelines updates and industry standards</li>
                  <li>• Incorporating accessibility into our design and development processes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions, feedback, or encounter accessibility barriers on our platform,
                  please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> accessibility@atlassanctum.com</p>
                  <p><strong>Address:</strong> San Francisco, CA, United States</p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  We will respond to your inquiry within 2 business days and work to address any accessibility
                  concerns you may have.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Last updated: January 2025</p>
            <p className="mt-2">
              This statement will be updated as we continue to improve our accessibility.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccessibilityPage;