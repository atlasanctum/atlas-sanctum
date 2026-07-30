import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Star, Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Zap, title: 'Real-time Alerts', desc: 'Instant push notifications for climate events, market changes, and governance updates.' },
  { icon: Shield, title: 'Offline-first', desc: 'Access critical data and dashboards even without internet connectivity.' },
  { icon: Globe, title: 'Geospatial Maps', desc: 'Interactive maps with satellite imagery and bioregional overlays.' },
  { icon: Star, title: 'AI Copilot', desc: 'Voice-activated AI assistant for on-the-go intelligence queries.' },
];

const platforms = [
  { name: 'iOS', store: 'App Store', rating: 4.8, downloads: '12K+', status: 'available' },
  { name: 'Android', store: 'Google Play', rating: 4.7, downloads: '18K+', status: 'available' },
];

export default function MobileApplication() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">Phase 2</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Mobile Application</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Atlas Sanctum in your pocket — full intelligence platform on iOS and Android with offline support and real-time alerts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-ocean/5 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{p.name}</h2>
                      <p className="text-muted-foreground">{p.store}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{p.rating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{p.downloads}</p>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 ml-auto">
                      {p.status}
                    </Badge>
                  </div>
                  <Button className="w-full" variant="hero">
                    <Download className="w-4 h-4 mr-2" />
                    Download for {p.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Key Mobile Features</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
