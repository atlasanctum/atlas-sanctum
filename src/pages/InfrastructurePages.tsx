import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, TrendingUp, Shield, Building, Factory, Sprout, Zap, BookOpen, Award, Phone } from 'lucide-react';

// Carbon Offsetting Page
export const CarbonOffsetting = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Carbon Offsetting</h1>
        <p className="text-muted-foreground">Neutralize your carbon footprint with verified regenerative credits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Individual Offsetting
            </CardTitle>
            <CardDescription>Personal carbon neutrality</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500 mb-2">$82/ton</p>
            <p className="text-sm text-muted-foreground">Starting from 1 RIU</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              Corporate Offsetting
            </CardTitle>
            <CardDescription>Enterprise carbon programs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-500 mb-2">$75/ton</p>
            <p className="text-sm text-muted-foreground">Bulk pricing available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Verified Impact
            </CardTitle>
            <CardDescription>Blockchain-verified removal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-500 mb-2">100%</p>
            <p className="text-sm text-muted-foreground">Transparency guaranteed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageLayout>
);

// Impact Investment Page
export const ImpactInvestment = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Impact Investment</h1>
        <p className="text-muted-foreground">Generate returns while creating environmental impact</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Regenerative Bonds</CardTitle>
            <CardDescription>Fixed-income investments backed by RIUs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>5-Year Bond</span>
                <Badge variant="secondary">3.8% APY</Badge>
              </div>
              <div className="flex justify-between">
                <span>10-Year Bond</span>
                <Badge variant="secondary">5.2% APY</Badge>
              </div>
              <div className="flex justify-between">
                <span>Perpetual Bond</span>
                <Badge variant="secondary">6.5% APY</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>RIU Portfolio</CardTitle>
            <CardDescription>Direct investment in regenerative credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">+19.9%</p>
                <p className="text-sm text-muted-foreground">YTD Performance</p>
              </div>
              <Button className="w-full">Start Investing</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageLayout>
);

// Regulatory Compliance Page
export const RegulatoryCompliance = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Regulatory Compliance</h1>
        <p className="text-muted-foreground">Meet sustainability requirements with verified credits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['XBRL Compatible', 'GRI Standards', 'TCFD Aligned', 'ISO 14064'].map((standard) => (
          <Card key={standard}>
            <CardHeader>
              <CardTitle className="text-sm">{standard}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-green-600 border-green-600">Certified</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </PageLayout>
);

// Enterprise Solutions Page
export const EnterpriseSolutions = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Enterprise Solutions</h1>
        <p className="text-muted-foreground">Large-scale carbon programs for corporations</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-primary" />
                <span>Bulk Credit Purchasing</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Custom Reporting</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span>API Integration</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>Dedicated Support</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <span>ESG Compliance</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>Training Programs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
);

// SMB Solutions Page
export const SMBSolutions = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">SMB Solutions</h1>
        <p className="text-muted-foreground">Accessible sustainability solutions for growing companies</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Starter Plan</CardTitle>
            <CardDescription>Perfect for small businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">$299/month</p>
            <ul className="space-y-2 text-sm">
              <li>• Up to 100 RIUs/month</li>
              <li>• Basic dashboard</li>
              <li>• Email support</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Growth Plan</CardTitle>
            <CardDescription>For expanding businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">$599/month</p>
            <ul className="space-y-2 text-sm">
              <li>• Up to 500 RIUs/month</li>
              <li>• Advanced analytics</li>
              <li>• Priority support</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Scale Plan</CardTitle>
            <CardDescription>For established companies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">$1,299/month</p>
            <ul className="space-y-2 text-sm">
              <li>• Unlimited RIUs</li>
              <li>• Custom reporting</li>
              <li>• Dedicated support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageLayout>
);

// Agriculture Solutions Page
export const AgricultureSolutions = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Agriculture Solutions</h1>
        <p className="text-muted-foreground">Regenerative farming credits and soil health optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-500" />
              Soil Carbon Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Earn credits for soil carbon sequestration through regenerative farming practices.
            </p>
            <Button>Learn More</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-blue-500" />
              Farm Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Real-time monitoring of soil health, biodiversity, and carbon levels.
            </p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageLayout>
);

// Renewable Energy Page
export const RenewableEnergy = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Renewable Energy</h1>
        <p className="text-muted-foreground">Clean energy transition projects and carbon credits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Solar Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500 mb-2">2.4 GW</p>
            <p className="text-sm text-muted-foreground">Installed capacity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Wind Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-500 mb-2">1.8 GW</p>
            <p className="text-sm text-muted-foreground">Installed capacity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              Hydro Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500 mb-2">950 MW</p>
            <p className="text-sm text-muted-foreground">Installed capacity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageLayout>
);

// Education Hub Page
export const EducationHub = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Education Hub</h1>
        <p className="text-muted-foreground">Learn about carbon markets and regenerative practices</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          'Carbon Market Basics',
          'Regenerative Agriculture',
          'Blockchain Verification',
          'ESG Reporting',
          'Impact Measurement',
          'Sustainability Standards'
        ].map((topic) => (
          <Card key={topic}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">Start Learning</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </PageLayout>
);

// Certifications Page
export const Certifications = () => (
  <PageLayout>
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Certifications</h1>
        <p className="text-muted-foreground">Standards and methodologies for carbon credits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { name: 'Verra VCS', description: 'Verified Carbon Standard' },
          { name: 'Gold Standard', description: 'Premium carbon credits' },
          { name: 'Climate Action Reserve', description: 'North American standard' },
          { name: 'Plan Vivo', description: 'Community-led projects' }
        ].map((cert) => (
          <Card key={cert.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                {cert.name}
              </CardTitle>
              <CardDescription>{cert.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-green-600 border-green-600">Certified</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </PageLayout>
);