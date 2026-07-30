import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Globe, Users, Target, Award, Heart } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const About = () => {
  useEffect(() => {
    // Log page access for audit
    const logAccess = async () => {
      try {
        await fetch('/api/audit-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_access',
            payload: { page: 'about' }
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
              <Leaf className="w-4 h-4" />
              About Atlas Sanctum
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Regenerating Earth's Future
            </h1>
            <p className="text-xl text-muted-foreground">
              The world's first regenerative platform uniting ecosystems for trillion-dollar impact
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Atlas Sanctum is pioneering a new paradigm in regenerative impact. We're building the world's first
                  comprehensive platform that unites ecosystems, communities, and capital to create measurable,
                  verified, and scalable positive impact on our planet.
                </p>
                <p className="text-muted-foreground">
                  Our vision is to enable trillion-dollar regenerative impact by providing the infrastructure,
                  tools, and marketplace needed to accelerate the transition to a regenerative economy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  What We Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Ecosystem Measurement</h4>
                      <p className="text-sm text-muted-foreground">Verify and track regenerative impact across bioregions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Community Governance</h4>
                      <p className="text-sm text-muted-foreground">Empower local communities to manage their resources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Impact Valuation</h4>
                      <p className="text-sm text-muted-foreground">Transform regenerative outcomes into measurable value</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Regenerative Finance</h4>
                      <p className="text-sm text-muted-foreground">Connect capital with high-impact regenerative projects</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Regeneration First:</strong> Every decision prioritizes regenerative outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Transparency:</strong> Open, verifiable, and accountable systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Community-Led:</strong> Empowering local communities to lead their own regeneration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Scientific Rigor:</strong> Evidence-based approaches to impact measurement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span><strong>Global Collaboration:</strong> Building partnerships across borders and sectors</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  Our Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Since our founding, Atlas Sanctum has been at the forefront of the regenerative movement:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-emerald-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-500">50+</div>
                    <div className="text-sm text-muted-foreground">Bioregions</div>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-500">10K+</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-500">$1B+</div>
                    <div className="text-sm text-muted-foreground">Impact Value</div>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-500">100+</div>
                    <div className="text-sm text-muted-foreground">Partners</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-500" />
                  Join Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We're always looking for passionate individuals and organizations to join our mission.
                  Whether you're a developer, researcher, investor, or community leader, there's a place for you at Atlas Sanctum.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="/careers" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                    View Careers
                  </a>
                  <a href="/contact" className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-500/10 transition-colors">
                    Contact Us
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>© 2025 Atlas Sanctum. All rights reserved.</p>
            <p className="mt-2">Regenerating Earth's future through verified, ethical impact.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
