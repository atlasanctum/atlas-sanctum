import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Book, Zap, Shield, CheckCircle, Copy, Terminal } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const APIDocumentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    // Log page access for audit
    const logAccess = async () => {
      try {
        await fetch('/api/audit-public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_access',
            payload: { page: 'api_documentation' }
          })
        });
      } catch (error) {
        console.error('Failed to log page access:', error);
      }
    };
    logAccess();
  }, []);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    auth: `// Get API Key
POST /api/v1/auth/api-key
{
  "email": "your@email.com",
  "password": "your-password"
}

// Response
{
  "success": true,
  "data": {
    "apiKey": "atlas_live_xxxxxxxxxxxx",
    "expiresAt": "2025-12-31T23:59:59Z"
  }
}`,
    measurements: `// Get Bioregion Measurements
GET /api/v1/measurements/bioregions/:id
Authorization: Bearer atlas_live_xxxxxxxxxxxx

// Response
{
  "success": true,
  "data": {
    "bioregionId": "bio_123",
    "carbonSequestered": 1250.5,
    "biodiversityIndex": 0.85,
    "soilHealth": 0.92,
    "waterQuality": 0.88,
    "lastUpdated": "2025-01-31T12:00:00Z"
  }
}`,
    projects: `// Create New Project
POST /api/v1/projects
Authorization: Bearer atlas_live_xxxxxxxxxxxx
Content-Type: application/json

{
  "name": "Forest Regeneration Project",
  "bioregionId": "bio_123",
  "type": "reforestation",
  "targetImpact": 5000,
  "description": "Restoring native forest ecosystem"
}

// Response
{
  "success": true,
  "data": {
    "projectId": "proj_456",
    "status": "pending_verification",
    "createdAt": "2025-01-31T12:00:00Z"
  }
}`,
    valuation: `// Calculate Impact Valuation
POST /api/v1/valuation/calculate
Authorization: Bearer atlas_live_xxxxxxxxxxxx
Content-Type: application/json

{
  "projectId": "proj_456",
  "metrics": {
    "carbonSequestered": 1250.5,
    "biodiversityIndex": 0.85,
    "soilHealth": 0.92
  }
}

// Response
{
  "success": true,
  "data": {
    "totalValue": 125000.00,
    "currency": "USD",
    "breakdown": {
      "carbonValue": 75000.00,
      "biodiversityValue": 30000.00,
      "soilHealthValue": 20000.00
    },
    "confidence": 0.92
  }
}`
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
              <Code className="w-4 h-4" />
              API Documentation
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Atlas Sanctum API
            </h1>
            <p className="text-xl text-muted-foreground">
              Build powerful regenerative impact applications with our RESTful API
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-emerald-500" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The Atlas Sanctum API provides programmatic access to our regenerative impact platform.
                  Use it to integrate measurements, manage projects, calculate valuations, and more.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <h4 className="font-semibold mb-2">1. Get API Key</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign up and generate your API key from the dashboard
                    </p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold mb-2">2. Authenticate</h4>
                    <p className="text-sm text-muted-foreground">
                      Include your API key in the Authorization header
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="font-semibold mb-2">3. Make Requests</h4>
                    <p className="text-sm text-muted-foreground">
                      Start building with our RESTful endpoints
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  All API requests require authentication using your API key. Include it in the Authorization header:
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>Authorization: Bearer atlas_live_xxxxxxxxxxxx</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard('Authorization: Bearer atlas_live_xxxxxxxxxxxx', 'auth-header')}
                  >
                    {copiedCode === 'auth-header' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Security Note:</strong> Never share your API key publicly. Use environment variables
                    to store it securely in your applications.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded">POST</span>
                      Authentication
                    </h4>
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs">
                        <code>{codeExamples.auth}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(codeExamples.auth, 'auth-code')}
                      >
                        {copiedCode === 'auth-code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">GET</span>
                      Measurements
                    </h4>
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs">
                        <code>{codeExamples.measurements}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(codeExamples.measurements, 'measurements-code')}
                      >
                        {copiedCode === 'measurements-code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded">POST</span>
                      Projects
                    </h4>
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs">
                        <code>{codeExamples.projects}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(codeExamples.projects, 'projects-code')}
                      >
                        {copiedCode === 'projects-code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded">POST</span>
                      Valuation
                    </h4>
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs">
                        <code>{codeExamples.valuation}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(codeExamples.valuation, 'valuation-code')}
                      >
                        {copiedCode === 'valuation-code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-500" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  API rate limits ensure fair usage and system stability:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold mb-1">Free Tier</h4>
                    <p className="text-2xl font-bold text-emerald-500">1,000</p>
                    <p className="text-sm text-muted-foreground">requests/day</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold mb-1">Pro Tier</h4>
                    <p className="text-2xl font-bold text-emerald-500">10,000</p>
                    <p className="text-sm text-muted-foreground">requests/day</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold mb-1">Enterprise</h4>
                    <p className="text-2xl font-bold text-emerald-500">Unlimited</p>
                    <p className="text-sm text-muted-foreground">custom limits</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Rate limit headers are included in every response: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">X-RateLimit-Limit</code>,
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">X-RateLimit-Remaining</code>,
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">X-RateLimit-Reset</code>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Response Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded w-16 text-center">200</span>
                    <span className="text-sm text-muted-foreground">OK - Request successful</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded w-16 text-center">201</span>
                    <span className="text-sm text-muted-foreground">Created - Resource created successfully</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded w-16 text-center">400</span>
                    <span className="text-sm text-muted-foreground">Bad Request - Invalid request parameters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded w-16 text-center">401</span>
                    <span className="text-sm text-muted-foreground">Unauthorized - Invalid or missing API key</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded w-16 text-center">429</span>
                    <span className="text-sm text-muted-foreground">Too Many Requests - Rate limit exceeded</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded w-16 text-center">500</span>
                    <span className="text-sm text-muted-foreground">Internal Server Error - Something went wrong</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-emerald-500" />
                  SDKs & Libraries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Official SDKs are available for popular programming languages:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Code className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">JavaScript/TypeScript</h4>
                      <p className="text-sm text-muted-foreground">npm install @atlassanctum/sdk</p>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Code className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Python</h4>
                      <p className="text-sm text-muted-foreground">pip install atlassanctum</p>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Code className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Go</h4>
                      <p className="text-sm text-muted-foreground">go get github.com/atlassanctum/sdk-go</p>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-emerald-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Code className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Ruby</h4>
                      <p className="text-sm text-muted-foreground">gem install atlassanctum</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-emerald-500" />
                  Support & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="/help" className="flex items-center gap-3 text-muted-foreground hover:text-emerald-400 transition-colors">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Help Center - Get answers to common questions</span>
                  </a>
                  <a href="/contact" className="flex items-center gap-3 text-muted-foreground hover:text-emerald-400 transition-colors">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Contact Support - Get help from our team</span>
                  </a>
                  <a href="https://github.com/atlassanctum" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-emerald-400 transition-colors">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>GitHub - View source code and examples</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Last updated: January 2025</p>
            <p className="mt-2">
              API version: v1.0.0 | Base URL: https://api.atlassanctum.com/v1
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default APIDocumentation;
