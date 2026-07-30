import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Image, Video, FileText, Palette, Globe, Mail } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const MediaKit = () => {
  useEffect(() => {
    // Log page access for audit
    const logAccess = async () => {
      try {
        await fetch('/api/audit-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_access',
            payload: { page: 'media_kit' }
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
              <Image className="w-4 h-4" />
              Media Kit
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Atlas Sanctum Media Kit
            </h1>
            <p className="text-xl text-muted-foreground">
              Official brand assets, logos, and resources for media and partners
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  About Atlas Sanctum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Atlas Sanctum is the world's first regenerative platform uniting ecosystems for trillion-dollar impact.
                  We provide the infrastructure, tools, and marketplace needed to accelerate the transition to a regenerative economy.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-semibold mb-2">Quick Facts</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Founded: 2024</li>
                      <li>• Headquarters: San Francisco, CA</li>
                      <li>• Mission: Regenerating Earth's Future</li>
                      <li>• Platform: Web & Mobile</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Metrics</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 50+ Bioregions</li>
                      <li>• 10,000+ Projects</li>
                      <li>• $1B+ Impact Value</li>
                      <li>• 100+ Partners</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-emerald-500" />
                  Brand Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our brand identity reflects our commitment to regeneration, sustainability, and positive impact.
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Primary Colors</h4>
                    <div className="flex gap-3 flex-wrap">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-lg bg-emerald-500 mb-2"></div>
                        <p className="text-xs text-muted-foreground">Emerald</p>
                        <p className="text-xs font-mono">#10B981</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-lg bg-blue-600 mb-2"></div>
                        <p className="text-xs text-muted-foreground">Ocean</p>
                        <p className="text-xs font-mono">#2563EB</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-lg bg-slate-900 mb-2"></div>
                        <p className="text-xs text-muted-foreground">Midnight</p>
                        <p className="text-xs font-mono">#0F172A</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Typography</h4>
                    <p className="text-sm text-muted-foreground">
                      Primary Font: Inter (sans-serif)<br />
                      Display Font: Poppins (headings)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Logo Usage</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Maintain clear space around the logo</li>
                      <li>• Don't stretch, skew, or rotate the logo</li>
                      <li>• Use approved color variations only</li>
                      <li>• Minimum size: 120px width for print, 80px for web</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-emerald-500" />
                  Logo Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Download our official logos in various formats for your use.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Primary Logo</h4>
                      <p className="text-sm text-muted-foreground">PNG, SVG, EPS</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Light Logo</h4>
                      <p className="text-sm text-muted-foreground">PNG, SVG, EPS</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Icon Only</h4>
                      <p className="text-sm text-muted-foreground">PNG, SVG, EPS</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Full Logo Pack</h4>
                      <p className="text-sm text-muted-foreground">ZIP (All formats)</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-500" />
                  Images & Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  High-quality images and videos for use in publications, presentations, and digital media.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Product Screenshots</h4>
                      <p className="text-sm text-muted-foreground">PNG, High Resolution</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Demo Videos</h4>
                      <p className="text-sm text-muted-foreground">MP4, 1080p</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Team Photos</h4>
                      <p className="text-sm text-muted-foreground">JPG, High Resolution</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Impact Images</h4>
                      <p className="text-sm text-muted-foreground">JPG, High Resolution</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Documents & Press
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Official documents, press releases, and company information.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Company Overview</h4>
                      <p className="text-sm text-muted-foreground">PDF, 2 pages</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Press Kit</h4>
                      <p className="text-sm text-muted-foreground">ZIP, All materials</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Fact Sheet</h4>
                      <p className="text-sm text-muted-foreground">PDF, 1 page</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Latest Press Release</h4>
                      <p className="text-sm text-muted-foreground">PDF</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  Media Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For press inquiries, interview requests, or media partnerships, please contact our media team:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> press@atlassanctum.com</p>
                  <p><strong>Phone:</strong> +1 (234) 567-890</p>
                  <p><strong>Address:</strong> San Francisco, CA, United States</p>
                </div>
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    <strong>Response Time:</strong> We aim to respond to media inquiries within 24 hours.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Usage Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  By downloading and using Atlas Sanctum media assets, you agree to the following guidelines:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use assets only for editorial, news, or informational purposes</li>
                  <li>• Do not modify, alter, or distort the logos or brand assets</li>
                  <li>• Do not use assets in a way that suggests endorsement or partnership without permission</li>
                  <li>• Credit Atlas Sanctum when using our images or videos</li>
                  <li>• Contact us for commercial use or partnership inquiries</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>© 2025 Atlas Sanctum. All rights reserved.</p>
            <p className="mt-2">
              All brand assets are the property of Atlas Sanctum and protected by copyright.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MediaKit;
