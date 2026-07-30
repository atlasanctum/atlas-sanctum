import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Package, Download, Star, GitBranch, BookOpen, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const sdkPackages = [
  { name: '@atlas-sanctum/js', lang: 'JavaScript / TypeScript', version: '2.4.1', downloads: '84K/mo', stars: 1240 },
  { name: 'atlas-sanctum-python', lang: 'Python', version: '2.4.0', downloads: '62K/mo', stars: 980 },
  { name: 'AtlasSanctum.NET', lang: 'C# / .NET', version: '2.3.2', downloads: '18K/mo', stars: 340 },
  { name: 'atlas_sanctum_r', lang: 'R', version: '1.8.0', downloads: '9K/mo', stars: 210 },
];

const codeExamples: Record<string, string> = {
  JavaScript: `import { AtlasSanctum } from '@atlas-sanctum/js';

const client = new AtlasSanctum({ apiKey: 'YOUR_KEY' });

const climate = await client.climate.get({
  region: 'amazon-basin',
  metrics: ['carbon_flux', 'temperature'],
});

console.log(climate.data);`,
  Python: `from atlas_sanctum import AtlasSanctum

client = AtlasSanctum(api_key="YOUR_KEY")

climate = client.climate.get(
    region="amazon-basin",
    metrics=["carbon_flux", "temperature"]
)

print(climate.data)`,
};

export default function DeveloperSDK() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">Phase 4</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Developer SDK</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Official SDKs for JavaScript, Python, C#, and R — giving developers first-class access to Atlas Sanctum's intelligence APIs with type safety and auto-completion.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'SDK Packages', value: '4' },
            { icon: Download, label: 'Monthly Downloads', value: '173K' },
            { icon: Star, label: 'GitHub Stars', value: '2,770' },
            { icon: GitBranch, label: 'Contributors', value: '84' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Available Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sdkPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <code className="font-mono text-sm font-semibold text-foreground">{pkg.name}</code>
                    <Badge variant="secondary" className="text-xs">v{pkg.version}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pkg.lang}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Download className="w-3 h-3" />{pkg.downloads}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{pkg.stars}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Code2 className="w-4 h-4" /> Quick Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted rounded-lg p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
                  <pre>{codeExamples['JavaScript']}</pre>
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><BookOpen className="w-4 h-4" /> Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Getting Started Guide', 'API Reference', 'Code Examples', 'Migration Guide', 'Changelog'].map((r) => (
                  <Button key={r} variant="ghost" className="w-full justify-start text-sm h-9">{r}</Button>
                ))}
                <Button className="w-full mt-2" variant="hero">
                  <GitBranch className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
