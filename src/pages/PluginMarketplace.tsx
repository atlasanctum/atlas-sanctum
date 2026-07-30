import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Puzzle, Star, Download, Shield, Zap, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const plugins = [
  { name: 'Mapbox Geospatial Layer', author: 'Atlas Labs', category: 'Visualization', rating: 4.9, installs: 8400, verified: true, free: true },
  { name: 'Stripe Payment Gateway', author: 'Stripe Inc.', category: 'Payments', rating: 4.8, installs: 6200, verified: true, free: false },
  { name: 'Chainlink Oracle Feed', author: 'Chainlink', category: 'Blockchain', rating: 4.7, installs: 2100, verified: true, free: true },
  { name: 'Twilio SMS Alerts', author: 'Twilio', category: 'Notifications', rating: 4.6, installs: 3800, verified: true, free: false },
  { name: 'D3.js Chart Builder', author: 'Community', category: 'Visualization', rating: 4.5, installs: 5600, verified: false, free: true },
  { name: 'OpenAI GPT Integration', author: 'OpenAI', category: 'AI', rating: 4.9, installs: 9200, verified: true, free: false },
];

const categories = ['All', 'Visualization', 'AI', 'Blockchain', 'Payments', 'Notifications'];

export default function PluginMarketplace() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? plugins : plugins.filter(p => p.category === activeCategory);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">Phase 4</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Plugin Marketplace</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Extend Atlas Sanctum with community-built and verified plugins — integrations, visualizations, AI models, and data connectors.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Puzzle, label: 'Total Plugins', value: '340' },
            { icon: Shield, label: 'Verified', value: '218' },
            { icon: Download, label: 'Total Installs', value: '2.1M' },
            { icon: Zap, label: 'Active Developers', value: '1,240' },
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

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-48 bg-muted/50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Search plugins..." className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
          </div>
          <Button variant="hero" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Submit Plugin
          </Button>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((plugin, i) => (
            <motion.div
              key={plugin.name}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-primary/20 transition-colors h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Puzzle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex gap-1">
                      {plugin.verified && <Badge className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified</Badge>}
                      <Badge variant={plugin.free ? 'secondary' : 'outline'} className="text-xs">{plugin.free ? 'Free' : 'Paid'}</Badge>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{plugin.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">by {plugin.author} · {plugin.category}</p>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {plugin.rating}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="w-3.5 h-3.5" />
                      {plugin.installs.toLocaleString()}
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">Install Plugin</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
